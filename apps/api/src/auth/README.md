# Auth Module

Implements JWT authentication with refresh token rotation using Domain-Driven Design.

## Structure
- **domain/**: value objects, policies, repositories
- **application/**: use cases
- **infrastructure/**: HTTP controllers, JWT service, Redis store

## Token Flow
1. **Generate Token**
   - Load user
   - Validate & sign access token
   - Create refresh token with `jti`
   - Persist `jti` in Redis
2. **Refresh Token**
   - Verify refresh token
   - Check `jti` in Redis
   - Rotate tokens and update store

## Security Notes
- JWT payload contains only `{ sub, role, subRole, username }` plus standard claims
- Passwords or sensitive data are never stored in tokens or logs
- Refresh tokens are stored via their `jti` in Redis; old tokens are revoked on rotation

## Environment Variables
- `JWT_SECRET` (string)
- `JWT_ISSUER` (default `growverse.api`)
- `JWT_AUDIENCE` (default `growverse.web`)
- `ACCESS_TOKEN_TTL` (default `15m`)
- `REFRESH_TOKEN_TTL` (default `30d`)
- `REDIS_URL` (default `redis://localhost:6379`)

## Examples
```
# Generate tokens
curl -X POST /auth/generate-token -d '{"userId":"123"}'

# Refresh tokens
curl -X POST /auth/refresh-token -d '{"refreshToken":"<token>"}'
```
