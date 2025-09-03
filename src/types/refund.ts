
export type RefundStatus = 'pending' | 'succeeded' | 'failed';

export interface RefundCreateParams {
  /** The amount to refund in the smallest currency unit (e.g., cents). */
  amount: number;

  /** The reason for the refund. */
  reason: string;
}

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