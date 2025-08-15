import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: {
      NODE_ENV: 'test',
      VITEST: 'true'
    },
    coverage: {
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/main.ts', '**/*.module.ts'],
      thresholds: {
        branches: 50,
        functions: 44,
        statements: 50,
        lines: 50
      }
    }
  }
});
