import { DomainError } from '../../users/domain/errors/domain.error.js';
import { ApiError } from './api-error.js';
import { ErrorCode } from './error-codes.js';

export class DomainErrorMapper {
  static mapDomainError(error: DomainError): ApiError {
    // Check error message patterns to determine appropriate API error
    const message = error.message.toLowerCase();

    if (message.includes('unknown role') || message.includes('invalid subrole')) {
      return ApiError.badRequest(
        ErrorCode.INVALID_USER_ROLE,
        'Invalid role configuration',
        error.message,
      );
    }

    if (message.includes('audiovolume') || message.includes('graphics')) {
      return ApiError.badRequest(
        ErrorCode.INVALID_USER_PREFERENCES,
        'Invalid user preferences',
        error.message,
      );
    }

    if (message.includes('not active') || message.includes('inactive')) {
      return ApiError.conflict(
        ErrorCode.USER_INACTIVE,
        'User is inactive',
        error.message,
      );
    }

    // Default to validation error for other domain errors
    return ApiError.badRequest(
      ErrorCode.VALIDATION_ERROR,
      'Domain validation failed',
      error.message,
    );
  }

  static isDomainError(error: Error): boolean {
    return error instanceof DomainError || error.name === 'DomainError';
  }
}
