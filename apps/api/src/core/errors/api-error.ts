import { HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorMessages } from './error-codes.js';

export interface ApiErrorResponse {
  error: {
    code: ErrorCode;
    message: string;
    details?: string;
    timestamp: string;
    path?: string;
  };
}

export class ApiError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly statusCode: HttpStatus,
    message?: string,
    public readonly details?: string,
  ) {
    super(message || ErrorMessages[code]);
    this.name = 'ApiError';
  }

  toResponse(path?: string): ApiErrorResponse {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
        timestamp: new Date().toISOString(),
        path,
      },
    };
  }

  // Factory methods for common errors
  static notFound(code: ErrorCode = ErrorCode.RESOURCE_NOT_FOUND, message?: string, details?: string): ApiError {
    return new ApiError(code, HttpStatus.NOT_FOUND, message, details);
  }

  static conflict(code: ErrorCode = ErrorCode.RESOURCE_ALREADY_EXISTS, message?: string, details?: string): ApiError {
    return new ApiError(code, HttpStatus.CONFLICT, message, details);
  }

  static badRequest(code: ErrorCode = ErrorCode.VALIDATION_ERROR, message?: string, details?: string): ApiError {
    return new ApiError(code, HttpStatus.BAD_REQUEST, message, details);
  }

  static unauthorized(code: ErrorCode = ErrorCode.UNAUTHORIZED, message?: string, details?: string): ApiError {
    return new ApiError(code, HttpStatus.UNAUTHORIZED, message, details);
  }

  static forbidden(code: ErrorCode = ErrorCode.FORBIDDEN, message?: string, details?: string): ApiError {
    return new ApiError(code, HttpStatus.FORBIDDEN, message, details);
  }

  static internal(code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR, message?: string, details?: string): ApiError {
    return new ApiError(code, HttpStatus.INTERNAL_SERVER_ERROR, message, details);
  }
}
