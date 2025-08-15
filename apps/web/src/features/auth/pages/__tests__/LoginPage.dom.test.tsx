// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import LoginPage from '../LoginPage';
import { useAuth } from '../../hooks/useAuth';

vi.mock('../../hooks/useAuth');

describe('LoginPage', () => {
  it('renders login form when guest', () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'guest',
      login: vi.fn(),
      logout: vi.fn(),
      user: null,
      ready: true,
    });
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: /login/i })).toBeTruthy();
  });

  it('redirects when authenticated', () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'authenticated',
      login: vi.fn(),
      logout: vi.fn(),
      user: { id: '1' },
      ready: true,
    });
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/" element={<div>home</div>} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText('home').textContent).toBe('home');
  });
});
