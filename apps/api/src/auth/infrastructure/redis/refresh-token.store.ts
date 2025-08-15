import { Inject, Injectable } from '@nestjs/common';
import type { Redis } from 'ioredis';
import { REDIS } from '../../../core/redis/redis.constants.js';
import { IRefreshTokenStore } from '../../domain/repositories/IRefreshTokenStore.js';

@Injectable()
export class RefreshTokenStore implements IRefreshTokenStore {
  constructor(@Inject(REDIS) private readonly redis: Redis) {}

  private key(userId: string, jti: string) {
    return `rt:${userId}:${jti}`;
  }

  async save(userId: string, jti: string, ttlSec: number): Promise<void> {
    await this.redis.set(this.key(userId, jti), '1', 'EX', ttlSec);
  }

  async exists(userId: string, jti: string): Promise<boolean> {
    const res = await this.redis.exists(this.key(userId, jti));
    return res === 1;
  }

  async delete(userId: string, jti: string): Promise<void> {
    await this.redis.del(this.key(userId, jti));
  }

  async deleteAllForUser(userId: string): Promise<void> {
    const pattern = `rt:${userId}:*`;
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
