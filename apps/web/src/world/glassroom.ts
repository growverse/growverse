import * as THREE from 'three';

export interface GlassRoomSetup {
  room: THREE.Group;
  height: number;
  block: (pos: THREE.Vector3, prev: THREE.Vector3, half?: number) => void;
}

export interface GlassRoomConfig {
  w: number;
  d: number;
  position: THREE.Vector3;
  doorRatio?: number;
}

export function createGlassRoom(scene: THREE.Scene, config: GlassRoomConfig): GlassRoomSetup {
  const { w, d, position, doorRatio = 0.35 } = config;
  const baseH = 2.6,
    upperH = 15.0;
  const h = baseH + upperH;
  const t = 0.25;

  const group = new THREE.Group();
  const matPillar = new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.6,
    roughness: 0.5,
  });
  const matGlass = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.22,
    metalness: 0.0,
    roughness: 0.15,
  });
  const matFloor = new THREE.MeshStandardMaterial({ color: 0x303030 });

  const floor = new THREE.Mesh(new THREE.BoxGeometry(w, t, d), matFloor);
  floor.position.y = 0;
  floor.receiveShadow = true;
  group.add(floor);

  const doorW = Math.max(1.2, d * doorRatio);
  const segZ = Math.max(0, (d - doorW) / 2);

  const northBase = new THREE.Mesh(new THREE.BoxGeometry(w, baseH, t), matPillar);
  northBase.position.set(0, baseH / 2, -d / 2);
  group.add(northBase);

  const southBase = new THREE.Mesh(new THREE.BoxGeometry(w, baseH, t), matPillar);
  southBase.position.set(0, baseH / 2, d / 2);
  group.add(southBase);

  const eastBase = new THREE.Mesh(new THREE.BoxGeometry(d, baseH, t), matPillar);
  eastBase.rotation.y = Math.PI / 2;
  eastBase.position.set(w / 2, baseH / 2, 0);
  group.add(eastBase);

  if (segZ > 0) {
    const westBaseL = new THREE.Mesh(new THREE.BoxGeometry(segZ, baseH, t), matPillar);
    westBaseL.rotation.y = Math.PI / 2;
    westBaseL.position.set(-w / 2, baseH / 2, -(doorW / 2 + segZ / 2));
    group.add(westBaseL);

    const westBaseR = new THREE.Mesh(new THREE.BoxGeometry(segZ, baseH, t), matPillar);
    westBaseR.rotation.y = Math.PI / 2;
    westBaseR.position.set(-w / 2, baseH / 2, doorW / 2 + segZ / 2);
    group.add(westBaseR);
  }

  const colW = 2.4,
    panelW = 1.2,
    cell = colW + panelW;
  const yUpperMid = baseH + upperH / 2;

  function buildUpperStrip({
    along,
    L,
    fixedVal,
    isWestDoor = false,
  }: {
    along: 'x' | 'z';
    L: number;
    fixedVal: number;
    isWestDoor?: boolean;
  }) {
    const count = Math.ceil(L / cell);
    for (let i = 0; i < count; i++) {
      const base = -L / 2 + i * cell;
      const colLen = Math.min(colW, L - i * cell);
      if (colLen > 0) {
        const col = new THREE.Mesh(
          along === 'x'
            ? new THREE.BoxGeometry(colLen, upperH, t)
            : new THREE.BoxGeometry(t, upperH, colLen),
          matPillar,
        );
        if (along === 'x') {
          col.position.set(base + colLen / 2, yUpperMid, fixedVal);
        } else {
          col.position.set(fixedVal, yUpperMid, base + colLen / 2);
        }
        if (!(isWestDoor && Math.abs(col.position.z) <= doorW / 2)) {
          group.add(col);
        }
      }
      const panLen = Math.min(panelW, L - (i * cell + colLen));
      if (panLen > 0) {
        const pan = new THREE.Mesh(
          along === 'x'
            ? new THREE.BoxGeometry(panLen, upperH, t)
            : new THREE.BoxGeometry(t, upperH, panLen),
          matGlass,
        );
        if (along === 'x') {
          pan.position.set(base + colLen + panLen / 2, yUpperMid, fixedVal);
        } else {
          pan.position.set(fixedVal, yUpperMid, base + colLen + panLen / 2);
        }
        if (!(isWestDoor && Math.abs(pan.position.z) <= doorW / 2)) {
          group.add(pan);
        }
      }
    }
  }

  buildUpperStrip({ along: 'x', L: w, fixedVal: -d / 2, isWestDoor: false });
  buildUpperStrip({ along: 'x', L: w, fixedVal: d / 2, isWestDoor: false });
  buildUpperStrip({ along: 'z', L: d, fixedVal: w / 2, isWestDoor: false });
  buildUpperStrip({ along: 'z', L: d, fixedVal: -w / 2, isWestDoor: true });

  const roof = new THREE.Mesh(new THREE.BoxGeometry(w, t, d), matGlass);
  roof.position.set(0, h + t / 2, 0);
  group.add(roof);

  group.position.copy(position);
  scene.add(group);

  const hx = w / 2,
    hz = d / 2;
  const ixMin = -hx,
    ixMax = hx,
    izMin = -hz,
    izMax = hz;

  function isInsideInner(lx: number, lz: number, half: number): boolean {
    return lx > ixMin + half && lx < ixMax - half && lz > izMin + half && lz < izMax - half;
  }

  function roomBlock(pos: THREE.Vector3, prev: THREE.Vector3, half = 1) {
    const lx = pos.x - position.x,
      lz = pos.z - position.z,
      lpx = prev.x - position.x,
      lpz = prev.z - position.z;
    const prevInside = isInsideInner(lpx, lpz, half),
      nowInside = isInsideInner(lx, lz, half);
    const doorWidth = Math.max(1.2, d * 0.35);
    const inDoorZ = Math.abs(lz) <= doorWidth / 2;
    const westInnerPlane = ixMin + half;
    const crossingWestOut = lpx >= westInnerPlane && lx < westInnerPlane;
    const crossingWestIn = lpx <= westInnerPlane && lx > westInnerPlane;

    if (prevInside && !nowInside) {
      const throughDoor = crossingWestOut && inDoorZ;
      if (!throughDoor) {
        pos.x = prev.x;
        pos.z = prev.z;
        return;
      }
    }
    if (!prevInside && nowInside) {
      const throughDoor = crossingWestIn && inDoorZ;
      if (!throughDoor) {
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

  return { room: group, height: h, block: roomBlock };
}
