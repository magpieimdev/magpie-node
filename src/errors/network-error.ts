import { MagpieError } from "./index";

export class NetworkError extends MagpieError {
  constructor(message: string, code?: string) {
    super({
      message,
      type: 'network_error',
      code: code ?? 'network_error',
    });
  }
}