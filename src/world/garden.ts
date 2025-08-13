import * as THREE from 'three';

export interface GardenSetup {
  ground: THREE.Mesh;
  planeSize: number;
  groundR: number;
  stage: THREE.Mesh;
  STAGE_W: number;
  STAGE_D: number;
  STAGE_H: number;
  insideStageXZ: (x: number, z: number, half?: number) => boolean;
  groundYAt: (x: number, z: number, half?: number) => number;
  boardBlock: (pos: THREE.Vector3, prev: THREE.Vector3, half?: number) => void;
  board: THREE.Mesh;
  boardSize: number;
  boardZCenter: number;
  boardYCenter: number;
}

export function createGarden(scene: THREE.Scene): GardenSetup {
  const planeSize = 400; // sahne ölçeği referansı

  // Dairesel zemin
  const groundR = planeSize * 0.78; // elips istenirse anisotropic scale
  const circle = new THREE.Mesh(
    new THREE.CircleGeometry(groundR, 128),
    new THREE.MeshLambertMaterial({ color: 0x2faa2f })
  );
  circle.rotation.x = -Math.PI / 2;
  circle.receiveShadow = true;
  scene.add(circle);

  // Sahne (X sabit solda, Z ortada)
  const STAGE_W = 90, STAGE_D = 90, STAGE_H = 15;
  const stageMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.1, roughness: 0.8 });
  const stage = new THREE.Mesh(new THREE.BoxGeometry(STAGE_W, STAGE_H, STAGE_D), stageMat);
  stage.castShadow = true;
  stage.receiveShadow = true;
  stage.position.set(-planeSize / 2 + STAGE_W / 2, STAGE_H / 2, 0);
  scene.add(stage);

  // Sunum tahtası
  const boardSize = 80;
  const boardX = -110;
  const boardZMin = -130, boardZMax = -50;
  const boardZCenter = (boardZMin + boardZMax) * 0.5;
  const boardYCenter = boardSize * 0.5;
  const board = new THREE.Mesh(
    new THREE.PlaneGeometry(boardSize, boardSize),
    new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.0, roughness: 0.25, side: THREE.DoubleSide })
  );
  board.position.set(boardX, boardYCenter, boardZCenter);
  board.rotation.y = -Math.PI / 2;
  scene.add(board);

  function boardBlock(pos: THREE.Vector3, prev: THREE.Vector3, half = 1) {
    const yMin = 0, yMax = boardSize;
    const zMin = boardZMin, zMax = boardZMax;
    const withinZ = (pos.z > zMin - half && pos.z < zMax + half) || (prev.z > zMin - half && prev.z < zMax + half);
    const withinY = (pos.y - half < yMax && pos.y + half > yMin) || (prev.y - half < yMax && prev.y + half > yMin);
    if (!withinZ || !withinY) return;
    const sidePrev = Math.sign(prev.x - boardX);
    const sideNow = Math.sign(pos.x - boardX);
    if (sidePrev === 0 && sideNow === 0) return;
    if (sidePrev === 0 && sideNow !== 0) { pos.x = boardX + (sideNow > 0 ? half : -half); return; }
    if (sidePrev !== 0 && sideNow !== 0 && sidePrev !== sideNow) { pos.x = prev.x; return; }
  }

  function insideStageXZ(x: number, z: number, half = 1): boolean {
    const sxMin = stage.position.x - STAGE_W / 2 - half,
      sxMax = stage.position.x + STAGE_W / 2 + half,
      szMin = stage.position.z - STAGE_D / 2 - half,
      szMax = stage.position.z + STAGE_D / 2 + half;
    return x >= sxMin && x <= sxMax && z >= szMin && z <= szMax;
  }

  // Eliptik/dairesel zemin fonksiyonu
  const a = groundR, b = groundR;
  function insideEllipse(x: number, z: number): boolean {
    return (x * x) / (a * a) + (z * z) / (b * b) <= 1.0;
  }

  const groundYAt = (x: number, z: number, half = 1): number => {
    if (insideStageXZ(x, z, half)) return 9999;
    return insideEllipse(x, z) ? 0 : 9999;
  };

  return { 
    ground: circle, 
    planeSize, 
    groundR, 
    stage, 
    STAGE_W, 
    STAGE_D, 
    STAGE_H, 
    insideStageXZ, 
    groundYAt, 
    boardBlock,
    board,
    boardSize,
    boardZCenter,
    boardYCenter
  };
}
