import { randomBytes } from 'crypto';

export class IdempotencyKey {
  static generate(): string {
    return randomBytes(16).toString('hex');
  }

  static isValid(key: string): boolean {
    return typeof key === 'string' && key.length >= 1 && key.length <= 255;
  }
}