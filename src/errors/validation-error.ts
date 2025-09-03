import { MagpieError } from "./index";

/**
 * Error thrown when request validation fails.
 * 
 * This error occurs when the API request contains invalid parameters,
 * missing required fields, or data that doesn't meet validation rules
 * (e.g., invalid email format, negative amounts, etc.).
 * 
 * @example
 * ```typescript
 * try {
 *   await magpie.charges.create({
 *     amount: -100, // Invalid: negative amount
 *     currency: 'invalid', // Invalid: unsupported currency
 *     source: '', // Invalid: empty source
 *     description: 'Test charge'
 *   });
 * } catch (error) {
 *   if (error instanceof ValidationError) {
 *     console.error('Validation error:', error.message);
 *     console.error('Invalid parameter:', error.param); // 'amount'
 *     
 *     // Show user-friendly error messages
 *     if (error.param === 'amount') {
 *       showError('Please enter a valid amount greater than zero.');
 *     }
 *   }
 * }
 * ```
 */
export class ValidationError extends MagpieError {
  /**
   * Creates a new ValidationError instance.
   * 
   * @param message - Human-readable error message describing what validation failed
   * @param param - Optional name of the parameter that failed validation
   * @param requestId - Optional request ID for debugging
   * 
   * @example
   * ```typescript
   * throw new ValidationError(
   *   'Amount must be a positive integer',
   *   'amount',
   *   'req_1234567890'
   * );
   * ```
   */
  constructor(message: string, param?: string, requestId?: string) {
    super({
      message,
      type: 'validation_error',
      code: 'validation_failed',
      statusCode: 422,
      param,
      requestId,
    });
  }
}