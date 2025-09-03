import { MagpieError } from "./index";

/**
 * Error thrown when API authentication fails.
 * 
 * This error occurs when the provided API key is invalid, missing,
 * or lacks the necessary permissions for the requested operation.
 * 
 * @example
 * ```typescript
 * try {
 *   const customer = await magpie.customers.create(params);
 * } catch (error) {
 *   if (error instanceof AuthenticationError) {
 *     console.error('Authentication failed. Check your API key.');
 *     // Redirect to API key configuration or login
 *   }
 * }
 * ```
 */
export class AuthenticationError extends MagpieError {
  /**
   * Creates a new AuthenticationError instance.
   * 
   * @param message - Human-readable error message
   * @param requestId - Optional request ID for debugging
   * 
   * @example
   * ```typescript
   * throw new AuthenticationError(
   *   'Invalid API key provided',
   *   'req_1234567890'
   * );
   * ```
   */
  constructor(message: string, requestId?: string) {
    super({
      message,
      type: 'authentication_error',
      code: 'authentication_failed',
      statusCode: 401,
      requestId,
    });
  }
}