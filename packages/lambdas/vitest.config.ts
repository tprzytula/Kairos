import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['sources/**/*.ts', 'libs/**/*.ts'],
      exclude: [
        '**/*.test.ts',
        '**/*.d.ts',
        '**/types.ts',
        '**/types/**',
        'libs/dynamodb/index.ts',
        'libs/dynamodb/commands/index.ts',
        'libs/middleware/utils/index.ts',
        'sources/join_project/utils/index.ts',
        'sources/db_migrations/migrations/**/data/**',
        'sources/db_migrations/migrations/**/index.ts',
      ],
      thresholds: {
        statements: 100,
        branches: 99,
        functions: 100,
        lines: 100,
      },
    },
  },
})
