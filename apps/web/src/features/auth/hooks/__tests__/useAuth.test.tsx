// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../useAuth';
import { authClient } from '../../api/auth.client';
import { tokenManager } from '@/lib/auth/tokenManager';

vi.mock('../../api/auth.client', () => ({
  authClient: {
    generateToken: vi.fn(),
    refreshToken: vi.fn(),
    me: vi.fn(),
  },
}));

function wrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

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

describe('useAuth', () => {
  it('login flow sets user and tokens', async () => {
    (authClient.generateToken as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      accessToken: 'a',
      refreshToken: 'r',
    });
    const user = {
      id: '1',
      username: 'alice',
      displayName: 'Alice',
      role: 'learner',
      subRole: 'basic',
      preferences: {
        language: 'en',
        timezone: 'UTC',
        graphics: 'medium',
        audioVolume: 50,
        micEnabled: false,
        chatEnabled: true,
      },
    };
    (authClient.me as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(user);
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.login({ username: 'alice', password: 'pw' });
    });
    expect(result.current.status).toBe('authenticated');
    expect(result.current.user).toEqual(user);
    expect(tokenManager.getAccessToken()).toBe('a');
    expect(tokenManager.getRefreshToken()).toBe('r');
  });

  it('logout clears tokens', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    act(() => {
      result.current.logout();
    });
    expect(result.current.status).toBe('guest');
    expect(tokenManager.getAccessToken()).toBeUndefined();
  });

  it('initial load with refresh token authenticates', async () => {
    tokenManager.setRefreshToken('r1');
    (authClient.refreshToken as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      accessToken: 'a1',
      refreshToken: 'r2',
    });
    const user = {
      id: '1',
      username: 'bob',
      displayName: 'Bob',
      role: 'learner',
      subRole: 'basic',
      preferences: {
        language: 'en',
        timezone: 'UTC',
        graphics: 'medium',
        audioVolume: 50,
        micEnabled: false,
        chatEnabled: true,
      },
    };
    (authClient.me as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(user);
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await Promise.resolve();
    }); // flush effects
    expect(result.current.status).toBe('authenticated');
    expect(result.current.user).toEqual(user);
    expect(tokenManager.getAccessToken()).toBe('a1');
  });
});
