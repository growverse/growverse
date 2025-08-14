import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Keys } from '@/core/input';
import { userStore } from '@/state/userStore';
import { canEnterStage } from '@/world/constraints';

export interface AvatarHelpers {
  insideStageXZ: (x: number, z: number, half?: number) => boolean;
  groundYAt: (x: number, z: number, half?: number) => number;
  planeSize: number;
  stageTopY: number;
  roomBlock?: (pos: THREE.Vector3, prev: THREE.Vector3, half?: number) => void;
  buildingBlock?: (pos: THREE.Vector3, prev: THREE.Vector3, half?: number) => void;
  boardBlock?: (pos: THREE.Vector3, prev: THREE.Vector3, half?: number) => void;
  stageBlock?: (pos: THREE.Vector3, prev: THREE.Vector3, half?: number) => void;
}

export interface AvatarMaterials {
  skin: THREE.MeshStandardMaterial;
  limb: THREE.MeshStandardMaterial;
  black: THREE.MeshStandardMaterial;
  white: THREE.MeshStandardMaterial;
}

export function createAvatarMesh(materials: AvatarMaterials): THREE.Group {
  const { skin, limb, black, white } = materials;

  const gBox = (x: number, y: number, z: number, m: THREE.Material): THREE.Mesh => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(x, y, z), m);
    mesh.castShadow = true;
    return mesh;
  };

  const root = new THREE.Group();
  const torso = gBox(1.2, 1.6, 0.6, skin);
  torso.position.y = 1.6;
  root.add(torso);

  const head = gBox(0.9, 0.9, 0.9, skin);
  head.position.y = 2.65;
  root.add(head);

  const face = new THREE.Group();
  face.position.set(0, 2.65, 0.455);

  const eyeW_L = gBox(0.22, 0.18, 0.02, white);
  eyeW_L.position.set(-0.22, 0.08, 0);
  const eyeW_R = eyeW_L.clone();
  eyeW_R.position.x *= -1;

  const eye_L = gBox(0.08, 0.08, 0.03, black);
  eye_L.position.set(-0.22, 0.08, 0.02);
  const eye_R = eye_L.clone();
  eye_R.position.x *= -1;

  const brow_L = gBox(0.28, 0.05, 0.03, black);
  brow_L.position.set(-0.22, 0.2, 0.01);
  const brow_R = brow_L.clone();
  brow_R.position.x *= -1;

  face.add(eyeW_L, eyeW_R, eye_L, eye_R, brow_L, brow_R);
  root.add(face);

  const arm = gBox(0.35, 1.2, 0.35, limb);
  const leg = gBox(0.45, 1.4, 0.45, limb);

  const aL = new THREE.Group();
  const aR = new THREE.Group();
  const lL = new THREE.Group();
  const lR = new THREE.Group();

  const armL = arm.clone();
  const armR = arm.clone();
  const legL = leg.clone();
  const legR = leg.clone();

  armL.position.set(0, -0.6, 0);
  armR.position.copy(armL.position);
  legL.position.set(0, -0.7, 0);
  legR.position.copy(legL.position);

  aL.position.set(-0.9, 2.2, 0);
  aR.position.set(0.9, 2.2, 0);
  lL.position.set(-0.3, 1.4, 0);
  lR.position.set(0.3, 1.4, 0);

  aL.add(armL);
  aR.add(armR);
  lL.add(legL);
  lR.add(legR);

  root.add(aL, aR, lL, lR);

  root.userData.limbs = { aL, aR, lL, lR };
  return root;
}

export interface AvatarFactory {
  create: () => THREE.Group;
}

export function AvatarFactory(): AvatarFactory {
  const materials: AvatarMaterials = {
    skin: new THREE.MeshStandardMaterial({ color: 0xffe0bd }),
    limb: new THREE.MeshStandardMaterial({ color: 0x888888 }),
    black: new THREE.MeshStandardMaterial({ color: 0x111111 }),
    white: new THREE.MeshStandardMaterial({ color: 0xffffff }),
  };

  return {
    create(): THREE.Group {
      return createAvatarMesh(materials);
    },
  };
}

