import type { AABB, Vec3 } from './types';

export function box(min: Vec3, max: Vec3): AABB {
  return { min: { ...min }, max: { ...max } };
}

export function ground(size: number, height = 0): AABB {
  const half = size / 2;
  return box({ x: -half, y: height - 0.01, z: -half }, { x: half, y: height, z: half });
}
