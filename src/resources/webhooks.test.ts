/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import crypto from 'crypto';
import { WebhooksResource } from './webhooks';
import { MagpieError } from '../errors';
import { 
  createTestWebhookEvent, 
  createTestWebhookHeaders, 
  createTestWebhookConfig 
} from '../__tests__/testUtils';

describe('WebhooksResource', () => {
  let webhooks: WebhooksResource;
  const testSecret = 'whsec_test_secret';
  const testPayload = JSON.stringify(createTestWebhookEvent());

  beforeEach(() => {
    webhooks = new WebhooksResource();
  });

  // Helper function to generate valid signature
  const generateValidSignature = (payload: string | Buffer, secret: string, algorithm = 'sha256', prefix = 'v1='): string => {
    const signature = crypto.createHmac(algorithm, secret).update(payload).digest('hex');
    return `${prefix}${signature}`;
  };

  describe('verifySignature', () => {
    it('should verify valid signature', () => {
      const validSignature = generateValidSignature(testPayload, testSecret);

      const isValid = webhooks.verifySignature(testPayload, validSignature, testSecret);

      expect(isValid).toBe(true);
    });

    it('should reject invalid signature', () => {
      const invalidSignature = 'v1=invalid_signature_hash';

      const isValid = webhooks.verifySignature(testPayload, invalidSignature, testSecret);

      expect(isValid).toBe(false);
    });

    it('should reject signature with wrong secret', () => {
      const signatureWithWrongSecret = generateValidSignature(testPayload, 'wrong_secret');

      const isValid = webhooks.verifySignature(testPayload, signatureWithWrongSecret, testSecret);

      expect(isValid).toBe(false);
    });

    it('should work with Buffer payload', () => {
      const bufferPayload = Buffer.from(testPayload, 'utf8');
      const validSignature = generateValidSignature(bufferPayload, testSecret);

      const isValid = webhooks.verifySignature(bufferPayload, validSignature, testSecret);

      expect(isValid).toBe(true);
    });

    it('should handle different signature algorithms', () => {
      const sha1Signature = generateValidSignature(testPayload, testSecret, 'sha1');
      const sha512Signature = generateValidSignature(testPayload, testSecret, 'sha512');

      const sha1Valid = webhooks.verifySignature(testPayload, sha1Signature, testSecret, { algorithm: 'sha1' });
      const sha512Valid = webhooks.verifySignature(testPayload, sha512Signature, testSecret, { algorithm: 'sha512' });

      expect(sha1Valid).toBe(true);
      expect(sha512Valid).toBe(true);
    });

    it('should handle custom signature prefix', () => {
      const customPrefix = 'v2=';
      const validSignature = generateValidSignature(testPayload, testSecret, 'sha256', customPrefix);

      const isValid = webhooks.verifySignature(testPayload, validSignature, testSecret, { prefix: customPrefix });

      expect(isValid).toBe(true);
    });

    it('should reject signature with wrong prefix', () => {
      const signatureWithWrongPrefix = `v2=${generateValidSignature(testPayload, testSecret).slice(3)}`;

      const isValid = webhooks.verifySignature(testPayload, signatureWithWrongPrefix, testSecret);

      expect(isValid).toBe(false);
    });

    it('should handle malformed signature gracefully', () => {
      const malformedSignatures = [
        'invalid_format',
        '',
        'v1=',
        'no_prefix_here',
        null,
        undefined
      ];

      malformedSignatures.forEach((sig) => {
        const isValid = webhooks.verifySignature(testPayload, sig as any, testSecret);
        expect(isValid).toBe(false);
      });
    });
  });

  describe('verifySignatureWithTimestamp', () => {
    const currentTimestamp = Math.floor(Date.now() / 1000);

    it('should verify valid signature with timestamp', () => {
      const validSignature = generateValidSignature(testPayload, testSecret);
      const headers = createTestWebhookHeaders(validSignature, currentTimestamp);

      const isValid = webhooks.verifySignatureWithTimestamp(testPayload, headers, testSecret);

      expect(isValid).toBe(true);
    });

    it('should verify signature without timestamp', () => {
      const validSignature = generateValidSignature(testPayload, testSecret);
      const headers = createTestWebhookHeaders(validSignature); // No timestamp

      const isValid = webhooks.verifySignatureWithTimestamp(testPayload, headers, testSecret);

      expect(isValid).toBe(true);
    });

    it('should throw error when signature header is missing', () => {
      const headers = { 'content-type': 'application/json' };

      expect(() => {
        webhooks.verifySignatureWithTimestamp(testPayload, headers, testSecret);
      }).toThrow(MagpieError);

      expect(() => {
        webhooks.verifySignatureWithTimestamp(testPayload, headers, testSecret);
      }).toThrow('Missing signature header: x-magpie-signature');
    });

    it('should throw error when timestamp is too old', () => {
      const oldTimestamp = currentTimestamp - 400; // 400 seconds ago (beyond 300s tolerance)
      const validSignature = generateValidSignature(testPayload, testSecret);
      const headers = createTestWebhookHeaders(validSignature, oldTimestamp);

      expect(() => {
        webhooks.verifySignatureWithTimestamp(testPayload, headers, testSecret);
      }).toThrow(MagpieError);

      expect(() => {
        webhooks.verifySignatureWithTimestamp(testPayload, headers, testSecret);
      }).toThrow('Webhook timestamp is outside tolerance window');
    });

    it('should throw error when timestamp is too new', () => {
      const futureTimestamp = currentTimestamp + 400; // 400 seconds in the future
      const validSignature = generateValidSignature(testPayload, testSecret);
      const headers = createTestWebhookHeaders(validSignature, futureTimestamp);

      expect(() => {
        webhooks.verifySignatureWithTimestamp(testPayload, headers, testSecret);
      }).toThrow(MagpieError);
    });

    it('should handle custom tolerance', () => {
      const oldTimestamp = currentTimestamp - 500; // 500 seconds ago
      const validSignature = generateValidSignature(testPayload, testSecret);
      const headers = createTestWebhookHeaders(validSignature, oldTimestamp);

      // Should fail with default tolerance (300s)
      expect(() => {
        webhooks.verifySignatureWithTimestamp(testPayload, headers, testSecret);
      }).toThrow(MagpieError);

      // Should pass with custom tolerance (600s)
      const isValid = webhooks.verifySignatureWithTimestamp(testPayload, headers, testSecret, { tolerance: 600 });
      expect(isValid).toBe(true);
    });

    it('should handle custom header names', () => {
      const validSignature = generateValidSignature(testPayload, testSecret);
      const customHeaders = {
        'custom-signature': validSignature,
        'custom-timestamp': currentTimestamp.toString()
      };

      const isValid = webhooks.verifySignatureWithTimestamp(testPayload, customHeaders, testSecret, {
        signatureHeader: 'custom-signature',
        timestampHeader: 'custom-timestamp'
      });

      expect(isValid).toBe(true);
    });

    it('should handle header case insensitivity', () => {
      const validSignature = generateValidSignature(testPayload, testSecret);
      const headers = {
        'x-magpie-signature': validSignature, // Standard case
        'X-MAGPIE-TIMESTAMP': currentTimestamp.toString() // Mixed case timestamp
      };

      const isValid = webhooks.verifySignatureWithTimestamp(testPayload, headers, testSecret);

      expect(isValid).toBe(true);
    });

    it('should handle array header values', () => {
      const validSignature = generateValidSignature(testPayload, testSecret);
      const headers = {
        'x-magpie-signature': [validSignature, 'secondary_signature'], // Array with multiple values
        'x-magpie-timestamp': currentTimestamp.toString()
      };

      const isValid = webhooks.verifySignatureWithTimestamp(testPayload, headers, testSecret);

      expect(isValid).toBe(true);
    });
  });

  describe('constructEvent', () => {
    it('should construct event from valid payload and signature', () => {
      const validSignature = generateValidSignature(testPayload, testSecret);

      const event = webhooks.constructEvent(testPayload, validSignature, testSecret);

      expect(event).toMatchObject({
        id: 'evt_test_webhook',
        type: 'payment.completed',
        data: {
          object: {
            id: 'ch_test_123',
            amount: 50000,
            currency: 'php',
            status: 'succeeded'
          }
        },
        livemode: false
      });
    });

    it('should work with Buffer payload', () => {
      const bufferPayload = Buffer.from(testPayload, 'utf8');
      const validSignature = generateValidSignature(bufferPayload, testSecret);

      const event = webhooks.constructEvent(bufferPayload, validSignature, testSecret);

      expect(event.id).toBe('evt_test_webhook');
      expect(event.type).toBe('payment.completed');
    });

    it('should throw error for invalid signature', () => {
      const invalidSignature = 'v1=invalid_signature';

      expect(() => {
        webhooks.constructEvent(testPayload, invalidSignature, testSecret);
      }).toThrow(MagpieError);

      expect(() => {
        webhooks.constructEvent(testPayload, invalidSignature, testSecret);
      }).toThrow('Invalid webhook signature');
    });

    it('should throw error for invalid JSON payload', () => {
      const invalidJsonPayload = '{ invalid json }';
      const validSignature = generateValidSignature(invalidJsonPayload, testSecret);

      expect(() => {
        webhooks.constructEvent(invalidJsonPayload, validSignature, testSecret);
      }).toThrow(MagpieError);

      expect(() => {
        webhooks.constructEvent(invalidJsonPayload, validSignature, testSecret);
      }).toThrow('Invalid JSON in webhook payload');
    });

    it('should handle different event types', () => {
      const customerEvent = createTestWebhookEvent({
        type: 'customer.created',
        data: {
          object: {
            id: 'cus_test_123',
            email: 'customer@example.com'
          }
        }
      });

      const customerPayload = JSON.stringify(customerEvent);
      const validSignature = generateValidSignature(customerPayload, testSecret);

      const event = webhooks.constructEvent(customerPayload, validSignature, testSecret);

      expect(event.type).toBe('customer.created');
      expect((event.data.object as any).id).toBe('cus_test_123');
    });

    it('should preserve all event properties', () => {
      const completeEvent = createTestWebhookEvent({
        id: 'evt_complete_test',
        type: 'charge.succeeded',
        created: 1609459200,
        livemode: true,
        api_version: '2024-01-01',
        pending_webhooks: 1,
        request: {
          id: 'req_test_123',
          idempotency_key: 'idem_key_456'
        }
      });

      const completePayload = JSON.stringify(completeEvent);
      const validSignature = generateValidSignature(completePayload, testSecret);

      const event = webhooks.constructEvent(completePayload, validSignature, testSecret);

      expect(event.id).toBe('evt_complete_test');
      expect(event.livemode).toBe(true);
      expect(event.api_version).toBe('2024-01-01');
      expect(event.pending_webhooks).toBe(1);
      expect(event.request?.id).toBe('req_test_123');
    });
  });

  describe('generateTestSignature', () => {
    it('should generate valid test signature', () => {
      const testSignature = webhooks.generateTestSignature(testPayload, testSecret);

      // Verify that the generated signature is valid
      const isValid = webhooks.verifySignature(testPayload, testSignature, testSecret);

      expect(isValid).toBe(true);
      expect(testSignature).toMatch(/^v1=[a-f0-9]{64}$/); // SHA256 produces 64 hex chars
    });

    it('should handle different algorithms', () => {
      const sha1Signature = webhooks.generateTestSignature(testPayload, testSecret, 'sha1');
      const sha512Signature = webhooks.generateTestSignature(testPayload, testSecret, 'sha512');

      expect(sha1Signature).toMatch(/^v1=[a-f0-9]{40}$/); // SHA1 produces 40 hex chars  
      expect(sha512Signature).toMatch(/^v1=[a-f0-9]{128}$/); // SHA512 produces 128 hex chars

      // Verify signatures work
      expect(webhooks.verifySignature(testPayload, sha1Signature, testSecret, { algorithm: 'sha1' })).toBe(true);
      expect(webhooks.verifySignature(testPayload, sha512Signature, testSecret, { algorithm: 'sha512' })).toBe(true);
    });

    it('should handle custom prefix', () => {
      const customPrefix = 'v2=';
      const testSignature = webhooks.generateTestSignature(testPayload, testSecret, 'sha256', customPrefix);

      expect(testSignature).toMatch(/^v2=[a-f0-9]{64}$/);
      expect(webhooks.verifySignature(testPayload, testSignature, testSecret, { prefix: customPrefix })).toBe(true);
    });

    it('should work with Buffer payload', () => {
      const bufferPayload = Buffer.from(testPayload, 'utf8');
      const testSignature = webhooks.generateTestSignature(bufferPayload, testSecret);

      expect(webhooks.verifySignature(bufferPayload, testSignature, testSecret)).toBe(true);
    });

    it('should generate different signatures for different payloads', () => {
      const payload1 = JSON.stringify(createTestWebhookEvent({ id: 'evt_1' }));
      const payload2 = JSON.stringify(createTestWebhookEvent({ id: 'evt_2' }));

      const signature1 = webhooks.generateTestSignature(payload1, testSecret);
      const signature2 = webhooks.generateTestSignature(payload2, testSecret);

      expect(signature1).not.toBe(signature2);
    });

    it('should generate same signature for same payload and secret', () => {
      const signature1 = webhooks.generateTestSignature(testPayload, testSecret);
      const signature2 = webhooks.generateTestSignature(testPayload, testSecret);

      expect(signature1).toBe(signature2);
    });
  });

  describe('isValidTimestamp', () => {
    it('should validate current timestamp', () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const isValid = webhooks.isValidTimestamp(currentTime);
      expect(isValid).toBe(true);
    });

    it('should validate recent timestamp within tolerance', () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const recentTimestamp = currentTime - 200; // 200 seconds ago

      const isValid = webhooks.isValidTimestamp(recentTimestamp);
      expect(isValid).toBe(true);
    });

    it('should reject old timestamp beyond tolerance', () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const oldTimestamp = currentTime - 400; // 400 seconds ago (beyond default 300s)

      const isValid = webhooks.isValidTimestamp(oldTimestamp);
      expect(isValid).toBe(false);
    });

    it('should reject future timestamp beyond tolerance', () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const futureTimestamp = currentTime + 400; // 400 seconds in the future

      const isValid = webhooks.isValidTimestamp(futureTimestamp);
      expect(isValid).toBe(false);
    });

    it('should handle custom tolerance', () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const oldTimestamp = currentTime - 500; // 500 seconds ago

      // Should fail with default tolerance
      expect(webhooks.isValidTimestamp(oldTimestamp)).toBe(false);

      // Should pass with custom tolerance
      expect(webhooks.isValidTimestamp(oldTimestamp, 600)).toBe(true);
    });

    it('should handle edge cases for tolerance boundaries', () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const tolerance = 300;

      // Use a safe boundary that accounts for timing differences
      // Test timestamps that are clearly within and beyond tolerance
      expect(webhooks.isValidTimestamp(currentTime - tolerance + 5, tolerance)).toBe(true);
      expect(webhooks.isValidTimestamp(currentTime + tolerance - 5, tolerance)).toBe(true);

      // Test timestamps that are clearly beyond the boundary
      expect(webhooks.isValidTimestamp(currentTime - tolerance - 5, tolerance)).toBe(false);
      expect(webhooks.isValidTimestamp(currentTime + tolerance + 5, tolerance)).toBe(false);
    });

    it('should handle zero tolerance', () => {
      // For zero tolerance, use a timestamp that's guaranteed to be within the same second
      // but add a small buffer to account for timing differences
      const now = Math.floor(Date.now() / 1000);
      expect(webhooks.isValidTimestamp(now, 1)).toBe(true); // 1 second tolerance
      expect(webhooks.isValidTimestamp(now - 2, 0)).toBe(false);
      expect(webhooks.isValidTimestamp(now + 2, 0)).toBe(false);
    });

    it('should handle negative tolerance correctly', () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const recentTimestamp = currentTime - 100;
      
      // Negative tolerance should fail validation (not treated as absolute)
      expect(webhooks.isValidTimestamp(recentTimestamp, -200)).toBe(false);
      
      // Only positive tolerance should work
      expect(webhooks.isValidTimestamp(recentTimestamp, 200)).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle various payload types gracefully', () => {
      const validSignature = generateValidSignature(testPayload, testSecret);

      // Empty string
      expect(webhooks.verifySignature('', validSignature, testSecret)).toBe(false);

      // Empty buffer
      expect(webhooks.verifySignature(Buffer.alloc(0), validSignature, testSecret)).toBe(false);
    });

    it('should handle empty or null secrets', () => {
      const validSignature = generateValidSignature(testPayload, testSecret);

      expect(webhooks.verifySignature(testPayload, validSignature, '')).toBe(false);
      expect(webhooks.verifySignature(testPayload, validSignature, null as any)).toBe(false);
      expect(webhooks.verifySignature(testPayload, validSignature, undefined as any)).toBe(false);
    });

    it('should maintain security with timing attack resistance', () => {
      const validSignature = generateValidSignature(testPayload, testSecret);
      const invalidSignature = `v1=${'a'.repeat(64)}`; // Same length but invalid

      // Both should be consistent in timing (we can't test actual timing, but we test they don't throw)
      expect(webhooks.verifySignature(testPayload, validSignature, testSecret)).toBe(true);
      expect(webhooks.verifySignature(testPayload, invalidSignature, testSecret)).toBe(false);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete webhook verification workflow', () => {
      // 1. Generate test signature
      const signature = webhooks.generateTestSignature(testPayload, testSecret);

      // 2. Create headers
      const headers = createTestWebhookHeaders(signature, Math.floor(Date.now() / 1000));

      // 3. Verify signature with timestamp
      const isValid = webhooks.verifySignatureWithTimestamp(testPayload, headers, testSecret);
      expect(isValid).toBe(true);

      // 4. Construct event
      const event = webhooks.constructEvent(testPayload, signature, testSecret);
      expect(event.type).toBe('payment.completed');
    });

    it('should handle webhook with custom configuration', () => {
      const customConfig = createTestWebhookConfig({
        algorithm: 'sha512',
        prefix: 'v2=',
        signatureHeader: 'x-custom-signature',
        timestampHeader: 'x-custom-timestamp',
        tolerance: 600
      });

      // Generate signature with custom settings
      const signature = webhooks.generateTestSignature(testPayload, testSecret, 'sha512', 'v2=');

      // Create headers with custom header names
      const headers = {
        'x-custom-signature': signature,
        'x-custom-timestamp': Math.floor(Date.now() / 1000).toString()
      };

      // Verify with custom configuration
      const isValid = webhooks.verifySignatureWithTimestamp(testPayload, headers, testSecret, customConfig);
      expect(isValid).toBe(true);

      // Construct event with custom configuration  
      const event = webhooks.constructEvent(testPayload, signature, testSecret, customConfig);
      expect(event.type).toBe('payment.completed');
    });

    it('should handle multiple webhook event types', () => {
      const eventTypes = [
        'customer.created',
        'charge.succeeded', 
        'payment_request.completed',
        'checkout_session.expired',
        'payment_link.updated'
      ];

      eventTypes.forEach(eventType => {
        const eventPayload = JSON.stringify(createTestWebhookEvent({ type: eventType }));
        const signature = webhooks.generateTestSignature(eventPayload, testSecret);

        const event = webhooks.constructEvent(eventPayload, signature, testSecret);
        expect(event.type).toBe(eventType);
      });
    });
  });
});