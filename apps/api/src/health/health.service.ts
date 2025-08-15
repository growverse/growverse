import mongoose from 'mongoose';
import type Redis from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';
import { REDIS } from '../core/redis/redis.constants';

@Injectable()
export class HealthService {
  constructor(@Inject(REDIS) private readonly redis: Redis) {}

  async mongoOk(): Promise<boolean> {
    try {
      const conn = mongoose.connection;
      if (!conn?.db) return false;
      await conn.db.admin().ping();
      return true;
    } catch {
      return false;
    }
  }

  async redisPing(): Promise<string | null> {
    try {
      return await this.redis.ping();
    } catch {
      return null;
    }
  }
}
