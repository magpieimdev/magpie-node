import { BaseClient } from "../base-client";
import {
  LastResponse,
  RequestOptions,
  Source,
  SourceCreateParams,
} from "../types";
import { BaseResource } from "./base";

/**
 * Resource class for managing payment sources.
 * 
 * The SourcesResource provides methods to create and retrieve payment sources
 * such as credit cards, debit cards, and bank accounts. Sources represent
 * payment methods that can be attached to customers or used for one-time payments.
 * 
 * @example
 * ```typescript
 * const magpie = new Magpie('sk_test_123');
 * 
 * // Create a card source
 * const source = await magpie.sources.create({
 *   type: 'card',
 *   card: {
 *     number: '4242424242424242',
 *     exp_month: 12,
 *     exp_year: 2025,
 *     cvc: '123'
 *   }
 * });
 * ```
 */
export class SourcesResource extends BaseResource {
  /**
   * Creates a new SourcesResource instance.
   * 
   * @param client - The BaseClient instance for API communication
   */
  constructor(client: BaseClient) {
    super(client, '/sources');
  }

  /**
   * Creates a new payment source.
   * 
   * Payment sources represent payment methods like credit cards or bank accounts
   * that can be used to process payments. Sources can be reusable or single-use.
   * 
   * @param params - The parameters for creating the source
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the created source with response metadata
   * 
   * @example
   * ```typescript
   * // Create a card source
   * const cardSource = await magpie.sources.create({
   *   type: 'card',
   *   card: {
   *     number: '4242424242424242',
   *     exp_month: 12,
   *     exp_year: 2025,
   *     cvc: '123'
   *   },
   *   owner: {
   *     name: 'John Doe',
   *     email: 'john@example.com'
   *   }
   * });
   * ```
   */
  async create(
    params: SourceCreateParams,
    options: RequestOptions = {},
  ): Promise<Source & { lastResponse: LastResponse }> {
    return this.createResource<Source, SourceCreateParams>(params, options);
  }

  /**
   * Retrieves an existing payment source by ID.
   * 
   * @param id - The unique identifier of the source
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the source with response metadata
   * 
   * @example
   * ```typescript
   * const source = await magpie.sources.retrieve('src_1234567890');
   * console.log(source.type); // 'card'
   * console.log(source.used); // false
   * ```
   */
  async retrieve(
    id: string,
    options: RequestOptions = {},
  ): Promise<Source & { lastResponse: LastResponse }> {
    return this.retrieveResource<Source>(id, options);
  }
}