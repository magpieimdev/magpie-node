/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { createTestCharge, getSpyableMagpie } from '../__tests__/testUtils';

describe('ChargesResource', () => {
  let magpie: ReturnType<typeof getSpyableMagpie>;

  beforeEach(() => {
    magpie = getSpyableMagpie('sk_test_123');
  });

  describe('create', () => {
    it('should send POST request to /charges', async () => {
      const chargeData = createTestCharge();
      
      await magpie.charges.create(chargeData as any);
      
      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        url: expect.stringContaining('/charges'),
        data: chargeData
      });
    });

    it('should handle minimal charge creation', async () => {
      const minimalData = {
        amount: 10000,
        currency: 'php',
        source: 'src_test_123',
        description: 'Minimal test charge',
        statement_descriptor: 'Test Payment',
        capture: true
      };
      
      await magpie.charges.create(minimalData as any);
      
      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        data: minimalData
      });
    });

    it('should handle charge creation with description', async () => {
      const chargeData = {
        ...createTestCharge(),
        description: 'Payment for order #1234'
      };
      
      await magpie.charges.create(chargeData as any);
      
      expect(magpie.LAST_REQUEST?.data).toEqual(chargeData);
    });

    it('should handle charge creation with capture flag', async () => {
      const chargeData = {
        ...createTestCharge(),
        capture: false
      };
      
      await magpie.charges.create(chargeData as any);
      
      expect(magpie.LAST_REQUEST?.data).toEqual(chargeData);
    });

    it('should handle charge creation with metadata', async () => {
      const chargeData = {
        ...createTestCharge(),
        metadata: {
          order_id: '1234',
          customer_segment: 'premium'
        }
      };
      
      await magpie.charges.create(chargeData as any);
      
      expect(magpie.LAST_REQUEST?.data).toEqual(chargeData);
    });
  });

  describe('retrieve', () => {
    it('should send GET request to /charges/:id', async () => {
      const chargeId = 'ch_test_123';
      
      await magpie.charges.retrieve(chargeId);
      
      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'GET',
        url: expect.stringContaining(`/charges/${chargeId}`)
      });
    });

    it('should handle charge ID parameter correctly', async () => {
      const chargeId = 'ch_special_characters_123';
      
      await magpie.charges.retrieve(chargeId);
      
      expect(magpie.LAST_REQUEST?.url).toContain(chargeId);
    });
  });

  describe('capture', () => {
    it('should send POST request to /charges/:id/capture', async () => {
      const chargeId = 'ch_test_123';
      const captureData = { amount: 15000 };
      
      await magpie.charges.capture(chargeId, captureData);
      
      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        url: expect.stringContaining(`/charges/${chargeId}/capture`),
        data: captureData
      });
    });

    it('should handle capture with specific amount', async () => {
      const chargeId = 'ch_test_123';
      const captureData = { amount: 10000 };
      
      await magpie.charges.capture(chargeId, captureData);
      
      expect(magpie.LAST_REQUEST?.data).toEqual(captureData);
    });

    it('should handle partial capture', async () => {
      const chargeId = 'ch_test_123';
      const captureData = {
        amount: 5000,
        description: 'Partial capture for shipping'
      };
      
      await magpie.charges.capture(chargeId, captureData);
      
      expect(magpie.LAST_REQUEST?.data).toEqual(captureData);
    });
  });

  describe('verify', () => {
    it('should send POST request to /charges/:id/verify', async () => {
      const chargeId = 'ch_test_123';
      const verifyData = {
        confirmation_id: '1234567890',
        otp: '123456'
      };
      
      await magpie.charges.verify(chargeId, verifyData);
      
      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        url: expect.stringContaining(`/charges/${chargeId}/verify`),
        data: verifyData
      });
    });

    it('should handle verification with confirmation_id and otp', async () => {
      const chargeId = 'ch_test_123';
      const verifyData = {
        confirmation_id: '9876543210',
        otp: '654321'
      };
      
      await magpie.charges.verify(chargeId, verifyData);
      
      expect(magpie.LAST_REQUEST?.data).toEqual(verifyData);
    });

    it('should handle verification with additional metadata', async () => {
      const chargeId = 'ch_test_123';
      const verifyData = {
        confirmation_id: '1234567890',
        otp: '123456',
        metadata: {
          verification_source: 'mobile_app'
        }
      };
      
      await magpie.charges.verify(chargeId, verifyData);
      
      expect(magpie.LAST_REQUEST?.data).toEqual(verifyData);
    });
  });

  describe('void', () => {
    it('should send POST request to /charges/:id/void', async () => {
      const chargeId = 'ch_test_123';
      
      await magpie.charges.void(chargeId);
      
      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        url: expect.stringContaining(`/charges/${chargeId}/void`),
        data: undefined
      });
    });

    it('should handle void with options', async () => {
      const chargeId = 'ch_test_123';
      const idempotencyKey = 'void_key_123';
      
      await magpie.charges.void(chargeId, { idempotencyKey });
      
      expect(magpie.LAST_REQUEST?.headers).toMatchObject({
        'X-Idempotency-Key': idempotencyKey
      });
    });
  });

  describe('refund', () => {
    it('should send POST request to /charges/:id/refund', async () => {
      const chargeId = 'ch_test_123';
      const refundData = {
        amount: 5000,
        reason: 'requested_by_customer'
      };
      
      await magpie.charges.refund(chargeId, refundData);
      
      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        url: expect.stringContaining(`/charges/${chargeId}/refund`),
        data: refundData
      });
    });

    it('should handle full refund', async () => {
      const chargeId = 'ch_test_123';
      const refundData = {
        amount: 10000,
        reason: 'duplicate'
      };
      
      await magpie.charges.refund(chargeId, refundData);
      
      expect(magpie.LAST_REQUEST?.data).toEqual(refundData);
    });

    it('should handle refund with metadata', async () => {
      const chargeId = 'ch_test_123';
      const refundData = {
        amount: 7500,
        reason: 'requested_by_customer',
        metadata: {
          refund_request_id: 'req_123',
          agent_id: 'agent_456'
        }
      };
      
      await magpie.charges.refund(chargeId, refundData);
      
      expect(magpie.LAST_REQUEST?.data).toEqual(refundData);
    });
  });

  describe('request options', () => {
    it('should handle idempotency key in create request', async () => {
      const chargeData = createTestCharge();
      const idempotencyKey = 'test_key_123';
      
      await magpie.charges.create(chargeData as any, { idempotencyKey });
      
      expect(magpie.LAST_REQUEST?.headers).toMatchObject({
        'X-Idempotency-Key': idempotencyKey
      });
    });

    it('should handle idempotency key in capture request', async () => {
      const chargeId = 'ch_test_123';
      const captureData = { amount: 10000 };
      const idempotencyKey = 'capture_key_456';
      
      await magpie.charges.capture(chargeId, captureData, { idempotencyKey });
      
      expect(magpie.LAST_REQUEST?.headers).toMatchObject({
        'X-Idempotency-Key': idempotencyKey
      });
    });

    it('should handle expand options', async () => {
      const chargeId = 'ch_test_123';
      
      await magpie.charges.retrieve(chargeId, { expand: ['customer', 'source'] });
      
      expect(magpie.LAST_REQUEST?.params).toMatchObject({
        expand: ['customer', 'source']
      });
    });
  });

  describe('error cases', () => {
    it('should handle invalid charge ID format', async () => {
      const invalidId = '';
      
      await magpie.charges.retrieve(invalidId);
      
      expect(magpie.LAST_REQUEST?.url).toContain('/charges');
    });

    it('should handle special characters in charge ID', async () => {
      const chargeId = 'ch_test@123#456';
      
      await magpie.charges.retrieve(chargeId);
      
      expect(magpie.LAST_REQUEST?.url).toContain(chargeId);
    });
  });

  describe('currency handling', () => {
    it('should handle PHP currency', async () => {
      const chargeData = {
        amount: 50000,
        currency: 'php',
        source: 'src_test_123',
        description: 'PHP payment',
        statement_descriptor: 'PHP Payment',
        capture: true
      };
      
      await magpie.charges.create(chargeData as any);
      
      expect(magpie.LAST_REQUEST?.data).toEqual(chargeData);
    });

    it('should handle USD currency', async () => {
      const chargeData = {
        amount: 10000,
        currency: 'usd',
        source: 'src_test_123',
        description: 'USD payment',
        statement_descriptor: 'USD Payment',
        capture: true
      };
      
      await magpie.charges.create(chargeData as any);
      
      expect(magpie.LAST_REQUEST?.data).toEqual(chargeData);
    });
  });
});