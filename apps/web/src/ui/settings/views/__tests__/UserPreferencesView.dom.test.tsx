/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { describe, it, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserPreferencesView from '../UserPreferencesView';

vi.mock('@/state/userStore', () => ({
  useLocalUser: () => ({ id: 'u1' }),
}));

vi.mock('@/features/users/api/users.client', () => ({
  usersApi: {
    getPrefs: vi.fn(() =>
      Promise.resolve({
        language: 'en',
        timezone: 'UTC',
        graphics: 'medium',
        audioVolume: 50,
        micEnabled: true,
        chatEnabled: true,
        notifications: true,
        theme: 'light',
      }),
    ),
    updatePrefs: vi.fn(),
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('UserPreferencesView', () => {
  it('renders user preferences form', async () => {
    const qc = new QueryClient();
    render(
      <QueryClientProvider client={qc}>
        <UserPreferencesView />
      </QueryClientProvider>,
    );
    await screen.findByLabelText('Language');
  });
});

