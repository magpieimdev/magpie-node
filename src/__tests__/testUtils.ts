/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Magpie } from '../magpie';
import { MagpieConfig } from '../types/magpie';

/**
 * Last request details captured by the spy
 */
export interface LastRequest {
  method: string;
  url: string;
  data?: unknown;
  headers?: Record<string, unknown>;
  params?: Record<string, unknown>;
  config?: AxiosRequestConfig;
}

/**
 * Extended Magpie client with request spying capabilities
 */
interface SpyableMagpie extends Magpie {
  LAST_REQUEST: LastRequest | null;
}

/**
 * Creates a spyable Magpie client that captures HTTP requests without making real API calls.
 * 
 * @param secretKey - API secret key (defaults to test key)
 * @param config - Optional client configuration
 * @returns Magpie client with request spying capabilities
 */
export function getSpyableMagpie(
  secretKey = 'sk_test_123',
  config?: MagpieConfig
): SpyableMagpie {
  const magpie = new Magpie(secretKey, config) as SpyableMagpie;
  
  // Initialize the LAST_REQUEST tracker
  magpie.LAST_REQUEST = null;
  
  // Mock the HTTP client to capture requests
  (magpie as any).http.request = jest.fn().mockImplementation((requestConfig: AxiosRequestConfig) => {
    // Merge with instance defaults to get the complete headers
    const instanceDefaults = (magpie as any).http.defaults;
    
    // Handle authorization header from auth config
    let authHeader: string | undefined;
    if (instanceDefaults.auth) {
      const { username, password = '' } = instanceDefaults.auth;
      authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    }
    
    // Properly merge headers from different sources
    const method = requestConfig.method?.toLowerCase() ?? 'get';
    const baseHeaders: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': `magpie-node/1.0.0 (Node.js ${process.version})`,
      'X-API-Version': 'v2',
    };
    
    // Add Content-Type for methods that typically have a body
    if (['post', 'put', 'patch'].includes(method)) {
      baseHeaders['Content-Type'] = 'application/json';
    }

    // Filter out undefined values from defaults to avoid overriding our baseHeaders
    const cleanDefaults = (headers: Record<string, any>) => {
      const clean: Record<string, any> = {};
      Object.entries(headers || {}).forEach(([key, value]) => {
        if (value !== undefined) {
          clean[key] = value;
        }
      });
      return clean;
    };

    const mergedHeaders = {
      // Default headers set in BaseClient
      ...baseHeaders,
      // Instance defaults (filtered)
      ...cleanDefaults(instanceDefaults.headers?.common ?? {}),
      ...cleanDefaults(instanceDefaults.headers?.[method] ?? {}),
      // Request specific headers
      ...requestConfig.headers,
      // Auth header from basic auth config
      ...(authHeader && { 'Authorization': authHeader })
    };

    // Capture request details
    magpie.LAST_REQUEST = {
      method: requestConfig.method?.toUpperCase() ?? 'GET',
      url: requestConfig.url ?? '',
      data: requestConfig.data,
      headers: mergedHeaders as Record<string, unknown>,
      params: requestConfig.params as Record<string, unknown>,
      config: {
        ...instanceDefaults,
        ...requestConfig,
        timeout: requestConfig.timeout ?? instanceDefaults.timeout,
        baseURL: requestConfig.baseURL ?? instanceDefaults.baseURL
      }
    };
    
    // Return a mock successful response
    const mockResponse: AxiosResponse = {
      data: { id: 'mock_response', object: 'test' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: requestConfig as any,
      request: {}
    };
    
    return Promise.resolve(mockResponse);
  });
  
  return magpie;
}

/**
 * Creates a Magpie client with custom mock responses
 * 
 * @param responses - Map of URL patterns to mock responses
 * @param secretKey - API secret key
 * @param config - Optional client configuration
 */
export function getMockMagpie(
  responses: Record<string, any>,
  secretKey = 'sk_test_123',
  config?: MagpieConfig
): SpyableMagpie {
  const magpie = getSpyableMagpie(secretKey, config);
  
  (magpie as any).http.request = jest.fn().mockImplementation((requestConfig: AxiosRequestConfig) => {
    // Merge with instance defaults to get the complete headers
    const instanceDefaults = (magpie as any).http.defaults;
    
    // Handle authorization header from auth config
    let authHeader: string | undefined;
    if (instanceDefaults.auth) {
      const { username, password = '' } = instanceDefaults.auth;
      authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    }
    
    // Properly merge headers from different sources
    const method = requestConfig.method?.toLowerCase() ?? 'get';
    const baseHeaders: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': `magpie-node/1.0.0 (Node.js ${process.version})`,
      'X-API-Version': 'v2',
    };
    
    // Add Content-Type for methods that typically have a body
    if (['post', 'put', 'patch'].includes(method)) {
      baseHeaders['Content-Type'] = 'application/json';
    }

    // Filter out undefined values from defaults to avoid overriding our baseHeaders
    const cleanDefaults = (headers: Record<string, any>) => {
      const clean: Record<string, any> = {};
      Object.entries(headers || {}).forEach(([key, value]) => {
        if (value !== undefined) {
          clean[key] = value;
        }
      });
      return clean;
    };

    const mergedHeaders = {
      // Default headers set in BaseClient
      ...baseHeaders,
      // Instance defaults (filtered)
      ...cleanDefaults(instanceDefaults.headers?.common ?? {}),
      ...cleanDefaults(instanceDefaults.headers?.[method] ?? {}),
      // Request specific headers
      ...requestConfig.headers,
      // Auth header from basic auth config
      ...(authHeader && { 'Authorization': authHeader })
    };

    // Capture request details
    magpie.LAST_REQUEST = {
      method: requestConfig.method?.toUpperCase() ?? 'GET',
      url: requestConfig.url ?? '',
      data: requestConfig.data,
      headers: mergedHeaders as Record<string, unknown>,
      params: requestConfig.params as Record<string, unknown>,
      config: {
        ...instanceDefaults,
        ...requestConfig,
        timeout: requestConfig.timeout ?? instanceDefaults.timeout,
        baseURL: requestConfig.baseURL ?? instanceDefaults.baseURL
      }
    };
    
    // Find matching mock response
    const url = requestConfig.url ?? '';
    const matchedResponse = Object.keys(responses).find(pattern => 
      url.includes(pattern)
    );
    
    const responseData = matchedResponse ? responses[matchedResponse] : { id: 'default_mock' };
    
    const mockResponse: AxiosResponse = {
      data: responseData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: requestConfig as any,
      request: {}
    };
    
    return Promise.resolve(mockResponse);
  });
  
  return magpie;
}

