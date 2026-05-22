import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/unit/**/*.unit.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/payload-types.ts'],
      thresholds: {
        statements: 18,
        branches: 16,
        functions: 8,
        lines: 20,
        'src/hooks/**': {
          statements: 85,
          branches: 80,
          functions: 100,
          lines: 85,
        },
        'src/lib/auth/**': {
          statements: 75,
          branches: 60,
          functions: 80,
          lines: 75,
        },
      },
    },
  },
})
