import { Source } from "./source";

/**
 * Parameters for creating a new customer.
 * 
 * Customers are entities that represent your buyers. They can have
 * multiple payment sources attached and can be used for recurring billing.
 */
export interface CustomerCreateParams {
  /** The email address of the customer */
  email: string;

  /** An arbitrary string that you can attach to a customer object. */
  description: string;

  /** The customer’s full name or business name. */
  name?: string;

  /** The mobile number of the customer */
  mobile_number?: string;

  /** Set of key-value pairs that you can attach to an object. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}

/**
 * Parameters for updating an existing customer.
 * 
 * All fields are optional since you only need to provide the
 * fields you want to update.
 */
export interface CustomerUpdateParams {
  /** An arbitrary string that you can attach to a customer object. */
  description?: string;

  /** The name of the customer */
  name?: string;

  /** The mobile number of the customer */
  mobile_number?: string;

  /** Set of key-value pairs that you can attach to an object. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}

/**
 * A customer represents a buyer in your system.
 * 
 * Customers have email addresses and can have multiple payment sources
 * attached. They're useful for recurring billing and keeping track of
 * payment history.
 */
export interface Customer {
  /** The unique identifier of the object */
  id: string;

  /** String representing the object's type. Always "customer" */
  object: string;

  /** The customer's email address */
  email: string;

  /** An arbitrary string attached to the object. */
  description: string;

  /** The customer's full name or business name. */
  name?: string;

  /** The customer's mobile number */
  mobile_number: string | null;

  /** Whether the customer is in test mode */
  livemode: boolean;

  /** The ISO 8601 datetime of when the object was created */
  created_at: string;

  /** The ISO 8601 datetime of when the object was last updated */
  updated_at: string;

  /** Set of key-value pairs attached to the object. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>;

  /** Array of source objects attached to the customer */
  sources: Source[];
}