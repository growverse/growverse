import type { AABB, Vec3, Ray } from './types';

export function resolveMovementWithAABBs(
  pos: Vec3,
  vel: Vec3,
  colliders: AABB[],
  dt: number,
): { pos: Vec3; vel: Vec3 } {
  const next = { x: pos.x + vel.x * dt, y: pos.y + vel.y * dt, z: pos.z + vel.z * dt };
  const resPos = { ...next };
  const resVel = { ...vel };
  for (const box of colliders) {
    if (
      resPos.x >= box.min.x &&
      resPos.x <= box.max.x &&
      resPos.y >= box.min.y &&
      resPos.y <= box.max.y &&
      resPos.z >= box.min.z &&
      resPos.z <= box.max.z
    ) {
      if (vel.x > 0) resPos.x = box.min.x;
      if (vel.x < 0) resPos.x = box.max.x;
      if (vel.y > 0) resPos.y = box.min.y;
      if (vel.y < 0) resPos.y = box.max.y;
      if (vel.z > 0) resPos.z = box.min.z;
      if (vel.z < 0) resPos.z = box.max.z;
      resVel.x = vel.x > 0 ? Math.min(0, resVel.x) : Math.max(0, resVel.x);
      resVel.y = vel.y > 0 ? Math.min(0, resVel.y) : Math.max(0, resVel.y);
      resVel.z = vel.z > 0 ? Math.min(0, resVel.z) : Math.max(0, resVel.z);
    }
  }
  return { pos: resPos, vel: resVel };
}

export function groundSnapRaycast(
  pos: Vec3,
  ray: Ray,
  colliders: AABB[],
): { grounded: boolean; newY: number } {
  let bestY = -Infinity;
  for (const box of colliders) {
    if (ray.dir.y >= 0) continue;
    if (pos.x < box.min.x || pos.x > box.max.x || pos.z < box.min.z || pos.z > box.max.z) continue;
    const top = box.max.y;
    if (top <= pos.y && top > bestY) bestY = top;
  }
  if (bestY === -Infinity) return { grounded: false, newY: pos.y };
  return { grounded: Math.abs(pos.y - bestY) < 0.05, newY: bestY };
}
