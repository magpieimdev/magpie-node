import { AxiosRequestConfig } from "axios";

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export interface MagpieConfig {
  /** Base URL for the API. Defaults to https://api.magpie.im */
  baseUrl?: string;

  /** Request timeout in milliseconds. Defaults to 30000 (30 seconds) */
  timeout?: number;

  /** Maximum number of retry attempts. Defaults to 3 */
  maxRetries?: number;

  /** Base delay between retry attempts in milliseconds. Defaults to 1000 (1 second) */
  retryDelay?: number;

  /** Enable debug logging. Defaults to false */
  debug?: boolean;

  /** API version to use. Defaults to v2 */
  apiVersion?: string;
}

export interface RequestOptions {
  /** Idempotency key for for safe retries of non-idempotent requests */
  idempotencyKey?: string;

  /** Fields to expand in the response */
  expand?: string[];

  /** Whether this request should be retried on failure. Defaults to true for safe methods */
  retryable?: boolean;

  /** Additional Axios configuration to merge */
  axiosConfig?: AxiosRequestConfig;
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  /** The response data */
  data: T;

  /** HTTP status code */
  status: number;

  /** Response headers */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers: Record<string, any>;

  /** Unique request identifier for debugging */
  requestId: string | null;
}