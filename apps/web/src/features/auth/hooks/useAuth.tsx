import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authClient, type SafeUser } from '../api/auth.client';
import { tokenManager } from '@/lib/auth/tokenManager';

export type AuthStatus = 'idle' | 'authenticating' | 'authenticated' | 'guest';

interface AuthContextValue {
  user: SafeUser | null;
  status: AuthStatus;
  ready: boolean;
  login: (opts: { username: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('idle');

  const login = async ({ username, password }: { username: string; password: string }) => {
    setStatus('authenticating');
    const tokens = await authClient.generateToken({ username, password });
    tokenManager.setAccessToken(tokens.accessToken);
    tokenManager.setRefreshToken(tokens.refreshToken);
    const me = await authClient.me(tokens.accessToken);
    setUser(me);
    setStatus('authenticated');
  };

  const logout = () => {
    tokenManager.clear();
    setUser(null);
    setStatus('guest');
  };

  useEffect(() => {
    const refresh = tokenManager.getRefreshToken();
    if (!refresh) {
      setStatus('guest');
      return;
    }
    void (async () => {
      try {
        const tokens = await authClient.refreshToken(refresh);
        tokenManager.setAccessToken(tokens.accessToken);
        tokenManager.setRefreshToken(tokens.refreshToken);
        const me = await authClient.me(tokens.accessToken);
        setUser(me);
        setStatus('authenticated');
      } catch {
        tokenManager.clear();
        setStatus('guest');
      }
    })();
  }, []);

  const value = useMemo(
    () => ({ user, status, ready: status !== 'idle', login, logout }),
    [user, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
