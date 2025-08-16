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
      preferences: {
        language: user.preferences.language,
        timezone: user.preferences.timezone,
        graphics: user.preferences.graphics,
        audioVolume: user.preferences.audioVolume,
        micEnabled: user.preferences.micEnabled,
        chatEnabled: user.preferences.chatEnabled,
        notifications: user.preferences.notifications,
        theme: user.preferences.theme,
      },
    });
  }, [user]);
}
