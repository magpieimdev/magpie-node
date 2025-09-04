/**
 * Global test setup configuration
 * This file runs before all tests and sets up common test environment
 */

// Set test environment variables
process.env.NODE_ENV = 'test';

// Global test timeout
jest.setTimeout(10000);