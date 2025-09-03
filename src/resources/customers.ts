import { BaseClient } from "../base-client";
import {
  Customer,
  CustomerCreateParams,
  CustomerUpdateParams,
} from "../types/customer";
import { LastResponse, RequestOptions } from "../types/magpie";
import { BaseResource } from "./base";

export class CustomersResource extends BaseResource {
  constructor(client: BaseClient) {
    super(client, '/customers');
  }

  async create(
    params: CustomerCreateParams,
    options: RequestOptions = {},
  ): Promise<Customer & { lastResponse: LastResponse }> {
    return this.createResource<Customer, CustomerCreateParams>(params, options);
  }

  async retrieve(
    id: string,
    options: RequestOptions = {},
  ): Promise<Customer & { lastResponse: LastResponse }> {
    return this.retrieveResource<Customer>(id, options);
  }

  async update(
    id: string,
    params: CustomerUpdateParams,
    options: RequestOptions = {},
  ): Promise<Customer & { lastResponse: LastResponse }> {
    return this.updateResource<Customer, CustomerUpdateParams>(id, params, options);
  }

  async retrieveByEmail(
    email: string,
    options: RequestOptions = {},
  ): Promise<Customer & { lastResponse: LastResponse }> {
    return this.customResourceAction<Customer>('GET', `${this.buildPath()}/email`, { email }, options);
  }

  async attachSource(
    id: string,
    source: string,
    options: RequestOptions = {},
  ): Promise<Customer & { lastResponse: LastResponse }> {
    return this.customResourceAction<Customer>('POST', `${this.buildPath(id)}/sources`, { source }, options);
  }

  async detachSource(
    id: string,
    source: string,
    options: RequestOptions = {},
  ): Promise<Customer & { lastResponse: LastResponse }> {
    return this.customResourceAction<Customer>('DELETE', `${this.buildPath(id)}/sources/${source}`, undefined, options);
  }
}