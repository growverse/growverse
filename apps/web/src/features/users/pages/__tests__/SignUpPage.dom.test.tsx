// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SignUpPage from '../SignUpPage';
import { useAuth } from '@/features/auth/hooks/useAuth';

vi.mock('@/features/auth/hooks/useAuth');

describe('SignUpPage', () => {
  it('renders sign up form when guest', () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'guest',
      login: vi.fn(),
      logout: vi.fn(),
      user: null,
      ready: true,
    });
    const qc = new QueryClient();
    render(
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={['/sign-up']}>
          <Routes>
            <Route path="/sign-up" element={<SignUpPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.getByRole('heading', { name: /sign up/i })).toBeTruthy();
  });

  it('redirects when authenticated', () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'authenticated',
      login: vi.fn(),
      logout: vi.fn(),
      user: { id: '1' },
      ready: true,
    });
    const qc = new QueryClient();
    render(
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={['/sign-up']}>
          <Routes>
            <Route path="/" element={<div>home</div>} />
            <Route path="/sign-up" element={<SignUpPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.getByText('home').textContent).toBe('home');
  });
});
