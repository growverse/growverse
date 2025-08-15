import { RedisProvider } from './redis.provider.js';

describe('RedisProvider', () => {
  it('should create mock Redis in test environment', () => {
    process.env.NODE_ENV = 'test';

    const redis = RedisProvider.useFactory();

    expect(redis).toBeDefined();
    expect(typeof redis.get).toBe('function');
    expect(typeof redis.set).toBe('function');
    expect(typeof redis.del).toBe('function');
  });

  it('should provide REDIS token', () => {
    expect(RedisProvider.provide).toBe('REDIS');
  });
});
