/**
 * Types of errors that can occur when using the Magpie SDK.
 * 
 * Each error type corresponds to different failure scenarios:
 * - `api_error`: Server-side errors (5xx responses)
 * - `authentication_error`: Invalid or missing API credentials
 * - `card_error`: Payment method or card-related issues
 * - `idempotency_error`: Duplicate request with different parameters
 * - `invalid_request_error`: Malformed request or missing parameters
 * - `rate_limit_error`: Too many requests in a time period
 * - `validation_error`: Request validation failed
 * - `permission_error`: Insufficient permissions for the operation
 * - `network_error`: Network connectivity issues
 * - `not_found_error`: Requested resource not found
 * - `timeout_error`: Request timed out
 * - `configuration_error`: SDK configuration issues
 */
export type MagpieErrorType =
  | 'api_error'
  | 'authentication_error'
  | 'card_error'
  | 'idempotency_error'
  | 'invalid_request_error'
  | 'rate_limit_error'
  | 'validation_error'
  | 'permission_error'
  | 'network_error'
  | 'not_found_error'
  | 'timeout_error'
  | 'configuration_error';

/**
 * Raw error response structure from API calls.
 * @internal
 */
interface ApiErrorResponse {
  response?: {
    data?: {
      error?: {
        message?: string;
        type?: string;
        code?: string;
        param?: string;
        doc_url?: string;
        decline_code?: string;
        charge_id?: string;
      };
      message?: string;
    };
    status?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    headers?: Record<string, any>;
  };
  message?: string;
  code?: string;
}

/**
 * Detailed information about a Magpie API error.
 * 
 * This interface contains all the relevant information about an error
 * that occurred during an API request, including contextual details
 * for debugging and error handling.
 */
export interface MagpieErrorDetails {
  /** Error message */
  message: string;

  /** Error type category */
  type: MagpieErrorType;

  /** Specific error code */
  code?: string;

  /** HTTP status code if applicable */
  statusCode?: number;

  /** Request ID for debugging */
  requestId?: string;

  /** Additional error parameters */
  param?: string;

  /** Error documentation URL */
  docUrl?: string;

  /** Decline code for card errors */
  declineCode?: string;

  /** Charge ID associated with the error */
  chargeId?: string;

  /** Response headers if available */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers?: Record<string, any>;
}

/**
 * Base error class for all Magpie SDK errors.
 * 
 * This class extends the native Error class to provide additional
 * context about API errors, including error types, status codes,
 * and debugging information.
 * 
 * @example
 * ```typescript
 * try {
 *   await magpie.charges.create(chargeParams);
 * } catch (error) {
 *   if (error instanceof MagpieError) {
 *     console.error('Magpie error:', error.type);
 *     console.error('Status code:', error.statusCode);
 *     console.error('Request ID:', error.requestId);
 *     
 *     // Handle specific error types
 *     if (error.isAuthenticationError()) {
 *       // Handle auth errors
 *     } else if (error.isValidationError()) {
 *       // Handle validation errors
 *     } else if (error.isRetryable()) {
 *       // Retry the request
 *     }
 *   }
 * }
 * ```
 */
export class MagpieError extends Error {
  /** The category of error that occurred */
  public readonly type: MagpieErrorType;
  
  /** Specific error code for programmatic handling */
  public readonly code?: string;
  
  /** HTTP status code if the error came from an API response */
  public readonly statusCode?: number;
  
  /** Unique identifier for the failed request (useful for support) */
  public readonly requestId?: string;
  
  /** The parameter that caused the error (for validation errors) */
  public readonly param?: string;
  
  /** URL to documentation about this error */
  public readonly docUrl?: string;
  
  /** Decline code for card-related errors */
  public readonly declineCode?: string;
  
  /** ID of the charge associated with the error */
  public readonly chargeId?: string;
  
  /** Response headers from the failed request */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly headers?: Record<string, any>;

