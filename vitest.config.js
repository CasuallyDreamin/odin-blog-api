import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    globalSetup: './test/setup.js', 
    include: ['./api.test.js'],
  },
});