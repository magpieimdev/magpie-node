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

export class MagpieError extends Error {
  public readonly type: MagpieErrorType;
  public readonly code?: string;
  public readonly statusCode?: number;
  public readonly requestId?: string;
  public readonly param?: string;
  public readonly docUrl?: string;
  public readonly declineCode?: string;
  public readonly chargeId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly headers?: Record<string, any>;

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
   * Creates a MagpieError from an API error response.
   */
  static fromAxiosError(error: ApiErrorResponse): MagpieError {
    const {response} = error;

    if (response?.data) {
      const { data, status, headers } = response;
      const errorData = data.error ?? data;
      
      // Safely access properties that might exist on either error or data
      const errorMessage = errorData?.message ?? data.message ?? `HTTP ${status ?? 'Unknown'} Error`;
      const errorType = ('type' in errorData) ? errorData.type : undefined;
      const errorCode = ('code' in errorData) ? errorData.code : `http_${status ?? 'unknown'}`;
      const param = ('param' in errorData) ? errorData.param : undefined;
      const docUrl = ('doc_url' in errorData) ? errorData.doc_url : undefined;
      const declineCode = ('decline_code' in errorData) ? errorData.decline_code : undefined;
      const chargeId = ('charge_id' in errorData) ? errorData.charge_id : undefined;

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
   * Convert error to JSON for logging
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
   * Check if error is retryable
   */
  public isRetryable(): boolean {
    return ['api_error', 'rate_limit_error', 'network_error', 'timeout_error'].includes(this.type);
  }

  /**
   * Check if error is related to authentication
   */
  public isAuthenticationError(): boolean {
    return this.type === 'authentication_error';
  }

  /**
   * Check if error is a validation error
   */
  public isValidationError(): boolean {
    return this.type === 'validation_error' || this.type === 'invalid_request_error';
  }

  /**
   * Check if error is related to rate limiting
   */
  public isRateLimitError(): boolean {
    return this.type === 'rate_limit_error';
  }
}