/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { createTestSource, getSpyableMagpie } from '../__tests__/testUtils';

describe('SourcesResource', () => {
  let magpie: ReturnType<typeof getSpyableMagpie>;

  beforeEach(() => {
    magpie = getSpyableMagpie('sk_test_123');
  });

  describe('create', () => {
    it('should send POST request to /sources', async () => {
      const sourceData = createTestSource();
      
      await magpie.sources.create(sourceData as any);
      
      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        url: expect.stringContaining('/sources'),
        data: sourceData
      });
    });

    it('should handle card source creation', async () => {
      const cardData = {
        type: 'card',
        card: {
          number: '4242424242424242',
          exp_month: 12,
          exp_year: 2025,
          cvc: '123'
        },
        redirect: {
          success: 'https://example.com/success',
          fail: 'https://example.com/fail'
        }
      };
      
      await magpie.sources.create(cardData as any);
      
      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        data: cardData
      });
    });

    it('should handle source creation with owner information', async () => {
      const sourceData = {
        ...createTestSource(),
        owner: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+639151234567'
        }
      };
      
      await magpie.sources.create(sourceData as any);
      
      expect(magpie.LAST_REQUEST?.data).toEqual(sourceData);
    });

    it('should handle source creation with billing information', async () => {
      const sourceData = {
        type: 'card',
        card: {
          number: '4242424242424242',
          exp_month: 12,
          exp_year: 2025,
          cvc: '123'
        },
        redirect: {
          success: 'https://example.com/success',
          fail: 'https://example.com/fail'
        },
        billing: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          address: {
            line1: '123 Main St',
            city: 'Manila',
            country: 'PH'
          }
        }
      };
      
      await magpie.sources.create(sourceData as any);
      
      expect(magpie.LAST_REQUEST?.data).toEqual(sourceData);
    });

    it('should handle minimal card source creation', async () => {
      const minimalCard = {
        type: 'card',
        card: {
          number: '4242424242424242',
          exp_month: 12,
          exp_year: 2025
        },
        redirect: {
          success: 'https://example.com/success',
          fail: 'https://example.com/fail'
        }
      };
      
      await magpie.sources.create(minimalCard as any);
      
      expect(magpie.LAST_REQUEST?.data).toEqual(minimalCard);
    });
  });

  describe('retrieve', () => {
    it('should send GET request to /sources/:id', async () => {
      const sourceId = 'src_test_123';
      
      await magpie.sources.retrieve(sourceId);
      
      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'GET',
        url: expect.stringContaining(`/sources/${sourceId}`)
      });
    });

    it('should handle source ID parameter correctly', async () => {
      const sourceId = 'src_special_characters_123';
      
      await magpie.sources.retrieve(sourceId);
      
      expect(magpie.LAST_REQUEST?.url).toContain(sourceId);
    });

    it('should handle different source ID formats', async () => {
      const sourceId = 'src_1234567890abcdef';
      
      await magpie.sources.retrieve(sourceId);
      
      expect(magpie.LAST_REQUEST?.url).toContain(`/sources/${sourceId}`);
    });
  });

  describe('request options', () => {
    it('should handle idempotency key in create request', async () => {
      const sourceData = createTestSource();
      const idempotencyKey = 'test_key_123';
      
      await magpie.sources.create(sourceData as any, { idempotencyKey });
      
      expect(magpie.LAST_REQUEST?.headers).toMatchObject({
        'X-Idempotency-Key': idempotencyKey
      });
    });

    it('should handle idempotency key in retrieve request', async () => {
      const sourceId = 'src_test_123';
      const idempotencyKey = 'retrieve_key_456';
      
      await magpie.sources.retrieve(sourceId, { idempotencyKey });
      
      expect(magpie.LAST_REQUEST?.headers).toMatchObject({
        'X-Idempotency-Key': idempotencyKey
      });
    });

    it('should handle expand options', async () => {
      const sourceId = 'src_test_123';
      
      await magpie.sources.retrieve(sourceId, { expand: ['customer'] });
      
      expect(magpie.LAST_REQUEST?.params).toMatchObject({
        expand: ['customer']
      });
    });
  });

  describe('error cases', () => {
    it('should handle invalid source ID format', async () => {
      const invalidId = '';
      
      await magpie.sources.retrieve(invalidId);
      
      expect(magpie.LAST_REQUEST?.url).toContain('/sources');
    });

    it('should handle special characters in source ID', async () => {
      const sourceId = 'src_test@123#456';
      
      await magpie.sources.retrieve(sourceId);
      
      expect(magpie.LAST_REQUEST?.url).toContain(sourceId);
    });
  });

  describe('card source specific tests', () => {
    it('should handle different card types', async () => {
      const visaCard = {
        type: 'card',
        card: {
          number: '4242424242424242',
          exp_month: 12,
          exp_year: 2025,
          cvc: '123'
        },
        redirect: {
          success: 'https://example.com/success',
          fail: 'https://example.com/fail'
        }
      };
      
      await magpie.sources.create(visaCard as any);
      
      expect(magpie.LAST_REQUEST?.data).toEqual(visaCard);
    });

    it('should handle card with additional metadata', async () => {
      const cardWithMetadata = {
        type: 'card',
        card: {
          number: '4242424242424242',
          exp_month: 6,
          exp_year: 2026,
          cvc: '456'
        },
        redirect: {
          success: 'https://example.com/success',
          fail: 'https://example.com/fail'
        },
        metadata: {
          customer_reference: 'cust_ref_123',
          payment_method: 'primary'
        }
      };
      
      await magpie.sources.create(cardWithMetadata as any);
      
      expect(magpie.LAST_REQUEST?.data).toEqual(cardWithMetadata);
    });
  });
});