// @vitest-environment jsdom
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UserProvider, useLocalUser } from '../userStore';
import { worldBridge } from '@/world/bridge/worldBridge';

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
      },
    });

    render(
      <UserProvider>
        <ShowName />
      </UserProvider>,
    );
    expect(screen.getByText('Alice')).toBeTruthy();

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
        },
      });
    });

    expect(screen.getByText('Bob')).toBeTruthy();
  });
});
