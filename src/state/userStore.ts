import { useSyncExternalStore } from 'react';
import { AvatarUser, Role, SubRole } from '@/domain/roles';

type Listener = () => void;

const listeners = new Set<Listener>();
const users = new Map<string, AvatarUser>();
let localId: string | null = null;

function emit(): void {
  for (const fn of listeners) fn();
}

function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function setLocalUser(u: AvatarUser): void {
  localId = u.id;
  users.set(u.id, { ...u, isLocal: true });
  emit();
}

function addOrUpdate(u: AvatarUser): void {
  users.set(u.id, u);
  emit();
}

function remove(id: string): void {
  users.delete(id);
  if (id === localId) localId = null;
  emit();
}

function getLocal(): AvatarUser | null {
  return localId ? users.get(localId) ?? null : null;
}

function all(): AvatarUser[] {
  return Array.from(users.values());
}

function count(): number {
  return users.size;
}

export const userStore = {
  subscribe,
  setLocalUser,
  addOrUpdate,
  remove,
  getLocal,
  all,
  count,
};

// Initialize with a default local user
setLocalUser({ id: 'local-1', name: 'macaris64', role: 'learner', subRole: 'pro', isAdmin: true });

export function useUsers(): AvatarUser[] {
  return useSyncExternalStore(userStore.subscribe, userStore.all);
}

export function useLocalUser(): AvatarUser | null {
  return useSyncExternalStore(userStore.subscribe, userStore.getLocal);
}

export function useOnlineCount(): number {
  return useSyncExternalStore(userStore.subscribe, userStore.count);
}

export function updateLocalRole(role: Role, subRole?: SubRole): void {
  if (!localId) return;
  const current = users.get(localId);
  if (!current) return;
  users.set(localId, { ...current, role, subRole });
  emit();
}

export function isLocalAdmin(): boolean {
  return Boolean(getLocal()?.isAdmin);
}
