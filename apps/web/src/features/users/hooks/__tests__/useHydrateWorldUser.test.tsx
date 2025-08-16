/** @vitest-environment jsdom */
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { worldBridge } from '@/world/bridge/worldBridge';
import { useHydrateWorldUser } from '../useHydrateWorldUser';
import type { User } from '../../api/users.client';

describe('useHydrateWorldUser', () => {
  it('hydrates world bridge with notifications and theme', () => {
    const user: User = {
      id: '1',
      email: 'a@a.com',
      username: 'alice',
      status: 'active',
      createdAt: '',
      updatedAt: '',
      displayName: 'Alice',
      role: 'learner',
      subRole: 'basic',
      preferences: {
        language: 'en',
        timezone: 'UTC',
        graphics: 'medium',
        audioVolume: 50,
        micEnabled: true,
        chatEnabled: true,
        notifications: false,
        theme: 'dark',
      },
    };
    renderHook(() => useHydrateWorldUser(user));
    const snap = worldBridge.user.get();
    expect(snap?.preferences.notifications).toBe(false);
    expect(snap?.preferences.theme).toBe('dark');
  });
});
