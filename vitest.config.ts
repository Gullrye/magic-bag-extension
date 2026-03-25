import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['node_modules', '.output', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/', '**/*.test.{ts,tsx}'],
    },
  },
  resolve: {
    alias: {
      '@': '/Users/gullrye/Documents/ai/tag-extension',
      '~': '/Users/gullrye/Documents/ai/tag-extension',
    },
  },
});
