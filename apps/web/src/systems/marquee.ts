import * as THREE from 'three';

// === CONFIG (yalnızca burayı değiştir) =========================
const LEFT_FOOT = { x: -113, y: 15, z: -40 }; // Sol direk ayak konumu
const RIGHT_FOOT = { x: -113, y: 15, z: 40 }; // Sağ direk ayak konumu
const FIXED_POLE_HEIGHT = 13; // Direk boyu (eşit), null => otomatik
const PANEL_DROP = 1.0; // Panelin traversin altına mesafesi
const PANEL_MARGIN = 1.0; // Panel uç güvenlik payı
const PANEL_HEIGHT = 5.8; // Panel yüksekliği
const SCROLL_SPEED = 80; // px/sn — yazı akış hızı
const FACE_TOWARD_POSITIVE_X = true; // true => panel +X yönüne (glassroom tarafı) baksın
// ===============================================================

export interface MarqueeConfig {
  stage: THREE.Mesh;
  dims: { STAGE_W: number; STAGE_D: number };
  stageTopY?: number; // auto yükseklik için (FIXED null ise)
  boardZCenter?: number; // imza korunuyor
  boardYCenter?: number; // auto yükseklik için (FIXED null ise)
  text?: string;
  panelW?: number; // yoksayılıyor (otomatik)
  panelH?: number; // yoksayılıyor (PANEL_HEIGHT kullanılır)
}

export interface MarqueeSystem {
  group: THREE.Group;
  setText: (text: string) => void;
  update: (dt: number) => void;
  setResolution: (w: number, h: number) => void;
}

export function createMarquee(scene: THREE.Scene, config: MarqueeConfig): MarqueeSystem {
  const { stageTopY, boardYCenter, text = 'Marquee' } = config;

  const group = new THREE.Group();
  scene.add(group);

  // --- Yükseklik (eşit) ---
  const autoPoleH =
    Number.isFinite(boardYCenter) && Number.isFinite(stageTopY)
      ? Math.max(1.2, boardYCenter! - stageTopY!)
      : 8;
  const poleH = Number.isFinite(FIXED_POLE_HEIGHT) ? FIXED_POLE_HEIGHT : autoPoleH;

  // Ayak & tepe noktaları
  const footL = new THREE.Vector3(LEFT_FOOT.x, LEFT_FOOT.y, LEFT_FOOT.z);
  const footR = new THREE.Vector3(RIGHT_FOOT.x, RIGHT_FOOT.y, RIGHT_FOOT.z);
  const topL = new THREE.Vector3(LEFT_FOOT.x, LEFT_FOOT.y + poleH, LEFT_FOOT.z);
  const topR = new THREE.Vector3(RIGHT_FOOT.x, RIGHT_FOOT.y + poleH, RIGHT_FOOT.z);
  const mid = new THREE.Vector3().addVectors(topL, topR).multiplyScalar(0.5);
  const dir = new THREE.Vector3().subVectors(topR, topL); // genişlik yönü
  const span = Math.max(0.001, dir.length());
  const xAxis = dir.clone().normalize();
  const yAxis = new THREE.Vector3(0, 1, 0);
  const zAxis = new THREE.Vector3().crossVectors(xAxis, yAxis).normalize(); // panel normali
  const yOrtho = new THREE.Vector3().crossVectors(zAxis, xAxis).normalize();
  const rotM = new THREE.Matrix4().makeBasis(xAxis, yOrtho, zAxis); // (x,y,z) -> (genişlik,yukarı,normal)

  // Malzemeler
  const poleMat = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.4,
    roughness: 0.6,
  });

  // Direkler
  const poleGeo = new THREE.CylinderGeometry(0.35, 0.45, poleH, 16);
  const poleL = new THREE.Mesh(poleGeo, poleMat);
  poleL.position.set(footL.x, footL.y + poleH * 0.5, footL.z);
  poleL.castShadow = true;
  poleL.receiveShadow = true;
  group.add(poleL);

  const poleR = new THREE.Mesh(poleGeo, poleMat);
  poleR.position.set(footR.x, footR.y + poleH * 0.5, footR.z);
  poleR.castShadow = true;
  poleR.receiveShadow = true;
  group.add(poleR);

  // Üst travers (iki tepe arası)
  const barGeo = new THREE.BoxGeometry(span, 0.2, 0.4);
  const barMat = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a,
    metalness: 0.5,
    roughness: 0.5,
  });
  const bar = new THREE.Mesh(barGeo, barMat);
  bar.position.copy(mid);
  bar.setRotationFromMatrix(rotM);
  bar.castShadow = true;
  group.add(bar);

  // Panel: genişlik otomatik (span - 2*PANEL_MARGIN)
  const autoPanelW = Math.max(2, span - 2 * PANEL_MARGIN);
  const panelGeo = new THREE.PlaneGeometry(autoPanelW, PANEL_HEIGHT);

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;

  const panelMat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const panel = new THREE.Mesh(panelGeo, panelMat);
  panel.position.copy(mid).add(new THREE.Vector3(0, -PANEL_DROP, 0));
  panel.setRotationFromMatrix(rotM); // genişliği direkle hizala
  group.add(panel);

  // === PANEL YÖNÜ: Glassroom tarafına (+X) çevir ===
  if (FACE_TOWARD_POSITIVE_X) {
    panel.updateMatrixWorld(true);
    const normalW = new THREE.Vector3(0, 0, 1)
      .applyMatrix4(new THREE.Matrix4().extractRotation(panel.matrixWorld))
      .normalize();
    const targetDir = new THREE.Vector3(1, 0, 0); // +X
    if (normalW.dot(targetDir) < 0) panel.rotateY(Math.PI); // tersse çevir
  }

  // Kayan yazı (scroll)
  const state = { text: String(text || ''), offset: 0, needsScroll: false, speed: SCROLL_SPEED };

  function redraw() {
    const pad = 24;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(8,11,18,0.95)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(160,190,255,0.5)';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
    ctx.font = '700 64px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
    ctx.fillStyle = '#E8F0FF';

    const m = ctx.measureText(state.text);
    const textW = Math.ceil(m.width);
    const viewW = canvas.width - pad * 2;
    state.needsScroll = textW > viewW;

    const y = canvas.height / 2 + 24;
    if (!state.needsScroll) {
      const x = (canvas.width - textW) / 2;
      ctx.fillText(state.text, x, y);
    } else {
      let x = pad - (state.offset % (textW + pad));
      while (x < canvas.width) {
        ctx.fillText(state.text, x, y);
        x += textW + pad;
      }
    }
    tex.needsUpdate = true;
  }
  redraw();

  function setText(t: string) {
    state.text = String(t || '');
    state.offset = 0;
    redraw();
  }

  function update(dt: number) {
    if (state.needsScroll) {
      state.offset += state.speed * (dt || 0);
      redraw();
    }
  }

  function setResolution(w: number, h: number) {
    if (w <= 0 || h <= 0) return;
    canvas.width = w;
    canvas.height = h;
    redraw();
  }

  return { group, setText, update, setResolution };
}
