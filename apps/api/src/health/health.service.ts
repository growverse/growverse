import type { Connection } from 'mongoose';
import type { Redis } from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { REDIS } from '../core/redis/redis.constants.js';

@Injectable()
export class HealthService {
  constructor(
    @Inject(REDIS) private readonly redis: Redis,
    @InjectConnection() private readonly mongoConnection: Connection
  ) {}

  async mongoOk(): Promise<boolean> {
    try {
      if (this.mongoConnection.readyState !== 1) return false;
      if (!this.mongoConnection.db) return false;
      await this.mongoConnection.db.admin().ping();
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
