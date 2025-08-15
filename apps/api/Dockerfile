# Build stage
FROM node:20 AS builder
WORKDIR /app
COPY package.json* pnpm-lock.yaml* yarn.lock* package-lock.json* ./
RUN if [ -f pnpm-lock.yaml ]; then \
      corepack enable && pnpm install --frozen-lockfile; \
    elif [ -f yarn.lock ]; then \
      yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then \
      npm ci; \
    else \
      npm install; \
    fi
COPY . .
RUN npm run build || yarn build || pnpm build

# Production stage
FROM node:20 AS runner
WORKDIR /app
COPY --from=builder /app .
EXPOSE 8000
CMD ["node", "dist/main.js"]
