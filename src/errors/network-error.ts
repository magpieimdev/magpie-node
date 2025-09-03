import { MagpieError } from "./index";

/**
 * Error thrown when network connectivity issues occur.
 * 
 * This error occurs when the SDK cannot establish a connection to the
 * Magpie API due to network problems, DNS resolution failures, or
 * connection timeouts.
 * 
 * @example
 * ```typescript
 * try {
 *   const customer = await magpie.customers.create(params);
 * } catch (error) {
 *   if (error instanceof NetworkError) {
 *     console.error('Network error:', error.message);
 *     // Implement retry logic or show offline message
 *     if (error.code === 'ENOTFOUND') {
 *       console.error('DNS resolution failed. Check your internet connection.');
 *     }
 *   }
 * }
 * ```
 */
export class NetworkError extends MagpieError {
  /**
   * Creates a new NetworkError instance.
   * 
   * @param message - Human-readable error message describing the network issue
   * @param code - Optional error code (e.g., 'ENOTFOUND', 'ECONNREFUSED', 'ETIMEDOUT')
   * 
   * @example
   * ```typescript
   * throw new NetworkError(
   *   'Connection refused by server',
   *   'ECONNREFUSED'
   * );
   * ```
   */
  constructor(message: string, code?: string) {
    super({
      message,
      type: 'network_error',
      code: code ?? 'network_error',
    });
  }
}