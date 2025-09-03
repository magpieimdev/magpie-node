import { Charge } from "./charge";
import { Branding, LineItem } from "./common";

export interface PaymentRequestDelivered {
  /** Whether the payment request was delivered to the customer via email. */
  email: boolean;

  /** Whether the payment request was delivered to the customer via SMS. */
  sms: boolean;
}

export interface PaymentRequestCreateParams {
  /** Details on branding elements to apply when rendering the Payment Request page. */
  branding?: Branding;

  /** Three-letter ISO currency code, in lowercase. Must be a supported currency. */
  currency: string;

  /** The ID of the customer object who will receive the Payment Request. */
  customer: string;

  /** The methods by which the customer will receive the Payment Request. */
  delivery_methods: string[];

  /** A list of items the customer will be billed for. */
  line_items: LineItem[];

  /** A custom message to be included in the Payment Request. */
  message?: string;

  /** Set of key-value pairs you can attach to the Payment Request object. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;

  /** The list of supported payment methods available for the customer to pay. */
  payment_method_types: string[];

  /** Whether to require 3D Secure authentication for card payments. */
  require_auth?: boolean;
}

export interface PaymentRequestVoidParams {
  /** The reason for voiding the payment request. */
  reason: string;
}

export interface PaymentRequest {
  /** The unique identifier of the payment request object. */
  id: string;

  /** The object type literal. */
  object: string;

  /** The name of the merchant who created and sent the Payment Request. */
  account_name: string;

  /** The support email of the merchant who created the Payment Request. */
  account_support_email: string | null;

  /** Details on branding elements to apply when rendering the Payment Request page. */
  branding: Branding;

  /** Time at which the object was created. Measured in seconds since the Unix epoch. */
  created: number;

  /** Three-letter ISO currency code, in lowercase. Must be a supported currency. */
  currency: string;

  /** The ID of the customer who will receive the Payment Request. */
  customer: string;

  /** The email address of the customer. */
  customer_email: string;

  /** The name of the customer. */
  customer_name: string;

  /** The phone number of the customer. */
  customer_phone: string | null;

  /** The methods by which the customer will receive the Payment Request. */
  delivery_methods: string[];

  /** Whether the payment request was delivered to the customer via email or SMS. */
  delivered: PaymentRequestDelivered;

  /** The list of items the customer will be billed for. */
  line_items: LineItem[];

  /** Whether the Payment Request is in live mode. */
  livemode: boolean;

  /** A custom message to be included in the Payment Request. */
  message: string | null;

  /** Set of key-value pairs attached to the Payment Request object. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>;

  /** A unique, identifying string that follows a specific pattern. It is used to identify the Payment Request associated to a customer. */
  'number': string;

  /** Whether the Payment Request has been paid. */
  paid: boolean;

  /** Time at which the Payment Request was paid. Measured in seconds since the Unix epoch. */
  paid_at: number | null;

  /** The charge object details associated with the Payment Request after successful payment. */
  payment_details: Charge | null;

  /** The list of supported payment methods available for the customer to pay. */
  payment_method_types: string[];

  /** The URL of the Payment Request. */
  payment_request_url: string;

  /** Whether to require 3D Secure authentication for card payments. */
  require_auth: boolean;

  /** The subtotal amount of the Payment Request. */
  subtotal: number;

  /** The total amount of the Payment Request. */
  total: number;

  /** Time at which the object was last updated. Measured in seconds since the Unix epoch. */
  updated: number;

  /** Whether the Payment Request has been voided. */
  voided: boolean;

  /** Time at which the Payment Request was voided. Measured in seconds since the Unix epoch. */
  voided_at: number | null;

  /** The reason for voiding the Payment Request. */
  void_reason: string | null;
}