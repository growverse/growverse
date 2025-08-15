import { assertValidRolePair, isValidSubRole } from './role.policy.js';

describe('role.policy', () => {
  it('accepts valid pair', () => {
    expect(isValidSubRole('admin', 'global')).toBe(true);
  });

  it('rejects invalid pair', () => {
    expect(() => assertValidRolePair('admin', 'vip' as any)).toThrow();
  });
});
