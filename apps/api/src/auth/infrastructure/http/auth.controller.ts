import { Body, Controller, Post, Inject } from '@nestjs/common';
import { ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GenerateTokenDto } from '../../dto/generate-token.dto.js';
import { RefreshTokenDto } from '../../dto/refresh-token.dto.js';
import { TokenPairDto } from '../../dto/token-pair.dto.js';
import { GenerateTokenUseCase } from '../../application/usecases/generate-token.usecase.js';
import { RefreshTokenUseCase } from '../../application/usecases/refresh-token.usecase.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(GenerateTokenUseCase) private readonly generateToken: GenerateTokenUseCase,
    @Inject(RefreshTokenUseCase) private readonly refreshToken: RefreshTokenUseCase,
  ) {}

  @Post('generate-token')
  @ApiOperation({ summary: 'Generate access and refresh tokens' })
  @ApiOkResponse({ description: 'Token pair' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiConflictResponse({ description: 'User inactive' })
  async generate(@Body() dto: GenerateTokenDto): Promise<TokenPairDto> {
    return this.generateToken.execute(dto);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiOkResponse({ description: 'New token pair' })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
  async refresh(@Body() dto: RefreshTokenDto): Promise<TokenPairDto> {
    return this.refreshToken.execute(dto);
  }
}
