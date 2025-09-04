/** @type {import('jest').Config} */
export default {
  // Use ts-jest preset for TypeScript support
  preset: 'ts-jest',
  
  
  // Root directory for tests and modules
  rootDir: '.',
  
  // Test file patterns
  testMatch: [
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}',
    '<rootDir>/test/**/*.{test,spec}.{ts,tsx}'
  ],
  
  // Source file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  
  // Module paths and aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/*.{test,spec}.{ts,tsx}',
  ],
  
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html',
  ],
  
  // Coverage thresholds (realistic for v1.0.0)
  coverageThreshold: {
    global: {
      branches: 55,
      functions: 65,
      lines: 65,
      statements: 65,
    },
  },
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Setup files for global test configuration
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  
  // Verbose output
  verbose: true,
  
  // Test environment setup
  testEnvironment: 'node',
  
  // TypeScript configuration for ts-jest  
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        types: ['jest', 'node']
      }
    }]
  },
};
