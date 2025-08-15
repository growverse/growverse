import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error.js';
import { ErrorCode } from './error-codes.js';

describe('ApiError', () => {
  describe('constructor', () => {
    it('should create an ApiError with all properties', () => {
      const error = new ApiError(
        ErrorCode.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
        'Custom message',
        'Additional details',
      );

      expect(error.code).toBe(ErrorCode.USER_NOT_FOUND);
      expect(error.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(error.message).toBe('Custom message');
      expect(error.details).toBe('Additional details');
      expect(error.name).toBe('ApiError');
    });

    it('should use default message from ErrorMessages when no message provided', () => {
      const error = new ApiError(ErrorCode.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

      expect(error.message).toBe('User not found');
    });
  });

  describe('toResponse', () => {
    it('should return properly formatted API error response', () => {
      const error = new ApiError(
        ErrorCode.VALIDATION_ERROR,
        HttpStatus.BAD_REQUEST,
        'Invalid input',
        'Email is required',
      );

      const response = error.toResponse('/api/users');

      expect(response).toEqual({
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: 'Invalid input',
          details: 'Email is required',
          timestamp: expect.any(String),
          path: '/api/users',
        },
      });

      expect(new Date(response.error.timestamp)).toBeInstanceOf(Date);
    });

    it('should not include path when not provided', () => {
      const error = new ApiError(ErrorCode.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
      const response = error.toResponse();

      expect(response.error.path).toBeUndefined();
    });
  });

  describe('factory methods', () => {
    it('should create notFound error with correct status', () => {
      const error = ApiError.notFound(ErrorCode.USER_NOT_FOUND, 'User not found');

      expect(error.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(error.code).toBe(ErrorCode.USER_NOT_FOUND);
      expect(error.message).toBe('User not found');
    });

    it('should create conflict error with correct status', () => {
      const error = ApiError.conflict(ErrorCode.USER_EMAIL_ALREADY_EXISTS);

      expect(error.statusCode).toBe(HttpStatus.CONFLICT);
      expect(error.code).toBe(ErrorCode.USER_EMAIL_ALREADY_EXISTS);
    });

    it('should create badRequest error with correct status', () => {
      const error = ApiError.badRequest(ErrorCode.VALIDATION_ERROR);

      expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
    });

    it('should create unauthorized error with correct status', () => {
      const error = ApiError.unauthorized();

      expect(error.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(error.code).toBe(ErrorCode.UNAUTHORIZED);
    });

    it('should create forbidden error with correct status', () => {
      const error = ApiError.forbidden();

      expect(error.statusCode).toBe(HttpStatus.FORBIDDEN);
      expect(error.code).toBe(ErrorCode.FORBIDDEN);
    });

    it('should create internal error with correct status', () => {
      const error = ApiError.internal();

      expect(error.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(error.code).toBe(ErrorCode.INTERNAL_SERVER_ERROR);
    });
  });
});
