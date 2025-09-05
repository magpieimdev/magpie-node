import { BaseClient } from "../base-client";
import {
  CheckoutSession,
  CheckoutSessionCaptureParams,
  CheckoutSessionCreateParams,
  LastResponse,
  RequestOptions,
} from "../types";
import { BaseResource } from "./base";

/**
 * Resource class for managing checkout sessions.
 * 
 * Checkout sessions provide a hosted payment page where customers can
 * securely enter their payment information. Sessions can be configured
 * with line items, branding, and redirect URLs for success/cancel scenarios.
 * 
 * @example
 * ```typescript
 * const magpie = new Magpie('sk_test_123');
 * 
 * // Create a checkout session
 * const session = await magpie.checkout.sessions.create({
 *   line_items: [{
 *     amount: 50000,
 *     description: 'Premium Plan Subscription',
 *     quantity: 1,
 *     image: 'https://example.com/product.jpg'
 *   }],
 *   success_url: 'https://example.com/success',
 *   cancel_url: 'https://example.com/cancel',
 *   customer_email: 'customer@example.com'
 * });
 * 
 * // Redirect customer to session.url for payment
 * console.log(session.url);
 * ```
 */
export class CheckoutSessionsResource extends BaseResource {
  /**
   * Creates a new CheckoutSessionsResource instance.
   * 
   * @param client - The BaseClient instance for API communication
   */
  constructor(client: BaseClient) {
    // Use different base URL for checkout sessions
    super(client, '/', 'https://new.pay.magpie.im');
  }

  /**
   * Creates a new checkout session.
   * 
   * Creates a hosted payment page where customers can securely complete their
   * purchase. The session includes line items, payment options, and redirect URLs.
   * 
   * @param params - The parameters for creating the checkout session
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the created checkout session with response metadata
   * 
   * @example
   * ```typescript
   * const session = await magpie.checkout.sessions.create({
   *   line_items: [
   *     {
   *       amount: 25000, // PHP 250.00
   *       description: 'Pro Plan Monthly',
   *       quantity: 1
   *     }
   *   ],
   *   success_url: 'https://example.com/success',
   *   cancel_url: 'https://example.com/cancel',
   *   customer_email: 'customer@example.com',
   *   expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
   * });
   * 
   * // Redirect customer to the checkout page
   * window.location.href = session.url;
   * ```
   */
  async create(
    params: CheckoutSessionCreateParams,
    options: RequestOptions = {},
  ): Promise<CheckoutSession & { lastResponse: LastResponse }> {
    return this.createResource<CheckoutSession, CheckoutSessionCreateParams>(params, options);
  }

  /**
   * Retrieves an existing checkout session by ID.
   * 
   * @param id - The unique identifier of the checkout session
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the checkout session with response metadata
   * 
   * @example
   * ```typescript
   * const session = await magpie.checkout.sessions.retrieve('cs_1234567890');
   * console.log(session.payment_status); // 'paid', 'unpaid', 'no_payment_required'
   * console.log(session.url); // Checkout page URL
   * ```
   */
  async retrieve(
    id: string,
    options: RequestOptions = {},
  ): Promise<CheckoutSession & { lastResponse: LastResponse }> {
    return this.retrieveResource<CheckoutSession>(id, options);
  }

  /**
   * Captures payment for a checkout session.
   * 
   * For sessions created with authorization-only payment methods,
   * this captures the authorized amount (or a portion of it).
   * 
   * @param id - The unique identifier of the checkout session
   * @param params - The capture parameters
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the updated checkout session with response metadata
   * 
   * @example
   * ```typescript
   * const captured = await magpie.checkout.sessions.capture('cs_1234567890', {
   *   amount: 20000 // Capture PHP 200.00
   * });
   * ```
   */
  async capture(
    id: string,
    params: CheckoutSessionCaptureParams,
    options: RequestOptions = {},
  ): Promise<CheckoutSession & { lastResponse: LastResponse }> {
    return this.customResourceAction<CheckoutSession>('POST', `${this.buildPath(id)}/capture`, params, options);
  }

  /**
   * Expires a checkout session, making it no longer usable.
   * 
   * Once expired, customers will no longer be able to complete
   * payment through the checkout session URL.
   * 
   * @param id - The unique identifier of the checkout session to expire
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the expired checkout session with response metadata
   * 
   * @example
   * ```typescript
   * const expired = await magpie.checkout.sessions.expire('cs_1234567890');
   * console.log(expired.status); // 'expired'
   * ```
   */
  async expire(
    id: string,
    options: RequestOptions = {},
  ): Promise<CheckoutSession & { lastResponse: LastResponse }> {
    return this.customResourceAction<CheckoutSession>('POST', `${this.buildPath(id)}/expire`, undefined, options);
  }
}