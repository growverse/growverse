import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiError } from './api-error.js';
import { DatabaseErrorMapper } from './database-error-mapper.js';
import { DomainErrorMapper } from './domain-error-mapper.js';
import { ErrorCode } from './error-codes.js';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const apiError = this.mapToApiError(exception);

    // Log error details
    if (apiError.statusCode >= 500) {
      this.logger.error(`Internal Server Error: ${apiError.message}`, {
        error: exception,
        path: request.url,
        method: request.method,
        body: request.body,
        params: request.params,
        query: request.query,
      });
    } else if (apiError.statusCode >= 400) {
      this.logger.warn(`Client Error: ${apiError.message}`, {
        path: request.url,
        method: request.method,
        code: apiError.code,
      });
    }

    response.code(apiError.statusCode).send(apiError.toResponse(request.url));
  }

  private mapToApiError(exception: unknown): ApiError {
    // Already an ApiError
    if (exception instanceof ApiError) {
      return exception;
    }

    // Standard NestJS HttpException
    if (exception instanceof HttpException) {
      return this.mapHttpException(exception);
    }

    // Database errors
    if (exception instanceof Error && DatabaseErrorMapper.isDatabaseError(exception)) {
      return DatabaseErrorMapper.mapMongoError(exception as any);
    }

    // Domain errors
    if (exception instanceof Error && DomainErrorMapper.isDomainError(exception)) {
      return DomainErrorMapper.mapDomainError(exception as any);
    }

    // Generic Error
    if (exception instanceof Error) {
      return ApiError.internal(
        ErrorCode.INTERNAL_SERVER_ERROR,
        'An unexpected error occurred',
        exception.message,
      );
    }

    // Unknown exception
    return ApiError.internal(
      ErrorCode.INTERNAL_SERVER_ERROR,
      'An unknown error occurred',
      String(exception),
    );
  }

  private mapHttpException(exception: HttpException): ApiError {
    const status = exception.getStatus();
    const response = exception.getResponse();

    let message = exception.message;
    let details: string | undefined;

    // Handle validation pipe errors
    if (typeof response === 'object' && response !== null) {
      const responseObj = response as any;
      if (responseObj.message) {
        if (Array.isArray(responseObj.message)) {
          details = responseObj.message.join(', ');
          message = 'Validation failed';
        } else {
          message = responseObj.message;
        }
      }
    }

    const errorCode = this.getErrorCodeFromStatus(status);
    return new ApiError(errorCode, status, message, details);
  }

  private getErrorCodeFromStatus(status: HttpStatus): ErrorCode {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return ErrorCode.VALIDATION_ERROR;
      case HttpStatus.UNAUTHORIZED:
        return ErrorCode.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ErrorCode.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ErrorCode.RESOURCE_NOT_FOUND;
      case HttpStatus.CONFLICT:
        return ErrorCode.RESOURCE_ALREADY_EXISTS;
      default:
        return ErrorCode.INTERNAL_SERVER_ERROR;
    }
  }
}
