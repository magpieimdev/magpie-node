import { Charge } from "./charge";
import { BillingAddressCollection, Branding, LineItem, ShippingAddressCollection } from "./common";

export type CheckoutSessionMode =
  | 'payment'
  | 'setup'
  | 'subscription'
  | 'save_card';

export type CheckoutSubmitType =
  | 'pay'
  | 'book'
  | 'donate'
  | 'send';

export type CheckoutSessionStatus =
  | 'paid'
  | 'unpaid'
  | 'expired'
  | 'authorized'
  | 'voided';

export interface CheckoutSessionAddress {
  /** The customer's full name or business name. */
  name: string;

  /** The first line of the address. */
  line1: string;

  /** The second line of the address. */
  line2: string | null;

  /** The barangay of the address. */
  barangay: string;

  /** The city of the address. */
  city: string;

  /** The state of the address. */
  state: string;

  /** The zip code of the address. */
  zip_code: string;

  /** The country of the address. */
  country: string;
}

export interface CheckoutSessionMerchant {
  /** The name of the merchant. */
  name: string;

  /** The support email of the merchant. */
  support_email: string | null;

  /** The support phone number of the merchant. */
  support_phone: string | null;
}

export interface CheckoutSessionCreateParams {
  /** A custom code provided by a bank you want to use for online banking payment methods */
  bank_code?: string;

  /** Details on branding elements to apply when rendering this Checkout Session. */
  branding?: Branding;

  /** Describes whether Checkout should collect the customer's billing address. */
  billing_address_collection?: BillingAddressCollection;

  /** Customers will be directed to this URL if they decide to cancel payment and return to your website. */
  cancel_url: string;

  /** A unique string to reference the Checkout Session. This can be a customer ID, a card ID, or similar, and can be used to reconcile the Session with your internal systems. */
  client_reference_id?: string;

  /** Three-letter ISO currency code, in lowercase. Must be a supported currency. */
  currency: string;

  /** The ID of an existing customer object that will be associated with this Checkout Session. This is used to prefill the customer-related fields like email address, name and phone on the payment page. */
  customer?: string;

  /** Email address of customer. This is used to prefill the email field on the payment page. */
  customer_email?: string;

  /** Name of customer. This is used to prefill the name field on the payment page. */
  customer_name?: string;

  /** Whether to collect the customer's name. */
  customer_name_collection?: boolean;

  /** Phone number of customer. This is used to prefill the phone field on the payment page. */
  customer_phone?: string;

  /** If provided, Checkout will use this value as description of the charge. */
  description?: string;

  /** A list of items the customer is purchasing. */
  line_items: LineItem[];

  /** The IETF language tag of the locale Checkout is displayed in. Defaults to en. */
  locale?: string;

  /** Set of key-value pairs you can attach to the session object. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;

  /** The mode of the checkout session. */
  mode: CheckoutSessionMode;

  /** A list of supported payment methods available for the customer. */
  payment_method_types: string[];

  /** Whether to collect the customer's phone number. */
  phone_number_collection?: boolean;

  /** Whether to require 3D Secure authentication for card payments. */
  require_auth?: boolean;

  /** Describes whether Checkout should collect the customer's shipping address. */
  shipping_address_collection?: ShippingAddressCollection;

  /** Describes the type of transaction being performed by Checkout in order to customize relevant text on the page, such as the submit button. */
  submit_type?: CheckoutSubmitType;

  /** Customers will be directed to this URL after a successful payment. */
  success_url: string;
}

export interface CheckoutSessionCaptureParams {
  /** The amount to capture. Can be less than the authorized amount but cannot exceed the authorized amount. */
  amount: number;
}

export interface CheckoutSession {
  /** The unique identifier of the checkout session object. */
  id: string;

  /** The object type literal. */
  object: string;

  /** The subtotal amount of the checkout session. */
  amount_subtotal: number;

  /** The total amount of the checkout session. */
  amount_total: number;

  /** The bank code to be used for online banking payment methods. */
  bank_code: string | null;

  /** Details on branding elements to apply when rendering this Checkout Session. */
  branding: Branding;

  /** The billing address collected from the customer. */
  billing: CheckoutSessionAddress | null;

  /** Describes whether Checkout should collect the customer's billing address. */
  billing_address_collection: BillingAddressCollection;

  /** Customers will be directed to this URL if they decide to cancel payment and return to your website. */
  cancel_url: string;

  /** A unique string to reference the Checkout Session. This can be a customer ID, a card ID, or similar, and can be used to reconcile the Session with your internal systems. */
  client_reference_id: string | null;

  /** The creation timestamp of the checkout session in ISO 8601 format. */
  created_at: string;

  /** The expiration timestamp of the checkout session in ISO 8601 format. */
  expires_at: string;

  /** The currency of the checkout session. */
  currency: string;

  /** The ID of the customer associated with the checkout session. */
  customer: string | null;

  /** The email address of the customer. */
  customer_email: string | null;

  /** The name of the customer. */
  customer_name: string | null;

  /** Whether to collect the customer's name. */
  customer_name_collection: boolean;

  /** The phone number of the customer. */
  customer_phone: string | null;

  /** The description of the checkout session. */
  description: string | null;

  /** The last updated timestamp of the checkout session in ISO 8601 format. */
  last_updated: string;

  /** The list of line items in the checkout session. */
  line_items: LineItem[];

  /** Whether the checkout session is in live mode. */
  livemode: boolean;

  /** The locale of the checkout session. */
  locale: string;

  /** The merchant details of the checkout session. */
  merchant: CheckoutSessionMerchant;

  /** Set of key-value pairs attached to the checkout session object. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>;

  /** The mode of the checkout session. */
  mode: CheckoutSessionMode;

  /** The payment details of the checkout session. */
  payment_details: Charge | null;

  /** The list of supported payment methods available for the customer. */
  payment_method_types: string[];

  /** The payment status of the checkout session. */
  payment_status: CheckoutSessionStatus;

  /** The payment URL of the checkout session. */
  payment_url: string;

  /** Whether to collect the customer's phone number. */
  phone_number_collection: boolean;

  /** Whether to require 3D Secure authentication for card payments. */
  require_auth: boolean;

  /** The shipping address collected from the customer. */
  shipping: CheckoutSessionAddress | null;

  /** Describes whether Checkout should collect the customer's shipping address. */
  shipping_address_collection: ShippingAddressCollection | null;

  /** The type of transaction being performed by Checkout in order to customize relevant text on the page, such as the submit button. */
  submit_type: CheckoutSubmitType;

  /** Customers will be directed to this URL after a successful payment. */
  success_url: string;
}
