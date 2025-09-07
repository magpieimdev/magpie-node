import { BaseClient } from "../base-client";
import {
  Customer,
  CustomerCreateParams,
  CustomerUpdateParams,
} from "../types/customer";
import { LastResponse, RequestOptions } from "../types/magpie";
import { BaseResource } from "./base";

/**
 * Resource class for managing customers.
 * 
 * The CustomersResource provides methods to create, retrieve, and update customer
 * records in the Magpie payment system. Customers can have attached payment sources
 * and can be used for recurring billing and payment history tracking.
 * 
 * @example
 * ```typescript
 * const magpie = new Magpie('sk_test_123');
 * 
 * // Create a customer
 * const customer = await magpie.customers.create({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   phone: '+639151234567'
 * });
 * 
 * // Attach a payment source to the customer
 * await magpie.customers.attachSource(customer.id, 'src_123');
 * ```
 */
export class CustomersResource extends BaseResource {
  /**
   * Creates a new CustomersResource instance.
   * 
   * @param client - The BaseClient instance for API communication
   */
  constructor(client: BaseClient) {
    super(client, '/customers/');
  }

  /**
   * Creates a new customer.
   * 
   * @param params - The parameters for creating the customer
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the created customer with response metadata
   * 
   * @example
   * ```typescript
   * const customer = await magpie.customers.create({
   *   name: 'John Doe',
   *   email: 'john@example.com',
   *   phone: '+639151234567',
   *   description: 'Premium customer'
   * });
   * ```
   */
  async create(
    params: CustomerCreateParams,
    options: RequestOptions = {},
  ): Promise<Customer & { lastResponse: LastResponse }> {
    return this.createResource<Customer, CustomerCreateParams>(params, options);
  }

  /**
   * Retrieves an existing customer by ID.
   * 
   * @param id - The unique identifier of the customer
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the customer with response metadata
   */
  async retrieve(
    id: string,
    options: RequestOptions = {},
  ): Promise<Customer & { lastResponse: LastResponse }> {
    return this.retrieveResource<Customer>(id, options);
  }

  /**
   * Updates an existing customer.
   * 
   * @param id - The unique identifier of the customer to update
   * @param params - The update parameters
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the updated customer with response metadata
   */
  async update(
    id: string,
    params: CustomerUpdateParams,
    options: RequestOptions = {},
  ): Promise<Customer & { lastResponse: LastResponse }> {
    return this.updateResource<Customer, CustomerUpdateParams>(id, params, options);
  }

  /**
   * Retrieves a customer by their email address.
   * 
   * @param email - The email address of the customer
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the customer with response metadata
   * 
   * @example
   * ```typescript
   * const customer = await magpie.customers.retrieveByEmail('john@example.com');
   * ```
   */
  async retrieveByEmail(
    email: string,
    options: RequestOptions = {},
  ): Promise<Customer & { lastResponse: LastResponse }> {
    const basePath = this.basePath.endsWith('/') ? this.basePath.slice(0, -1) : this.basePath;
    return this.customResourceAction<Customer>('GET', `${basePath}/by_email/${email}`, undefined, options);
  }

  /**
   * Attaches a payment source to a customer.
   * 
   * @param id - The unique identifier of the customer
   * @param source - The ID of the payment source to attach
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the updated customer with response metadata
   * 
   * @example
   * ```typescript
   * const updatedCustomer = await magpie.customers.attachSource(
   *   'cus_123',
   *   'src_456'
   * );
   * ```
   */
  async attachSource(
    id: string,
    source: string,
    options: RequestOptions = {},
  ): Promise<Customer & { lastResponse: LastResponse }> {
    return this.customResourceAction<Customer>('POST', `${this.buildPath(id)}/sources`, { source }, options);
  }

  /**
   * Detaches a payment source from a customer.
   * 
   * @param id - The unique identifier of the customer
   * @param source - The ID of the payment source to detach
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the updated customer with response metadata
   * 
   * @example
   * ```typescript
   * const updatedCustomer = await magpie.customers.detachSource(
   *   'cus_123',
   *   'src_456'
   * );
   * ```
   */
  async detachSource(
    id: string,
    source: string,
    options: RequestOptions = {},
  ): Promise<Customer & { lastResponse: LastResponse }> {
    return this.customResourceAction<Customer>('DELETE', `${this.buildPath(id)}/sources/${source}`, undefined, options);
  }
}