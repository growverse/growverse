import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '../../infrastructure/jwt/jwt.service.js';
import { UserRepository } from '../../../users/infrastructure/mongo/user.repository.js';
import { ApiError } from '../../../core/errors/api-error.js';
import { ErrorCode } from '../../../core/errors/error-codes.js';
import { assertUserActive } from '../../domain/policies/token.policy.js';
import { Me } from '../../domain/value-objects/me.types.js';
import { toMeDto } from '../../mappers/user-to-me.mapper.js';

interface Input { token: string }

@Injectable()
export class MeUseCase {
  constructor(
    @Inject(JwtService) private readonly jwt: JwtService,
    @Inject(UserRepository) private readonly users: UserRepository,
  ) {}

  async execute({ token }: Input): Promise<Me> {
    let claims;
    try {
      claims = await this.jwt.verify(token);
    } catch {
      throw ApiError.unauthorized(ErrorCode.UNAUTHORIZED, 'Invalid or expired token');
    }
    const userId = claims.sub;
    if (!userId) {
      throw ApiError.unauthorized(ErrorCode.UNAUTHORIZED, 'Invalid token');
    }
    const user = await this.users.findById(userId);
    if (!user) throw ApiError.notFound(ErrorCode.USER_NOT_FOUND);
    assertUserActive(user);
    return toMeDto(user);
  }
}
