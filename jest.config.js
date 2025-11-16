module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'services/**/*.ts',
    'libs/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  moduleNameMapper: {
    '^@shared-types/(.*)$': '<rootDir>/libs/shared-types/src/$1',
    '^@ui-components/(.*)$': '<rootDir>/libs/ui-components/src/$1',
    '^@workflow-clients/(.*)$': '<rootDir>/libs/workflow-clients/src/$1',
  },
};

