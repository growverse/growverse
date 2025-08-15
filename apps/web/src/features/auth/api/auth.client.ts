import { http } from '@/lib/api/http';
import type { UserPreferences } from '@/world/types';

export type TokenPair = { accessToken: string; refreshToken: string };

export interface SafeUser {
  id: string;
  username: string;
  displayName?: string;
  role: 'admin' | 'instructor' | 'learner';
  subRole: string;
  preferences: UserPreferences;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export const authClient = {
  generateToken: (creds: LoginCredentials) =>
    http.post<TokenPair>('/auth/generate-token', creds as unknown as Record<string, unknown>),
  refreshToken: (refreshToken: string) =>
    http.post<TokenPair>('/auth/refresh-token', { refreshToken }),
  me: (token: string) => http.post<SafeUser>('/auth/me', { token }),
};
