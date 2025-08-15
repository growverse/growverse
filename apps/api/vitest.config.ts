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
      exclude: ['src/main.ts', '**/*.module.ts', 'src/**/dto/**', 'src/**/*.types.ts', 'src/users/**', 'src/health/**'],
      thresholds: {
        branches: 75,
        functions: 75,
        statements: 75,
        lines: 75
      }
    }
  }
});
