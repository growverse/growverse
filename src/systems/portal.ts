import * as THREE from 'three';
import { sessionStore } from '@/state/sessionStore';

export interface PortalDOMElements {
  portalUI: HTMLElement;
  portalList: HTMLElement;
  btnCancel: HTMLElement;
  btnTeleport: HTMLElement;
  portalHint: HTMLElement;
  fade: HTMLElement;
}

export interface Destination {
  id: string;
  title: string;
  note: string;
}

export interface PortalSystem {
  group: THREE.Group;
  radius: number;
  openUI: () => void;
  closeUI: () => void;
  moveSel: (direction: number) => void;
  getSelected: () => Destination;
  teleportWith: (applyPreset: (id: string) => void) => Promise<void>;
  teleportTo: (id: string, applyPreset: (id: string) => void) => Promise<void>;
}

export function createPortalSystem(scene: THREE.Scene, dom: PortalDOMElements): PortalSystem {
  // Visual portal
  const group = new THREE.Group();
  scene.add(group);
  const radius = 10;
  const ringGeo = new THREE.RingGeometry(radius * 0.7, radius, 64);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x7fd1ff, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  group.add(ring);

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.05, radius * 0.3, 6, 16, 1, true),
    new THREE.MeshBasicMaterial({ color: 0x9fd8ff, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
  );
  beam.position.y = 3;
  group.add(beam);

  const { portalUI, portalList, btnCancel, portalHint, fade } = dom;
  
  // Sessions from central store
  const destinations: Destination[] = sessionStore
    .getState()
    .sessions.map((s) => ({ id: s.id, title: s.name, note: s.description || '' }));
  let selected = 0;
  
  function renderList() {
    portalList.innerHTML = '';
    destinations.forEach((d, i) => {
      const el = document.createElement('div');
      el.className = 'item' + (i === selected ? ' selected' : '');
      el.innerHTML = `<div style="width:8px; height:8px; border-radius:50%; background:#8cc2ff;"></div>
                      <div style="flex:1">
                        <div style="font-weight:600">${d.title}</div>
                        <div style="opacity:.7; font-size:12px">${d.note}</div>
                      </div>`;
      el.addEventListener('click', () => {
        selected = i;
        renderList();
      });
      portalList.appendChild(el);
    });
  }
  renderList();

  function openUI() {
    portalUI.classList.add('visible');
    portalHint.classList.add('visible');
  }
  
  function closeUI() {
    portalUI.classList.remove('visible');
    portalHint.classList.remove('visible');
  }

  btnCancel.addEventListener('click', closeUI);
  
  function moveSel(d: number) {
    selected = (selected + d + destinations.length) % destinations.length;
    renderList();
  }
  
  function fadeOn() {
    fade.classList.add('on');
  }
  
  function fadeOff() {
    fade.classList.remove('on');
  }

  async function runTeleport(id: string, applyPreset: (id: string) => void) {
    fadeOn();
    await new Promise((r) => setTimeout(r, 420));
    applyPreset(id);
    await new Promise((r) => setTimeout(r, 120));
    fadeOff();
  }

  return {
    group,
    radius,
    openUI,
    closeUI,
    moveSel,
    getSelected: () => destinations[selected],
    async teleportWith(applyPreset: (id: string) => void) {
      const dst = destinations[selected];
      await runTeleport(dst.id, applyPreset);
    },
    teleportTo(id: string, applyPreset: (id: string) => void) {
      return runTeleport(id, applyPreset);
    },
  };
}

// --- Faz 5: Preset controller — TÜMÜ VARSAYILAN DÜZEN ---
export interface SceneObjects {
  stage: THREE.Mesh;
  glassRoom: THREE.Group;
  nftBuilding: THREE.Group;
}

export interface SceneDimensions {
  planeSize: number;
  STAGE_W: number;
  STAGE_D: number;
  STAGE_H: number;
}

export interface SceneRefs {
  objects: SceneObjects;
  dims: SceneDimensions;
}

export function createPresetController(sceneRefs: SceneRefs): (id: string) => void {
  const { objects, dims } = sceneRefs;
  
  function applyDefault() {
    objects.stage.position.set(-dims.planeSize / 2 + dims.STAGE_W / 2, dims.STAGE_H / 2, 0);
    objects.glassRoom.position.set(dims.planeSize / 2 - dims.STAGE_W / 2, 0, 0);
    objects.nftBuilding.position.set(5, 0, 135);
  }
  
  const presets: Record<string, () => void> = {
    'garden-alpha': applyDefault,
    'garden-beta': applyDefault,
    'garden-gamma': applyDefault,
    'garden-delta': applyDefault,
    'garden-epsilon': applyDefault,
  };
  
  return function applyPreset(id: string) {
    (presets[id] || applyDefault)();
  };
}
