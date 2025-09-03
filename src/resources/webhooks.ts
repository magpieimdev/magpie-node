import { WebhookEvent, WebhookSignatureConfig } from "../types/webhook";
import { WebhookUtils } from "../utils/webhook";

/**
 * Webhooks resource for verifying and handling webhook events
 * 
 * @example
 * ```typescript
 * // In your webhook endpoint handler
 * app.post('/webhook', (req, res) => {
 *   try {
 *     const event = magpie.webhooks.constructEvent(
 *       req.body,
 *       req.headers['x-magpie-signature'],
 *       process.env.MAGPIE_WEBHOOK_SECRET
 *     );
 * 
 *     switch (event.type) {
 *       case 'payment.completed':
 *         // Handle successful payment
 *         break;
 *       case 'payment.failed':
 *         // Handle failed payment
 *         break;
 *       default:
 *         console.log(`Unhandled event type: ${event.type}`);
 *     }
 * 
 *     res.status(200).send('OK');
 *   } catch (error) {
 *     console.error('Webhook error:', error);
 *     res.status(400).send('Invalid webhook');
 *   }
 * });
 * ```
 */
export class WebhooksResource {
  /**
   * Verifies a webhook signature
   * 
   * @param payload - Raw webhook payload (as received from Magpie)
   * @param signature - Signature header value
   * @param secret - Your webhook endpoint secret
   * @param config - Optional configuration for signature verification
   * @returns True if the signature is valid
   */
  public verifySignature(
    payload: string | Buffer,
    signature: string,
    secret: string,
    config?: WebhookSignatureConfig
  ): boolean {
    return WebhookUtils.verifySignature(payload, signature, secret, config);
  }

  /**
   * Verifies webhook signature with timestamp validation
   * 
   * @param payload - Raw webhook payload
   * @param headers - Request headers object
   * @param secret - Your webhook endpoint secret  
   * @param config - Optional configuration
   * @returns True if both signature and timestamp are valid
   * @throws {MagpieError} When signature or timestamp validation fails
   */
  public verifySignatureWithTimestamp(
    payload: string | Buffer,
    headers: Record<string, string | string[]>,
    secret: string,
    config?: WebhookSignatureConfig
  ): boolean {
    return WebhookUtils.verifySignatureWithTimestamp(payload, headers, secret, config);
  }

  /**
   * Constructs a webhook event from a verified payload
   * 
   * @param payload - Raw webhook payload
   * @param signature - Signature header value
   * @param secret - Your webhook endpoint secret
   * @param config - Optional configuration
   * @returns Parsed and verified webhook event
   * @throws {MagpieError} When signature verification or JSON parsing fails
   * 
   * @example
   * ```typescript
   * const event = magpie.webhooks.constructEvent(
   *   request.body,
   *   request.headers['x-magpie-signature'],
   *   'whsec_your_secret_here'
   * );
   * 
   * console.log(`Received ${event.type} event for ${event.data.object.id}`);
   * ```
   */
  public constructEvent<T = unknown>(
    payload: string | Buffer,
    signature: string,
    secret: string,
    config?: WebhookSignatureConfig
  ): WebhookEvent<T> {
    return WebhookUtils.constructEvent<T>(payload, signature, secret, config);
  }

  /**
   * Generates a test webhook signature (for testing purposes)
   * 
   * @param payload - Payload to generate signature for
   * @param secret - Webhook secret
   * @param algorithm - Hashing algorithm (default: 'sha256')
   * @param prefix - Signature prefix (default: 'v1=')
   * @returns Generated signature string
   * 
   * @example
   * ```typescript
   * // For testing your webhook handler
   * const testPayload = JSON.stringify({ type: 'test.event', data: { object: {} } });
   * const testSignature = magpie.webhooks.generateTestSignature(
   *   testPayload,
   *   'your_test_secret'
   * );
   * 
   * // Use in your test HTTP request
   * fetch('/webhook', {
   *   method: 'POST',
   *   headers: { 'x-magpie-signature': testSignature },
   *   body: testPayload
   * });
   * ```
   */
  public generateTestSignature(
    payload: string | Buffer,
    secret: string,
    algorithm?: 'sha256' | 'sha1' | 'sha512',
    prefix?: string
  ): string {
    return WebhookUtils.generateTestSignature(payload, secret, algorithm, prefix);
  }

  /**
   * Validates if a timestamp is within acceptable tolerance
   * 
   * @param timestamp - Unix timestamp to validate
   * @param tolerance - Maximum age in seconds (default: 300 = 5 minutes)
   * @returns True if timestamp is valid
   */
  public isValidTimestamp(timestamp: number, tolerance?: number): boolean {
    return WebhookUtils.isValidTimestamp(timestamp, tolerance);
  }
}