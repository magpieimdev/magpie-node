/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { createTestCheckoutSession, createTestLineItem, getSpyableMagpie } from '../__tests__/testUtils';

describe('CheckoutSessionsResource', () => {
  let magpie: ReturnType<typeof getSpyableMagpie>;

  beforeEach(() => {
    magpie = getSpyableMagpie('sk_test_123');
  });

  describe('create', () => {
    it('should send POST request to / with session data', async () => {
      const sessionData = createTestCheckoutSession({
        line_items: [createTestLineItem({
          amount: 50000,
          description: 'Premium Plan'
        })]
      });

      await magpie.checkout.sessions.create(sessionData as any);

      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        url: expect.stringContaining('/'),
        data: sessionData
      });
    });

    it('should handle complex session creation with all parameters', async () => {
      const sessionData = createTestCheckoutSession({
        line_items: [
          createTestLineItem({
            amount: 25000,
            description: 'Pro Plan Monthly',
            quantity: 1,
            image: 'https://example.com/product.jpg'
          }),
          createTestLineItem({
            amount: 5000,
            description: 'Setup Fee'
          })
        ],
        success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
        customer_email: 'customer@example.com',
        payment_method_types: ['card', 'gcash'],
        metadata: {
          order_id: 'order_123',
          source: 'website'
        }
      });

      await magpie.checkout.sessions.create(sessionData as any);

      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        data: sessionData
      });
    });

    it('should handle minimal session creation', async () => {
      const minimalData = createTestCheckoutSession({
        line_items: [createTestLineItem({ description: 'Basic Product' })]
      });

      await magpie.checkout.sessions.create(minimalData as any);

      expect(magpie.LAST_REQUEST?.data).toEqual(minimalData);
    });

    it('should use correct base URL for checkout sessions', async () => {
      const sessionData = createTestCheckoutSession();

      await magpie.checkout.sessions.create(sessionData as any);

      expect(magpie.LAST_REQUEST?.config?.baseURL).toBe('https://api.pay.magpie.im');
    });
  });

  describe('retrieve', () => {
    it('should send GET request to /:id', async () => {
      const sessionId = 'cs_test_123';

      await magpie.checkout.sessions.retrieve(sessionId);

      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'GET',
        url: expect.stringContaining(`/${sessionId}`)
      });
    });

    it('should handle session ID parameter correctly', async () => {
      const sessionId = 'cs_special_characters_123';

      await magpie.checkout.sessions.retrieve(sessionId);

      expect(magpie.LAST_REQUEST?.url).toContain(sessionId);
    });

    it('should use correct base URL for session retrieval', async () => {
      const sessionId = 'cs_test_123';

      await magpie.checkout.sessions.retrieve(sessionId);

      expect(magpie.LAST_REQUEST?.config?.baseURL).toBe('https://api.pay.magpie.im');
    });
  });

  describe('capture', () => {
    it('should send POST request to /:id/capture', async () => {
      const sessionId = 'cs_test_123';
      const captureData = { amount: 20000 };

      await magpie.checkout.sessions.capture(sessionId, captureData);

      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        url: expect.stringContaining(`/${sessionId}/capture`),
        data: captureData
      });
    });

    it('should handle partial capture', async () => {
      const sessionId = 'cs_test_123';
      const captureData = { 
        amount: 15000
      };

      await magpie.checkout.sessions.capture(sessionId, captureData);

      expect(magpie.LAST_REQUEST?.data).toEqual(captureData);
    });

    it('should handle capture with minimum amount', async () => {
      const sessionId = 'cs_test_123';
      const captureData = { amount: 100 };

      await magpie.checkout.sessions.capture(sessionId, captureData);

      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        url: expect.stringContaining('/capture'),
        data: captureData
      });
    });
  });

  describe('expire', () => {
    it('should send POST request to /:id/expire', async () => {
      const sessionId = 'cs_test_123';

      await magpie.checkout.sessions.expire(sessionId);

      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        url: expect.stringContaining(`/${sessionId}/expire`)
      });
    });

    it('should not include request data for expire action', async () => {
      const sessionId = 'cs_test_123';

      await magpie.checkout.sessions.expire(sessionId);

      expect(magpie.LAST_REQUEST?.data).toBeUndefined();
    });

    it('should handle expire for different session IDs', async () => {
      const sessionIds = ['cs_test_123', 'cs_another_456', 'cs_final_789'];

      for (const sessionId of sessionIds) {
        await magpie.checkout.sessions.expire(sessionId);
        expect(magpie.LAST_REQUEST?.url).toContain(`/${sessionId}/expire`);
      }
    });
  });

  describe('request options', () => {
    it('should handle idempotency key in create request', async () => {
      const sessionData = createTestCheckoutSession();
      const idempotencyKey = 'session_create_key_123';

      await magpie.checkout.sessions.create(sessionData as any, { idempotencyKey });

      expect(magpie.LAST_REQUEST?.headers).toMatchObject({
        'X-Idempotency-Key': idempotencyKey
      });
    });

    it('should handle idempotency key in capture request', async () => {
      const sessionId = 'cs_test_123';
      const captureData = { amount: 20000 };
      const idempotencyKey = 'capture_key_456';

      await magpie.checkout.sessions.capture(sessionId, captureData, { idempotencyKey });

      expect(magpie.LAST_REQUEST?.headers).toMatchObject({
        'X-Idempotency-Key': idempotencyKey
      });
    });

    it('should handle request timeout option', async () => {
      const sessionData = createTestCheckoutSession();

      await magpie.checkout.sessions.create(sessionData as any, { axiosConfig: { timeout: 10000 } });

      expect(magpie.LAST_REQUEST?.config?.timeout).toBe(10000);
    });
  });

  describe('error cases', () => {
    it('should handle empty session ID in retrieve', async () => {
      const emptyId = '';

      await magpie.checkout.sessions.retrieve(emptyId);

      expect(magpie.LAST_REQUEST?.url).toContain('/');
    });

    it('should handle special characters in session ID', async () => {
      const sessionId = 'cs_test@123#456';

      await magpie.checkout.sessions.retrieve(sessionId);

      expect(magpie.LAST_REQUEST?.url).toContain(sessionId);
    });

    it('should handle empty line items array', async () => {
      const sessionData = createTestCheckoutSession({
        line_items: []
      });

      await magpie.checkout.sessions.create(sessionData as any);

      expect((magpie.LAST_REQUEST?.data as any).line_items).toEqual([]);
    });
  });

  describe('URL template handling', () => {
    it('should handle success_url with session_id template', async () => {
      const sessionData = createTestCheckoutSession({
        success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}'
      });

      await magpie.checkout.sessions.create(sessionData as any);

      expect((magpie.LAST_REQUEST?.data as any).success_url).toBe(sessionData.success_url);
    });

    it('should handle cancel_url without template variables', async () => {
      const sessionData = createTestCheckoutSession({
        cancel_url: 'https://example.com/cancel?reason=user_cancelled'
      });

      await magpie.checkout.sessions.create(sessionData as any);

      expect((magpie.LAST_REQUEST?.data as any).cancel_url).toBe(sessionData.cancel_url);
    });
  });

  describe('line items validation scenarios', () => {
    it('should handle single line item', async () => {
      const sessionData = createTestCheckoutSession({
        line_items: [createTestLineItem({
          amount: 50000,
          description: 'Single Premium Product'
        })]
      });

      await magpie.checkout.sessions.create(sessionData as any);

      expect((magpie.LAST_REQUEST?.data as any).line_items).toHaveLength(1);
    });

    it('should handle multiple line items', async () => {
      const sessionData = createTestCheckoutSession({
        line_items: [
          createTestLineItem({
            amount: 25000,
            description: 'Product A',
            quantity: 2
          }),
          createTestLineItem({
            amount: 15000,
            description: 'Product B'
          }),
          createTestLineItem({
            amount: 5000,
            description: 'Shipping'
          })
        ]
      });

      await magpie.checkout.sessions.create(sessionData as any);

      expect((magpie.LAST_REQUEST?.data as any).line_items).toHaveLength(3);
      expect((magpie.LAST_REQUEST?.data as any).line_items[0].quantity).toBe(2);
    });

    it('should handle line items with all optional fields', async () => {
      const sessionData = createTestCheckoutSession({
        line_items: [createTestLineItem({
          amount: 30000,
          description: 'Premium Product with Image',
          image: 'https://example.com/product-image.jpg'
        })]
      });

      await magpie.checkout.sessions.create(sessionData as any);

      expect((magpie.LAST_REQUEST?.data as any).line_items[0].image).toBe('https://example.com/product-image.jpg');
    });
  });

  describe('different modes', () => {
    it('should handle setup mode for saving payment methods', async () => {
      const sessionData = createTestCheckoutSession({
        line_items: [],
        mode: 'setup'
      });

      await magpie.checkout.sessions.create(sessionData as any);

      expect((magpie.LAST_REQUEST?.data as any).mode).toBe('setup');
    });

    it('should handle subscription mode', async () => {
      const sessionData = createTestCheckoutSession({
        line_items: [createTestLineItem({ description: 'Monthly Subscription' })],
        mode: 'subscription'
      });

      await magpie.checkout.sessions.create(sessionData as any);

      expect((magpie.LAST_REQUEST?.data as any).mode).toBe('subscription');
    });
  });

  describe('payment method types', () => {
    it('should handle multiple payment method types', async () => {
      const sessionData = createTestCheckoutSession({
        payment_method_types: ['card', 'gcash', 'paymaya', 'grabpay']
      });

      await magpie.checkout.sessions.create(sessionData as any);

      expect((magpie.LAST_REQUEST?.data as any).payment_method_types).toEqual(['card', 'gcash', 'paymaya', 'grabpay']);
    });

    it('should handle single payment method type', async () => {
      const sessionData = createTestCheckoutSession({
        payment_method_types: ['gcash']
      });

      await magpie.checkout.sessions.create(sessionData as any);

      expect((magpie.LAST_REQUEST?.data as any).payment_method_types).toEqual(['gcash']);
    });
  });
});