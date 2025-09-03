import { BaseClient } from "../base-client";
import {
  CheckoutSession,
  CheckoutSessionCaptureParams,
  CheckoutSessionCreateParams,
  LastResponse,
  RequestOptions,
} from "../types";
import { BaseResource } from "./base";

export class CheckoutSessionsResource extends BaseResource {
  constructor(client: BaseClient) {
    // Use different base URL for checkout sessions
    super(client, '/', 'https://new.pay.magpie.im');
  }

  async create(
    params: CheckoutSessionCreateParams,
    options: RequestOptions = {},
  ): Promise<CheckoutSession & { lastResponse: LastResponse }> {
    return this.createResource<CheckoutSession, CheckoutSessionCreateParams>(params, options);
  }

  async retrieve(
    id: string,
    options: RequestOptions = {},
  ): Promise<CheckoutSession & { lastResponse: LastResponse }> {
    return this.retrieveResource<CheckoutSession>(id, options);
  }

  async capture(
    id: string,
    params: CheckoutSessionCaptureParams,
    options: RequestOptions = {},
  ): Promise<CheckoutSession & { lastResponse: LastResponse }> {
    return this.customResourceAction<CheckoutSession>('POST', `${this.buildPath(id)}/capture`, params, options);
  }

  async expire(
    id: string,
    options: RequestOptions = {},
  ): Promise<CheckoutSession & { lastResponse: LastResponse }> {
    return this.customResourceAction<CheckoutSession>('POST', `${this.buildPath(id)}/expire`, undefined, options);
  }
}