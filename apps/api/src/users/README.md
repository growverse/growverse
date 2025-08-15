# Users Module

This module manages user profiles, roles, and preferences using a domain-driven design layout.

```
users/
├── application/   # use cases
├── domain/        # entities, policies, value objects
├── dto/           # request/response DTOs
├── infrastructure/# persistence adapters
├── mappers/       # mapping helpers
```

## Roles

| Role       | SubRoles                              |
|------------|---------------------------------------|
| admin      | global, local                         |
| instructor | instructor, co-instructor, learning-assistant |
| learner    | vip, pro, basic, bot                  |

## Preferences

| Field       | Default | Rules               |
|-------------|---------|--------------------|
| language    | "en"   | string             |
| timezone    | "UTC"  | string             |
| graphics    | "medium" | low \| medium \| high |
| audioVolume | 70      | 0..100             |
| micEnabled  | false   | boolean            |
| chatEnabled | true    | boolean            |

## API Endpoints

- `POST /users` – create user
- `GET /users/:id` – fetch user
- `PATCH /users/:id` – update profile/role/preferences
- `DELETE /users/:id` – remove user
- `GET /users/:id/preferences` – get preferences
- `PATCH /users/:id/preferences` – update preferences

### Example

```bash
# create
curl -s -X POST http://localhost:8000/users \
  -H 'Content-Type: application/json' \
  -d '{"email":"a@a.com","username":"u1","role":"learner","subRole":"basic"}'

# fetch
curl http://localhost:8000/users/<id>

# update
curl -X PATCH http://localhost:8000/users/<id> \
  -H 'Content-Type: application/json' \
  -d '{"role":"admin","subRole":"global","preferences":{"audioVolume":40}}'

# delete
curl -X DELETE http://localhost:8000/users/<id>
```

## Testing

```bash
npm run test:cov
```

Coverage threshold is 75% globally.

## Next Iterations

- Scoped RBAC
- Redis sessions
- Pagination and filtering
