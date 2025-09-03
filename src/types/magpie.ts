import { AxiosRequestConfig } from "axios";

/**
 * HTTP methods supported by the Magpie API.
 */
export type HttpMethod = 
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS';

/**
 * Configuration options for the Magpie SDK client.
 * 
 * These options control the behavior of HTTP requests, retry logic,
 * debugging, and other client-level settings.
 */
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

/**
 * Additional options that can be passed to individual API requests.
 * 
 * These options allow for fine-grained control over individual requests,
 * including idempotency, field expansion, retry behavior, and Axios configuration.
 */
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


/**
 * Standard response wrapper for all Magpie API responses.
 * 
 * This interface wraps all API response data with additional metadata
 * including HTTP status, headers, and request identification.
 * 
 * @template T - The type of the response data
 */
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

/**
 * Options for paginating and filtering list requests.
 * 
 * These options are used when retrieving lists of resources like customers,
 * charges, or payment sources. Supports cursor-based pagination and filtering.
 */
export interface ListOptions {
  /** Number of items to return. Default and maximum is 100 */
  limit?: number;

  /** Cursor for pagination - ID of the last item from previous page */
  starting_after?: string;

  /** Cursor for pagination - ID of the first item from next page */
  ending_before?: string;

  /** Filter by creation date */
  created?: DateRangeFilter | number;

  /** Additional filters specific to each resource */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Filter for date-based queries using Unix timestamps.
 * 
 * This interface allows for flexible date range filtering using
 * Unix timestamps (seconds since epoch).
 */
export interface DateRangeFilter {
  /** Greater than (exclusive) */
  gt?: number;

  /** Greater than or equal to (inclusive) */
  gte?: number;

  /** Less than (exclusive) */
  lt?: number;

  /** Less than or equal to (inclusive) */
  lte?: number;  
}

/**
 * Standard response format for paginated list endpoints.
 * 
 * This interface represents the structure of responses from list endpoints,
 * providing the data array along with pagination metadata.
 * 
 * @template T - The type of items in the list
 */
export interface ListResponse<T> {
  /** Object type */
  object: 'list';

  /** Array of items */
  data: T[];

  /** Whether there are more items available */
  has_more: boolean;

  /** Total count of items (if available) */
  total_count?: number;

  /** URL that produced this list */
  url: string;
}
  

/**
 * Response format for successful deletion operations.
 * 
 * This interface represents the response structure when a resource
 * is successfully deleted from the Magpie system.
 */
export interface DeletedResponse {
  /** ID of the deleted object */
  id: string;

  /** Object type that was deleted */
  object: string;

  /** Whether the deletion was successful */
  deleted: boolean;
}

/**
 * Metadata about the HTTP response for the last API request.
 * 
 * This interface is attached to all API response objects to provide
 * debugging information and HTTP response metadata.
 */
export interface LastResponse {
  /** HTTP status code */
  statusCode: number;

  /** Unique request identifier for debugging */
  requestId: string | null;

  /** Response headers */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers: Record<string, any>;
}

