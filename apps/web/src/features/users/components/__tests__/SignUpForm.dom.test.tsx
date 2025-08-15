import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SignUpForm } from '../SignUpForm';
import { usersApi } from '../../api/users.client';

vi.mock('../../api/users.client', () => ({
  usersApi: {
    create: vi.fn(),
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

function setup() {
  const qc = new QueryClient();
  render(
    <QueryClientProvider client={qc}>
      <SignUpForm />
    </QueryClientProvider>,
  );
}

describe('SignUpForm', () => {
  it('submits data and shows success', async () => {
    const createMock = usersApi.create as unknown as ReturnType<typeof vi.fn>;
    createMock.mockResolvedValueOnce({ id: '1' });
    setup();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Email'), 'a@b.c');
    await user.type(screen.getByLabelText('Username'), 'alice');
    await user.selectOptions(screen.getByLabelText('Role'), 'learner');
    await user.selectOptions(screen.getByLabelText('Sub Role'), 'pro');
    await user.type(screen.getByLabelText('Language'), 'en');
    await user.type(screen.getByLabelText('Timezone'), 'UTC');
    await user.selectOptions(screen.getByLabelText('Graphics'), 'high');
    await user.type(screen.getByLabelText('Audio Volume'), '80');
    await user.click(screen.getByLabelText('Mic Enabled'));
    await user.click(screen.getByLabelText('Chat Enabled'));
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(usersApi.create).toHaveBeenCalledWith({
        email: 'a@b.c',
        username: 'alice',
        role: 'learner',
        subRole: 'pro',
        preferences: {
          language: 'en',
          timezone: 'UTC',
          graphics: 'high',
          audioVolume: 80,
          micEnabled: true,
          chatEnabled: false,
        },
      });
    });
    await screen.findByText('Account created!');
  });

  it('shows error message on failure', async () => {
    const createMock = usersApi.create as unknown as ReturnType<typeof vi.fn>;
    createMock.mockRejectedValueOnce(new Error('bad'));
    setup();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Email'), 'a@b.c');
    await user.type(screen.getByLabelText('Username'), 'alice');
    await user.selectOptions(screen.getByLabelText('Role'), 'learner');
    await user.selectOptions(screen.getByLabelText('Sub Role'), 'pro');
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    await screen.findByText('bad');
  });
});
