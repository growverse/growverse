import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo } from 'react';
import type { AuthUser } from './types';

interface AuthContextValue {
  user: AuthUser | null;
  login: () => void;
  logout: () => void;
}

const defaultUser: AuthUser = {
  username: 'macaris64',
  role: 'instructor',
  subRole: 'instructor',
  isAdmin: true,
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(defaultUser);
  const login = () => setUser(defaultUser);
  const logout = () => setUser(null);
  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