  /**
   * Creates a new MagpieError instance.
   * 
   * @param details - Detailed error information
   * 
   * @example
   * ```typescript
   * const error = new MagpieError({
   *   message: 'Invalid API key provided',
   *   type: 'authentication_error',
   *   code: 'invalid_api_key',
   *   statusCode: 401
   * });
   * ```
   */
  constructor(details: MagpieErrorDetails) {
    super(details.message);

    // Set the prototype explicitly for proper instanceof checks
    Object.setPrototypeOf(this, MagpieError.prototype);

    this.name = 'MagpieError';
    this.type = details.type;
    this.code = details.code;
    this.statusCode = details.statusCode;
    this.requestId = details.requestId;
    this.param = details.param;
    this.docUrl = details.docUrl;
    this.declineCode = details.declineCode;
    this.chargeId = details.chargeId;
    this.headers = details.headers;
    
    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MagpieError);
    }
  }

  /**
   * Creates a MagpieError from an Axios error response.
   * 
   * This static method is used internally to convert HTTP errors
   * from the underlying Axios library into structured MagpieError instances.
   * 
   * @param error - The Axios error response
   * @returns A new MagpieError instance with parsed error details
   * 
   * @internal
   */
  static fromAxiosError(error: ApiErrorResponse): MagpieError {
    const {response} = error;

    if (response?.data) {
      const { data, status, headers } = response;
      
      // Handle string responses
      if (typeof data === 'string') {
        return new MagpieError({
          message: data,
          type: MagpieError.mapStatusToType(status),
          code: `http_${status ?? 'unknown'}`,
          statusCode: status,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          requestId: headers?.['request-id'] ?? headers?.['x-request-id'],
          headers,
        });
      }
      
      const errorData = data.error ?? data;
      
      // Safely access properties that might exist on either error or data
      const errorMessage = errorData?.message ?? data.message ?? `HTTP ${status ?? 'Unknown'} Error`;
      const errorType = (errorData && typeof errorData === 'object' && 'type' in errorData) ? errorData.type : undefined;
      const errorCode = (errorData && typeof errorData === 'object' && 'code' in errorData) ? errorData.code : `http_${status ?? 'unknown'}`;
      const param = (errorData && typeof errorData === 'object' && 'param' in errorData) ? errorData.param : undefined;
      const docUrl = (errorData && typeof errorData === 'object' && 'doc_url' in errorData) ? errorData.doc_url : undefined;
      const declineCode = (errorData && typeof errorData === 'object' && 'decline_code' in errorData) ? errorData.decline_code : undefined;
      const chargeId = (errorData && typeof errorData === 'object' && 'charge_id' in errorData) ? errorData.charge_id : undefined;

      return new MagpieError({
        message: errorMessage,
        type: MagpieError.mapStatusToType(status, errorType),
        code: errorCode,
        statusCode: status,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        requestId: headers?.['request-id'] ?? headers?.['x-request-id'],
        param,
        docUrl,
        declineCode,
        chargeId,
        headers,
      });
    }

    // Network or other errors
    return new MagpieError({
      message: error.message ?? 'Network error occurred',
      type: MagpieError.mapCodeToType(error.code),
      code: error.code,
    });
  }

  /**
   * Map HTTP status codes to error types
   */
  private static mapStatusToType(status?: number, apiType?: string): MagpieErrorType {
    // Use API-provided error type if available
    if (apiType && MagpieError.isValidErrorType(apiType)) {
      return apiType as MagpieErrorType;
    }

    // Map status codes to types
    if (!status) return 'api_error';
    
    switch (status) {
      case 400: return 'invalid_request_error';
      case 401: return 'authentication_error';
      case 403: return 'permission_error';
      case 404: return 'not_found_error';
      case 409: return 'idempotency_error';
      case 422: return 'validation_error';
      case 429: return 'rate_limit_error';
      case 500:
      case 502:
      case 503:
      case 504:
        return 'api_error';
      default: return 'api_error';
    }
  }

  /**
   * Map error codes to types
   */
  private static mapCodeToType(code?: string): MagpieErrorType {
    if (!code) return 'network_error';

    switch (code) {
      case 'ENOTFOUND':
      case 'ECONNREFUSED':
      case 'ECONNRESET':
      case 'EPIPE': return 'network_error';
      case 'ETIMEDOUT': return 'timeout_error';
      default: return 'network_error';
    }
  }

  /**
   * Check if a string is valid error type
   */
  private static isValidErrorType(type: string): boolean {
    const validTypes: MagpieErrorType[] = [
      'api_error',
      'authentication_error',
      'card_error',
      'idempotency_error',
      'invalid_request_error',
      'rate_limit_error',
      'validation_error',
      'permission_error',
      'network_error',
      'not_found_error',
      'timeout_error',
      'configuration_error',
    ];

    return validTypes.includes(type as MagpieErrorType);
  }

  /**
   * Converts the error to a plain object for logging or serialization.
   * 
   * @returns A plain object containing all error properties
   * 
   * @example
   * ```typescript
   * try {
   *   await magpie.charges.create(params);
   * } catch (error) {
   *   if (error instanceof MagpieError) {
   *     console.log(JSON.stringify(error.toJSON(), null, 2));
   *   }
   * }
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      code: this.code,
      statusCode: this.statusCode,
      requestId: this.requestId,
      param: this.param,
      docUrl: this.docUrl,
      declineCode: this.declineCode,
      chargeId: this.chargeId,
      headers: this.headers,
      stack: this.stack,
    };
  }

  /**
   * Determines if the error represents a temporary failure that could be retried.
   * 
   * @returns `true` if the request should be retried, `false` otherwise
   * 
   * @example
   * ```typescript
   * if (error.isRetryable()) {
   *   // Wait and retry the request
   *   await new Promise(resolve => setTimeout(resolve, 1000));
   *   return await retryRequest();
   * }
   * ```
   */
  public isRetryable(): boolean {
    return ['api_error', 'rate_limit_error', 'network_error', 'timeout_error'].includes(this.type);
  }

  /**
   * Checks if the error is related to authentication or authorization.
   * 
   * @returns `true` if this is an authentication error, `false` otherwise
   * 
   * @example
   * ```typescript
   * if (error.isAuthenticationError()) {
   *   // Prompt user to re-authenticate or check API keys
   *   redirectToLogin();
   * }
   * ```
   */
  public isAuthenticationError(): boolean {
    return this.type === 'authentication_error';
  }

  /**
   * Checks if the error is due to invalid request parameters or validation failure.
   * 
   * @returns `true` if this is a validation error, `false` otherwise
   * 
   * @example
   * ```typescript
   * if (error.isValidationError()) {
   *   console.error('Invalid parameter:', error.param);
   *   // Show user-friendly validation message
   * }
   * ```
   */
  public isValidationError(): boolean {
    return this.type === 'validation_error' || this.type === 'invalid_request_error';
  }

  /**
   * Checks if the error is due to rate limiting.
   * 
   * @returns `true` if this is a rate limit error, `false` otherwise
   * 
   * @example
   * ```typescript
   * if (error.isRateLimitError()) {
   *   // Implement exponential backoff
   *   const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
   *   await new Promise(resolve => setTimeout(resolve, delay));
   * }
   * ```
   */
  public isRateLimitError(): boolean {
    return this.type === 'rate_limit_error';
  }
}

// Export specific error classes
export { AuthenticationError } from './authentication-error';
export { ValidationError } from './validation-error';
export { NetworkError } from './network-error';
export { RateLimitError } from './rate-limit-error';
export { ConfigurationError } from './configuration-error';