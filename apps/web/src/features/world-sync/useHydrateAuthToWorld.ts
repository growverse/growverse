import { useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { worldBridge } from '@/world/bridge/worldBridge';

export function useHydrateAuthToWorld(): void {
  const { user, status } = useAuth();

  useEffect(() => {
    if (status === 'authenticated' && user) {
      worldBridge.user.set({
        id: user.id,
        displayName: user.displayName ?? user.username ?? 'Player',
        role: user.role,
        subRole: user.subRole,
        preferences: user.preferences,
      });
    } else if (status === 'guest') {
      const name = `Guest${Math.floor(100000 + Math.random() * 900000)}`;
      worldBridge.user.set({
        id: 'guest',
        displayName: name,
        role: 'learner',
        subRole: 'basic',
        preferences: {
          language: 'en',
          timezone: 'UTC',
          graphics: 'medium',
          audioVolume: 70,
          micEnabled: false,
          chatEnabled: true,
        },
      });
    }
  }, [status, user]);
}

