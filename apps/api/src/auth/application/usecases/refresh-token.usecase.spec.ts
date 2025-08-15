import { describe, it, expect, vi } from 'vitest';
import { RefreshTokenUseCase } from './refresh-token.usecase.js';
import { User } from '../../../users/domain/entities/user.entity.js';
import { ApiError } from '../../../core/errors/api-error.js';

function user() {
  return User.create('1', {
    email: 'a@a.com',
    username: 'u1',
    passwordHash: 'hash',
    role: 'learner',
    subRole: 'basic',
    status: 'active',
  });
}

describe('RefreshTokenUseCase', () => {
  it('rotates tokens and invalidates old', async () => {
    const repo = { findById: vi.fn().mockResolvedValue(user()) } as any;
    const jwt = {
      verify: vi.fn().mockResolvedValue({ sub: '1', jti: 'old', role: 'learner', subRole: 'basic' }),
      signAccess: vi.fn().mockResolvedValue('a2'),
      signRefresh: vi.fn().mockResolvedValue({ token: 'r2', jti: 'new' }),
      refreshTtlSeconds: 1000,
    } as any;
    const store = { exists: vi.fn().mockResolvedValue(true), save: vi.fn(), delete: vi.fn() } as any;
    const usecase = new RefreshTokenUseCase(repo, jwt, store);
    const res = await usecase.execute({ refreshToken: 'x' });
    expect(res).toEqual({ accessToken: 'a2', refreshToken: 'r2' });
    expect(store.save).toHaveBeenCalledWith('1', 'new', 1000);
    expect(store.delete).toHaveBeenCalledWith('1', 'old');
  });

  it('throws unauthorized when revoked', async () => {
    const repo = { findById: vi.fn().mockResolvedValue(user()) } as any;
    const jwt = {
      verify: vi.fn().mockResolvedValue({ sub: '1', jti: 'old' }),
      signAccess: vi.fn(),
      signRefresh: vi.fn(),
      refreshTtlSeconds: 1000,
    } as any;
    const store = { exists: vi.fn().mockResolvedValue(false), save: vi.fn(), delete: vi.fn() } as any;
    const usecase = new RefreshTokenUseCase(repo, jwt, store);
    await expect(usecase.execute({ refreshToken: 'x' })).rejects.toBeInstanceOf(ApiError);
  });

  it('throws unauthorized when token invalid', async () => {
    const repo = { findById: vi.fn().mockResolvedValue(user()) } as any;
    const jwt = { verify: vi.fn().mockRejectedValue(new Error('bad')) } as any;
    const store = { exists: vi.fn(), save: vi.fn(), delete: vi.fn() } as any;
    const usecase = new RefreshTokenUseCase(repo, jwt, store);
    await expect(usecase.execute({ refreshToken: 'x' })).rejects.toBeInstanceOf(ApiError);
  });
});
