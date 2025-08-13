import type * as THREE from 'three';

export interface Teleprompter {
  group: THREE.Group;
  setText: (text: string) => void;
}

/** Floor wedge teleprompter using a CanvasTexture. */
export function createTeleprompter(
  THREE: typeof import('three'),
  opts: { color?: number; accent?: number } = {}
): Teleprompter {
  const { color = 0x222222, accent = 0x7aa7ff } = opts;
  const group = new THREE.Group();

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.15, 0.6),
    new THREE.MeshStandardMaterial({ color, metalness: 0.5, roughness: 0.6 })
  );
  base.castShadow = true;
  base.receiveShadow = true;
  base.position.y = 0.15 * 0.5;
  group.add(base);

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.8, 0.45),
    new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })
  );
  screen.position.set(0, 0.15, 0);
  screen.rotation.x = -Math.PI / 4; // tilt toward instructor
  screen.rotation.y = Math.PI; // face -X
  group.add(screen);

  const state = { text: '' };

  function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#E8F0FF';
    ctx.font = '700 48px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state.text, canvas.width / 2, canvas.height / 2);
    ctx.strokeStyle = `#${accent.toString(16).padStart(6, '0')}`;
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
    tex.needsUpdate = true;
  }

  function setText(text: string) {
    if (text === state.text) return;
    state.text = text;
    redraw();
  }

  return { group, setText };
}
