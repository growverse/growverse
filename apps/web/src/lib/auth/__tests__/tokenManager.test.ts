import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tokenManager, withAuth } from '../tokenManager';
import { authClient } from '@/features/auth/api/auth.client';
import { ApiError } from '@/lib/api/errors';

vi.mock('@/features/auth/api/auth.client', () => ({
  authClient: {
    refreshToken: vi.fn(),
  },
}));

function mockStorage() {
  const store: Record<string, string> = {};
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => {
      store[k] = v;
    },
    removeItem: (k: string) => {
      delete store[k];
    },
  });
}

beforeEach(() => {
  mockStorage();
  tokenManager.clear();
  vi.clearAllMocks();
});

describe('tokenManager', () => {
  it('sets and gets tokens', () => {
    tokenManager.setAccessToken('a');
    tokenManager.setRefreshToken('r');
    expect(tokenManager.getAccessToken()).toBe('a');
    expect(tokenManager.getRefreshToken()).toBe('r');
    tokenManager.clear();
    expect(tokenManager.getAccessToken()).toBeUndefined();
    expect(tokenManager.getRefreshToken()).toBeUndefined();
  });

  it('withAuth refreshes on 401 and retries', async () => {
    const fn = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new ApiError('no', 401))
      .mockResolvedValueOnce('ok');
    (authClient.refreshToken as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      accessToken: 'new',
      refreshToken: 'newr',
    });
    tokenManager.setRefreshToken('old');
    const res = await withAuth(fn);
    expect(res).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(2);
    expect(authClient.refreshToken).toHaveBeenCalledWith('old');
    expect(tokenManager.getAccessToken()).toBe('new');
    expect(tokenManager.getRefreshToken()).toBe('newr');
  });

  it('withAuth clears tokens if refresh fails', async () => {
    const fn = vi.fn<() => Promise<string>>().mockRejectedValue(new ApiError('no', 401));
    (authClient.refreshToken as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('bad'),
    );
    tokenManager.setAccessToken('a');
    tokenManager.setRefreshToken('r');
    await expect(withAuth(fn)).rejects.toThrow('bad');
    expect(tokenManager.getAccessToken()).toBeUndefined();
    expect(tokenManager.getRefreshToken()).toBeUndefined();
  });
});

