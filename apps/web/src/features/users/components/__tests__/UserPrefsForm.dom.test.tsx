/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserPrefsForm } from '../UserPrefsForm';
import { usersApi } from '../../api/users.client';
import { worldBridge } from '@/world/bridge/worldBridge';

vi.mock('../../api/users.client', () => ({
  usersApi: {
    getPrefs: vi.fn(),
    updatePrefs: vi.fn(),
  },
}));

afterEach(() => {
  vi.clearAllMocks();
  worldBridge.user.set(null);
});

function setup() {
  const qc = new QueryClient();
  const getPrefsMock = usersApi.getPrefs as unknown as ReturnType<typeof vi.fn>;
  getPrefsMock.mockResolvedValue({
    language: 'en',
    timezone: 'UTC',
    graphics: 'medium',
    audioVolume: 50,
    micEnabled: true,
    chatEnabled: true,
    notifications: true,
    theme: 'light',
  });
  const updatePrefsMock = usersApi.updatePrefs as unknown as ReturnType<typeof vi.fn>;
  updatePrefsMock.mockResolvedValueOnce({
    language: 'es',
    timezone: 'UTC',
    graphics: 'high',
    audioVolume: 50,
    micEnabled: true,
    chatEnabled: true,
    notifications: false,
    theme: 'dark',
  });
  worldBridge.user.set({
    id: 'u1',
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
      notifications: true,
      theme: 'light',
    },
  });
  render(
    <QueryClientProvider client={qc}>
      <UserPrefsForm userId="u1" />
    </QueryClientProvider>,
  );
}

describe('UserPrefsForm', () => {
  it('renders controls and submits payload', async () => {
    setup();
    const user = userEvent.setup();
    await screen.findByLabelText('Language');
    await user.clear(screen.getByLabelText('Language'));
    await user.type(screen.getByLabelText('Language'), 'es');
    await user.selectOptions(screen.getByLabelText('Graphics'), 'high');
    await user.click(screen.getByLabelText('Notifications'));
    await user.selectOptions(screen.getByLabelText('Theme'), 'dark');
    await user.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => {
      expect(usersApi.updatePrefs).toHaveBeenCalledWith('u1', {
        language: 'es',
        timezone: 'UTC',
        graphics: 'high',
        audioVolume: 50,
        micEnabled: true,
        chatEnabled: true,
        notifications: false,
        theme: 'dark',
      });
    });
    await screen.findByText('Saved');
    expect(worldBridge.user.get()!.preferences).toMatchObject({
      notifications: false,
      theme: 'dark',
      graphics: 'high',
    });
  });
});
