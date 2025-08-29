import { BaseClient } from "./base-client";
import { MagpieConfig } from "./types/magpie";

export class Magpie extends BaseClient {
  constructor(secretKey: string, config?: MagpieConfig) {
    super(secretKey, config);
  }
}