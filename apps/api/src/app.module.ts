import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './core/config/validation.js';
import { DbModule } from './core/db/db.module.js';
import { RedisModule } from './core/redis/redis.module.js';
import { HealthModule } from './health/health.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
    DbModule,
    RedisModule,
    HealthModule,
    UsersModule
  ],
})
export class AppModule {}
