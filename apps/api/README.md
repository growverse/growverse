# Growverse API

A NestJS-based backend API for the Growverse platform, built with Fastify, MongoDB, and Redis.

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)
- pnpm (recommended) or npm

### Running with Docker (Recommended)

1. **Start all services** (from project root):

   ```bash
   docker compose up -d
   ```

2. **Build and restart after changes**:

   ```bash
   docker compose up -d --build
   ```

3. **Stop all services**:
   ```bash
   docker compose down
   ```

## 📍 Access Points

### API Endpoints

- **Base URL**: http://localhost:8000
- **Health Check**: http://localhost:8000/health
- **Full Health Check**: http://localhost:8000/health/full

### Swagger Documentation

- **Swagger UI**: http://localhost:8000/docs
- Interactive API documentation with request/response examples
- Test endpoints directly from the browser

## 🏗️ Architecture

The API follows Clean Architecture principles with domain-driven design:

```
src/
├── core/           # Core infrastructure (DB, Redis, Config)
├── health/         # Health check endpoints
├── auth/           # Authentication domain
├── users/          # User management domain
├── worlds/         # Virtual worlds domain
├── sessions/       # Session management domain
├── progress/       # Progress tracking domain
├── telemetry/      # Analytics and telemetry domain
└── config/         # Configuration domain
```

Each domain follows the structure:

- `domain/` - Business entities and rules
- `application/` - Use cases and application services
- `infrastructure/` - External integrations
- `dto/` - Data transfer objects
- `mappers/` - Entity/DTO mapping

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run CI tests (with coverage, fail if no tests)
npm run test:ci
```

### Running Tests in Docker

```bash
# Execute tests inside the running container
docker compose exec api npm test

# Or run tests with coverage
docker compose exec api npm run test:cov
```

## 🗄️ Database Access

### MongoDB

**Connection Details:**

- **Host**: localhost
- **Port**: 27017
- **Database**: growverse
- **Connection String**: `mongodb://localhost:27017/growverse`

**Access MongoDB shell:**

```bash
# Connect to MongoDB container
docker compose exec mongo mongosh

# Or connect directly
mongosh mongodb://localhost:27017/growverse
```

**Using MongoDB Compass:**

- Connection String: `mongodb://localhost:27017`
- Database: `growverse`

### Redis

**Connection Details:**

- **Host**: localhost
- **Port**: 6379
- **Connection String**: `redis://localhost:6379`

**Access Redis CLI:**

```bash
# Connect to Redis container
docker compose exec redis redis-cli

# Test connection
docker compose exec redis redis-cli ping
```

**Common Redis commands:**

```bash
# List all keys
KEYS *

# Get a specific key
GET key_name

# Monitor real-time commands
MONITOR
```

## ⚙️ Configuration

### Environment Variables

The API uses the following environment variables:

| Variable      | Default                           | Description                            |
| ------------- | --------------------------------- | -------------------------------------- |
| `PORT`        | `8000`                            | API server port                        |
| `MONGO_URL`   | `mongodb://mongo:27017/growverse` | MongoDB connection string              |
| `REDIS_URL`   | `redis://redis:6379`              | Redis connection string                |
| `CORS_ORIGIN` | `http://localhost:5173`           | Allowed CORS origins (comma-separated) |

### Docker Environment

When running with Docker Compose, these are automatically configured:

- MongoDB runs on port 27017
- Redis runs on port 6379
- API runs on port 8000
- Services wait for databases to be healthy before starting

## 🛠️ Development

### Local Development (without Docker)

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Start databases** (requires Docker):

   ```bash
   docker compose up mongo redis -d
   ```

3. **Set environment variables**:

   ```bash
   export MONGO_URL="mongodb://localhost:27017/growverse"
   export REDIS_URL="redis://localhost:6379"
   export CORS_ORIGIN="http://localhost:5173"
   ```

4. **Start development server**:
   ```bash
   npm run start:dev
   ```

### Building

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Linting

```bash
# Run ESLint
npm run lint
```

## 🔧 Docker Services

The API depends on the following Docker services:

### MongoDB (mongo)

- **Image**: `mongo:7`
- **Port**: `27017:27017`
- **Health Check**: MongoDB ping command
- **Volume**: `mongodata:/data/db` (persistent storage)

### Redis (redis)

- **Image**: `redis:7`
- **Port**: `6379:6379`
- **Health Check**: Redis ping command

### API (api)

- **Build**: Multi-stage Docker build
- **Port**: `8000:8000`
- **Dependencies**: Waits for mongo and redis to be healthy
- **Environment**: Configured via docker-compose.yml

## 📊 Monitoring

### Health Checks

- **Basic**: `GET /health` - Returns simple status
- **Full**: `GET /health/full` - Returns detailed health including database connections

### Logs

```bash
# View API logs
docker compose logs api

# Follow logs in real-time
docker compose logs -f api

# View last 100 lines
docker compose logs api --tail=100
```

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**:

   ```bash
   # Check what's using port 8000
   lsof -i :8000

   # Kill the process or change the port
   export PORT=8001
   ```

2. **Database connection issues**:

   ```bash
   # Check if databases are running
   docker compose ps

   # Restart databases
   docker compose restart mongo redis
   ```

3. **Build failures**:
   ```bash
   # Clean build
   docker compose down
   docker compose up -d --build --force-recreate
   ```

### Reset Everything

```bash
# Stop and remove all containers, networks, and volumes
docker compose down -v

# Rebuild everything from scratch
docker compose up -d --build
```

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Fastify Documentation](https://www.fastify.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Redis Documentation](https://redis.io/documentation)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## 📄 API Documentation

Once the API is running, visit the Swagger documentation at [http://localhost:8000/docs](http://localhost:8000/docs) for:

- Complete API endpoint documentation
- Request/response schemas
- Interactive testing interface
- Authentication examples
- Error response formats

---

**Version**: 0.2.0
**Tech Stack**: NestJS, Fastify, MongoDB, Redis, TypeScript, Vitest
