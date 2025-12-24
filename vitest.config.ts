import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['packages/*/src/**/*.{ts,tsx}'],
      exclude: [
        'packages/*/src/**/*.test.{ts,tsx}',
        'packages/*/src/**/*.spec.{ts,tsx}',
        'packages/*/src/**/index.ts',
        'packages/*/src/**/types.ts',
        'packages/*/src/**/types/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@longvhv/core': path.resolve(__dirname, './packages/core/src'),
      '@longvhv/api-client': path.resolve(__dirname, './packages/api-client/src'),
      '@longvhv/auth': path.resolve(__dirname, './packages/auth/src'),
      '@longvhv/ui-components': path.resolve(__dirname, './packages/ui-components/src'),
      '@longvhv/shared': path.resolve(__dirname, './packages/shared/src'),
      '@longvhv/i18n': path.resolve(__dirname, './packages/i18n/src'),
      '@longvhv/crud': path.resolve(__dirname, './packages/crud/src'),
      '@longvhv/cache': path.resolve(__dirname, './packages/cache/src'),
      '@longvhv/context': path.resolve(__dirname, './packages/context/src'),
      '@longvhv/forms': path.resolve(__dirname, './packages/forms/src'),
      '@longvhv/media': path.resolve(__dirname, './packages/media/src'),
      '@longvhv/vietnamese': path.resolve(__dirname, './packages/vietnamese/src'),
      '@longvhv/cli': path.resolve(__dirname, './packages/cli/src'),
      '@longvhv/testing': path.resolve(__dirname, './packages/testing/src'),
      '@longvhv/theme': path.resolve(__dirname, './packages/theme/src'),
      '@longvhv/notifications': path.resolve(__dirname, './packages/notifications/src'),
      '@longvhv/query': path.resolve(__dirname, './packages/query/src'),
    },
  },
});
