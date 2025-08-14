import * as THREE from 'three';

export function createTreesController(instanced: THREE.InstancedMesh) {
  const max = instanced.count;
  let current = max;
  return {
    setDensity(ratio: number) {
      const clamped = Math.max(0, Math.min(1, ratio));
      const target = Math.floor(max * clamped);
      if (target === current) return;
      instanced.count = target;
      instanced.instanceMatrix.needsUpdate = true;
      current = target;
    }
  };
}
