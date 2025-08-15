import { describe, it, expect } from 'vitest';
import { RefreshTokenStore } from './refresh-token.store.js';

class MockRedis {
  private data = new Map<string, string>();

  async set(key: string, value: string, _mode: string, _ttl: number) {
    this.data.set(key, value);
  }
  async exists(key: string) {
    return this.data.has(key) ? 1 : 0;
  }
  async del(...keys: string[]) {
    let cnt = 0;
    for (const k of keys) {
      if (this.data.delete(k)) cnt++;
    }
    return cnt;
  }
  async keys(pattern: string) {
    const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
    return Array.from(this.data.keys()).filter((k) => regex.test(k));
  }
}

describe('RefreshTokenStore', () => {
  it('saves, checks and deletes tokens', async () => {
    const store = new RefreshTokenStore(new MockRedis() as any);
    await store.save('u1', 'j1', 60);
    expect(await store.exists('u1', 'j1')).toBe(true);
    await store.delete('u1', 'j1');
    expect(await store.exists('u1', 'j1')).toBe(false);
  });
});
