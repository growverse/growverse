import * as THREE from 'three';
import { Role } from '@/domain/roles';
import { emitTeleportLocal } from './worldBus';

interface WorldRefs {
  stage: THREE.Object3D;
  glassRoom: THREE.Object3D;
  dims: { STAGE_W: number; STAGE_D: number; STAGE_H: number; planeSize: number };
}

let refs: WorldRefs | null = null;
const AVATAR_HALF = 1;

export function setWorldRefs(r: WorldRefs): void {
  refs = r;
}

export function getInstructorSpawn() {
  if (!refs) throw new Error('World refs not set');
  const { stage, dims } = refs;
  const position = {
    x: stage.position.x,
    y: stage.position.y + dims.STAGE_H / 2 + AVATAR_HALF,
    z: stage.position.z - dims.STAGE_D / 2 + 2,
  };
  return { position, rotationY: 0 };
}

export function getLearnerSpawn() {
  if (!refs) throw new Error('World refs not set');
  const { glassRoom } = refs;
  const position = {
    x: glassRoom.position.x,
    y: AVATAR_HALF,
    z: glassRoom.position.z,
  };
  return { position, rotationY: -Math.PI / 2 };
}

export function requestTeleportToRole(role: Role) {
  const p = role === 'instructor' ? getInstructorSpawn() : getLearnerSpawn();
  emitTeleportLocal(p);
}
