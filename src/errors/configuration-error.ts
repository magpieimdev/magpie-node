import { MagpieError } from "./index";

/**
 * Error thrown when there's an issue with SDK configuration.
 * 
 * This error occurs when the SDK is misconfigured, such as missing
 * required configuration options or invalid configuration values.
 * 
 * @example
 * ```typescript
 * try {
 *   // Invalid configuration
 *   const magpie = new Magpie('', { timeout: -1000 });
 * } catch (error) {
 *   if (error instanceof ConfigurationError) {
 *     console.error('Configuration error:', error.message);
 *     // Fix configuration and retry
 *   }
 * }
 * ```
 */
export class ConfigurationError extends MagpieError {
  /**
   * Creates a new ConfigurationError instance.
   * 
   * @param message - Human-readable error message describing the configuration issue
   * 
   * @example
   * ```typescript
   * throw new ConfigurationError(
   *   'Invalid timeout value. Must be a positive number.'
   * );
   * ```
   */
  constructor(message: string) {
    super({
      message,
      type: 'configuration_error',
      code: 'configuration_error',
    });
  }
}