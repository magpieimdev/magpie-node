import { BaseClient } from "../base-client";
import {
  LastResponse,
  RequestOptions,
  Source,
  SourceCreateParams,
} from "../types";
import { BaseResource } from "./base";

export class SourcesResource extends BaseResource {
  constructor(client: BaseClient) {
    super(client, '/sources');
  }

  async create(
    params: SourceCreateParams,
    options: RequestOptions = {},
  ): Promise<Source & { lastResponse: LastResponse }> {
    return this.createResource<Source, SourceCreateParams>(params, options);
  }

  async retrieve(
    id: string,
    options: RequestOptions = {},
  ): Promise<Source & { lastResponse: LastResponse }> {
    return this.retrieveResource<Source>(id, options);
  }
}