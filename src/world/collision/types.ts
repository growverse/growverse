export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface AABB {
  min: Vec3;
  max: Vec3;
}

export type Collider = AABB;

export interface Ray {
  origin: Vec3;
  dir: Vec3; // should be normalized
}

export interface RayHit {
  distance: number;
  point: Vec3;
}
