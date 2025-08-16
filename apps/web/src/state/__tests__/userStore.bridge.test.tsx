// @vitest-environment jsdom
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { UserProvider, useLocalUser } from '../userStore';
import { worldBridge } from '@/world/bridge/worldBridge';
import { applyCurrentPreset } from '@/engine/perf/presets';

vi.mock('@/engine/perf/presets', () => ({
  applyCurrentPreset: vi.fn(),
}));

afterEach(() => {
  worldBridge.user.set(null);
});

describe('UserProvider sync with worldBridge', () => {
  function ShowName() {
    const user = useLocalUser();
    return <div>{user.name}</div>;
  }

  it('initializes from bridge and reacts to updates', () => {
    worldBridge.user.set({
      id: 'u1',
      displayName: 'Alice',
      role: 'learner',
      subRole: 'basic',
      preferences: {
        language: 'en',
        timezone: 'UTC',
        graphics: 'high',
        audioVolume: 50,
        micEnabled: false,
        chatEnabled: true,
        notifications: true,
        theme: 'light',
      },
    });

    render(
      <UserProvider>
        <ShowName />
      </UserProvider>,
    );
    expect(screen.getByText('Alice')).toBeTruthy();
    expect(applyCurrentPreset).toHaveBeenLastCalledWith('high');

    act(() => {
      worldBridge.user.set({
        id: 'u1',
        displayName: 'Bob',
        role: 'learner',
        subRole: 'basic',
        preferences: {
          language: 'en',
          timezone: 'UTC',
          graphics: 'medium',
          audioVolume: 50,
          micEnabled: false,
          chatEnabled: true,
          notifications: true,
          theme: 'light',
        },
      });
    });

    expect(screen.getByText('Bob')).toBeTruthy();
    expect(applyCurrentPreset).toHaveBeenLastCalledWith('medium');
  });
});
