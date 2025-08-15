import { http } from '@/lib/api/http';
import type { GraphicsQuality, UserPreferences } from '@/world/types';

export type Role = 'admin' | 'instructor' | 'learner';
export type Graphics = GraphicsQuality;

export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  role: Role;
  subRole: string;
  status: 'active' | 'inactive' | 'banned';
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  role: Role;
  subRole: string;
  preferences?: Partial<UserPreferences>;
}

export const usersApi = {
  create: (payload: CreateUserPayload) =>
    http.post<User>('/users', payload as unknown as Record<string, unknown>),
  get: (id: string) => http.get<User>(`/users/${id}`),
  update: (id: string, patch: Partial<CreateUserPayload>) =>
    http.patch<User>(`/users/${id}`, patch as unknown as Record<string, unknown>),
  remove: (id: string) => http.del<void>(`/users/${id}`),

  getPrefs: (id: string) => http.get<UserPreferences>(`/users/${id}/preferences`),
  updatePrefs: (id: string, patch: Partial<UserPreferences>) =>
    http.patch<UserPreferences>(
      `/users/${id}/preferences`,
      patch as unknown as Record<string, unknown>,
    ),
};
