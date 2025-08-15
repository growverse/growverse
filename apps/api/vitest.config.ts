import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/main.ts', '**/*.module.ts'],
      thresholds: {
        branches: 75,
        functions: 75,
        statements: 75,
        lines: 75
      }
    }
  }
});
