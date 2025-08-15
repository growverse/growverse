import { http } from '@/lib/api/http';
import { ApiError } from '@/lib/api/errors';
import { authClient, type TokenPair } from '@/features/auth/api/auth.client';

const REFRESH_KEY = 'gv:rt';
let accessToken: string | undefined;

export function getAccessToken(): string | undefined {
  return accessToken;
}

export function setAccessToken(token?: string): void {
  accessToken = token;
  http.setAuthToken(token);
}

export function getRefreshToken(): string | undefined {
  const token = globalThis.localStorage.getItem(REFRESH_KEY);
  return token ?? undefined;
}

export function setRefreshToken(token?: string): void {
  if (token) globalThis.localStorage.setItem(REFRESH_KEY, token);
  else globalThis.localStorage.removeItem(REFRESH_KEY);
}

export function clear(): void {
  setAccessToken(undefined);
  setRefreshToken(undefined);
}

export async function withAuth<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      const rt = getRefreshToken();
      if (!rt) throw err;
      try {
        const tokens: TokenPair = await authClient.refreshToken(rt);
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
        return await fn();
      } catch (refreshErr) {
        clear();
        throw refreshErr;
      }
    }
    throw err;
  }
}

export const tokenManager = {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  clear,
  withAuth,
};

