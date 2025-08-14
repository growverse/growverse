import * as THREE from 'three';

export interface NFTBuildingSetup {
  building: THREE.Group;
  block: (pos: THREE.Vector3, prev: THREE.Vector3, half?: number) => void;
  size: { w: number; d: number; h: number };
  door: { w: number; h: number };
}

export interface NFTBuildingConfig {
  w?: number;
  d?: number;
  h?: number;
  position?: THREE.Vector3;
  doorRatio?: number;
}

export function createNftBuilding(
  scene: THREE.Scene,
  config: NFTBuildingConfig = {},
): NFTBuildingSetup {
  const {
    w = 60,
    d = 40,
    h = 22,
    position = new THREE.Vector3(5, 0, 135),
    doorRatio = 0.35,
  } = config;

  const group = new THREE.Group();
  const purple = new THREE.MeshStandardMaterial({
    color: 0x7a3cf6,
    metalness: 0.35,
    roughness: 0.6,
  });
  const black = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.5, roughness: 0.4 });
  const whiteM = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.0,
    roughness: 0.2,
    side: THREE.DoubleSide,
  });
  const t = 0.3;

  const floor = new THREE.Mesh(new THREE.BoxGeometry(w, t, d), purple);
  floor.position.y = 0;
  floor.receiveShadow = true;
  group.add(floor);

  const doorW = Math.max(2.0, w * doorRatio);
  const doorH = Math.min(3.2, h * 0.5);
  const hx = w / 2,
    hz = d / 2;
  const segW = Math.max(0, (w - doorW) / 2);

  if (segW > 0) {
    const northL = new THREE.Mesh(new THREE.BoxGeometry(segW, h, t), purple);
    northL.position.set(-(doorW / 2 + segW / 2), h / 2, -hz);
    group.add(northL);

    const northR = new THREE.Mesh(new THREE.BoxGeometry(segW, h, t), purple);
    northR.position.set(doorW / 2 + segW / 2, h / 2, -hz);
    group.add(northR);
  }

  const south = new THREE.Mesh(new THREE.BoxGeometry(w, h, t), purple);
  south.position.set(0, h / 2, hz);
  group.add(south);

  const west = new THREE.Mesh(new THREE.BoxGeometry(d, h, t), purple);
  west.rotation.y = Math.PI / 2;
  west.position.set(-hx, h / 2, 0);
  group.add(west);

  const east = new THREE.Mesh(new THREE.BoxGeometry(d, h, t), purple);
  east.rotation.y = Math.PI / 2;
  east.position.set(hx, h / 2, 0);
  group.add(east);

  const fw = 8,
    fh = 6,
    gap = 3,
    inset = t / 2 + 0.02,
    border = 0.4,
    depth = 0.2;

  function makeFrame(): THREE.Group {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(fw - 2 * border, fh - 2 * border), whiteM);
    const barH = new THREE.BoxGeometry(fw, border, depth);
    const barV = new THREE.BoxGeometry(border, fh, depth);
    const top = new THREE.Mesh(barH, black);
    const bot = new THREE.Mesh(barH, black);
    const lef = new THREE.Mesh(barV, black);
    const rig = new THREE.Mesh(barV, black);

    top.position.set(0, (fh - border) / 2, 0);
    bot.position.set(0, -(fh - border) / 2, 0);
    lef.position.set(-(fw - border) / 2, 0, 0);
    rig.position.set((fw - border) / 2, 0, 0);

    const g = new THREE.Group();
    g.add(panel, top, bot, lef, rig);
    return g;
  }

  function addTriple(which: 'south' | 'west' | 'east') {
    const totalW = 3 * fw + 2 * gap;
    const y = h * 0.55;
    for (let i = 0; i < 3; i++) {
      const g = makeFrame();
      const lx = -totalW / 2 + i * (fw + gap) + fw / 2;
      if (which === 'south') {
        g.rotation.y = Math.PI;
        g.position.set(lx, y, hz - inset);
      }
      if (which === 'west') {
        g.rotation.y = Math.PI / 2;
        g.position.set(-hx + inset, y, lx);
      }
      if (which === 'east') {
        g.rotation.y = -Math.PI / 2;
        g.position.set(hx - inset, y, lx);
      }
      group.add(g);
    }
  }

  addTriple('south');
  addTriple('west');
  addTriple('east');

  group.position.copy(position);
  scene.add(group);

  const ixMin = -hx,
    ixMax = hx,
    izMin = -hz,
    izMax = hz;

  function isInside(lx: number, lz: number, half: number): boolean {
    return lx > ixMin + half && lx < ixMax - half && lz > izMin + half && lz < izMax - half;
  }

  function buildingBlock(pos: THREE.Vector3, prev: THREE.Vector3, half = 1) {
    const lx = pos.x - position.x,
      lz = pos.z - position.z,
      lpx = prev.x - position.x,
      lpz = prev.z - position.z;
    const prevInside = isInside(lpx, lpz, half),
      nowInside = isInside(lx, lz, half);
    const inDoorX = Math.abs(lx) <= doorW / 2;
    const inDoorY = pos.y - half <= doorH;
    const northPlane = izMin + half;
    const crossingNorthOut = lpz >= northPlane && lz < northPlane;
    const crossingNorthIn = lpz <= northPlane && lz > northPlane;

    if (prevInside && !nowInside) {
      const through = crossingNorthOut && inDoorX && inDoorY;
      if (!through) {
        pos.x = prev.x;
        pos.z = prev.z;
        return;
      }
    }
    if (!prevInside && nowInside) {
      const through = crossingNorthIn && inDoorX && inDoorY;
      if (!through) {
        pos.x = prev.x;
        pos.z = prev.z;
        return;
      }
    }
    if (prevInside && nowInside) {
      pos.x = Math.min(Math.max(pos.x, position.x + ixMin + half), position.x + ixMax - half);
      pos.z = Math.min(Math.max(pos.z, position.z + izMin + half), position.z + izMax - half);
    }
  }

  return { building: group, block: buildingBlock, size: { w, d, h }, door: { w: doorW, h: doorH } };
}
