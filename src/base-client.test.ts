/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/only-throw-error */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  mockAuthenticationErrorResponse,
  mockRateLimitErrorResponse,
  mockValidationErrorResponse
} from './__tests__/fixtures';
import { getSpyableMagpie } from './__tests__/testUtils';
import { BaseClient } from './base-client';
import { MagpieError } from './errors';

describe('BaseClient', () => {
  describe('initialization', () => {
    it('should create client with secret key', () => {
      const magpie = getSpyableMagpie('sk_test_123');
      expect(magpie).toBeDefined();
    });

    it('should throw error for missing secret key', () => {
      expect(() => {
        new (BaseClient as any)();
      }).toThrow();
    });

    it('should throw error for invalid secret key format', () => {
      expect(() => {
        new (BaseClient as any)('invalid_key');
      }).toThrow('Invalid secretKey');
    });

    it('should accept valid configuration options', () => {
      const config = {
        timeout: 10000,
        maxRetries: 5,
        debug: true
      };
      const magpie = getSpyableMagpie('sk_test_123', config);
      expect(magpie).toBeDefined();
    });
  });

  describe('request handling', () => {
    it('should set correct authorization header', async () => {
      const magpie = getSpyableMagpie('sk_test_123');
      
      // Make a test request
      await magpie.customers.create({ email: 'test@example.com' });
      
      // Basic auth encodes username:password in base64. Since password is empty, it's just 'sk_test_123:'
      const expectedAuth = `Basic ${Buffer.from('sk_test_123:').toString('base64')}`;
      expect(magpie.LAST_REQUEST?.headers).toMatchObject({
        'Authorization': expectedAuth
      });
    });

    it('should set correct content type for POST requests', async () => {
      const magpie = getSpyableMagpie('sk_test_123');
      
      await magpie.customers.create({
        name: 'Test Customer',
        email: 'test@example.com'
      });
      
      expect(magpie.LAST_REQUEST?.headers).toMatchObject({
        'Content-Type': 'application/json'
      });
    });

    it('should include User-Agent header', async () => {
      const magpie = getSpyableMagpie('sk_test_123');
      
      await magpie.customers.create({ email: 'test@example.com' });
      
      expect(magpie.LAST_REQUEST?.headers?.['User-Agent']).toMatch(/^magpie-node\/\d+\.\d+\.\d+/);
    });

    it('should handle idempotency keys', async () => {
      const magpie = getSpyableMagpie('sk_test_123');
      const idempotencyKey = 'test_idempotency_key_123';
      
      await magpie.charges.create({
        amount: 10000,
        currency: 'php',
        source: 'src_test_123',
        description: 'Test charge',
        statement_descriptor: 'TEST',
        capture: true,
        metadata: {}
      }, { idempotencyKey });
      
      expect(magpie.LAST_REQUEST?.headers).toMatchObject({
        'X-Idempotency-Key': idempotencyKey
      });
    });
  });

  describe('error handling', () => {
    it('should transform authentication errors', async () => {
      const magpie = getSpyableMagpie('sk_test_invalid');

      // Replace the mock to return a rejected promise and then use interceptors
      (magpie as any).http.request.mockImplementation(async (config: any) => {
        const axiosError = {
          response: {
            status: 401,
            statusText: 'Unauthorized',
            data: mockAuthenticationErrorResponse,
            headers: {},
            config,
            request: {}
          },
          config,
          isAxiosError: true,
          toJSON: () => ({})
        };
        
        // Simulate axios error handling by calling response interceptor error handler
        const responseInterceptors = (magpie as any).http.interceptors.response.handlers;
        if (responseInterceptors.length > 0) {
          const errorHandler = responseInterceptors[0].rejected;
          if (errorHandler) {
            throw await errorHandler(axiosError);
          }
        }
        throw axiosError;
      });

      await expect(magpie.customers.create({ email: 'test@example.com' } as any)).rejects.toThrow(MagpieError);
    });

    it('should transform validation errors', async () => {
      const magpie = getSpyableMagpie();

      // Replace the mock to return a rejected promise and then use interceptors
      (magpie as any).http.request.mockImplementation(async (config: any) => {
        const axiosError = {
          response: {
            status: 400,
            statusText: 'Bad Request',
            data: mockValidationErrorResponse,
            headers: {},
            config,
            request: {}
          },
          config,
          isAxiosError: true,
          toJSON: () => ({})
        };
        
        // Simulate axios error handling by calling response interceptor error handler
        const responseInterceptors = (magpie as any).http.interceptors.response.handlers;
        if (responseInterceptors.length > 0) {
          const errorHandler = responseInterceptors[0].rejected;
          if (errorHandler) {
            throw await errorHandler(axiosError);
          }
        }
        throw axiosError;
      });

      await expect(magpie.customers.create({ email: 'invalid' } as any)).rejects.toThrow(MagpieError);
    });

    it('should transform rate limit errors', async () => {
      const magpie = getSpyableMagpie();

      // Replace the mock to return a rejected promise and then use interceptors
      (magpie as any).http.request.mockImplementation(async (config: any) => {
        const axiosError = {
          response: {
            status: 429,
            statusText: 'Too Many Requests',
            data: mockRateLimitErrorResponse,
            headers: {},
            config,
            request: {}
          },
          config,
          isAxiosError: true,
          toJSON: () => ({})
        };
        
        // Simulate axios error handling by calling response interceptor error handler
        const responseInterceptors = (magpie as any).http.interceptors.response.handlers;
        if (responseInterceptors.length > 0) {
          const errorHandler = responseInterceptors[0].rejected;
          if (errorHandler) {
            throw await errorHandler(axiosError);
          }
        }
        throw axiosError;
      });

      await expect(magpie.customers.create({ email: 'test@example.com' } as any)).rejects.toThrow(MagpieError);
    });

    it('should handle network errors', async () => {
      const magpie = getSpyableMagpie();

      // Replace the mock to return a rejected promise and then use interceptors
      (magpie as any).http.request.mockImplementation(async (config: any) => {
        const axiosError = {
          code: 'ECONNREFUSED',
          message: 'Connection refused',
          config,
          isAxiosError: true,
          toJSON: () => ({})
        };
        
        // Simulate axios error handling by calling response interceptor error handler
        const responseInterceptors = (magpie as any).http.interceptors.response.handlers;
        if (responseInterceptors.length > 0) {
          const errorHandler = responseInterceptors[0].rejected;
          if (errorHandler) {
            throw await errorHandler(axiosError);
          }
        }
        throw axiosError;
      });

      await expect(magpie.customers.create({ email: 'test@example.com' } as any)).rejects.toThrow(MagpieError);
    });

    it('should handle timeout errors', async () => {
      const magpie = getSpyableMagpie();

      // Replace the mock to return a rejected promise and then use interceptors
      (magpie as any).http.request.mockImplementation(async (config: any) => {
        const axiosError = {
          code: 'ECONNABORTED',
          message: 'timeout of 5000ms exceeded',
          config,
          isAxiosError: true,
          toJSON: () => ({})
        };
        
        // Simulate axios error handling by calling response interceptor error handler
        const responseInterceptors = (magpie as any).http.interceptors.response.handlers;
        if (responseInterceptors.length > 0) {
          const errorHandler = responseInterceptors[0].rejected;
          if (errorHandler) {
            throw await errorHandler(axiosError);
          }
        }
        throw axiosError;
      });

      await expect(magpie.customers.create({ email: 'test@example.com' } as any)).rejects.toThrow(MagpieError);
    });
  });

  describe('configuration', () => {
    it('should use default timeout', async () => {
      const magpie = getSpyableMagpie('sk_test_123');
      
      await magpie.customers.create({ email: 'test@example.com' });
      
      // Check that timeout is set in the request config
      expect(magpie.LAST_REQUEST?.config?.timeout).toBeDefined();
    });

    it('should use custom timeout', async () => {
      const magpie = getSpyableMagpie('sk_test_123', { timeout: 15000 });
      
      await magpie.customers.create({ email: 'test@example.com' });
      
      expect(magpie.LAST_REQUEST?.config?.timeout).toBe(15000);
    });

    it('should use custom base URL', async () => {
      const customUrl = 'https://api.custom.magpie.im';
      const magpie = getSpyableMagpie('sk_test_123', { baseUrl: customUrl });
      
      await magpie.customers.create({ email: 'test@example.com' });
      
      expect(magpie.LAST_REQUEST?.config?.baseURL).toBe(`${customUrl}/v2`);
    });
  });
});