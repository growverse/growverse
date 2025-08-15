// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { useHydrateAuthToWorld } from '../useHydrateAuthToWorld';
import { worldBridge } from '@/world/bridge/worldBridge';

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));
import { useAuth } from '@/features/auth/hooks/useAuth';

function TestComponent() {
  useHydrateAuthToWorld();
  return null;
}

describe('useHydrateAuthToWorld', () => {
  it('hydrates authenticated user', () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: {
        id: '1',
        username: 'bob',
        displayName: 'Bob',
        role: 'learner',
        subRole: 'basic',
        preferences: {
          language: 'en',
          timezone: 'UTC',
          graphics: 'medium',
          audioVolume: 70,
          micEnabled: false,
          chatEnabled: true,
        },
      },
      status: 'authenticated',
    });
    render(<TestComponent />);
    expect(worldBridge.user.get()).toMatchObject({ id: '1', displayName: 'Bob' });
  });

  it('hydrates guest when unauthenticated', () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      status: 'guest',
    });
    render(<TestComponent />);
    const u = worldBridge.user.get();
    expect(u?.id).toBe('guest');
    expect(u?.displayName).toMatch(/^Guest\d{6}$/);
  });
});

