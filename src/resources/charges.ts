import { BaseClient } from "../base-client";
import {
  Charge,
  ChargeCaptureParams,
  ChargeCreateParams,
  LastResponse,
  RefundCreateParams,
  RequestOptions,
} from "../types";
import { BaseResource } from "./base";

/**
 * Resource class for managing charges and payments.
 * 
 * The ChargesResource provides methods to create, retrieve, and manipulate charges
 * in the Magpie payment system. This includes creating new charges, capturing
 * authorized payments, voiding authorizations, and processing refunds.
 * 
 * @example
 * ```typescript
 * const magpie = new Magpie('sk_test_123');
 * 
 * // Create a charge
 * const charge = await magpie.charges.create({
 *   amount: 20000,
 *   currency: 'php',
 *   source: 'src_123',
 *   description: 'Payment for order #1234'
 * });
 * 
 * // Capture an authorized charge
 * const captured = await magpie.charges.capture(charge.id, {
 *   amount: 20000
 * });
 * ```
 */
export class ChargesResource extends BaseResource {
  /**
   * Creates a new ChargesResource instance.
   * 
   * @param client - The BaseClient instance for API communication
   */
  constructor(client: BaseClient) {
    super(client, '/charges/');
  }

  /**
   * Creates a new charge.
   * 
   * A charge represents a request to transfer money from a customer to your account.
   * You can create charges directly or authorize them first for later capture.
   * 
   * @param params - The parameters for creating the charge
   * @param options - Additional request options (e.g., idempotency key)
   * 
   * @returns Promise that resolves to the created charge with response metadata
   * 
   * @example
   * ```typescript
   * const charge = await magpie.charges.create({
   *   amount: 20000, // 200.00 in cents
   *   currency: 'php',
   *   source: 'src_1234567890',
   *   description: 'Payment for order #1001',
   *   capture: true // Capture immediately
   * });
   * 
   * console.log(charge.id); // 'ch_1234567890'
   * console.log(charge.status); // 'succeeded'
   * ```
   */
  async create(
    params: ChargeCreateParams,
    options: RequestOptions = {},
  ): Promise<Charge & { lastResponse: LastResponse }> {
    return this.createResource<Charge, ChargeCreateParams>(params, options);
  }

  /**
   * Retrieves an existing charge by its ID.
   * 
   * @param id - The unique identifier of the charge to retrieve
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the charge with response metadata
   * 
   * @example
   * ```typescript
   * const charge = await magpie.charges.retrieve('ch_1234567890');
   * console.log(charge.amount); // 2000
   * console.log(charge.status); // 'succeeded'
   * ```
   */
  async retrieve(
    id: string,
    options: RequestOptions = {},
  ): Promise<Charge & { lastResponse: LastResponse }> {
    return this.retrieveResource<Charge>(id, options);
  }

  /**
   * Captures a previously authorized charge.
   * 
   * When you create a charge with `capture: false`, it will be authorized but not
   * captured. Use this method to capture the authorized amount (or a portion of it).
   * 
   * @param id - The unique identifier of the charge to capture
   * @param params - The capture parameters (amount, etc.)
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the updated charge with response metadata
   * 
   * @example
   * ```typescript
   * // Create an authorized but uncaptured charge
   * const charge = await magpie.charges.create({
   *   amount: 20000,
   *   currency: 'php',
   *   source: 'src_123',
   *   capture: false // Only authorize, don't capture
   * });
   * 
   * // Later, capture the full amount
   * const captured = await magpie.charges.capture(charge.id, {
   *   amount: 20000
   * });
   * 
   * // Or capture a partial amount
   * const partialCapture = await magpie.charges.capture(charge.id, {
   *   amount: 15000 // Capture 150.00 instead of 200.00
   * });
   * ```
   */
  async capture(
    id: string,
    params: ChargeCaptureParams,
    options: RequestOptions = {},
  ): Promise<Charge & { lastResponse: LastResponse }> {
    return this.customResourceAction<Charge>('POST', `${this.buildPath(id)}/capture`, params, options);
  }


  /**
   * Voids a charge, canceling it before it can be captured.
   * 
   * This method can only be used on charges that have been authorized but not yet
   * captured. Once voided, the authorization is released and cannot be captured.
   * 
   * @param id - The unique identifier of the charge to void
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the voided charge with response metadata
   * 
   * @example
   * ```typescript
   * // Create an authorized charge
   * const charge = await magpie.charges.create({
   *   amount: 20000,
   *   currency: 'php',
   *   source: 'src_123',
   *   capture: false
   * });
   * 
   * // Later, void the authorization instead of capturing
   * const voided = await magpie.charges.void(charge.id);
   * console.log(voided.status); // 'canceled'
   * ```
   */
  async void(
    id: string,
    options: RequestOptions = {},
  ): Promise<Charge & { lastResponse: LastResponse }> {
    return this.customResourceAction<Charge>('POST', `${this.buildPath(id)}/void`, undefined, options);
  }

  /**
   * Creates a refund for a charge.
   * 
   * Refunds can be created for the full charge amount or a partial amount.
   * The refund will be processed back to the original payment method.
   * 
   * @param id - The unique identifier of the charge to refund
   * @param params - The refund parameters (amount, reason, etc.)
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the updated charge with response metadata
   * 
   * @example
   * ```typescript
   * // Full refund
   * const refunded = await magpie.charges.refund('ch_1234567890', {
   *   reason: 'requested_by_customer'
   * });
   * 
   * // Partial refund
   * const partialRefund = await magpie.charges.refund('ch_1234567890', {
   *   amount: 10000, // Refund 100.00 out of 200.00 charge
   *   reason: 'duplicate'
   * });
   * ```
   */
  async refund(
    id: string,
    params: RefundCreateParams,
    options: RequestOptions = {},
  ): Promise<Charge & { lastResponse: LastResponse }> {
    return this.customResourceAction<Charge>('POST', `${this.buildPath(id)}/refund`, params, options);
  }
}