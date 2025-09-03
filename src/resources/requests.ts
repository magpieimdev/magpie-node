import { BaseClient } from "../base-client";
import {
  LastResponse,
  PaymentRequest,
  PaymentRequestCreateParams,
  PaymentRequestVoidParams,
  RequestOptions,
} from "../types";
import { BaseResource } from "./base";

/**
 * Resource class for managing payment requests.
 * 
 * Payment requests allow you to request payments from customers via email
 * or SMS. They provide a convenient way to collect payments without requiring
 * customers to visit your website or app.
 * 
 * @example
 * ```typescript
 * const magpie = new Magpie('sk_test_123');
 * 
 * // Create a payment request
 * const request = await magpie.paymentRequests.create({
 *   amount: 75000,
 *   currency: 'php',
 *   description: 'Invoice #INV-001',
 *   recipient: {
 *     name: 'John Doe',
 *     email: 'john@example.com',
 *     phone: '+639151234567'
 *   },
 *   send_email: true,
 *   send_sms: false
 * });
 * 
 * console.log(request.status); // 'pending'
 * console.log(request.url); // Customer payment URL
 * ```
 */
export class PaymentRequestsResource extends BaseResource {
   /**
    * Creates a new PaymentRequestsResource instance.
    * 
    * @param client - The BaseClient instance for API communication
    */
   constructor(client: BaseClient) {
    super(client, '/requests', 'https://request.magpie.im/api/v1');
  }

  /**
   * Creates a new payment request.
   * 
   * Sends a payment request to a customer via email, SMS, or both.
   * The customer receives a link to a secure payment page where they
   * can complete the payment.
   * 
   * @param params - The parameters for creating the payment request
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the created payment request with response metadata
   * 
   * @example
   * ```typescript
   * const request = await magpie.paymentRequests.create({
   *   amount: 50000, // PHP 500.00
   *   currency: 'php',
   *   description: 'Monthly Subscription Payment',
   *   recipient: {
   *     name: 'Jane Smith',
   *     email: 'jane@example.com',
   *     phone: '+639151234567'
   *   },
   *   send_email: true,
   *   send_sms: true,
   *   due_date: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 days from now
   * });
   * 
   * console.log(request.id); // 'pr_1234567890'
   * console.log(request.status); // 'pending'
   * ```
   */
  async create(
    params: PaymentRequestCreateParams,
    options: RequestOptions = {},
  ): Promise<PaymentRequest & { lastResponse: LastResponse }> {
    return this.createResource<PaymentRequest, PaymentRequestCreateParams>(params, options);
  }

  /**
   * Retrieves an existing payment request by ID.
   * 
   * @param id - The unique identifier of the payment request
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the payment request with response metadata
   * 
   * @example
   * ```typescript
   * const request = await magpie.paymentRequests.retrieve('pr_1234567890');
   * console.log(request.status); // 'pending', 'paid', 'canceled', 'expired'
   * console.log(request.url); // Payment URL for the customer
   * ```
   */
  async retrieve(
    id: string,
    options: RequestOptions = {},
  ): Promise<PaymentRequest & { lastResponse: LastResponse }> {
    return this.retrieveResource<PaymentRequest>(id, options);
  }

  /**
   * Resends a payment request to the customer.
   * 
   * Sends the payment request notification again via the originally
   * configured channels (email, SMS, or both).
   * 
   * @param id - The unique identifier of the payment request to resend
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the payment request with response metadata
   * 
   * @example
   * ```typescript
   * const request = await magpie.paymentRequests.resend('pr_1234567890');
   * console.log('Payment request resent successfully');
   * ```
   */
  async resend(
    id: string,
    options: RequestOptions = {},
  ): Promise<PaymentRequest & { lastResponse: LastResponse }> {
    return this.customResourceAction<PaymentRequest>('POST', `${this.buildPath(id)}/resend`, undefined, options);
  }

  /**
   * Voids a payment request, canceling it and preventing payment.
   * 
   * Once voided, the customer will no longer be able to pay the request,
   * and any payment attempts will be rejected.
   * 
   * @param id - The unique identifier of the payment request to void
   * @param params - The void parameters (reason, etc.)
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the voided payment request with response metadata
   * 
   * @example
   * ```typescript
   * const voided = await magpie.paymentRequests.void('pr_1234567890', {
   *   reason: 'duplicate_request'
   * });
   * 
   * console.log(voided.status); // 'canceled'
   * ```
   */
  async void(
    id: string,
    params: PaymentRequestVoidParams,
    options: RequestOptions = {},
  ): Promise<PaymentRequest & { lastResponse: LastResponse }> {
    return this.customResourceAction<PaymentRequest>('POST', `${this.buildPath(id)}/void`, params, options);
  }
}
