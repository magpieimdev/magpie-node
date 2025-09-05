/**
 * Organization-related types for the Magpie API.
 * 
 * These types define the structure of organization objects used when
 * interacting with organization-related endpoints.
 */

/**
 * Payment method rate configuration.
 */
export interface PaymentMethodRate {
  /** Merchant Discount Rate (percentage) */
  mdr: number;
  
  /** Fixed fee in centavos */
  fixed_fee: number;
  
  /** Rate formula type */
  formula?: 'mdr_plus_fixed' | 'mdr_or_fixed';
}

/**
 * Gateway information for payment methods.
 */
export interface PaymentGateway {
  /** Gateway ID */
  id: string;
  
  /** Gateway display name */
  name: string;
}

/**
 * Payment method configuration.
 */
export interface PaymentMethodSettings {
  /** Merchant ID for this payment method */
  mid: string | null;
  
  /** Gateway configuration */
  gateway: PaymentGateway | null;
  
  /** Rate configuration */
  rate: PaymentMethodRate;
  
  /** Approval status */
  status: 'approved' | 'pending' | 'rejected';
}

/**
 * Organization branding configuration.
 */
export interface OrganizationBranding {
  /** Icon URL */
  icon: string | null;
  
  /** Logo URL */
  logo: string | null;
  
  /** Whether to use logo in branding */
  use_logo: boolean;
  
  /** Primary brand color in hex format */
  brand_color: string;
  
  /** Accent color in hex format */
  accent_color: string;
}

/**
 * Payout settings configuration.
 */
export interface PayoutSettings {
  /** Payout schedule type */
  schedule: 'automatic' | 'manual';
  
  /** Delivery type */
  delivery_type: 'standard' | 'express';
  
  /** Bank code */
  bank_code: string;
  
  /** Account number */
  account_number: string;
  
  /** Account holder name */
  account_name: string;
}

/**
 * Represents an organization in the Magpie system.
 */
export interface Organization {
  /** Type identifier, always 'organization' */
  object: 'organization';
  
  /** Unique identifier for the organization */
  id: string;
  
  /** Organization title/display name */
  title: string;
  
  /** Account name */
  account_name: string;
  
  /** Statement descriptor shown on customer statements */
  statement_descriptor: string;
  
  /** Test public key */
  pk_test_key: string;
  
  /** Test secret key */
  sk_test_key: string;
  
  /** Live public key */
  pk_live_key: string;
  
  /** Live secret key */
  sk_live_key: string;
  
  /** Organization branding settings */
  branding: OrganizationBranding;
  
  /** Organization status */
  status: 'approved' | 'pending' | 'rejected';
  
  /** Timestamp when the organization was created */
  created_at: string;
  
  /** Timestamp when the organization was last updated */
  updated_at: string;
  
  /** Business address */
  business_address: string | null;
  
  /** Payment method settings for various payment types */
  payment_method_settings: Record<string, PaymentMethodSettings>;
  
  /** Simplified rates configuration */
  rates: Record<string, Omit<PaymentMethodRate, 'formula'>>;
  
  /** Payout settings */
  payout_settings: PayoutSettings;
  
  /** Additional metadata */
  metadata: Record<string, string>;
}
