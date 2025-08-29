import { MagpieError } from "./index";

export class ConfigurationError extends MagpieError {
  constructor(message: string) {
    super({
      message,
      type: 'configuration_error',
      code: 'configuration_error',
    });
  }
}