/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['lcov', 'text'],
      include: ['src/**/*.ts'],
      exclude: ['**/node_modules/**', '**/dist/**', 'build.js'],
      all: true,
    },
  },
});
