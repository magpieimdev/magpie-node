import { BaseClient } from "../base-client";
import { LastResponse, Organization, RequestOptions } from "../types";
import { BaseResource } from "./base";

/**
 * Resource class for managing organization information.
 * 
 * The OrganizationsResource provides methods to retrieve organization
 * information including branding, payment method settings, and payout configurations.
 * This resource is read-only as organization modifications are typically handled
 * through the Magpie dashboard.
 * 
 * @example
 * ```typescript
 * const magpie = new Magpie('sk_test_123');
 * 
 * // Retrieve organization info
 * const org = await magpie.organizations.me();
 * console.log(org.title); // "My Business"
 * console.log(org.branding.brand_color); // "#fffefd"
 * ```
 */
export class OrganizationsResource extends BaseResource {
  /**
   * Creates a new OrganizationsResource instance.
   * 
   * @param client - The BaseClient instance for API communication
   */
  constructor(client: BaseClient) {
    super(client, '/me');
  }

  /**
   * Retrieves the current organization information.
   * 
   * This method returns comprehensive organization details including branding settings,
   * payment method configurations, payout settings, and API keys. The organization
   * is determined by the secret key used to authenticate the request.
   * 
   * @param options - Additional request options
   * 
   * @returns Promise that resolves to the organization with response metadata
   * 
   * @example
   * ```typescript
   * const organization = await magpie.organizations.me();
   * 
   * console.log(organization.title); // "Magpie Test"
   * console.log(organization.status); // "approved"
   * console.log(organization.branding.brand_color); // "#fffefd"
   * 
   * // Access payment method settings
   * const cardSettings = organization.payment_method_settings.card;
   * console.log(cardSettings.rate.mdr); // 0.029
   * console.log(cardSettings.status); // "approved"
   * 
   * // Access payout settings
   * console.log(organization.payout_settings.schedule); // "automatic"
   * console.log(organization.payout_settings.bank_code); // "BPI/BPI Family Savings Bank"
   * 
   * // Access metadata
   * console.log(organization.metadata.business_website); // "https://example.com"
   * ```
   */
  async me(
    options: RequestOptions = {},
  ): Promise<Organization & { lastResponse: LastResponse }> {
    const response = await this.client.get<Organization>(this.basePath, undefined, options);
    return this.attachLastResponse(response.data, response);
  }
}
