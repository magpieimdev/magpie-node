import { MagpieError } from "./index";

export class AuthenticationError extends MagpieError {
  constructor(message: string, requestId?: string) {
    super({
      message,
      type: 'authentication_error',
      code: 'authentication_failed',
      statusCode: 401,
      requestId,
    });
  }
}