import { describe, expect, it } from 'vitest';
import { resolveMovementWithAABBs } from '../physics';
import type { Vec3, AABB } from '../types';

describe('resolveMovementWithAABBs', () => {
  it('stops at wall', () => {
    const pos: Vec3 = { x: 0, y: 0, z: 0 };
    const vel: Vec3 = { x: 10, y: 0, z: 0 };
    const wall: AABB = { min: { x: 1, y: -1, z: -1 }, max: { x: 2, y: 1, z: 1 } };
    const { pos: np, vel: nv } = resolveMovementWithAABBs(pos, vel, [wall], 1);
    expect(np.x).toBe(1);
    expect(nv.x).toBe(0);
  });
});
