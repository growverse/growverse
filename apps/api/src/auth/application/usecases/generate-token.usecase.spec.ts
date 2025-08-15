import { describe, it, expect, vi } from 'vitest';
import { GenerateTokenUseCase } from './generate-token.usecase.js';
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

describe('GenerateTokenUseCase', () => {
  it('returns token pair for active user', async () => {
    const repo = { findById: vi.fn().mockResolvedValue(createUser('active')) } as any;
    const jwt = {
      signAccess: vi.fn().mockResolvedValue('a'),
      signRefresh: vi.fn().mockResolvedValue({ token: 'r', jti: 'j1' }),
      refreshTtlSeconds: 1000,
    } as any;
    const store = { save: vi.fn() } as any;
    const usecase = new GenerateTokenUseCase(repo, jwt, store);
    const res = await usecase.execute({ userId: '1' });
    expect(res).toEqual({ accessToken: 'a', refreshToken: 'r' });
    expect(store.save).toHaveBeenCalledWith('1', 'j1', 1000);
  });

  it('throws when user inactive', async () => {
    const repo = { findById: vi.fn().mockResolvedValue(createUser('inactive')) } as any;
    const jwt = { signAccess: vi.fn(), signRefresh: vi.fn(), refreshTtlSeconds: 1000 } as any;
    const store = { save: vi.fn() } as any;
    const usecase = new GenerateTokenUseCase(repo, jwt, store);
    await expect(usecase.execute({ userId: '1' })).rejects.toThrow();
  });

  it('throws not found for missing user', async () => {
    const repo = { findById: vi.fn().mockResolvedValue(null) } as any;
    const jwt = { signAccess: vi.fn(), signRefresh: vi.fn(), refreshTtlSeconds: 1000 } as any;
    const store = { save: vi.fn() } as any;
    const usecase = new GenerateTokenUseCase(repo, jwt, store);
    await expect(usecase.execute({ userId: '1' })).rejects.toBeInstanceOf(ApiError);
  });
});
