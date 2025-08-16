import { describe, it, expect } from 'vitest';
import { worldBridge } from '../worldBridge';

describe('worldBridge Atom', () => {
  it('set & get & subscribe', () => {
    let called = 0;
    const unsub = worldBridge.user.subscribe(() => {
      called++;
    });
    expect(worldBridge.user.get()).toBeNull();
    worldBridge.user.set({
      id: 'u1',
      displayName: 'Alice',
      role: 'learner',
      subRole: 'pro',
      preferences: {
        language: 'en',
        timezone: 'UTC',
        graphics: 'medium',
        audioVolume: 70,
        micEnabled: false,
        chatEnabled: true,
        notifications: true,
        theme: 'light',
      },
    });
    unsub();
    expect(worldBridge.user.get()!.id).toBe('u1');
    expect(called).toBe(1);
    const v1 = worldBridge.user.getVersion();
    worldBridge.user.update({ displayName: 'A' });
    const v2 = worldBridge.user.getVersion();
    expect(v2).toBeGreaterThan(v1);
  });
});
