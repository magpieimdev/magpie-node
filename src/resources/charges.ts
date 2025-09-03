import { BaseClient } from "../base-client";
import {
  Charge,
  ChargeCaptureParams,
  ChargeCreateParams,
  ChargeVerifyParams,
  LastResponse,
  RefundCreateParams,
  RequestOptions,
} from "../types";
import { BaseResource } from "./base";

export class ChargesResource extends BaseResource {
  constructor(client: BaseClient) {
    super(client, '/charges');
  }

  async create(
    params: ChargeCreateParams,
    options: RequestOptions = {},
  ): Promise<Charge & { lastResponse: LastResponse }> {
    return this.createResource<Charge, ChargeCreateParams>(params, options);
  }

  async retrieve(
    id: string,
    options: RequestOptions = {},
  ): Promise<Charge & { lastResponse: LastResponse }> {
    return this.retrieveResource<Charge>(id, options);
  }

  async capture(
    id: string,
    params: ChargeCaptureParams,
    options: RequestOptions = {},
  ): Promise<Charge & { lastResponse: LastResponse }> {
    return this.customResourceAction<Charge>('POST', `${this.buildPath(id)}/capture`, params, options);
  }

  async verify(
    id: string,
    params: ChargeVerifyParams,
    options: RequestOptions = {},
  ): Promise<Charge & { lastResponse: LastResponse }> {
    return this.customResourceAction<Charge>('POST', `${this.buildPath(id)}/verify`, params, options);
  }

  async void(
    id: string,
    options: RequestOptions = {},
  ): Promise<Charge & { lastResponse: LastResponse }> {
    return this.customResourceAction<Charge>('POST', `${this.buildPath(id)}/void`, undefined, options);
  }

  async refund(
    id: string,
    params: RefundCreateParams,
    options: RequestOptions = {},
  ): Promise<Charge & { lastResponse: LastResponse }> {
    return this.customResourceAction<Charge>('POST', `${this.buildPath(id)}/refund`, params, options);
  }
}