/**
 * Utility to generate random test strings
 */
export function getRandomString(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Utility to create test customer data
 */
export function createTestCustomer(overrides: Record<string, any> = {}): Record<string, any> {
  const baseCustomer = {
    name: 'Test Customer',
    email: `test+${getRandomString()}@example.com`,
    phone: '+63917123456',
  };
  
  // Ensure email is always present (required field)
  return {
    ...baseCustomer,
    ...overrides,
    email: overrides.email ?? baseCustomer.email
  };
}

/**
 * Utility to create test charge data
 */
export function createTestCharge(overrides: Record<string, any> = {}): Record<string, any> {
  return {
    amount: 10000,
    currency: 'php',
    source: 'src_test_123',
    description: 'Test charge',
    statement_descriptor: 'Test Payment',
    capture: true,
    metadata: {},
    ...overrides
  };
}

/**
 * Utility to create test source data
 */
export function createTestSource(overrides: Record<string, any> = {}): Record<string, any> {
  return {
    type: 'card',
    card: {
      number: '4242424242424242',
      exp_month: 12,
      exp_year: 2025,
      cvc: '123'
    },
    redirect: {
      success: 'https://example.com/success',
      fail: 'https://example.com/fail'
    },
    billing: {
      name: 'Test User',
      email: 'test@example.com'
    },
    ...overrides
  };
}

/**
 * Utility to create test line item data
 */
export function createTestLineItem(overrides: Record<string, any> = {}): Record<string, any> {
  return {
    amount: 10000,
    description: 'Test Product',
    quantity: 1,
    ...overrides
  };
}

/**
 * Utility to create test checkout session data
 */
export function createTestCheckoutSession(overrides: Record<string, any> = {}): Record<string, any> {
  return {
    line_items: [createTestLineItem()],
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
    currency: 'php',
    mode: 'payment',
    payment_method_types: ['card'],
    ...overrides
  };
}

/**
 * Utility to create test payment request data
 */
export function createTestPaymentRequest(overrides: Record<string, any> = {}): Record<string, any> {
  return {
    currency: 'php',
    customer: 'cus_test_123',
    delivery_methods: ['email'],
    line_items: [createTestLineItem()],
    payment_method_types: ['card'],
    ...overrides
  };
}

/**
 * Utility to create test payment request void params
 */
export function createTestPaymentRequestVoidParams(overrides: Record<string, any> = {}): Record<string, any> {
  return {
    reason: 'customer_requested',
    ...overrides
  };
}

/**
 * Utility to create test payment link item data
 */
export function createTestPaymentLinkItem(overrides: Record<string, any> = {}): Record<string, any> {
  return {
    amount: 10000,
    description: 'Test Product',
    quantity: 100,
    image: null,
    remaining: 100,
    ...overrides
  };
}

/**
 * Utility to create test payment link data
 */
export function createTestPaymentLink(overrides: Record<string, any> = {}): Record<string, any> {
  return {
    allow_adjustable_quantity: false,
    currency: 'php',
    internal_name: 'Test Payment Link',
    line_items: [createTestPaymentLinkItem()],
    payment_method_types: ['card'],
    ...overrides
  };
}

/**
 * Utility to create test payment link update params
 */
export function createTestPaymentLinkUpdateParams(overrides: Record<string, any> = {}): Record<string, any> {
  return {
    allow_adjustable_quantity: false,
    currency: 'php',
    line_items: [createTestPaymentLinkItem()],
    payment_method_types: ['card'],
    ...overrides
  };
}

/**
 * Utility to create test webhook event data
 */
export function createTestWebhookEvent(overrides: Partial<Record<string, any>> = {}): Record<string, any> {
  return {
    id: 'evt_test_webhook',
    type: 'payment.completed',
    data: {
      object: {
        id: 'ch_test_123',
        amount: 50000,
        currency: 'php',
        status: 'succeeded'
      }
    },
    created: Math.floor(Date.now() / 1000),
    livemode: false,
    api_version: '2024-01-01',
    ...overrides
  };
}

/**
 * Utility to create test webhook headers
 */
export function createTestWebhookHeaders(signature: string, timestamp?: number, overrides: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    'x-magpie-signature': signature,
    'content-type': 'application/json',
    'user-agent': 'Magpie-Webhooks/1.0',
    ...overrides
  };

  if (timestamp) {
    headers['x-magpie-timestamp'] = timestamp.toString();
  }

  return headers;
}

/**
 * Utility to create test webhook signature configuration
 */
export function createTestWebhookConfig(overrides: Record<string, any> = {}): Record<string, any> {
  return {
    algorithm: 'sha256',
    signatureHeader: 'x-magpie-signature',
    timestampHeader: 'x-magpie-timestamp',
    tolerance: 300, // 5 minutes
    prefix: 'v1=',
    ...overrides
  };
}