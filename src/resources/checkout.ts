import { BaseClient } from "../base-client";
import { CheckoutSessionsResource } from "./sessions";

/**
 * Resource class for managing checkout-related operations.
 * 
 * The CheckoutResource provides access to checkout sessions and related
 * functionality for creating hosted payment pages and handling customer
 * checkout flows.
 * 
 * @example
 * ```typescript
 * const magpie = new Magpie('sk_test_123');
 * 
 * // Create a checkout session
 * const session = await magpie.checkout.sessions.create({
 *   line_items: [{
 *     amount: 20000,
 *     description: 'Premium Service',
 *     quantity: 1
 *   }],
 *   success_url: 'https://example.com/success',
 *   cancel_url: 'https://example.com/cancel'
 * });
 * ```
 */
export class CheckoutResource {
  /** Resource for managing checkout sessions */
  public sessions: CheckoutSessionsResource;

  /**
   * Creates a new CheckoutResource instance.
   * 
   * @param client - The BaseClient instance for API communication
   */
  constructor(client: BaseClient) {
    this.sessions = new CheckoutSessionsResource(client);
  }
}