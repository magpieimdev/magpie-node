import { Refund } from "./refund";
import { Source, SourceOwner } from "./source";

/**
 * Status of a charge indicating its current processing state.
 * 
 * - `pending`: Charge is being processed or awaiting authentication
 * - `succeeded`: Charge has been successfully completed
 * - `failed`: Charge processing failed
 */
export type ChargeStatus = 'pending' | 'succeeded' | 'failed';

/**
 * Action required to complete a charge (e.g., 3D Secure authentication).
 * 
 * Some charges require additional customer interaction to complete,
 * such as entering an OTP or completing 3D Secure authentication.
 */
export interface ChargeAction {
  /** The action type */
  type: string;

  /** The action URL */
  url: string;
}

/**
 * Link from payment provider response.
 * @internal
 */
export interface ChargeProviderResponseLink {
  /** The provider response link href */
  href: string;

  /** The provider response link rel */
  rel: string;
}

/**
 * Response data from the payment provider.
 * 
 * Contains raw response information from the underlying payment
 * processor for debugging and troubleshooting purposes.
 * @internal
 */
export interface ChargeProviderResponse {
  /** The provider response links */
  links: ChargeProviderResponseLink[]; 

  /** The provider response code */
  code: string;

  /** The provider response message */
  message: string;

  /** The provider response logref */
  logref: string;
}

/**
 * Information about a failed charge.
 * 
 * When a charge fails, this interface provides detailed information
 * about why it failed and suggested next steps for resolution.
 */
export interface ChargeFailure {
  /** The failure reason */
  reason: string;

  /** The failure code */
  code: string;

  /** The failure next steps */
  next_steps: string;

  /** The failure provider response */
  provider_response: ChargeProviderResponse;
}

/**
 * Parameters for creating a new charge.
 * 
 * This interface defines all the required and optional parameters
 * needed to create a charge against a payment source.
 */
export interface ChargeCreateParams {
  /** The amount to charge in the smallest currency unit (e.g., cents) */
  amount: number;

  /** 3-letter ISO-code for currency (e.g., PHP) */
  currency: string;

  /** The ID of the payment source */
  source: string;

  /** An arbitrary string attached to the object */
  description: string;

  /** An arbitrary string to be displayed on the customer's credit card statement. Maximum of 15 characters. */
  statement_descriptor: string;

  /** Whether to immediately capture the charge. */
  capture: boolean;

  /** The card's security code. */
  cvc?: string;

  /** When set to false, attempt to do 3D secure authentication for credit card is bypassed and charge is immediately executed. */
  require_auth?: boolean;

  /** The redirect URL used ofr direct bank payments. */
  redirect_url?: string;

  /** Set of key-value pairs that you can attach to an object. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}  

/**
 * Parameters for capturing a previously authorized charge.
 * 
 * When a charge is created with `capture: false`, it's only authorized.
 * Use these parameters to capture the authorized amount later.
 */
export interface ChargeCaptureParams {
  /** The amount to capture in the smallest currency unit (e.g., cents). Must not be greater than the amount of the charge. */
  amount: number;
}

/**
 * Parameters for verifying a charge that requires additional authentication.
 * 
 * Some payment methods (like direct bank payments) require additional
 * verification steps such as OTP confirmation.
 */
export interface ChargeVerifyParams {
  /** The confirmation ID from the provider. */
  confirmation_id: string;

  /** The OTP code from the provider. */
  otp: string;
}

/**
 * A charge represents a payment transaction.
 * 
 * Charges represents a single attempt to move money into your Magpie account.
 * They can be immediately captured or authorized for later capture.
 */
export interface Charge {
  /** A unique identifier for the charge. */
  id: string;

  /** The object type literal. */
  object: string;

  /** Amount intended to be collected by this charge, in the smallest currency unit (e.g., cents). */
  amount: number;

  /** Amount in cents refunded (if any). */
  amount_refunded: number;

  /** Whether an amount is authorized or help for future capturing. */
  authorized: boolean;

  /** Whether an authorized amount has been captured. */
  captured: boolean;

  /** 3-letter ISO-code for currency (e.g., PHP). */
  currency: string;

  /** An arbitrary string to be displayed on the customer's credit card statement. Maximum of 15 characters. */
  statement_descriptor: string;

  /** An arbitrary string attached to the object. */
  description: string;

  /** The source used to make the charge. */
  source: Source;

  /** Whether the charge requires authentication. */
  require_auth: boolean;

  /** The owner details of the charge. */
  owner: SourceOwner | null;

  /** The next immediate action to be taken for the charge. */
  action: ChargeAction | null;

  /** The list of refunds for the charge. */
  refunds: Refund[];

  /** Whether the charge is in live mode. */
  livemode: boolean;

  /** The creation timestamp of the charge in ISO 8601 format. */
  created_at: string;

  /** The last update timestamp of the charge in ISO 8601 format. */
  updated_at: string;

  /** Set of key-value pairs attached to the charge object. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>;

  /** A dictionary that contains error response from the provider. */
  failure_data: ChargeFailure | null;
}