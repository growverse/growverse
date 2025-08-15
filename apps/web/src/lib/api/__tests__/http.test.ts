import { describe, it, expect, vi, afterEach } from 'vitest';
import { createHttpClient } from '../http';

const base = 'http://api.test/';
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

afterEach(() => {
  vi.restoreAllMocks();
});

describe('http client', () => {
  it('GET success returns JSON', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(json({ id: '1' }));
    const http = createHttpClient(base);
    const res = await http.get<{ id: string }>('/users/1');
    expect(res.id).toBe('1');
  });

  it('POST error throws ApiError', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(json({ message: 'Bad' }, 400));
    const http = createHttpClient(base);
    await expect(http.post('/users', { a: 1 })).rejects.toMatchObject({ status: 400 });
  });

  it('extracts nested error message', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      json({ error: { message: 'Email exists' } }, 409),
    );
    const http = createHttpClient(base);
    await expect(http.post('/users', {})).rejects.toMatchObject({
      status: 409,
      message: 'Email exists',
    });
  });
});
