/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getSpyableMagpie } from '../__tests__/testUtils';
import { CheckoutSessionsResource } from './sessions';

describe('CheckoutResource', () => {
  let magpie: ReturnType<typeof getSpyableMagpie>;

  beforeEach(() => {
    magpie = getSpyableMagpie('sk_test_123');
  });

  describe('constructor', () => {
    it('should initialize sessions resource', () => {
      expect(magpie.checkout.sessions).toBeInstanceOf(CheckoutSessionsResource);
    });

    it('should pass the base client to sessions resource', () => {
      // Verify that the sessions resource has access to make requests through the base client
      const sessionsResource = magpie.checkout.sessions;
      expect(sessionsResource).toBeDefined();
      
      // The sessions resource should be properly constructed
      expect(typeof sessionsResource.create).toBe('function');
      expect(typeof sessionsResource.retrieve).toBe('function');
      expect(typeof sessionsResource.capture).toBe('function');
      expect(typeof sessionsResource.expire).toBe('function');
    });
  });

  describe('integration with sessions', () => {
    it('should provide access to session creation through checkout.sessions', async () => {
      const sessionData = {
        line_items: [{
          name: 'Test Product',
          amount: 50000,
          description: 'Test Product',
          quantity: 1,
          image: null
        }],
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        currency: 'php',
        mode: 'payment' as const,
        payment_method_types: ['card']
      };

      await magpie.checkout.sessions.create(sessionData);

      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        url: expect.stringContaining('/'),
        data: sessionData
      });
    });

    it('should provide access to session retrieval through checkout.sessions', async () => {
      const sessionId = 'cs_test_123';

      await magpie.checkout.sessions.retrieve(sessionId);

      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'GET',
        url: expect.stringContaining(sessionId)
      });
    });
  });
});