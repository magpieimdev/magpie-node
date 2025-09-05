/* eslint-disable @typescript-eslint/no-namespace */

// Import all individual types
import type * as ChargeTypes from './charge';
import type * as CommonTypes from './common';
import type * as CustomerTypes from './customer';
import type * as PaymentLinkTypes from './link';
import type * as MagpieTypes from './magpie';
import type * as OrganizationTypes from './organization';
import type * as RefundTypes from './refund';
import type * as PaymentRequestTypes from './request';
import type * as CheckoutSessionTypes from './session';
import type * as SourceTypes from './source';
import type * as WebhookTypes from './webhook';

// Create the main Magpie namespace
export namespace Magpie {
  // Core API types
  export type HttpMethod = MagpieTypes.HttpMethod;
  export type Config = MagpieTypes.MagpieConfig;
  export type RequestOptions = MagpieTypes.RequestOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type ApiResponse<T = any> = MagpieTypes.ApiResponse<T>;
  export type ListOptions = MagpieTypes.ListOptions;
  export type ListResponse<T> = MagpieTypes.ListResponse<T>;
  export type DeletedResponse = MagpieTypes.DeletedResponse;
  export type LastResponse = MagpieTypes.LastResponse;
  export type DateRangeFilter = MagpieTypes.DateRangeFilter;

  // Common types
  export type Address = CommonTypes.Address;
  export type Billing = CommonTypes.Billing;
  export type Shipping = CommonTypes.Shipping;
  export type Branding = CommonTypes.Branding;
  export type BillingAddressCollection = CommonTypes.BillingAddressCollection;
  export type LineItem = CommonTypes.LineItem;
  export type ShippingAddressCollection = CommonTypes.ShippingAddressCollection;

  // Customer types
  export type Customer = CustomerTypes.Customer;
  export type CustomerCreateParams = CustomerTypes.CustomerCreateParams;
  export type CustomerUpdateParams = CustomerTypes.CustomerUpdateParams;

  // Source types
  export type Source = SourceTypes.Source;
  export type SourceCard = SourceTypes.SourceCard;
  export type SourceBankAccount = SourceTypes.SourceBankAccount;
  export type SourceRedirect = SourceTypes.SourceRedirect;
  export type SourceOwner = SourceTypes.SourceOwner;
  export type SourceType = SourceTypes.SourceType;

  // Charge types
  export type Charge = ChargeTypes.Charge;
  export type ChargeCreateParams = ChargeTypes.ChargeCreateParams;
  export type ChargeCaptureParams = ChargeTypes.ChargeCaptureParams;
  export type ChargeVerifyParams = ChargeTypes.ChargeVerifyParams;
  export type ChargeAction = ChargeTypes.ChargeAction;
  export type ChargeFailure = ChargeTypes.ChargeFailure;

  // Refund types
  export type Refund = RefundTypes.Refund;
  export type RefundCreateParams = RefundTypes.RefundCreateParams;

  // Checkout Session types
  export type CheckoutSession = CheckoutSessionTypes.CheckoutSession;
  export type CheckoutSessionCreateParams = CheckoutSessionTypes.CheckoutSessionCreateParams;
  export type CheckoutSessionCaptureParams = CheckoutSessionTypes.CheckoutSessionCaptureParams;

  // Payment Request types
  export type PaymentRequest = PaymentRequestTypes.PaymentRequest;
  export type PaymentRequestCreateParams = PaymentRequestTypes.PaymentRequestCreateParams;
  export type PaymentRequestVoidParams = PaymentRequestTypes.PaymentRequestVoidParams;

  // Payment Link types
  export type PaymentLink = PaymentLinkTypes.PaymentLink;
  export type PaymentLinkCreateParams = PaymentLinkTypes.PaymentLinkCreateParams;
  export type PaymentLinkUpdateParams = PaymentLinkTypes.PaymentLinkUpdateParams;

  // Organization types
  export type Organization = OrganizationTypes.Organization;
  export type OrganizationBranding = OrganizationTypes.OrganizationBranding;
  export type PaymentMethodSettings = OrganizationTypes.PaymentMethodSettings;
  export type PaymentMethodRate = OrganizationTypes.PaymentMethodRate;
  export type PaymentGateway = OrganizationTypes.PaymentGateway;
  export type PayoutSettings = OrganizationTypes.PayoutSettings;

  // Webhook types
  export type WebhookEvent<T = unknown> = WebhookTypes.WebhookEvent<T>;
  export type WebhookEndpoint = WebhookTypes.WebhookEndpoint;
  export type WebhookSignatureConfig = WebhookTypes.WebhookSignatureConfig;
  export type WebhookSignature = WebhookTypes.WebhookSignature;
  export type WebhookEventType = WebhookTypes.WebhookEventType;
}

// Export the namespace as default for clean imports
export default Magpie;

// Also export individual types for backward compatibility
export * from './charge';
export * from './common';
export * from './customer';
export * from './link';
export * from './magpie';
export * from './organization';
export * from './refund';
export * from './request';
export * from './session';
export * from './source';
export * from './webhook';

