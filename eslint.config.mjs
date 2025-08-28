import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  // Base JavaScript rules
  js.configs.recommended,
  
  // TypeScript files configuration
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      // TypeScript-specific rules
      ...typescript.configs.recommended.rules,
      ...typescript.configs['recommended-requiring-type-checking'].rules,
      
      // SDK-specific rules for clean, professional code
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      
      // General code quality
      'no-console': 'warn', // SDKs should use proper logging
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'prefer-destructuring': ['error', {
        'object': true,
        'array': false
      }],
      
      // SDK-specific: consistent naming
      'camelcase': ['error', { 
        'properties': 'always',
        'ignoreImports': true,
        'allow': ['^UNSAFE_'] // Allow for API field names that might be snake_case
      }],
      
      // Prevent common SDK mistakes
      'no-throw-literal': 'error',
      'prefer-promise-reject-errors': 'error',
    },
  },
  
  // Test files - more relaxed rules
  {
    files: ['**/*.test.ts', '**/*.spec.ts', 'test/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-console': 'off',
    },
  },
  
  // Configuration files
  {
    files: ['*.config.js', '*.config.ts', '*.config.mjs', 'eslint.config.mjs'],
    languageOptions: {
      globals: {
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      'no-console': 'off',
    },
  },
  
  // Ignore patterns
  {
    ignores: [
      'dist/',
      'node_modules/',
      'coverage/',
      '*.d.ts',
      'build/',
      'lib/',
      'examples/node_modules/',
    ],
  },
];