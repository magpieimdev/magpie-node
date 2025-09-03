import { BaseClient } from "../base-client";
import {
  LastResponse,
  PaymentRequest,
  PaymentRequestCreateParams,
  PaymentRequestVoidParams,
  RequestOptions,
} from "../types";
import { BaseResource } from "./base";

export class PaymentRequestsResource extends BaseResource {
   constructor(client: BaseClient) {
    super(client, '/requests', 'https://request.magpie.im/api/v1');
  }

  async create(
    params: PaymentRequestCreateParams,
    options: RequestOptions = {},
  ): Promise<PaymentRequest & { lastResponse: LastResponse }> {
    return this.createResource<PaymentRequest, PaymentRequestCreateParams>(params, options);
  }

  async retrieve(
    id: string,
    options: RequestOptions = {},
  ): Promise<PaymentRequest & { lastResponse: LastResponse }> {
    return this.retrieveResource<PaymentRequest>(id, options);
  }

  async resend(
    id: string,
    options: RequestOptions = {},
  ): Promise<PaymentRequest & { lastResponse: LastResponse }> {
    return this.customResourceAction<PaymentRequest>('POST', `${this.buildPath(id)}/resend`, undefined, options);
  }

  async void(
    id: string,
    params: PaymentRequestVoidParams,
    options: RequestOptions = {},
  ): Promise<PaymentRequest & { lastResponse: LastResponse }> {
    return this.customResourceAction<PaymentRequest>('POST', `${this.buildPath(id)}/void`, params, options);
  }
}
