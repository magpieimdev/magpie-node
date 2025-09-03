import { Billing, Shipping } from "./common";

/**
 * Types of payment sources supported by Magpie.
 * 
 * - `card`: Credit or debit cards
 * - `bpi`: BPI direct bank transfer
 * - `qrph`: QR PH (InstaPay/PESONet QR)
 * - `gcash`: GCash e-wallet
 * - `maya`: Maya (formerly PayMaya) e-wallet
 * - `paymaya`: Legacy PayMaya e-wallet
 */
export type SourceType = 
  | 'card'
  | 'bpi'
  | 'qrph'
  | 'gcash'
  | 'maya'
  | 'paymaya';

/**
 * Redirect URLs for payment sources that require customer redirection.
 * 
 * Some payment methods require redirecting the customer to complete
 * the payment flow (e.g., online banking, e-wallets).
 */
export interface SourceRedirect {
  /** The URL to redirect to after the payment is successful. */
  success: string;

  /** The URL to redirect to after the payment fails. */
  fail: string;

  /** The URL that will be called repeatedly, until a proper response was received. Works like a payment webhook. */
  notify?: string;
}

/**
 * Information about the owner of a payment source.
 * 
 * Contains contact and address information for the person or
 * entity that owns the payment method.
 */
export interface SourceOwner {
  /** The name of the owner. */
  name: string;

  /** The country of the owner. */
  address_country?: string;

  /** The billing address of the owner. */
  billing?: Billing;

  /** The shipping address of the owner. */
  shipping?: Shipping;
}

/**
 * Parameters for creating a card payment source.
 * 
 * Card sources represent credit or debit cards that can be used
 * for payments. All card information is tokenized for security.
 */
export interface CardSourceCreateParams {
  /** The name of the card holder. */
  name: string;

  /** The card number. */
  number: string;

  /** The card expiration month. */
  exp_month: string;

  /** The card expiration year. */
  exp_year: string;

  /** The card security code. */
  cvc: string;

  /** The card billing address line 1. */
  address_line1?: string;

  /** The card billing address line 2. */
  address_line2?: string;

  /** The card billing address city. */
  address_city?: string;

  /** The card billing address state. */
  address_state?: string;

  /** The card billing address country. */
  address_country?: string;

  /** The card billing address zip code. */
  address_zip?: string;
}

/**
 * Parameters for creating a payment source.
 * 
 * Payment sources represent different payment methods that can be used
 * for payments. All payment information is tokenized for security.
 */
export interface SourceCreateParams {
  /** The type of the source. */
  type: SourceType;

  /** The details of the card, if source type is card. */
  card?: CardSourceCreateParams;

  /** The payment redirect params. */
  redirect: SourceRedirect;

  /** The owner details. */
  owner?: SourceOwner;
}

/**
 * A card object represents a credit or debit card payment source type.
 */
export interface SourceCard {
  /** The unique identifier of the card object. */
  id: string;

  /** The object type literal. */
  object: string;

  /** The name of the card holder. */
  name: string;

  /** The last 4 digits of the card number. */
  last4: string;

  /** The card expiration month. */
  exp_month: string;

  /** The card expiration year. */
  exp_year: string;

  /** The card billing address line 1. */
  address_line1?: string;

  /** The card billing address line 2. */
  address_line2?: string;

  /** The card billing address city. */
  address_city?: string;

  /** The card billing address state. */
  address_state?: string;

  /** The card billing address country. */
  address_country?: string;

  /** The card billing address zip code. */
  address_zip?: string;

  /** The card brand. */
  brand: string;

  /** The card country. */
  country: string;

  /** The card cvc check. */
  cvc_checked: string;

  /** The card funding type. */
  funding: string;

  /** The card issuing bank. */
  issuing_bank: string;
}

/**
 * A bank account object represents a bank account payment source type.
 */
export interface SourceBankAccount {
  /** The reference ID of the bank account. */
  reference_id: string;

  /** The type of the bank account. */
  bank_type: string;

  /** The bank code of the bank account. */
  bank_code: string;

  /** The name of the account owner. */
  account_name: string;

  /** The account number. */
  account_number: string;

  /** The type of the account. */
  account_type: string;

  /** The expiration date of the bank transaction session. */
  expires_at: string;

  /** Set of key-value pairs attached to the bank account object. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>;
}

/**
 * Source objects allow you to accept a variety of payment methods.
 * They represent a customer’s payment instrument, 
 * and can be used with the Magpie API just like a Card object: 
 * once chargeable, they can be charged, or can be attached to customers.
 */
export interface Source {
  /** The unique identifier of the source object. */
  id: string;

  /** The object type literal. */
  object: string;

  /** The type of the source. */
  type: SourceType;

  /** The details of the card, if source type is card. */
  card?: SourceCard;

  /** The details of the bank account, if source type is a bank direct payment type. */
  bank_account?: SourceBankAccount;

  /** The payment redirect details. */
  redirect: SourceRedirect;

  /** The owner details. */
  owner?: SourceOwner;

  /** Whether the source is vaulted. */
  vaulted: boolean;

  /** Whether the source is used. */
  used: boolean;

  /** Whether the source is in live mode. */
  livemode: boolean;

  /** The creation timestamp of the source in ISO 8601 format. */
  created_at: string;

  /** The last update timestamp of the source in ISO 8601 format. */
  updated_at: string;

  /** Set of key-value pairs attached to the source object. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>;
}