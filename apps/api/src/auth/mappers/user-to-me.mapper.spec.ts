import { describe, it, expect } from 'vitest';
import { User } from '../../users/domain/entities/user.entity.js';
import { toMeDto } from './user-to-me.mapper.js';

describe('user-to-me mapper', () => {
  it('maps user to safe profile without sensitive fields', () => {
    const user = User.create('1', {
      email: 'a@a.com',
      username: 'u1',
      passwordHash: 'hash',
      role: 'learner',
      subRole: 'basic',
    });
    const me = toMeDto(user);
    expect(me).toMatchObject({
      id: '1',
      email: 'a@a.com',
      username: 'u1',
      role: 'learner',
      subRole: 'basic',
      status: 'active',
    });
    expect('password' in me).toBe(false);
    expect('passwordHash' in me).toBe(false);
  });
});
