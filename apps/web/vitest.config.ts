import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      statements: 75,
      branches: 75,
      functions: 75,
      lines: 75,
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/openapi-types.d.ts'],
    },
  },
});
