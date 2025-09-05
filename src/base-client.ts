/* eslint-disable @typescript-eslint/no-explicit-any, no-console, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import type { MagpieErrorType } from "./errors";
import { MagpieError } from "./errors";
import { ApiResponse, HttpMethod, MagpieConfig, RequestOptions } from "./types/magpie";

/**
 * Metadata attached to HTTP requests for tracking and debugging.
 * @internal
 */
interface RequestMetadata {
  /** Timestamp when the request was initiated */
  startTime?: number;
}

/**
 * Extended Axios request configuration with additional metadata.
 * @internal
 */
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  /** Additional request metadata */
  metadata?: RequestMetadata;
}

/**
 * Base client class that handles HTTP communication with the Magpie API.
 * 
 * This class provides the foundation for all API interactions, including:
 * - Authentication via API keys
 * - Request/response interceptors
 * - Automatic retry logic with exponential backoff
 * - Error handling and transformation
 * - Debug logging capabilities
 * - Request timeout and configuration management
 * 
 * @internal This class is not intended for direct use by SDK consumers
 */
export class BaseClient {
  /** Axios instance configured for Magpie API communication */
  private http: AxiosInstance;
  
  /** The secret API key used for authentication */
  private secretKey: string;
  
  /** Complete client configuration with defaults applied */
  private config: Required<MagpieConfig>;

