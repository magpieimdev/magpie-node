/* eslint-disable no-redeclare */
import { BaseClient } from "./base-client";
import { ChargesResource } from "./resources/charges";
import { CheckoutResource } from "./resources/checkout";
import { CustomersResource } from "./resources/customers";
import { PaymentLinksResource } from "./resources/links";
import { PaymentRequestsResource } from "./resources/requests";
import { SourcesResource } from "./resources/sources";
import { Magpie as MagpieNamespace } from "./types";
import { MagpieConfig } from "./types/magpie";

export class Magpie extends BaseClient {
  public customers: CustomersResource;
  public sources: SourcesResource;
  public charges: ChargesResource;
  public checkout: CheckoutResource;
  public paymentRequests: PaymentRequestsResource;
  public paymentLinks: PaymentLinksResource;

  constructor(secretKey: string, config?: MagpieConfig) {
    super(secretKey, config);
    this.customers = new CustomersResource(this);
    this.sources = new SourcesResource(this);
    this.charges = new ChargesResource(this);
    this.checkout = new CheckoutResource(this);
    this.paymentRequests = new PaymentRequestsResource(this);
    this.paymentLinks = new PaymentLinksResource(this);
  }
}

/* eslint-disable @typescript-eslint/no-namespace */
export namespace Magpie {
  // Re-export all types from the namespace
  export type HttpMethod = MagpieNamespace.HttpMethod;
  export type Config = MagpieNamespace.Config;
  export type RequestOptions = MagpieNamespace.RequestOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type ApiResponse<T = any> = MagpieNamespace.ApiResponse<T>;
  export type ListOptions = MagpieNamespace.ListOptions;
  export type ListResponse<T> = MagpieNamespace.ListResponse<T>;
  export type DeletedResponse = MagpieNamespace.DeletedResponse;
  export type LastResponse = MagpieNamespace.LastResponse;
  export type DateRangeFilter = MagpieNamespace.DateRangeFilter;

  // Common types
  export type Address = MagpieNamespace.Address;
  export type Billing = MagpieNamespace.Billing;
  export type Shipping = MagpieNamespace.Shipping;
  export type Branding = MagpieNamespace.Branding;
  export type BillingAddressCollection = MagpieNamespace.BillingAddressCollection;
  export type LineItem = MagpieNamespace.LineItem;
  export type ShippingAddressCollection = MagpieNamespace.ShippingAddressCollection;
  
  // Customer types
  export type Customer = MagpieNamespace.Customer;
  export type CustomerCreateParams = MagpieNamespace.CustomerCreateParams;
  export type CustomerUpdateParams = MagpieNamespace.CustomerUpdateParams;
  
  // Source types
  export type Source = MagpieNamespace.Source;
  export type SourceCreateParams = MagpieNamespace.SourceCreateParams;
  export type SourceCard = MagpieNamespace.SourceCard;
  export type SourceBankAccount = MagpieNamespace.SourceBankAccount;
  export type SourceRedirect = MagpieNamespace.SourceRedirect;
  export type SourceOwner = MagpieNamespace.SourceOwner;
  export type CardSourceCreateParams = MagpieNamespace.CardSourceCreateParams;
  export type SourceType = MagpieNamespace.SourceType;

  // Charge types
  export type Charge = MagpieNamespace.Charge;
  export type ChargeCreateParams = MagpieNamespace.ChargeCreateParams;
  export type ChargeCaptureParams = MagpieNamespace.ChargeCaptureParams;
  export type ChargeVerifyParams = MagpieNamespace.ChargeVerifyParams;
  export type ChargeAction = MagpieNamespace.ChargeAction;
  export type ChargeFailure = MagpieNamespace.ChargeFailure;

  // Refund types
  export type Refund = MagpieNamespace.Refund;
  export type RefundCreateParams = MagpieNamespace.RefundCreateParams;

  // Checkout Session types
  export type CheckoutSession = MagpieNamespace.CheckoutSession;
  export type CheckoutSessionCreateParams = MagpieNamespace.CheckoutSessionCreateParams;
  export type CheckoutSessionCaptureParams = MagpieNamespace.CheckoutSessionCaptureParams;

  // Payment Request types
  export type PaymentRequest = MagpieNamespace.PaymentRequest;
  export type PaymentRequestCreateParams = MagpieNamespace.PaymentRequestCreateParams;
  export type PaymentRequestVoidParams = MagpieNamespace.PaymentRequestVoidParams;

  // Payment Link types
  export type PaymentLink = MagpieNamespace.PaymentLink;
  export type PaymentLinkCreateParams = MagpieNamespace.PaymentLinkCreateParams;
  export type PaymentLinkUpdateParams = MagpieNamespace.PaymentLinkUpdateParams;
}