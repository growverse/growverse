export enum ErrorCode {
  // Generic errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  // Authentication & Authorization
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',

  // Resource errors
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',

  // User-specific errors
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_EMAIL_ALREADY_EXISTS = 'USER_EMAIL_ALREADY_EXISTS',
  USER_USERNAME_ALREADY_EXISTS = 'USER_USERNAME_ALREADY_EXISTS',
  INVALID_USER_ROLE = 'INVALID_USER_ROLE',
  INVALID_USER_PREFERENCES = 'INVALID_USER_PREFERENCES',

  // Database errors
  DATABASE_CONNECTION_ERROR = 'DATABASE_CONNECTION_ERROR',
  DATABASE_CONSTRAINT_VIOLATION = 'DATABASE_CONSTRAINT_VIOLATION',
}

export const ErrorMessages = {
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'An internal server error occurred',
  [ErrorCode.VALIDATION_ERROR]: 'Validation failed',
  [ErrorCode.UNAUTHORIZED]: 'Authentication required',
  [ErrorCode.FORBIDDEN]: 'Access denied',
  [ErrorCode.RESOURCE_NOT_FOUND]: 'Resource not found',
  [ErrorCode.RESOURCE_ALREADY_EXISTS]: 'Resource already exists',
  [ErrorCode.USER_NOT_FOUND]: 'User not found',
  [ErrorCode.USER_EMAIL_ALREADY_EXISTS]: 'Email address is already registered',
  [ErrorCode.USER_USERNAME_ALREADY_EXISTS]: 'Username is already taken',
  [ErrorCode.INVALID_USER_ROLE]: 'Invalid user role or sub-role',
  [ErrorCode.INVALID_USER_PREFERENCES]: 'Invalid user preferences',
  [ErrorCode.DATABASE_CONNECTION_ERROR]: 'Database connection error',
  [ErrorCode.DATABASE_CONSTRAINT_VIOLATION]: 'Database constraint violation',
} as const;
