import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { worldBridge } from '@/world/bridge/worldBridge';
import { PreferencesHUDPanel } from '../PreferencesHUDPanel';

describe('PreferencesHUDPanel', () => {
  it('shows user preferences', () => {
    worldBridge.user.set({
      id: '1',
      role: 'learner',
      subRole: 'basic',
      preferences: {
        language: 'en',
        timezone: 'UTC',
        graphics: 'high',
        audioVolume: 80,
        micEnabled: true,
        chatEnabled: false,
        notifications: true,
        theme: 'dark',
      },
    });
    render(<PreferencesHUDPanel />);
    screen.getByText(/Role: learner/);
    screen.getByText(/Notifications: On/);
    screen.getByText(/Theme: Dark/);
    screen.getByText(/Audio volume: 80/);
  });
});
