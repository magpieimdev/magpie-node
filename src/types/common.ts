export interface Address {
  /** Address line 1 (e.g., street, PO Box, or company name). */
  line1?: string;

  /** Address line 2 (e.g., apartment, suite, unit, or building). */
  line2?: string;

  /** City, district, suburb, town, or village. */
  city?: string;

  /** State, county, province, or region. */
  state?: string;

  /** Two-letter country code (ISO 3166-1 alpha-2). */
  country?: string;

  /** ZIP or postal code. */
  zip_code?: string;
}

export interface Billing extends Address {
  /** The customer’s full name or business name. */
  name: string;

  /** The customer’s phone number. */
  phone_number?: string;

  /** The customer’s email address. */
  email?: string;
}

export interface Shipping extends Address {
  /** Customer or recipient name. */
  name: string;

  /** Customer or recipient phone number. */
  phone_number?: string;

  /** Customer or recipient email address. */
  email?: string;
}

export interface Branding {
  /** URL to an icon image. */
  icon?: string;

  /** URL to a logo image. */
  logo?: string;

  /** Whether to use the logo. */
  use_logo: boolean;

  /** A CSS color value representing the primary branding color. */
  primary_color: string;

  /** A CSS color value representing the secondary branding color. */
  secondary_color: string;
}

export type BillingAddressCollection = 'auto' | 'required';

export interface LineItem {
  /** The amount of the line item in the smallest currency unit (e.g., cents). */
  amount: number;

  /** The description of the line item. */
  description: string | null;

  /** The image of the line item. */
  image: string | null;

  /** The quantity of the line item being purchased. */
  quantity: number;
}

export interface ShippingAddressCollection {
  /** A list of two-letter ISO country codes. Shipping address will be collected only from these countries. */
  allowed_countries: string[];
}