  /**
   * Creates a new BaseClient instance.
   * 
   * @param secretKey - Magpie secret API key (must start with 'sk_')
   * @param config - Optional configuration overrides
   * 
   * @throws {Error} When secretKey is missing, invalid, or malformed
   * 
   * @example
   * ```typescript
   * const client = new BaseClient('sk_test_123', {
   *   timeout: 10000,
   *   maxRetries: 3,
   *   debug: true
   * });
   * ```
   */
  constructor(
    secretKey: string,
    config: MagpieConfig = {}
  ) {
    if (!secretKey || typeof secretKey !== 'string') {
      throw new Error('Missing or invalid secretKey');
    }

    if (!secretKey.startsWith('sk_')) {
      throw new Error('Invalid secretKey');
    }

    this.secretKey = secretKey;
    this.config = {
      baseUrl: config.baseUrl ?? 'https://api.magpie.im',
      timeout: config.timeout ?? 30000,
      maxRetries: config.maxRetries ?? 3,
      retryDelay: config.retryDelay ?? 1000,
      debug: config.debug ?? false,
      apiVersion: config.apiVersion ?? 'v2',
      ...config
    };

    this.http = this.createAxiosInstance();
    this.setupInterceptors();
  }

  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: `${this.config.baseUrl}/${this.config.apiVersion}`,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': `magpie-node/1.0.0 (Node.js ${process.version})`,
        'X-API-Version': this.config.apiVersion,
      },
      auth: {
        username: this.secretKey,
        password: '',
      },
      validateStatus: (status: number) => {
        // Don't throw for any status code, let the response interceptor handle it
        return status < 600;
      }
    });
  }

  private setupInterceptors(): void {
    // Request interceptor for idempotency and logging
    this.http.interceptors.request.use(
      (config: ExtendedAxiosRequestConfig) => {
        // Add request timestamp for debugging
        config.metadata = {
          ...config.metadata,
          startTime: Date.now(),
        };

        if (config.headers && 'x-idempotency-key' in config.headers) {
          // Idempotency key already set in headers
          if (this.config.debug) {
            console.warn(
              '⚠️  Idepotency key provided but not yet supported by API'
            );
          }
        }

        if (this.config.debug) {
          console.log('🔍 Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            baseURL: config.baseURL,
            headers: this.sanitizeHeaders(config.headers || {}),
            data: config.data,
          });
        }

        return config;
    },
    (error: AxiosError) => {
      if (this.config.debug) {
        console.error('❌ Request setup error:', error.message);
      }
      return Promise.reject(error);
    }
  );

    // Response interceptor with retry logic
    this.http.interceptors.response.use(
      (response: AxiosResponse) => {
        const config = response.config as ExtendedAxiosRequestConfig;
        const duration = config.metadata?.startTime
          ? Date.now() - config.metadata.startTime
          : 0;

        if (this.config.debug) {
          console.log('✅ Response:', {
            status: response.status,
            statusText: response.statusText,
            duration: `${duration}ms`,
            headers: {
              'content-type': response.headers['content-type'],
              'request-id': response.headers['request-id'],
            },
            data: response.data,
          });
        }

        // Check if response indicates an error despite successful HTTP status
        if (response.status >= 400) {
          throw this.createErrorFromResponse(response);
        }

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retryCount?: number;
          _retryable?: boolean;
        };

        if (this.config.debug) {
          console.error('❌ Response error:', {
            status: error.response?.status,
            message: error.message,
            code: error.code,
            retryCount: originalRequest._retryCount ?? 0,
          })
        }

        // Handle retry logic
        if (this.shouldRetry(error, originalRequest)) {
          originalRequest._retryCount = (originalRequest._retryCount ?? 0) + 1;

          const delay = this.calculateRetryDelay(originalRequest._retryCount);

          if (this.config.debug) {
            console.log(`🔄 Retrying request (${originalRequest._retryCount}/${this.config.maxRetries}) in ${delay}ms`);
          }
          
          await this.delay(delay);
          return this.http.request(originalRequest);
        }

        // Convert axios error to MagpieError
        throw MagpieError.fromAxiosError(error as any);
      }
    );
  }

  private shouldRetry(
    error: AxiosError,
    request: InternalAxiosRequestConfig & { _retryCount?: number; _retryable?: boolean; }
  ): boolean {
    // Don't retry if we've hit the max retries
    if ((request._retryCount ?? 0) >= this.config.maxRetries) {
      return false;
    }

    // Don't retry if explicitly marked as non-retryable
    if (request._retryable === false) {
      return false;
    }

    // Only retry safe HTTP methods
    const method = request.method?.toLowerCase();
    if (method && !['get', 'head', 'options', 'put', 'delete'].includes(method)) {
      // Don't retry POST requests unless they have idempotency key
      if (method === 'post' && !request.headers['idempotency-key']) {
        return false;
      }
    }

    // Retry on network errors
    if (!error.response) {
      return ['ENOTFOUND', 'ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED'].includes(error.code ?? '');
    }

    // Retry on 5xx server errors and specific 4xx errors
    const {status} = error.response;
    return status >= 500 || status === 429; // Include rate limiting
  }

  private calculateRetryDelay(retryCount: number): number {
    // Exponential backoff with jitter
    const baseDelay = this.config.retryDelay;
    const exponentialDelay = baseDelay * Math.pow(2, retryCount - 1);
    const jitter = Math.random() * 0.1 * exponentialDelay;

    return Math.min(exponentialDelay + jitter, 30000); // Cap at 30 seconds
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private createErrorFromResponse(response: AxiosResponse): MagpieError {
    const { data, status, headers } = response;

    return new MagpieError({
      message: data?.error?.message ?? data?.message ?? `HTTP ${status} Error`,
      type: this.mapStatusToErrorType(status),
      code: data?.error?.code ?? `http_${status}`,
      statusCode: status,
      requestId: headers['request-id'] as string,
      headers: headers as Record<string, any>,
    });
  }


  private mapStatusToErrorType(status: number): MagpieErrorType {
    if (status >= 500) return 'api_error';
    if (status === 429) return 'rate_limit_error';
    if (status === 401) return 'authentication_error';
    if (status === 403) return 'permission_error';
    if (status === 404) return 'not_found_error';
    if (status >= 400) return 'invalid_request_error';
    return 'api_error'; 
  }

  private sanitizeHeaders(headers: Record<string, any>): Record<string, any> {
    const sanitized = { ...headers };

    // Remove sensitive information from logs
    if (sanitized['Authorization']) {
      sanitized['Authorization'] = '[REDACTED]';
    }
    if (sanitized['authorization']) {
      sanitized['authorization'] = '[REDACTED]';
    }

    return sanitized;
  }

  /**
   * Makes a generic HTTP request to the Magpie API.
   * 
   * This is the core method used by all resource classes to communicate with the API.
   * It handles request preparation, data serialization, error handling, and response parsing.
   * 
   * @template TResponse - Expected response data type
   * @param method - HTTP method (GET, POST, PUT, PATCH, DELETE)
   * @param endpoint - API endpoint path (with or without leading slash)
   * @param data - Request payload data or query parameters
   * @param options - Additional request options and configuration
   * 
   * @returns Promise that resolves to an ApiResponse containing the response data and metadata
   * 
   * @throws {MagpieError} When the request fails or API returns an error response
   * 
   * @example
   * ```typescript
   * const response = await client.request('GET', '/customers', { limit: 10 });
   * console.log(response.data); // Customer list
   * console.log(response.requestId); // Request ID for debugging
   * ```
   */
  public async request<TResponse = any>(
    method: HttpMethod,
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<TResponse>> {
    const config: AxiosRequestConfig = {
      method,
      url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
      headers: {},
      ...options.axiosConfig,
    };

    // Add request body for methods that support it
    if (['post', 'put', 'patch'].includes(method.toLowerCase()) && data) {
      config.data = data;
    } else if (data) {
      // For GET requests, add as query parameters
      config.params = { ...config.params, ...data };
    }

    // Add idempotency key if provided
    if (options.idempotencyKey) {
      config.headers = config.headers ?? {};
      config.headers['X-Idempotency-Key'] = options.idempotencyKey;
    }

    // Add expand parameters if provided
    if (options.expand && options.expand.length > 0) {
      config.params = { ...config.params, expand: options.expand };
    }

    // Mark as non-retryable if specified
    if (options.retryable === false) {
      (config as any)._retryable = false;
    }

    const response: AxiosResponse<TResponse> = await this.http.request(config);

    return {
      data: response.data,
      status: response.status,
      headers: response.headers,
      requestId: response.headers['request-id'] as string || null,
    };
  }

  // Convenience methods
  /**
   * Performs a GET request to the specified endpoint.
   * 
   * @template TResponse - Expected response data type
   * @param endpoint - API endpoint path
   * @param params - Query parameters to append to the request
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the API response
   * 
   * @example
   * ```typescript
   * const customers = await client.get('/customers', { limit: 10, offset: 20 });
   * ```
   */
  public async get<TResponse = any>(
    endpoint: string,
    params?: any,
    options?: RequestOptions,
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse>('GET', endpoint, params, options);
  }

  /**
   * Performs a POST request to the specified endpoint.
   * 
   * @template TResponse - Expected response data type
   * @param endpoint - API endpoint path
   * @param data - Request payload data
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the API response
   * 
   * @example
   * ```typescript
   * const customer = await client.post('/customers', {
   *   name: 'John Doe',
   *   email: 'john@example.com'
   * });
   * ```
   */
  public async post<TResponse = any>(
    endpoint: string,
    data?: any,
    options?: RequestOptions,
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse>('POST', endpoint, data, options);
  }

  /**
   * Performs a PUT request to the specified endpoint.
   * 
   * @template TResponse - Expected response data type
   * @param endpoint - API endpoint path
   * @param data - Request payload data
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the API response
   */
  public async put<TResponse = any>(
    endpoint: string,
    data?: any,
    options?: RequestOptions,
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse>('PUT', endpoint, data, options);
  }

  /**
   * Performs a PATCH request to the specified endpoint.
   * 
   * @template TResponse - Expected response data type
   * @param endpoint - API endpoint path
   * @param data - Request payload data
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the API response
   */
  public async patch<TResponse = any>(
    endpoint: string,
    data?: any,
    options?: RequestOptions,
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse>('PATCH', endpoint, data, options);
  }

  /**
   * Performs a DELETE request to the specified endpoint.
   * 
   * @template TResponse - Expected response data type
   * @param endpoint - API endpoint path
   * @param data - Optional request payload data
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the API response
   */
  public async delete<TResponse = any>(
    endpoint: string,
    data?: any,
    options?: RequestOptions,
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse>('DELETE', endpoint, data, options);
  }

  // Configuration getters
  /**
   * Returns the current client configuration.
   * 
   * @returns A read-only copy of the complete client configuration
   * 
   * @example
   * ```typescript
   * const config = client.getConfig();
   * console.log(config.timeout); // 30000
   * console.log(config.maxRetries); // 3
   * ```
   */
  public getConfig(): Readonly<Required<MagpieConfig>> {
    return { ...this.config };
  }

  /**
   * Returns the base URL used for API requests.
   * 
   * @returns The base API URL (e.g., 'https://api.magpie.im')
   */
  public getBaseUrl(): string {
    return this.config.baseUrl;
  }

  /**
   * Enables or disables debug logging for HTTP requests and responses.
   * 
   * @param debug - Whether to enable debug logging
   * 
   * @example
   * ```typescript
   * client.setDebug(true); // Enable detailed request/response logging
   * ```
   */
  public setDebug(debug: boolean): void {
    this.config.debug = debug;
  }

  /**
   * Updates the API key used for authentication.
   * 
   * This method allows switching between different API keys (e.g., from secret key
   * to public key) for specific requests. The key validation ensures only valid
   * Magpie API keys are accepted.
   * 
   * @param apiKey - New API key (must start with 'sk_' or 'pk_')
   * 
   * @throws {Error} When apiKey is missing, invalid, or malformed
   * 
   * @example
   * ```typescript
   * // Switch to public key for sources operations
   * client.setApiKey('pk_test_123');
   * 
   * // Switch back to secret key
   * client.setApiKey('sk_test_456');
   * ```
   */
  public setApiKey(apiKey: string): void {
    if (!apiKey || typeof apiKey !== 'string') {
      throw new Error('Missing or invalid API key');
    }

    if (!apiKey.startsWith('sk_') && !apiKey.startsWith('pk_')) {
      throw new Error('Invalid API key - must start with sk_ or pk_');
    }

    this.secretKey = apiKey;
    
    // Update the Axios instance with the new authentication
    this.http.defaults.auth = {
      username: apiKey,
      password: '',
    };
  }

  /**
   * Gets the currently configured API key.
   * 
   * @returns The current API key (secret or public)
   * 
   * @example
   * ```typescript
   * const currentKey = client.getApiKey();
   * console.log(currentKey.startsWith('sk_') ? 'Secret Key' : 'Public Key');
   * ```
   */
  public getApiKey(): string {
    return this.secretKey;
  }

  /**
   * Tests connectivity to the Magpie API.
   * 
   * This method sends a lightweight request to verify that the client can
   * successfully communicate with the API using the provided credentials.
   * 
   * @returns Promise that resolves to `true` if the connection is successful,
   *          `false` if there are any connectivity or authentication issues
   * 
   * @example
   * ```typescript
   * const isConnected = await client.ping();
   * if (isConnected) {
   *   console.log('✅ Connected to Magpie API');
   * } else {
   *   console.error('❌ Failed to connect to Magpie API');
   * }
   * ```
   */
  public async ping(): Promise<boolean> {
    try {
      await this.get('/ping');
      return true;
    } catch {
      return false;
    }
  }
}