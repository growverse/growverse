import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../../../users/infrastructure/mongo/user.repository.js';
import { JwtService } from '../../infrastructure/jwt/jwt.service.js';
import { RefreshTokenStore } from '../../infrastructure/redis/refresh-token.store.js';
import { TokenPair } from '../../domain/value-objects/token.types.js';
import { validateClaims, assertUserActive } from '../../domain/policies/token.policy.js';
import { ApiError } from '../../../core/errors/api-error.js';
import { ErrorCode } from '../../../core/errors/error-codes.js';

interface Input { refreshToken: string }

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(UserRepository) private readonly users: UserRepository,
    @Inject(JwtService) private readonly jwt: JwtService,
    @Inject(RefreshTokenStore) private readonly store: RefreshTokenStore,
  ) {}

  async execute({ refreshToken }: Input): Promise<TokenPair> {
    let claims;
    try {
      claims = await this.jwt.verify(refreshToken);
    } catch {
      throw ApiError.unauthorized(ErrorCode.UNAUTHORIZED, 'Invalid or expired token');
    }
    const userId = claims.sub;
    const oldJti = claims.jti;
    if (!userId || !oldJti) {
      throw ApiError.unauthorized(ErrorCode.UNAUTHORIZED, 'Invalid token');
    }
    const exists = await this.store.exists(userId, oldJti);
    if (!exists) {
      throw ApiError.unauthorized(ErrorCode.UNAUTHORIZED, 'Token revoked');
    }
    const user = await this.users.findById(userId);
    if (!user) throw ApiError.notFound(ErrorCode.USER_NOT_FOUND);
    assertUserActive(user);
    const snap = user.snapshot;
    const newClaims = { sub: snap.id, role: snap.role, subRole: snap.subRole, username: snap.username };
    validateClaims(newClaims);
    const accessToken = await this.jwt.signAccess(newClaims);
    const { token: refreshToken2, jti: jti2 } = await this.jwt.signRefresh({ sub: snap.id });
    await this.store.save(snap.id, jti2, this.jwt.refreshTtlSeconds);
    await this.store.delete(snap.id, oldJti);
    return { accessToken, refreshToken: refreshToken2 };
  }
}
