/** @type {import('jest').Config} */
export default {
  // Use ts-jest preset for TypeScript support
  preset: 'ts-jest',
  
  // Test environment
  testEnvironment: 'node',
  
  // Root directory for tests and modules
  rootDir: '.',
  
  // Test file patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}',
    '<rootDir>/test/**/*.{test,spec}.{ts,tsx}'
  ],
  
  // Source file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Transform files with ts-jest
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  
  // Module paths and aliases
  moduleNameMapping: {
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
  
  // Coverage thresholds (adjust as needed)
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Setup files (create these if you need global test setup)
  // setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  
  // Verbose output
  verbose: true,
  
  // TypeScript configuration for ts-jest
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};
