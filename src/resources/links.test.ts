/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  createTestPaymentLink,
  createTestPaymentLinkItem,
  createTestPaymentLinkUpdateParams,
  getSpyableMagpie
} from '../__tests__/testUtils';

describe('PaymentLinksResource', () => {
  let magpie: ReturnType<typeof getSpyableMagpie>;

  beforeEach(() => {
    magpie = getSpyableMagpie('sk_test_123');
  });

  describe('create', () => {
    it('should send POST request to /links with payment link data', async () => {
      const paymentLinkData = createTestPaymentLink();

      await magpie.paymentLinks.create(paymentLinkData as any);

      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        url: expect.stringContaining('/links'),
        data: paymentLinkData
      });
    });

    it('should handle complex payment link creation with all parameters', async () => {
      const paymentLinkData = createTestPaymentLink({
        internal_name: 'Holiday Sale - Limited Edition Items',
        description: 'Special holiday collection with limited quantities',
        allow_adjustable_quantity: true,
        line_items: [
          createTestPaymentLinkItem({
            amount: 75000,
            description: 'Premium Holiday Bundle',
            quantity: 1,
            remaining: 50,
            image: 'https://example.com/holiday-bundle.jpg'
          }),
          createTestPaymentLinkItem({
            amount: 25000,
            description: 'Holiday Gift Wrap',
            quantity: 1,
            remaining: 100,
            image: null
          })
        ],
        payment_method_types: ['card', 'gcash', 'paymaya', 'grabpay'],
        expiry: '12/31/2024',
        maximum_payments: 100,
        redirect_url: 'https://example.com/thank-you',
        require_auth: true,
        phone_number_collection: true,
        branding: {
          use_logo: true,
          primary_color: '#ff6b35',
          secondary_color: '#ffffff',
          logo: 'https://example.com/holiday-logo.png'
        },
        shipping_address_collection: {
          allowed_countries: ['PH', 'US', 'CA']
        },
        metadata: {
          campaign: 'holiday-sale-2024',
          category: 'limited-edition',
          priority: 'high'
        }
      });

      await magpie.paymentLinks.create(paymentLinkData as any);

      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        data: paymentLinkData
      });
    });

    it('should handle minimal payment link creation', async () => {
      const minimalData = createTestPaymentLink({
        internal_name: 'Basic Product',
        line_items: [createTestPaymentLinkItem({ description: 'Basic Service' })]
      });

      await magpie.paymentLinks.create(minimalData as any);

      expect(magpie.LAST_REQUEST?.data).toEqual(minimalData);
    });

    it('should use correct base URL for payment links', async () => {
      const paymentLinkData = createTestPaymentLink();

      await magpie.paymentLinks.create(paymentLinkData as any);

      expect(magpie.LAST_REQUEST?.config?.baseURL).toBe('https://buy.magpie.im/api/v1');
    });

    it('should handle adjustable quantity settings', async () => {
      const adjustableData = createTestPaymentLink({
        allow_adjustable_quantity: true
      });

      await magpie.paymentLinks.create(adjustableData as any);

      expect((magpie.LAST_REQUEST?.data as any).allow_adjustable_quantity).toBe(true);

      const nonAdjustableData = createTestPaymentLink({
        allow_adjustable_quantity: false
      });

      await magpie.paymentLinks.create(nonAdjustableData as any);

      expect((magpie.LAST_REQUEST?.data as any).allow_adjustable_quantity).toBe(false);
    });
  });

  describe('retrieve', () => {
    it('should send GET request to /links/:id', async () => {
      const linkId = 'pl_test_123';

      await magpie.paymentLinks.retrieve(linkId);

      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'GET',
        url: expect.stringContaining(`/links/${linkId}`)
      });
    });

    it('should handle payment link ID parameter correctly', async () => {
      const linkId = 'pl_special_characters_123';

      await magpie.paymentLinks.retrieve(linkId);

      expect(magpie.LAST_REQUEST?.url).toContain(linkId);
    });

    it('should use correct base URL for payment link retrieval', async () => {
      const linkId = 'pl_test_123';

      await magpie.paymentLinks.retrieve(linkId);

      expect(magpie.LAST_REQUEST?.config?.baseURL).toBe('https://buy.magpie.im/api/v1');
    });
  });

  describe('update', () => {
    it('should send PUT request to /links/:id', async () => {
      const linkId = 'pl_test_123';
      const updateData = createTestPaymentLinkUpdateParams({
        internal_name: 'Updated Payment Link'
      });

      await magpie.paymentLinks.update(linkId, updateData as any);

      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'PUT',
        url: expect.stringContaining(`/links/${linkId}`),
        data: updateData
      });
    });

    it('should handle partial updates', async () => {
      const linkId = 'pl_test_123';
      const updateData = createTestPaymentLinkUpdateParams({
        description: 'Updated description',
        maximum_payments: 50,
        metadata: { updated: 'true' }
      });

      await magpie.paymentLinks.update(linkId, updateData as any);

      expect(magpie.LAST_REQUEST?.data).toEqual(updateData);
    });

    it('should handle line items updates', async () => {
      const linkId = 'pl_test_123';
      const updateData = createTestPaymentLinkUpdateParams({
        line_items: [
          createTestPaymentLinkItem({
            amount: 30000,
            description: 'Updated Product',
            remaining: 25
          })
        ]
      });

      await magpie.paymentLinks.update(linkId, updateData as any);

      expect((magpie.LAST_REQUEST?.data as any).line_items).toHaveLength(1);
      expect((magpie.LAST_REQUEST?.data as any).line_items[0].amount).toBe(30000);
    });

    it('should use correct base URL for update action', async () => {
      const linkId = 'pl_test_123';
      const updateData = createTestPaymentLinkUpdateParams();

      await magpie.paymentLinks.update(linkId, updateData as any);

      expect(magpie.LAST_REQUEST?.config?.baseURL).toBe('https://buy.magpie.im/api/v1');
    });
  });

  describe('activate', () => {
    it('should send POST request to /links/:id/activate', async () => {
      const linkId = 'pl_test_123';

      await magpie.paymentLinks.activate(linkId);

      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        url: expect.stringContaining(`/links/${linkId}/activate`)
      });
    });

    it('should not include request data for activate action', async () => {
      const linkId = 'pl_test_123';

      await magpie.paymentLinks.activate(linkId);

      expect(magpie.LAST_REQUEST?.data).toBeUndefined();
    });

    it('should handle activate for different payment link IDs', async () => {
      const linkIds = ['pl_test_123', 'pl_another_456', 'pl_final_789'];

      for (const linkId of linkIds) {
        await magpie.paymentLinks.activate(linkId);
        expect(magpie.LAST_REQUEST?.url).toContain(`/links/${linkId}/activate`);
      }
    });

    it('should use correct base URL for activate action', async () => {
      const linkId = 'pl_test_123';

      await magpie.paymentLinks.activate(linkId);

      expect(magpie.LAST_REQUEST?.config?.baseURL).toBe('https://buy.magpie.im/api/v1');
    });
  });

  describe('deactivate', () => {
    it('should send POST request to /links/:id/deactivate', async () => {
      const linkId = 'pl_test_123';

      await magpie.paymentLinks.deactivate(linkId);

      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        url: expect.stringContaining(`/links/${linkId}/deactivate`)
      });
    });

    it('should not include request data for deactivate action', async () => {
      const linkId = 'pl_test_123';

      await magpie.paymentLinks.deactivate(linkId);

      expect(magpie.LAST_REQUEST?.data).toBeUndefined();
    });

    it('should handle deactivate for different payment link IDs', async () => {
      const linkIds = ['pl_test_123', 'pl_another_456', 'pl_final_789'];

      for (const linkId of linkIds) {
        await magpie.paymentLinks.deactivate(linkId);
        expect(magpie.LAST_REQUEST?.url).toContain(`/links/${linkId}/deactivate`);
      }
    });

    it('should use correct base URL for deactivate action', async () => {
      const linkId = 'pl_test_123';

      await magpie.paymentLinks.deactivate(linkId);

      expect(magpie.LAST_REQUEST?.config?.baseURL).toBe('https://buy.magpie.im/api/v1');
    });
  });

  describe('request options', () => {
    it('should handle idempotency key in create request', async () => {
      const paymentLinkData = createTestPaymentLink();
      const idempotencyKey = 'payment_link_create_key_123';

      await magpie.paymentLinks.create(paymentLinkData as any, { idempotencyKey });

      expect(magpie.LAST_REQUEST?.headers).toMatchObject({
        'X-Idempotency-Key': idempotencyKey
      });
    });

    it('should handle idempotency key in update request', async () => {
      const linkId = 'pl_test_123';
      const updateData = createTestPaymentLinkUpdateParams();
      const idempotencyKey = 'update_key_456';

      await magpie.paymentLinks.update(linkId, updateData as any, { idempotencyKey });

      expect(magpie.LAST_REQUEST?.headers).toMatchObject({
        'X-Idempotency-Key': idempotencyKey
      });
    });

    it('should handle request timeout option', async () => {
      const paymentLinkData = createTestPaymentLink();

      await magpie.paymentLinks.create(paymentLinkData as any, { axiosConfig: { timeout: 20000 } });

      expect(magpie.LAST_REQUEST?.config?.timeout).toBe(20000);
    });

    it('should handle expand option', async () => {
      const linkId = 'pl_test_123';

      await magpie.paymentLinks.retrieve(linkId, { expand: ['line_items', 'branding'] });

      expect(magpie.LAST_REQUEST?.params).toMatchObject({
        expand: ['line_items', 'branding']
      });
    });
  });

  describe('error cases', () => {
    it('should handle empty payment link ID in retrieve', async () => {
      const emptyId = '';

      await magpie.paymentLinks.retrieve(emptyId);

      expect(magpie.LAST_REQUEST?.url).toContain('/links');
    });

    it('should handle special characters in payment link ID', async () => {
      const linkId = 'pl_test@123#456';

      await magpie.paymentLinks.retrieve(linkId);

      expect(magpie.LAST_REQUEST?.url).toContain(linkId);
    });

    it('should handle empty line items array', async () => {
      const paymentLinkData = createTestPaymentLink({
        line_items: []
      });

      await magpie.paymentLinks.create(paymentLinkData as any);

      expect((magpie.LAST_REQUEST?.data as any).line_items).toEqual([]);
    });

    it('should handle missing internal_name', async () => {
      const paymentLinkData = createTestPaymentLink({
        internal_name: ''
      });

      await magpie.paymentLinks.create(paymentLinkData as any);

      expect((magpie.LAST_REQUEST?.data as any).internal_name).toBe('');
    });
  });

  describe('line items handling', () => {
    it('should handle single line item with inventory', async () => {
      const paymentLinkData = createTestPaymentLink({
        line_items: [createTestPaymentLinkItem({
          amount: 50000,
          description: 'Limited Edition Product',
          remaining: 10
        })]
      });

      await magpie.paymentLinks.create(paymentLinkData as any);

      expect((magpie.LAST_REQUEST?.data as any).line_items).toHaveLength(1);
      expect((magpie.LAST_REQUEST?.data as any).line_items[0].remaining).toBe(10);
    });

    it('should handle multiple line items with different inventory levels', async () => {
      const paymentLinkData = createTestPaymentLink({
        line_items: [
          createTestPaymentLinkItem({
            amount: 25000,
            description: 'Product A',
            quantity: 1,
            remaining: 50
          }),
          createTestPaymentLinkItem({
            amount: 15000,
            description: 'Product B',
            quantity: 1,
            remaining: 25
          }),
          createTestPaymentLinkItem({
            amount: 5000,
            description: 'Add-on Service',
            quantity: 1,
            remaining: 0 // Out of stock
          })
        ]
      });

      await magpie.paymentLinks.create(paymentLinkData as any);

      expect((magpie.LAST_REQUEST?.data as any).line_items).toHaveLength(3);
      expect((magpie.LAST_REQUEST?.data as any).line_items[0].remaining).toBe(50);
      expect((magpie.LAST_REQUEST?.data as any).line_items[2].remaining).toBe(0);
    });

    it('should handle line items with all optional fields', async () => {
      const paymentLinkData = createTestPaymentLink({
        line_items: [createTestPaymentLinkItem({
          amount: 30000,
          description: 'Premium Product with Image',
          quantity: 1,
          remaining: 15,
          image: 'https://example.com/product-image.jpg'
        })]
      });

      await magpie.paymentLinks.create(paymentLinkData as any);

      expect((magpie.LAST_REQUEST?.data as any).line_items[0].image).toBe('https://example.com/product-image.jpg');
    });
  });

  describe('payment method types', () => {
    it('should handle multiple payment method types', async () => {
      const paymentLinkData = createTestPaymentLink({
        payment_method_types: ['card', 'gcash', 'paymaya', 'grabpay', 'bank_transfer']
      });

      await magpie.paymentLinks.create(paymentLinkData as any);

      expect((magpie.LAST_REQUEST?.data as any).payment_method_types).toEqual([
        'card', 'gcash', 'paymaya', 'grabpay', 'bank_transfer'
      ]);
    });

    it('should handle single payment method type', async () => {
      const paymentLinkData = createTestPaymentLink({
        payment_method_types: ['card']
      });

      await magpie.paymentLinks.create(paymentLinkData as any);

      expect((magpie.LAST_REQUEST?.data as any).payment_method_types).toEqual(['card']);
    });

    it('should handle digital wallet payment methods', async () => {
      const paymentLinkData = createTestPaymentLink({
        payment_method_types: ['gcash', 'paymaya', 'grabpay']
      });

      await magpie.paymentLinks.create(paymentLinkData as any);

      expect((magpie.LAST_REQUEST?.data as any).payment_method_types).toContain('gcash');
      expect((magpie.LAST_REQUEST?.data as any).payment_method_types).toContain('paymaya');
      expect((magpie.LAST_REQUEST?.data as any).payment_method_types).toContain('grabpay');
    });
  });

  describe('branding and customization', () => {
    it('should handle branding configuration', async () => {
      const paymentLinkData = createTestPaymentLink({
        branding: {
          use_logo: true,
          logo: 'https://example.com/logo.png',
          icon: 'https://example.com/icon.png',
          primary_color: '#0066cc',
          secondary_color: '#ffffff'
        }
      });

      await magpie.paymentLinks.create(paymentLinkData as any);

      expect((magpie.LAST_REQUEST?.data as any).branding.use_logo).toBe(true);
      expect((magpie.LAST_REQUEST?.data as any).branding.primary_color).toBe('#0066cc');
    });

    it('should handle custom description', async () => {
      const customDescription = 'Special offer: Get 20% off on all premium products!';
      const paymentLinkData = createTestPaymentLink({
        description: customDescription
      });

      await magpie.paymentLinks.create(paymentLinkData as any);

      expect((magpie.LAST_REQUEST?.data as any).description).toBe(customDescription);
    });

    it('should handle metadata', async () => {
      const metadata = {
        campaign: 'summer-sale-2024',
        category: 'electronics',
        priority: 'high',
        source: 'social-media'
      };

      const paymentLinkData = createTestPaymentLink({
        metadata
      });

      await magpie.paymentLinks.create(paymentLinkData as any);

      expect((magpie.LAST_REQUEST?.data as any).metadata).toEqual(metadata);
    });

    it('should handle redirect URL configuration', async () => {
      const redirectUrl = 'https://example.com/success?campaign=holiday';
      const paymentLinkData = createTestPaymentLink({
        redirect_url: redirectUrl
      });

      await magpie.paymentLinks.create(paymentLinkData as any);

      expect((magpie.LAST_REQUEST?.data as any).redirect_url).toBe(redirectUrl);
    });
  });

  describe('expiry and limits', () => {
    it('should handle expiry date', async () => {
      const expiryDate = '12/31/2024';
      const paymentLinkData = createTestPaymentLink({
        expiry: expiryDate
      });

      await magpie.paymentLinks.create(paymentLinkData as any);

      expect((magpie.LAST_REQUEST?.data as any).expiry).toBe(expiryDate);
    });

    it('should handle maximum payments limit', async () => {
      const maxPayments = 50;
      const paymentLinkData = createTestPaymentLink({
        maximum_payments: maxPayments
      });

      await magpie.paymentLinks.create(paymentLinkData as any);

      expect((magpie.LAST_REQUEST?.data as any).maximum_payments).toBe(maxPayments);
    });

    it('should handle unlimited payments (no maximum)', async () => {
      const paymentLinkData = createTestPaymentLink({
        // maximum_payments not set - should allow unlimited
      });

      await magpie.paymentLinks.create(paymentLinkData as any);

      expect((magpie.LAST_REQUEST?.data as any).maximum_payments).toBeUndefined();
    });
  });

  describe('collection options', () => {
    it('should handle phone number collection', async () => {
      const paymentLinkData = createTestPaymentLink({
        phone_number_collection: true
      });

      await magpie.paymentLinks.create(paymentLinkData as any);

      expect((magpie.LAST_REQUEST?.data as any).phone_number_collection).toBe(true);
    });

    it('should handle shipping address collection', async () => {
      const paymentLinkData = createTestPaymentLink({
        shipping_address_collection: {
          allowed_countries: ['PH', 'US', 'CA', 'AU']
        }
      });

      await magpie.paymentLinks.create(paymentLinkData as any);

      expect((magpie.LAST_REQUEST?.data as any).shipping_address_collection.allowed_countries).toEqual([
        'PH', 'US', 'CA', 'AU'
      ]);
    });

    it('should handle disabled phone number collection', async () => {
      const paymentLinkData = createTestPaymentLink({
        phone_number_collection: false
      });

      await magpie.paymentLinks.create(paymentLinkData as any);

      expect((magpie.LAST_REQUEST?.data as any).phone_number_collection).toBe(false);
    });
  });

  describe('currency handling', () => {
    it('should handle PHP currency', async () => {
      const paymentLinkData = createTestPaymentLink({
        currency: 'php'
      });

      await magpie.paymentLinks.create(paymentLinkData as any);

      expect((magpie.LAST_REQUEST?.data as any).currency).toBe('php');
    });

    it('should handle USD currency', async () => {
      const paymentLinkData = createTestPaymentLink({
        currency: 'usd'
      });

      await magpie.paymentLinks.create(paymentLinkData as any);

      expect((magpie.LAST_REQUEST?.data as any).currency).toBe('usd');
    });
  });
});