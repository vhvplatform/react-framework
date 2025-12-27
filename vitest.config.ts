import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    include: [
      'tests/**/*.{test,spec}.{ts,tsx}',
      'tests/performance/**/*.perf.{test,spec}.{ts,tsx}',
    ],
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
      '@vhvplatform/core': path.resolve(__dirname, './packages/core/src'),
      '@vhvplatform/api-client': path.resolve(__dirname, './packages/api-client/src'),
      '@vhvplatform/auth': path.resolve(__dirname, './packages/auth/src'),
      '@vhvplatform/ui-components': path.resolve(__dirname, './packages/ui-components/src'),
      '@vhvplatform/shared': path.resolve(__dirname, './packages/shared/src'),
      '@vhvplatform/i18n': path.resolve(__dirname, './packages/i18n/src'),
      '@vhvplatform/crud': path.resolve(__dirname, './packages/crud/src'),
      '@vhvplatform/cache': path.resolve(__dirname, './packages/cache/src'),
      '@vhvplatform/context': path.resolve(__dirname, './packages/context/src'),
      '@vhvplatform/forms': path.resolve(__dirname, './packages/forms/src'),
      '@vhvplatform/media': path.resolve(__dirname, './packages/media/src'),
      '@vhvplatform/vietnamese': path.resolve(__dirname, './packages/vietnamese/src'),
      '@vhvplatform/cli': path.resolve(__dirname, './packages/cli/src'),
      '@vhvplatform/testing': path.resolve(__dirname, './packages/testing/src'),
      '@vhvplatform/theme': path.resolve(__dirname, './packages/theme/src'),
      '@vhvplatform/notifications': path.resolve(__dirname, './packages/notifications/src'),
      '@vhvplatform/query': path.resolve(__dirname, './packages/query/src'),
    },
  },
});
