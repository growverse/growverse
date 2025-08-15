/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../../hooks/useAuth';
import { LoginForm } from '../LoginForm';
import { authClient } from '../../api/auth.client';

vi.mock('../../api/auth.client', () => ({
  authClient: {
    generateToken: vi.fn(),
    me: vi.fn(),
  },
}));

vi.mock('@/lib/auth/tokenManager', () => ({
  tokenManager: {
    setAccessToken: vi.fn(),
    setRefreshToken: vi.fn(),
    clear: vi.fn(),
    getRefreshToken: () => undefined,
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

function setup() {
  render(
    <AuthProvider>
      <LoginForm />
    </AuthProvider>,
  );
}

describe('LoginForm', () => {
  it('submits and shows success', async () => {
    const genMock = authClient.generateToken as unknown as ReturnType<typeof vi.fn>;
    genMock.mockResolvedValueOnce({ accessToken: 'a', refreshToken: 'r' });
    (authClient.me as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ id: '1' });
    setup();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('User ID'), '42');
    await user.click(screen.getByRole('button', { name: /login/i }));
    await waitFor(() => {
      expect(authClient.generateToken).toHaveBeenCalledWith('42');
    });
    await screen.findByText('Logged in!');
  });

  it('shows error on failure', async () => {
    const genMock = authClient.generateToken as unknown as ReturnType<typeof vi.fn>;
    genMock.mockRejectedValueOnce(new Error('bad'));
    setup();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('User ID'), '42');
    await user.click(screen.getByRole('button', { name: /login/i }));
    await screen.findByRole('alert');
  });
});

