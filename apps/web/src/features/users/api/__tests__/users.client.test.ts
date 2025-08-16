import { describe, it, expect, vi, afterEach } from 'vitest';
import { usersApi } from '../users.client';
import type { UserPreferences } from '@/world/types';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

afterEach(() => {
  vi.restoreAllMocks();
});

describe('usersApi', () => {
  it('create user calls POST /users', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      json({
        id: 'u1',
        role: 'learner',
        subRole: 'pro',
        email: 'a@b.c',
        username: 'alice',
        status: 'active',
        preferences: {
          language: 'en',
          timezone: 'UTC',
          graphics: 'medium',
          audioVolume: 70,
          micEnabled: false,
          chatEnabled: true,
          notifications: true,
          theme: 'light',
        },
        createdAt: '',
        updatedAt: '',
      }),
    );
    const res = await usersApi.create({
      email: 'a@b.c',
      username: 'alice',
      password: 'pw',
      passwordConfirmation: 'pw',
      role: 'learner',
      subRole: 'pro',
    });
    expect(res.id).toBe('u1');
  });

  it('getPrefs returns preferences with notifications and theme', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      json({
        language: 'en',
        timezone: 'UTC',
        graphics: 'medium',
        audioVolume: 70,
        micEnabled: false,
        chatEnabled: true,
        notifications: true,
        theme: 'light',
      }),
    );
    const res = await usersApi.getPrefs('u1');
    expect(res.notifications).toBe(true);
    expect(res.theme).toBe('light');
  });

  it('updatePrefs sends patch with notifications and theme', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(json({
        language: 'en',
        timezone: 'UTC',
        graphics: 'medium',
        audioVolume: 70,
        micEnabled: false,
        chatEnabled: true,
        notifications: false,
        theme: 'dark',
      }));
    await usersApi.updatePrefs('u1', { notifications: false, theme: 'dark' });
    const body = JSON.parse(spy.mock.calls[0][1]?.body as string) as UserPreferences;
    expect(body.notifications).toBe(false);
    expect(body.theme).toBe('dark');
  });
});
