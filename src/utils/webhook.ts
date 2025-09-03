import crypto from 'crypto';
import { MagpieError } from '../errors';
import { WebhookEvent, WebhookSignature, WebhookSignatureConfig } from '../types/webhook';

/**
 * Webhook utility class for verifying and parsing webhook events
 */
export class WebhookUtils {
  private static readonly DEFAULT_CONFIG: Required<WebhookSignatureConfig> = {
    algorithm: 'sha256',
    signatureHeader: 'x-magpie-signature',
    timestampHeader: 'x-magpie-timestamp',
    tolerance: 300, // 5 minutes
    prefix: 'v1=',
  };

  /**
   * Verifies a webhook signature using timing-safe comparison
   * 
   * @param payload - Raw webhook payload (string or Buffer)
   * @param signature - Signature from webhook headers
   * @param secret - Webhook endpoint secret
   * @param config - Optional configuration overrides
   * @returns True if signature is valid
   * 
   * @example
   * ```typescript
   * const isValid = WebhookUtils.verifySignature(
   *   payload,
   *   headers['x-magpie-signature'],
   *   'whsec_...',
   *   { tolerance: 600 }
   * );
   * ```
   */
  public static verifySignature(
    payload: string | Buffer,
    signature: string,
    secret: string,
    config: WebhookSignatureConfig = {}
  ): boolean {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };

    try {
      const parsedSignature = this.parseSignature(signature, finalConfig.prefix);
      const expectedSignature = this.generateSignature(payload, secret, finalConfig.algorithm);
      
      return this.timingSafeEqual(parsedSignature.signature, expectedSignature);
    } catch {
      return false;
    }
  }

  /**
   * Verifies webhook signature with timestamp validation
   * 
   * @param payload - Raw webhook payload
   * @param headers - Request headers object
   * @param secret - Webhook endpoint secret
   * @param config - Optional configuration
   * @returns True if both signature and timestamp are valid
   */
  public static verifySignatureWithTimestamp(
    payload: string | Buffer,
    headers: Record<string, string | string[]>,
    secret: string,
    config: WebhookSignatureConfig = {}
  ): boolean {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
    
    const signature = this.getHeader(headers, finalConfig.signatureHeader);
    const timestamp = this.getHeader(headers, finalConfig.timestampHeader);

    if (!signature) {
      throw new MagpieError({
        message: `Missing signature header: ${finalConfig.signatureHeader}`,
        type: 'invalid_request_error',
        code: 'webhook_signature_missing'
      });
    }

    // Verify timestamp if provided
    if (timestamp && !this.isValidTimestamp(parseInt(timestamp), finalConfig.tolerance)) {
      throw new MagpieError({
        message: 'Webhook timestamp is outside tolerance window',
        type: 'invalid_request_error',
        code: 'webhook_timestamp_invalid'
      });
    }

    return this.verifySignature(payload, signature, secret, config);
  }

  /**
   * Constructs a webhook event from verified payload
   * 
   * @param payload - Raw webhook payload  
   * @param signature - Signature from headers
   * @param secret - Webhook secret
   * @param config - Optional configuration
   * @returns Parsed webhook event
   * 
   * @example
   * ```typescript
   * const event = WebhookUtils.constructEvent(
   *   req.body,
   *   req.headers['x-magpie-signature'],
   *   process.env.MAGPIE_WEBHOOK_SECRET
   * );
   * 
   * if (event.type === 'payment.completed') {
   *   // Handle payment completion
   * }
   * ```
   */
  public static constructEvent<T = unknown>(
    payload: string | Buffer,
    signature: string,
    secret: string,
    config: WebhookSignatureConfig = {}
  ): WebhookEvent<T> {
    if (!this.verifySignature(payload, signature, secret, config)) {
      throw new MagpieError({
        message: 'Invalid webhook signature',
        type: 'invalid_request_error',
        code: 'webhook_signature_invalid'
      });
    }

    try {
      const payloadString = Buffer.isBuffer(payload) ? payload.toString('utf8') : payload;
      return JSON.parse(payloadString) as WebhookEvent<T>;
    } catch {
      throw new MagpieError({
        message: 'Invalid JSON in webhook payload',
        type: 'invalid_request_error',
        code: 'webhook_payload_invalid'
      });
    }
  }

  /**
   * Generates a webhook signature for testing purposes
   * 
   * @param payload - Payload to sign
   * @param secret - Webhook secret
   * @param algorithm - Hashing algorithm
   * @returns Generated signature with prefix
   */
  public static generateTestSignature(
    payload: string | Buffer,
    secret: string,
    algorithm: 'sha256' | 'sha1' | 'sha512' = 'sha256',
    prefix = 'v1='
  ): string {
    const signature = this.generateSignature(payload, secret, algorithm);
    return `${prefix}${signature}`;
  }

  /**
   * Checks if a timestamp is within the tolerance window
   * 
   * @param timestamp - Unix timestamp to check
   * @param tolerance - Tolerance in seconds
   * @returns True if timestamp is valid
   */
  public static isValidTimestamp(timestamp: number, tolerance: number = 300): boolean {
    const now = Math.floor(Date.now() / 1000);
    return Math.abs(now - timestamp) <= tolerance;
  }

  /**
   * Generates HMAC signature for payload
   */
  private static generateSignature(
    payload: string | Buffer,
    secret: string,
    algorithm: string
  ): string {
    return crypto
      .createHmac(algorithm, secret)
      .update(payload)
      .digest('hex');
  }

  /**
   * Parses signature header value
   */
  private static parseSignature(signature: string, prefix: string): WebhookSignature {
    if (!signature.startsWith(prefix)) {
      throw new Error(`Invalid signature format. Expected prefix: ${prefix}`);
    }

    return {
      version: prefix.replace('=', ''),
      signature: signature.slice(prefix.length)
    };
  }

  /**
   * Timing-safe string comparison to prevent timing attacks
   */
  private static timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    const bufferA = Buffer.from(a, 'hex');
    const bufferB = Buffer.from(b, 'hex');

    return crypto.timingSafeEqual(bufferA, bufferB);
  }

  /**
   * Gets header value handling both string and array cases
   */
  private static getHeader(headers: Record<string, string | string[]>, name: string): string | undefined {
    const value = headers[name] ?? headers[name.toLowerCase()];
    return Array.isArray(value) ? value[0] : value;
  }
}