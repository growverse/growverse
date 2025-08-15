import { Body, Controller, Post, Inject, Headers, HttpCode } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { GenerateTokenDto } from '../../dto/generate-token.dto.js';
import { RefreshTokenDto } from '../../dto/refresh-token.dto.js';
import { TokenPairDto } from '../../dto/token-pair.dto.js';
import { GenerateTokenUseCase } from '../../application/usecases/generate-token.usecase.js';
import { RefreshTokenUseCase } from '../../application/usecases/refresh-token.usecase.js';
import { MeUseCase } from '../../application/usecases/me.usecase.js';
import { MeRequestDto, MeDto } from '../../dto/me.dto.js';
import { ApiError } from '../../../core/errors/api-error.js';
import { ErrorCode } from '../../../core/errors/error-codes.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(GenerateTokenUseCase) private readonly generateToken: GenerateTokenUseCase,
    @Inject(RefreshTokenUseCase) private readonly refreshToken: RefreshTokenUseCase,
    @Inject(MeUseCase) private readonly meUseCase: MeUseCase,
  ) {}

  @Post('generate-token')
  @ApiOperation({ summary: 'Generate access and refresh tokens' })
  @ApiBody({ type: GenerateTokenDto })
  @ApiOkResponse({ description: 'Token pair', type: TokenPairDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiConflictResponse({ description: 'User inactive' })
  async generate(@Body() dto: GenerateTokenDto): Promise<TokenPairDto> {
    return this.generateToken.execute(dto);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ description: 'New token pair', type: TokenPairDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
  async refresh(@Body() dto: RefreshTokenDto): Promise<TokenPairDto> {
    return this.refreshToken.execute(dto);
  }

  @Post('me')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBody({ type: MeRequestDto })
  @ApiOkResponse({ description: 'Current user profile', type: MeDto })
  @ApiBadRequestResponse({ description: 'Token missing' })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiConflictResponse({ description: 'User inactive' })
  async me(@Body() dto: MeRequestDto, @Headers('authorization') auth?: string): Promise<MeDto> {
    const token = dto.token ?? (auth?.startsWith('Bearer ') ? auth.slice(7) : undefined);
    if (!token) throw ApiError.badRequest(ErrorCode.VALIDATION_ERROR, 'Token required');
    return this.meUseCase.execute({ token });
  }
}
