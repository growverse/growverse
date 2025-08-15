import { describe, it, expect, vi, afterEach } from 'vitest';
import { authClient } from '../auth.client';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

afterEach(() => {
  vi.restoreAllMocks();
});

describe('authClient', () => {
  it('generateToken', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      json({ accessToken: 'a', refreshToken: 'r' }),
    );
    const res = await authClient.generateToken({
      username: 'alice',
      password: 'secret',
    });
    expect(res).toEqual({ accessToken: 'a', refreshToken: 'r' });
  });

  it('refreshToken', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      json({ accessToken: 'a2', refreshToken: 'r2' }),
    );
    const res = await authClient.refreshToken('r1');
    expect(res).toEqual({ accessToken: 'a2', refreshToken: 'r2' });
  });

  it('me', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(json({ id: '1' }));
    const res = await authClient.me('a');
    expect(res).toEqual({ id: '1' });
  });
});
