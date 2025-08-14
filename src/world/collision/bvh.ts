import * as THREE from 'three';
import type { BufferGeometry } from 'three';
import type * as MeshBVHModule from 'three-mesh-bvh';

let bvh: typeof MeshBVHModule | null = null;

export async function initBVH(): Promise<void> {
  if (bvh) return;
  const mod: typeof MeshBVHModule = await import('three-mesh-bvh');
  bvh = mod;
  THREE.Mesh.prototype.raycast = bvh.acceleratedRaycast;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  (THREE.BufferGeometry.prototype as any).computeBoundsTree = bvh.computeBoundsTree;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  (THREE.BufferGeometry.prototype as any).disposeBoundsTree = bvh.disposeBoundsTree;
}

export function computeBoundsTree(geometry: BufferGeometry): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
  (geometry as any).computeBoundsTree?.();
}

export function disposeBoundsTree(geometry: BufferGeometry): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
  (geometry as any).disposeBoundsTree?.();
}
