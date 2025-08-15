# Error Handling System

This comprehensive error handling system provides REST API standard error responses across the entire application.

## Features

✅ **Standardized Error Codes**: Predefined error codes for common scenarios
✅ **Consistent API Responses**: Structured JSON error responses with timestamps
✅ **Database Error Mapping**: Automatic handling of MongoDB duplicate key errors
✅ **Domain Error Mapping**: Maps domain validation errors to appropriate HTTP status codes
✅ **Global Exception Filter**: Catches all unhandled exceptions automatically
✅ **Detailed Logging**: Logs errors with context for debugging

## Error Response Format

All errors return a consistent JSON structure:

```json
{
  "error": {
    "code": "USER_EMAIL_ALREADY_EXISTS",
    "message": "Email address is already registered",
    "details": "This email is already associated with another account",
    "timestamp": "2025-08-15T15:49:40.123Z",
    "path": "/users"
  }
}
```

## Supported Error Cases

### Database Errors

- **E11000 Duplicate Email** → `409 USER_EMAIL_ALREADY_EXISTS`
- **E11000 Duplicate Username** → `409 USER_USERNAME_ALREADY_EXISTS`
- **Validation Errors** → `400 VALIDATION_ERROR`
- **Connection Errors** → `500 DATABASE_CONNECTION_ERROR`

### Domain Errors

- **Invalid Role/SubRole** → `400 INVALID_USER_ROLE`
- **Invalid Preferences** → `400 INVALID_USER_PREFERENCES`
- **General Domain Validation** → `400 VALIDATION_ERROR`

### Application Errors

- **User Not Found** → `404 USER_NOT_FOUND`
- **Resource Not Found** → `404 RESOURCE_NOT_FOUND`
- **Unauthorized Access** → `401 UNAUTHORIZED`
- **Forbidden Access** → `403 FORBIDDEN`

## Usage

### Throwing Errors in Controllers

```typescript
import { ApiError, ErrorCode } from "../core/errors/index.js";

// User not found
if (!user) {
  throw ApiError.notFound(ErrorCode.USER_NOT_FOUND);
}

// Validation error
throw ApiError.badRequest(
  ErrorCode.VALIDATION_ERROR,
  "Invalid input data",
  "Email is required",
);
```

### Automatic Error Handling

The `GlobalExceptionFilter` automatically handles:

- MongoDB duplicate key errors (E11000)
- Mongoose validation errors
- Domain validation errors
- NestJS HTTP exceptions
- Generic JavaScript errors

### Example Error Transformations

**Before (Raw MongoDB Error):**

```
MongoServerError: E11000 duplicate key error collection: growverse.users index: email_1 dup key: { email: "admin@test.com" }
```

**After (Structured API Response):**

```json
{
  "error": {
    "code": "USER_EMAIL_ALREADY_EXISTS",
    "message": "Email address is already registered",
    "details": "This email is already associated with another account",
    "timestamp": "2025-08-15T15:49:40.123Z",
    "path": "/users"
  }
}
```

## Benefits

1. **Client-Friendly**: Clear, actionable error messages
2. **Consistent**: Same format across all endpoints
3. **Debuggable**: Detailed logging for developers
4. **Maintainable**: Centralized error handling logic
5. **Extensible**: Easy to add new error types
6. **Standards-Compliant**: Follows REST API conventions
