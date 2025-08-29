import { MagpieError } from "./index";

export class RateLimitError extends MagpieError {
  constructor(message: string = 'Too many requests', requestId?: string) {
    super({
      message,
      type: 'rate_limit_error',
      code: 'rate_limit_exceeded',
      statusCode: 429,
      requestId,
    });
  }
}
  