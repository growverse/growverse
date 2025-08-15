import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { validationSchema } from './core/config/validation.js';
import { DbModule } from './core/db/db.module.js';
import { RedisModule } from './core/redis/redis.module.js';
import { HealthModule } from './health/health.module.js';
import { UsersModule } from './users/users.module.js';
import { GlobalExceptionFilter } from './core/errors/index.js';
import { AppController } from './app.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
    DbModule,
    RedisModule,
    HealthModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
