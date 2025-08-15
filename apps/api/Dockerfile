# Build stage
FROM node:20 AS builder
WORKDIR /app

# Enable corepack and prepare pnpm with fallback
RUN corepack enable || npm install -g pnpm@latest
RUN corepack prepare pnpm@latest --activate || echo "corepack prepare failed, using global pnpm"

COPY package.json* pnpm-lock.yaml* yarn.lock* package-lock.json* ./
RUN if [ -f pnpm-lock.yaml ]; then \
      pnpm install --frozen-lockfile; \
    elif [ -f yarn.lock ]; then \
      yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then \
      npm ci; \
    else \
      npm install; \
    fi
COPY . .
RUN if [ -f pnpm-lock.yaml ]; then \
      pnpm build; \
    elif [ -f yarn.lock ]; then \
      yarn build; \
    else \
      npm run build; \
    fi

# Production stage
FROM node:20 AS prod
WORKDIR /app
COPY --from=builder /app .
EXPOSE 8000
CMD ["node", "dist/main.js"]
