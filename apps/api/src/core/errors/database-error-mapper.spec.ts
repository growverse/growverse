import { MongoError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';
import { DatabaseErrorMapper } from './database-error-mapper.js';
import { ApiError } from './api-error.js';
import { ErrorCode } from './error-codes.js';
import { HttpStatus } from '@nestjs/common';

describe('DatabaseErrorMapper', () => {
  describe('mapMongoError', () => {
    it('should map E11000 duplicate key error for email', () => {
      const mongoError = new MongoError('E11000 duplicate key error collection: growverse.users index: email_1 dup key: { email: "test@test.com" }');
      (mongoError as any).code = 11000;

      const apiError = DatabaseErrorMapper.mapMongoError(mongoError);

      expect(apiError).toBeInstanceOf(ApiError);
      expect(apiError.statusCode).toBe(HttpStatus.CONFLICT);
      expect(apiError.code).toBe(ErrorCode.USER_EMAIL_ALREADY_EXISTS);
      expect(apiError.message).toBe('Email address is already registered');
      expect(apiError.details).toBe('This email is already associated with another account');
    });

    it('should map E11000 duplicate key error for username', () => {
      const mongoError = new MongoError('E11000 duplicate key error collection: growverse.users index: username_1 dup key: { username: "testuser" }');
      (mongoError as any).code = 11000;

      const apiError = DatabaseErrorMapper.mapMongoError(mongoError);

      expect(apiError.statusCode).toBe(HttpStatus.CONFLICT);
      expect(apiError.code).toBe(ErrorCode.USER_USERNAME_ALREADY_EXISTS);
      expect(apiError.message).toBe('Username is already taken');
      expect(apiError.details).toBe('Please choose a different username');
    });

    it('should map E11000 duplicate key error for unknown field', () => {
      const mongoError = new MongoError('E11000 duplicate key error collection: growverse.users index: unknown_1 dup key: { unknown: "value" }');
      (mongoError as any).code = 11000;

      const apiError = DatabaseErrorMapper.mapMongoError(mongoError);

      expect(apiError.statusCode).toBe(HttpStatus.CONFLICT);
      expect(apiError.code).toBe(ErrorCode.DATABASE_CONSTRAINT_VIOLATION);
      expect(apiError.message).toBe('Duplicate value detected');
    });

    it('should map general MongoDB errors', () => {
      const mongoError = new MongoError('Connection timeout');

      const apiError = DatabaseErrorMapper.mapMongoError(mongoError);

      expect(apiError.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(apiError.code).toBe(ErrorCode.DATABASE_CONNECTION_ERROR);
      expect(apiError.message).toBe('Database operation failed');
    });
  });

  describe('mapMongooseError', () => {
    it('should map ValidationError', () => {
      const validationError = new MongooseError.ValidationError();
      validationError.errors = {
        field1: { message: 'Field 1 is required' } as any,
        field2: { message: 'Field 2 is invalid' } as any,
      };

      const apiError = DatabaseErrorMapper.mapMongooseError(validationError);

      expect(apiError.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(apiError.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(apiError.message).toBe('Validation failed');
      expect(apiError.details).toBe('Field 1 is required, Field 2 is invalid');
    });

    it('should map CastError', () => {
      const castError = new MongooseError.CastError('ObjectId', 'invalid-id', '_id');

      const apiError = DatabaseErrorMapper.mapMongooseError(castError);

      expect(apiError.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(apiError.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(apiError.message).toBe('Invalid data format');
      expect(apiError.details).toBe('Invalid _id: invalid-id');
    });

    it('should map generic Mongoose errors', () => {
      const genericError = new MongooseError('Unknown mongoose error');

      const apiError = DatabaseErrorMapper.mapMongooseError(genericError);

      expect(apiError.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(apiError.code).toBe(ErrorCode.DATABASE_CONNECTION_ERROR);
    });
  });

  describe('isDatabaseError', () => {
    it('should return true for MongoError', () => {
      const error = new MongoError('Test error');
      expect(DatabaseErrorMapper.isDatabaseError(error)).toBe(true);
    });

    it('should return true for MongooseError', () => {
      const error = new MongooseError('Test error');
      expect(DatabaseErrorMapper.isDatabaseError(error)).toBe(true);
    });

    it('should return true for errors with MongoDB names', () => {
      const error = new Error('Test error');
      error.name = 'MongoServerError';
      expect(DatabaseErrorMapper.isDatabaseError(error)).toBe(true);
    });

    it('should return false for generic errors', () => {
      const error = new Error('Generic error');
      expect(DatabaseErrorMapper.isDatabaseError(error)).toBe(false);
    });
  });
});
