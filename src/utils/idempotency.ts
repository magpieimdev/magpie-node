import { randomBytes } from 'crypto';

/**
 * Utility class for generating and validating idempotency keys.
 * 
 * Idempotency keys are used to safely retry API requests without causing
 * duplicate operations. They ensure that if a request is retried with the
 * same idempotency key, it will have the same effect as if it was only
 * sent once.
 * 
 * @example
 * ```typescript
 * import { IdempotencyKey } from 'magpie-node/utils';
 * 
 * // Generate a new idempotency key
 * const key = IdempotencyKey.generate();
 * console.log(key); // '7f9c3d2e1a5b4c6d8e0f1a2b3c4d5e6f'
 * 
 * // Use it in a request
 * const charge = await magpie.charges.create({
 *   amount: 5000,
 *   currency: 'php',
 *   source: 'src_123',
 *   description: 'Order payment'
 * }, {
 *   idempotencyKey: key
 * });
 * 
 * // Validate an idempotency key
 * const isValid = IdempotencyKey.isValid('my-custom-key-123');
 * ```
 */
export class IdempotencyKey {
  /**
   * Generates a cryptographically secure random idempotency key.
   * 
   * Uses Node.js crypto.randomBytes to generate a 32-character hexadecimal
   * string that can be used as an idempotency key for API requests.
   * 
   * @returns A randomly generated 32-character hexadecimal string
   * 
   * @example
   * ```typescript
   * const key1 = IdempotencyKey.generate();
   * const key2 = IdempotencyKey.generate();
   * 
   * console.log(key1); // '7f9c3d2e1a5b4c6d8e0f1a2b3c4d5e6f'
   * console.log(key2); // 'a1b2c3d4e5f6789012345678901abcde'
   * console.log(key1 !== key2); // true - always unique
   * ```
   */
  static generate(): string {
    return randomBytes(16).toString('hex');
  }

  /**
   * Validates whether a string is a valid idempotency key.
   * 
   * Idempotency keys must be strings between 1 and 255 characters long.
   * This matches the Magpie API's requirements for idempotency keys.
   * 
   * @param key - The string to validate as an idempotency key
   * @returns `true` if the key is valid, `false` otherwise
   * 
   * @example
   * ```typescript
   * console.log(IdempotencyKey.isValid('valid-key-123')); // true
   * console.log(IdempotencyKey.isValid('')); // false - too short
   * console.log(IdempotencyKey.isValid('a'.repeat(256))); // false - too long
   * console.log(IdempotencyKey.isValid(null)); // false - not a string
   * 
   * // Use for validation before making requests
   * const userKey = getUserProvidedKey();
   * if (IdempotencyKey.isValid(userKey)) {
   *   await magpie.charges.create(params, { idempotencyKey: userKey });
   * } else {
   *   throw new Error('Invalid idempotency key provided');
   * }
   * ```
   */
  static isValid(key: string): boolean {
    return typeof key === 'string' && key.length >= 1 && key.length <= 255;
  }
}