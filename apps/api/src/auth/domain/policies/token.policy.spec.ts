import { describe, it, expect } from 'vitest';
import { validateClaims, assertUserActive } from './token.policy.js';
import { User } from '../../../users/domain/entities/user.entity.js';

describe('token.policy', () => {
  describe('validateClaims', () => {
    it('accepts valid claims', () => {
      expect(() =>
        validateClaims({ sub: '1', role: 'learner', subRole: 'basic', username: 'u1' })
      ).not.toThrow();
    });

    it('throws on missing fields', () => {
      expect(() => validateClaims({} as any)).toThrow();
    });
  });

  describe('assertUserActive', () => {
    const active = User.create('1', {
      email: 'a@a.com',
      username: 'u1',
      role: 'learner',
      subRole: 'basic',
      status: 'active',
    });
    const inactive = User.create('2', {
      email: 'b@b.com',
      username: 'u2',
      role: 'learner',
      subRole: 'basic',
      status: 'inactive',
    });

    it('passes for active user', () => {
      expect(() => assertUserActive(active)).not.toThrow();
    });

    it('throws for inactive user', () => {
      expect(() => assertUserActive(inactive)).toThrow();
    });
  });
});