export function updateAvatar(
  dt: number,
  avatar: THREE.Group,
  keys: Keys,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  helpers: AvatarHelpers,
): void {
  if (!avatar) return;

  const { insideStageXZ, groundYAt, planeSize, roomBlock, buildingBlock, boardBlock, stageBlock } =
    helpers;
  const AVATAR_SIZE = 2;

  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  forward.y = 0;
  forward.normalize();

  const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

  const moveX = (keys.d ? 1 : 0) + (keys.a ? -1 : 0);
  const moveZ = (keys.s ? 1 : 0) + (keys.w ? -1 : 0);
  const move = new THREE.Vector3().addScaledVector(forward, -moveZ).addScaledVector(right, moveX);
  if (move.lengthSq() > 0) move.normalize();

  if (!avatar.userData.vel) {
    avatar.userData.vel = new THREE.Vector3(0, 0, 0);
  }
  const vel = avatar.userData.vel;

  const speed = 18,
    gravity = 22,
    jumpSpeed = 8.5,
    friction = 10;
  vel.x += (move.x * speed - vel.x) * Math.min(1, dt * 8);
  vel.z += (move.z * speed - vel.z) * Math.min(1, dt * 8);
  if (move.lengthSq() === 0) {
    const damp = Math.max(0, 1 - friction * dt);
    vel.x *= damp;
    vel.z *= damp;
  }

  const gY = groundYAt(avatar.position.x, avatar.position.z, AVATAR_SIZE / 2) + AVATAR_SIZE / 2;
  const onGround = Math.abs(avatar.position.y - gY) < 0.01;
  if (onGround && keys.space) vel.y = jumpSpeed;
  else if (!onGround) vel.y -= gravity * dt;
  else vel.y = 0;

  const prev = avatar.position.clone();
  avatar.position.x += vel.x * dt;
  avatar.position.y = Math.max(avatar.position.y + vel.y * dt, AVATAR_SIZE / 2);
  avatar.position.z += vel.z * dt;

  const minX = -planeSize / 2 + AVATAR_SIZE / 2;
  const maxX = planeSize / 2 - AVATAR_SIZE / 2;
  const minZ = -planeSize / 2 + AVATAR_SIZE / 2;
  const maxZ = planeSize / 2 - AVATAR_SIZE / 2;
  avatar.position.x = Math.min(Math.max(avatar.position.x, minX), maxX);
  avatar.position.z = Math.min(Math.max(avatar.position.z, minZ), maxZ);

  // Prevent learners from entering the stage area
  const role = userStore.getLocal()?.role ?? 'learner';
  if (
    !canEnterStage(role) &&
    insideStageXZ(avatar.position.x, avatar.position.z, AVATAR_SIZE / 2)
  ) {
    avatar.position.copy(prev);
  }

  if (typeof stageBlock === 'function') stageBlock(avatar.position, prev, AVATAR_SIZE / 2);
  if (typeof roomBlock === 'function') roomBlock(avatar.position, prev, AVATAR_SIZE / 2);
  if (typeof buildingBlock === 'function') buildingBlock(avatar.position, prev, AVATAR_SIZE / 2);
  if (typeof boardBlock === 'function') boardBlock(avatar.position, prev, AVATAR_SIZE / 2);

  const nGY = groundYAt(avatar.position.x, avatar.position.z, AVATAR_SIZE / 2) + AVATAR_SIZE / 2;
  if (avatar.position.y < nGY) {
    avatar.position.y = nGY;
    vel.y = 0;
  }

  if (vel.lengthSq() > 0.0001) {
    const dirY = Math.atan2(vel.x, vel.z);
    if (!Number.isNaN(dirY)) avatar.rotation.y = dirY;
  }

  if (!avatar.userData.animBlend) avatar.userData.animBlend = 0;
  if (!avatar.userData.swingTime) avatar.userData.swingTime = 0;

  const speed2D = Math.hypot(vel.x, vel.z);
  const targetRun = Math.min(1, speed2D / speed);
  const blendK = 12;
  avatar.userData.animBlend += (targetRun - avatar.userData.animBlend) * Math.min(1, dt * blendK);
  if (avatar.userData.animBlend < 0.05) avatar.userData.swingTime = 0;

  const freq = THREE.MathUtils.lerp(2.0, 6.0, avatar.userData.animBlend);
  avatar.userData.swingTime += dt * freq;
  const amp = THREE.MathUtils.lerp(0.1, 0.6, avatar.userData.animBlend);
  const s = Math.sin(avatar.userData.swingTime);
  const { aL, aR, lL, lR } = avatar.userData.limbs;
  aL.rotation.x = s * amp;
  aR.rotation.x = -s * amp;
  lL.rotation.x = -s * amp;
  lR.rotation.x = s * amp;
  if (!onGround) {
    aL.rotation.x += 0.6;
    aR.rotation.x += 0.6;
  }

  const desiredTarget = avatar.position.clone();
  const deltaTarget = desiredTarget.clone().sub(controls.target);
  camera.position.add(deltaTarget);
  controls.target.copy(avatar.position);
}
