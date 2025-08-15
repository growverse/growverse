import { useEffect } from 'react';
import { worldBridge } from '@/world/bridge/worldBridge';
import type { User } from '../api/users.client';

export function useHydrateWorldUser(user?: User) {
  useEffect(() => {
    if (!user) return;
    worldBridge.user.set({
      id: user.id,
      displayName: user.displayName,
      role: user.role,
      subRole: user.subRole,
      preferences: user.preferences,
    });
  }, [user]);
}
