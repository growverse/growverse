import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from '../core/redis/redis.module.js';
import { UserSchema } from '../users/infrastructure/mongo/user.model.js';
import { UserRepository } from '../users/infrastructure/mongo/user.repository.js';
import { JwtService } from './infrastructure/jwt/jwt.service.js';
import { RefreshTokenStore } from './infrastructure/redis/refresh-token.store.js';
import { GenerateTokenUseCase } from './application/usecases/generate-token.usecase.js';
import { RefreshTokenUseCase } from './application/usecases/refresh-token.usecase.js';
import { MeUseCase } from './application/usecases/me.usecase.js';
import { AuthController } from './infrastructure/http/auth.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [
    UserRepository,
    JwtService,
    RefreshTokenStore,
    GenerateTokenUseCase,
    RefreshTokenUseCase,
    MeUseCase,
  ],
})
export class AuthModule {}
