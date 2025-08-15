import { describe, it, expect, vi, afterEach } from 'vitest';
import { usersApi } from '../users.client';

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
});
