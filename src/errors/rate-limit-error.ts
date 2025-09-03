import { MagpieError } from "./index";

/**
 * Error thrown when API rate limits are exceeded.
 * 
 * This error occurs when you've made too many requests to the Magpie API
 * in a short period. The API enforces rate limits to ensure fair usage
 * and maintain service quality for all users.
 * 
 * @example
 * ```typescript
 * try {
 *   // Making too many rapid requests
 *   const promises = Array.from({ length: 100 }, (_, i) => 
 *     magpie.customers.retrieve(`cus_${i}`)
 *   );
 *   await Promise.all(promises);
 * } catch (error) {
 *   if (error instanceof RateLimitError) {
 *     console.error('Rate limit exceeded:', error.message);
 *     // Implement exponential backoff
 *     const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
 *     setTimeout(() => retryRequest(), delay);
 *   }
 * }
 * ```
 */
export class RateLimitError extends MagpieError {
  /**
   * Creates a new RateLimitError instance.
   * 
   * @param message - Human-readable error message (defaults to 'Too many requests')
   * @param requestId - Optional request ID for debugging
   * 
   * @example
   * ```typescript
   * throw new RateLimitError(
   *   'Rate limit exceeded. Try again in 60 seconds.',
   *   'req_1234567890'
   * );
   * ```
   */
  constructor(message: string = 'Too many requests', requestId?: string) {
    super({
      message,
      type: 'rate_limit_error',
      code: 'rate_limit_exceeded',
      statusCode: 429,
      requestId,
    });
  }
}
  