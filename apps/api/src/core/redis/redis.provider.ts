import { Provider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS } from './redis.constants.js';

// Mock Redis implementation for tests
class MockRedis {
  private store = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  async set(key: string, value: string): Promise<string> {
    this.store.set(key, value);
    return 'OK';
  }

  async del(key: string): Promise<number> {
    const existed = this.store.has(key);
    this.store.delete(key);
    return existed ? 1 : 0;
  }

  async exists(key: string): Promise<number> {
    return this.store.has(key) ? 1 : 0;
  }

  async quit(): Promise<string> {
    this.store.clear();
    return 'OK';
  }

  async disconnect(): Promise<void> {
    this.store.clear();
  }
}

export const RedisProvider: Provider = {
  provide: REDIS,
  useFactory: () => {
    // In test environment, use mock Redis instead of real connection
    if (process.env.NODE_ENV === 'test' || process.env.VITEST === 'true') {
      return new MockRedis();
    }

    // For actual Redis connection in non-test environments
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    return new Redis(url);
  },
};
