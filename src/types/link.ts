import { Branding, LineItem, ShippingAddressCollection } from "./common";

/**
 * A line item for a payment link with inventory tracking.
 * 
 * Extends the base LineItem with additional fields specific
 * to payment links, including stock management.
 */
export interface PaymentLinkItem extends LineItem {
  /** The total number of stocks remaining. */
  remaining: number;
}

/**
 * Parameters for creating a new payment link.
 * 
 * Payment links are shareable URLs that allow customers to make payments
 * without you building a custom checkout flow. Perfect for social media,
 * email marketing, or one-off sales.
 */
export interface PaymentLinkCreateParams {
  /** Whether the quantity of the line item can be adjusted by the customer. */
  allow_adjustable_quantity: boolean;

  /** Details on branding elements to apply when rendering the Payment Link page. */
  branding?: Branding;

  /** Three-letter ISO currency code, in lowercase. Must be a supported currency. */
  currency: string;

  /** An arbitrary string associated with the Payment Link. */
  description?: string;

  /** The date when the Payment Link will automatically expire in MM/DD/YYYY format. */
  expiry?: string;

  /** A reference name for the Payment Link that is only visible to the merchant for easy identification. */
  internal_name: string;

  /** A list of line items that will be displayed in the Payment Link page. */
  line_items: PaymentLinkItem[];

  /** The maximum number of payments that can be made to the Payment Link. */
  maximum_payments?: number;

  /** Set of key-value pairs you can attach to the Payment Link object. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;

  /** The list of supported payment methods available for the customer to pay. */
  payment_method_types: string[];

  /** Whether to collect the customer's phone number. */
  phone_number_collection?: boolean;

  /** The URL to redirect to after the customer successfully makes a payment. */
  redirect_url?: string;

  /** Whether to require 3D Secure authentication for card payments. */
  require_auth?: boolean;

  /** Whether to collect the customer's shipping address. */
  shipping_address_collection?: ShippingAddressCollection;
}

/**
 * Parameters for updating an existing payment link.
 * 
 * You can update most aspects of a payment link including items,
 * pricing, expiry date, and configuration options.
 */
export interface PaymentLinkUpdateParams {
  /** Whether the quantity of the line item can be adjusted by the customer. */
  allow_adjustable_quantity: boolean;

  /** Details on branding elements to apply when rendering the Payment Link page. */
  branding?: Branding;

  /** Three-letter ISO currency code, in lowercase. Must be a supported currency. */
  currency: string;

  /** An arbitrary string associated with the Payment Link. */
  description?: string;

  /** The date when the Payment Link will automatically expire in MM/DD/YYYY format. */
  expiry?: string;

  /** A list of line items that will be displayed in the Payment Link page. */
  line_items: PaymentLinkItem[];

  /** The maximum number of payments that can be made to the Payment Link. */
  maximum_payments?: number;

  /** Set of key-value pairs you can attach to the Payment Link object. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;

  /** The list of supported payment methods available for the customer to pay. */
  payment_method_types: string[];

  /** Whether to collect the customer's phone number. */
  phone_number_collection?: boolean;

  /** The URL to redirect to after the customer successfully makes a payment. */
  redirect_url?: string;

  /** Whether to require 3D Secure authentication for card payments. */
  require_auth?: boolean;

  /** Whether to collect the customer's shipping address. */
  shipping_address_collection?: ShippingAddressCollection;
}

/**
 * A payment link represents a hosted payment page accessible via URL.
 * 
 * Payment links provide a no-code solution for collecting payments.
 * Share the URL via email, social media, or embed it in your website.
 */
export interface PaymentLink {
  /** The unique identifier of the Payment Link object. */
  id: string;

  /** The object type literal. */
  object: string;

  /** Whether the Payment Link is active. */
  active: boolean;

  /** Whether the quantity of the line item can be adjusted by the customer. */
  allow_adjustable_quantity: boolean;

  /** Details on branding elements to apply when rendering the Payment Link page. */
  branding: Branding;

  /** Time at which the object was created. Measured in seconds since the Unix epoch. */
  created: number;

  /** Three-letter ISO currency code, in lowercase. Must be a supported currency. */
  currency: string;

  /** An arbitrary string associated with the Payment Link. */
  description: string | null;

  /** The date when the Payment Link will automatically expire in MM/DD/YYYY format. */
  expiry: string | null;

  /** A reference name for the Payment Link that is only visible to the merchant for easy identification. */
  internal_name: string;

  /** A list of line items that will be displayed in the Payment Link page. */
  line_items: PaymentLinkItem[];

  /** Whether the Payment Link is in test mode. */
  livemode: boolean;

  /** The maximum number of payments that can be made to the Payment Link. */
  maximum_payments: number | null;

  /** Set of key-value pairs you can attach to the Payment Link object. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>;

  /** The list of supported payment methods available for the customer to pay. */
  payment_method_types: string[];

  /** Whether to collect the customer's phone number. */
  phone_number_collection?: boolean;

  /** The URL to redirect to after the customer successfully makes a payment. */
  redirect_url: string | null;

  /** Whether to require 3D Secure authentication for card payments. */
  require_auth: boolean;

  /** Whether to collect the customer's shipping address. */
  shipping_address_collection: ShippingAddressCollection | null;

  /** Time at which the object was last updated. Measured in seconds since the Unix epoch. */
  updated: number;

  /** The URL of the Payment Link. */
  url: string;
}