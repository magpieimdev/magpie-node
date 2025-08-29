import { MagpieError } from "./index";

export class ValidationError extends MagpieError {
  constructor(message: string, param?: string, requestId?: string) {
    super({
      message,
      type: 'validation_error',
      code: 'validation_failed',
      statusCode: 422,
      param,
      requestId,
    });
  }
}