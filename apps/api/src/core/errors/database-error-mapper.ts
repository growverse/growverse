import { MongoError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';
import { ApiError } from './api-error.js';
import { ErrorCode } from './error-codes.js';

export class DatabaseErrorMapper {
  static mapMongoError(error: MongoError): ApiError {
    // E11000 duplicate key error
    if (error.code === 11000) {
      return this.handleDuplicateKeyError(error);
    }

    // General MongoDB errors
    return ApiError.internal(
      ErrorCode.DATABASE_CONNECTION_ERROR,
      'Database operation failed',
      error.message,
    );
  }

  static mapMongooseError(error: MongooseError): ApiError {
    if (error instanceof MongooseError.ValidationError) {
      return this.handleValidationError(error);
    }

    if (error instanceof MongooseError.CastError) {
      return ApiError.badRequest(
        ErrorCode.VALIDATION_ERROR,
        'Invalid data format',
        `Invalid ${error.path}: ${error.value}`,
      );
    }

    return ApiError.internal(
      ErrorCode.DATABASE_CONNECTION_ERROR,
      'Database operation failed',
      error.message,
    );
  }

  private static handleDuplicateKeyError(error: MongoError): ApiError {
    const keyValue = error.message.match(/dup key: \{ (.+?) \}/)?.[1];

    if (keyValue?.includes('email')) {
      return ApiError.conflict(
        ErrorCode.USER_EMAIL_ALREADY_EXISTS,
        'Email address is already registered',
        'This email is already associated with another account',
      );
    }

    if (keyValue?.includes('username')) {
      return ApiError.conflict(
        ErrorCode.USER_USERNAME_ALREADY_EXISTS,
        'Username is already taken',
        'Please choose a different username',
      );
    }

    return ApiError.conflict(
      ErrorCode.DATABASE_CONSTRAINT_VIOLATION,
      'Duplicate value detected',
      error.message,
    );
  }

  private static handleValidationError(error: MongooseError.ValidationError): ApiError {
    const validationMessages = Object.values(error.errors).map(err => err.message);

    return ApiError.badRequest(
      ErrorCode.VALIDATION_ERROR,
      'Validation failed',
      validationMessages.join(', '),
    );
  }

  static isDatabaseError(error: Error): boolean {
    return error instanceof MongoError ||
           error instanceof MongooseError ||
           error.name === 'MongoError' ||
           error.name === 'MongoServerError' ||
           error.name === 'ValidationError';
  }
}
