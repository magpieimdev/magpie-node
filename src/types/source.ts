import { Billing, Shipping } from "./common";

export type SourceType = 
  | 'card'
  | 'bpi'
  | 'qrph'
  | 'gcash'
  | 'maya'
  | 'paymaya';

export interface SourceRedirect {
  /** The URL to redirect to after the payment is successful. */
  success: string;

  /** The URL to redirect to after the payment fails. */
  fail: string;

  /** The URL that will be called repeatedly, until a proper response was received. Works like a payment webhook. */
  notify?: string;
}

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