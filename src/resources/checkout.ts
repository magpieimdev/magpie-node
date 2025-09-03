import { BaseClient } from "../base-client";
import { CheckoutSessionsResource } from "./sessions";

export class CheckoutResource {
  public sessions: CheckoutSessionsResource;

  constructor(client: BaseClient) {
    this.sessions = new CheckoutSessionsResource(client);
  }
}