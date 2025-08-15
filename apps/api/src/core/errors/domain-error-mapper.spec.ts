import { DomainError } from '../../users/domain/errors/domain.error.js';
import { DomainErrorMapper } from './domain-error-mapper.js';
import { ErrorCode } from './error-codes.js';
import { HttpStatus } from '@nestjs/common';

describe('DomainErrorMapper', () => {
  describe('mapDomainError', () => {
    it('should map role validation errors', () => {
      const domainError = new DomainError('Unknown role: invalid');

      const apiError = DomainErrorMapper.mapDomainError(domainError);

      expect(apiError.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(apiError.code).toBe(ErrorCode.INVALID_USER_ROLE);
      expect(apiError.message).toBe('Invalid role configuration');
      expect(apiError.details).toBe('Unknown role: invalid');
    });

    it('should map subRole validation errors', () => {
      const domainError = new DomainError('Invalid subRole "invalid" for role "learner"');

      const apiError = DomainErrorMapper.mapDomainError(domainError);

      expect(apiError.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(apiError.code).toBe(ErrorCode.INVALID_USER_ROLE);
      expect(apiError.message).toBe('Invalid role configuration');
    });

    it('should map preferences validation errors', () => {
      const domainError = new DomainError('audioVolume must be between 0 and 100');

      const apiError = DomainErrorMapper.mapDomainError(domainError);

      expect(apiError.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(apiError.code).toBe(ErrorCode.INVALID_USER_PREFERENCES);
      expect(apiError.message).toBe('Invalid user preferences');
      expect(apiError.details).toBe('audioVolume must be between 0 and 100');
    });

    it('should map graphics validation errors', () => {
      const domainError = new DomainError('graphics must be low, medium or high');

      const apiError = DomainErrorMapper.mapDomainError(domainError);

      expect(apiError.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(apiError.code).toBe(ErrorCode.INVALID_USER_PREFERENCES);
      expect(apiError.message).toBe('Invalid user preferences');
    });

    it('should map generic domain errors', () => {
      const domainError = new DomainError('Some other domain validation failed');

      const apiError = DomainErrorMapper.mapDomainError(domainError);

      expect(apiError.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(apiError.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(apiError.message).toBe('Domain validation failed');
      expect(apiError.details).toBe('Some other domain validation failed');
    });
  });

  describe('isDomainError', () => {
    it('should return true for DomainError instances', () => {
      const error = new DomainError('Test error');
      expect(DomainErrorMapper.isDomainError(error)).toBe(true);
    });

    it('should return true for errors with DomainError name', () => {
      const error = new Error('Test error');
      error.name = 'DomainError';
      expect(DomainErrorMapper.isDomainError(error)).toBe(true);
    });

    it('should return false for generic errors', () => {
      const error = new Error('Generic error');
      expect(DomainErrorMapper.isDomainError(error)).toBe(false);
    });
  });
});
