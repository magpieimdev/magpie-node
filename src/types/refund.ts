
/**
 * Status of a refund indicating its current processing state.
 * 
 * - `pending`: Refund is being processed
 * - `succeeded`: Refund has been successfully completed
 * - `failed`: Refund processing failed
 */
export type RefundStatus = 'pending' | 'succeeded' | 'failed';

/**
 * Parameters for creating a refund.
 * 
 * Refunds can be created for the full charge amount or a partial amount.
 * The refund will be processed back to the original payment method.
 */
export interface RefundCreateParams {
  /** The amount to refund in the smallest currency unit (e.g., cents). */
  amount: number;

  /** The reason for the refund. */
  reason: string;
}

/**
 * A refund represents the return of funds to a customer.
 * 
 * Refunds are created against charges and return money to the
 * customer's original payment method. They can be full or partial.
 */
export interface Refund {
  /** The unique identifier of the refund object. */
  id: string;

  /** The object type literal. */
  object: string;

  /** The amount refunded in the smallest currency unit (e.g., cents). */
  amount: number;

  /** 3-letter ISO-code for currency (e.g., PHP). */
  currency: string;

  /** The reason for the refund. */
  reason: string;

  /** The status of the refund. */
  status: RefundStatus;

  /** The creation timestamp of the refund in ISO 8601 format. */
  created_at: string;

  /** The last update timestamp of the refund in ISO 8601 format. */
  updated_at: string | null;
}