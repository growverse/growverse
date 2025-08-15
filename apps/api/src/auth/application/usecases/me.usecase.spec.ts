import { describe, it, expect, vi } from 'vitest';
import { MeUseCase } from './me.usecase.js';
import { User } from '../../../users/domain/entities/user.entity.js';
import { ApiError } from '../../../core/errors/api-error.js';

function createUser(status: 'active' | 'inactive') {
  return User.create('1', {
    email: 'a@a.com',
    username: 'u1',
    role: 'learner',
    subRole: 'basic',
    status,
  });
}

describe('MeUseCase', () => {
  it('returns profile for valid token and active user', async () => {
    const jwt = { verify: vi.fn().mockResolvedValue({ sub: '1' }) } as any;
    const repo = { findById: vi.fn().mockResolvedValue(createUser('active')) } as any;
    const usecase = new MeUseCase(jwt, repo);
    const res = await usecase.execute({ token: 't' });
    expect(res).toMatchObject({ id: '1', email: 'a@a.com', username: 'u1' });
  });

  it('throws when user inactive', async () => {
    const jwt = { verify: vi.fn().mockResolvedValue({ sub: '1' }) } as any;
    const repo = { findById: vi.fn().mockResolvedValue(createUser('inactive')) } as any;
    const usecase = new MeUseCase(jwt, repo);
    await expect(usecase.execute({ token: 't' })).rejects.toThrow();
  });

  it('throws not found for missing user', async () => {
    const jwt = { verify: vi.fn().mockResolvedValue({ sub: '1' }) } as any;
    const repo = { findById: vi.fn().mockResolvedValue(null) } as any;
    const usecase = new MeUseCase(jwt, repo);
    await expect(usecase.execute({ token: 't' })).rejects.toBeInstanceOf(ApiError);
  });

  it('throws unauthorized for invalid token', async () => {
    const jwt = { verify: vi.fn().mockRejectedValue(new Error('bad')) } as any;
    const repo = { findById: vi.fn() } as any;
    const usecase = new MeUseCase(jwt, repo);
    await expect(usecase.execute({ token: 't' })).rejects.toBeInstanceOf(ApiError);
  });
});
