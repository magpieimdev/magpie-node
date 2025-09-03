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
  

export interface DeletedResponse {
  /** ID of the deleted object */
  id: string;

  /** Object type that was deleted */
  object: string;

  /** Whether the deletion was successful */
  deleted: boolean;
}

export interface LastResponse {
  /** HTTP status code */
  statusCode: number;

  /** Unique request identifier for debugging */
  requestId: string | null;

  /** Response headers */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers: Record<string, any>;
}

