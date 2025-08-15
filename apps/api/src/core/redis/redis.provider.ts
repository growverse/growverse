import { Provider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS } from './redis.constants.js';

export const RedisProvider: Provider = {
  provide: REDIS,
  useFactory: () => {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    return new Redis(url);
  },
};
