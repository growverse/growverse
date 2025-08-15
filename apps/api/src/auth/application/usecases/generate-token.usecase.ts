import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../../../users/infrastructure/mongo/user.repository.js';
import { JwtService } from '../../infrastructure/jwt/jwt.service.js';
import { RefreshTokenStore } from '../../infrastructure/redis/refresh-token.store.js';
import { TokenPair } from '../../domain/value-objects/token.types.js';
import { validateClaims, assertUserActive } from '../../domain/policies/token.policy.js';
import { ApiError } from '../../../core/errors/api-error.js';
import { ErrorCode } from '../../../core/errors/error-codes.js';

interface Input { userId: string }

@Injectable()
export class GenerateTokenUseCase {
  constructor(
    @Inject(UserRepository) private readonly users: UserRepository,
    @Inject(JwtService) private readonly jwt: JwtService,
    @Inject(RefreshTokenStore) private readonly store: RefreshTokenStore,
  ) {}

  async execute({ userId }: Input): Promise<TokenPair> {
    const user = await this.users.findById(userId);
    if (!user) throw ApiError.notFound(ErrorCode.USER_NOT_FOUND);

    assertUserActive(user);

    const snap = user.snapshot;
    const claims = { sub: snap.id, role: snap.role, subRole: snap.subRole, username: snap.username };
    validateClaims(claims);

    const accessToken = await this.jwt.signAccess(claims);
    const { token: refreshToken, jti } = await this.jwt.signRefresh({ sub: snap.id });
    await this.store.save(snap.id, jti, this.jwt.refreshTtlSeconds);
    return { accessToken, refreshToken };
  }
}
