import { BaseClient } from "../base-client";
import {
  LastResponse,
  PaymentLink,
  PaymentLinkCreateParams,
  PaymentLinkUpdateParams,
  RequestOptions,
} from "../types";
import { BaseResource } from "./base";

/**
 * Resource class for managing payment links.
 * 
 * Payment links are shareable URLs that allow you to collect payments from
 * customers without building a custom checkout flow. They can be sent via
 * email, SMS, or shared on social media.
 * 
 * @example
 * ```typescript
 * const magpie = new Magpie('sk_test_123');
 * 
 * // Create a payment link
 * const link = await magpie.paymentLinks.create({
 *   line_items: [{
 *     amount: 50000,
 *     description: 'Consultation Fee',
 *     quantity: 1
 *   }],
 *   after_completion: {
 *     type: 'redirect',
 *     redirect: { url: 'https://example.com/thanks' }
 *   }
 * });
 * 
 * // Share the payment link
 * console.log(link.url); // https://buy.magpie.im/pl_1234567890
 * ```
 */
export class PaymentLinksResource extends BaseResource {
  /**
   * Creates a new PaymentLinksResource instance.
   * 
   * @param client - The BaseClient instance for API communication
   */
  constructor(client: BaseClient) {
    super(client, '/links', 'https://buy.magpie.im/api/v1');
  }

  /**
   * Creates a new payment link.
   * 
   * Payment links provide a hosted payment page accessible via a shareable URL.
   * No coding required - perfect for social media, email campaigns, or instant invoicing.
   * 
   * @param params - The parameters for creating the payment link
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the created payment link with response metadata
   * 
   * @example
   * ```typescript
   * const paymentLink = await magpie.paymentLinks.create({
   *   line_items: [
   *     {
   *       amount: 100000, // PHP 1,000.00
   *       description: 'Website Design Service',
   *       quantity: 1,
   *       image: 'https://example.com/service.jpg'
   *     }
   *   ],
   *   after_completion: {
   *     type: 'redirect',
   *     redirect: { url: 'https://example.com/thank-you' }
   *   },
   *   allow_promotion_codes: true,
   *   billing_address_collection: 'auto'
   * });
   * 
   * console.log(paymentLink.url); // Share this URL with customers
   * ```
   */
  async create(
    params: PaymentLinkCreateParams,
    options: RequestOptions = {},
  ): Promise<PaymentLink & { lastResponse: LastResponse }> {
    return this.createResource<PaymentLink, PaymentLinkCreateParams>(params, options);
  }

  /**
   * Retrieves an existing payment link by ID.
   * 
   * @param id - The unique identifier of the payment link
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the payment link with response metadata
   * 
   * @example
   * ```typescript
   * const link = await magpie.paymentLinks.retrieve('pl_1234567890');
   * console.log(link.active); // true or false
   * console.log(link.url); // The shareable payment URL
   * ```
   */
  async retrieve(
    id: string,
    options: RequestOptions = {},
  ): Promise<PaymentLink & { lastResponse: LastResponse }> {
    return this.retrieveResource<PaymentLink>(id, options);
  }

  /**
   * Updates an existing payment link.
   * 
   * @param id - The unique identifier of the payment link to update
   * @param params - The update parameters
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the updated payment link with response metadata
   * 
   * @example
   * ```typescript
   * const updated = await magpie.paymentLinks.update('pl_1234567890', {
   *   active: false, // Deactivate the payment link
   *   metadata: { campaign: 'holiday-sale' }
   * });
   * ```
   */
  async update(
    id: string,
    params: PaymentLinkUpdateParams,
    options: RequestOptions = {},
  ): Promise<PaymentLink & { lastResponse: LastResponse }> {
    return this.updateResource<PaymentLink, PaymentLinkUpdateParams>(id, params, options);
  }

  /**
   * Activates a payment link, making it available for payments.
   * 
   * @param id - The unique identifier of the payment link to activate
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the activated payment link with response metadata
   * 
   * @example
   * ```typescript
   * const activated = await magpie.paymentLinks.activate('pl_1234567890');
   * console.log(activated.active); // true
   * ```
   */
  async activate(
    id: string,
    options: RequestOptions = {},
  ): Promise<PaymentLink & { lastResponse: LastResponse }> {
    return this.customResourceAction<PaymentLink>('POST', `${this.buildPath(id)}/activate`, undefined, options);
  }

  /**
   * Deactivates a payment link, preventing new payments.
   * 
   * Once deactivated, customers will no longer be able to complete
   * payments through this payment link.
   * 
   * @param id - The unique identifier of the payment link to deactivate
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the deactivated payment link with response metadata
   * 
   * @example
   * ```typescript
   * const deactivated = await magpie.paymentLinks.deactivate('pl_1234567890');
   * console.log(deactivated.active); // false
   * ```
   */
  async deactivate(
    id: string,
    options: RequestOptions = {},
  ): Promise<PaymentLink & { lastResponse: LastResponse }> {
    return this.customResourceAction<PaymentLink>('POST', `${this.buildPath(id)}/deactivate`, undefined, options);
  }
}