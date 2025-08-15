import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      reporter: ['text', 'lcov'],
      branches: 75,
      functions: 75,
      statements: 75,
      lines: 75,
      include: ['src/health/health.controller.ts']
    }
  }
});
