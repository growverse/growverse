import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './core/config/validation';
import { DbModule } from './core/db/db.module';
import { RedisModule } from './core/redis/redis.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
    DbModule,
    RedisModule,
    HealthModule
  ],
})
export class AppModule {}
