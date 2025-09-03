import { BaseClient } from "../base-client";
import {
  LastResponse,
  PaymentLink,
  PaymentLinkCreateParams,
  PaymentLinkUpdateParams,
  RequestOptions,
} from "../types";
import { BaseResource } from "./base";

export class PaymentLinksResource extends BaseResource {
  constructor(client: BaseClient) {
    super(client, '/links', 'https://buy.magpie.im/api/v1');
  }

  async create(
    params: PaymentLinkCreateParams,
    options: RequestOptions = {},
  ): Promise<PaymentLink & { lastResponse: LastResponse }> {
    return this.createResource<PaymentLink, PaymentLinkCreateParams>(params, options);
  }

  async retrieve(
    id: string,
    options: RequestOptions = {},
  ): Promise<PaymentLink & { lastResponse: LastResponse }> {
    return this.retrieveResource<PaymentLink>(id, options);
  }

  async update(
    id: string,
    params: PaymentLinkUpdateParams,
    options: RequestOptions = {},
  ): Promise<PaymentLink & { lastResponse: LastResponse }> {
    return this.updateResource<PaymentLink, PaymentLinkUpdateParams>(id, params, options);
  }

  async activate(
    id: string,
    options: RequestOptions = {},
  ): Promise<PaymentLink & { lastResponse: LastResponse }> {
    return this.customResourceAction<PaymentLink>('POST', `${this.buildPath(id)}/activate`, undefined, options);
  }

  async deactivate(
    id: string,
    options: RequestOptions = {},
  ): Promise<PaymentLink & { lastResponse: LastResponse }> {
    return this.customResourceAction<PaymentLink>('POST', `${this.buildPath(id)}/deactivate`, undefined, options);
  }
}