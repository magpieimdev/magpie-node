import { BaseClient } from "../base-client";
import {
  LastResponse,
  RequestOptions,
  Source,
} from "../types";
import { BaseResource } from "./base";

/**
 * Resource class for managing payment sources.
 * 
 * The SourcesResource provides methods to retrieve payment sources
 * such as credit cards, debit cards, and bank accounts. Sources represent
 * payment methods that are created through secure client-side processes
 * and can be retrieved using their identifiers.
 * 
 * Note: Sources are created client-side using public keys for security.
 * This resource only provides retrieval functionality.
 * 
 * @example
 * ```typescript
 * const magpie = new Magpie('sk_test_123');
 * 
 * // Retrieve a source by ID
 * const source = await magpie.sources.retrieve('src_1234567890');
 * console.log(source.type); // 'card'
 * console.log(source.used); // false
 * ```
 */
export class SourcesResource extends BaseResource {
  /** Flag to track if we've already switched to PK authentication */
  private pkSwitched = false;
  
  /** Cached public key to avoid multiple organization API calls */
  private cachedPK: string | null = null;

  /**
   * Creates a new SourcesResource instance.
   * 
   * @param client - The BaseClient instance for API communication
   */
  constructor(client: BaseClient) {
    super(client, '/sources');
  }

  /**
   * Ensures the client is using public key authentication.
   * This method switches to PK authentication lazily when needed.
   * 
   * @private
   */
  private async ensurePKAuthentication(): Promise<void> {
    if (this.pkSwitched) {
      return;
    }

    if (!this.cachedPK) {
      // Get organization details to retrieve the public key
      const originalKey = this.client.getApiKey();
      
      try {
        const orgResponse = await this.client.get<{ pk_test_key: string; pk_live_key: string }>('/me');
        const organization = orgResponse.data;
        
        // Determine which public key to use based on the current secret key
        if (originalKey.includes('_test_')) {
          this.cachedPK = organization.pk_test_key;
        } else {
          this.cachedPK = organization.pk_live_key;
        }
      } catch {
        throw new Error('Failed to retrieve organization public key for sources authentication');
      }
    }

    // Switch to public key authentication
    this.client.setApiKey(this.cachedPK);
    this.pkSwitched = true;
  }

  /**
   * Retrieves an existing payment source by ID.
   * 
   * This method automatically switches to public key authentication before
   * making the request, as required by the sources API endpoint.
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
    // Ensure we're using public key authentication
    await this.ensurePKAuthentication();
    
    return this.retrieveResource<Source>(id, options);
  }
}