/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  createTestLineItem,
  createTestPaymentRequest,
  createTestPaymentRequestVoidParams,
  getSpyableMagpie
} from '../__tests__/testUtils';

describe('PaymentRequestsResource', () => {
  let magpie: ReturnType<typeof getSpyableMagpie>;

  beforeEach(() => {
    magpie = getSpyableMagpie('sk_test_123');
  });

  describe('create', () => {
    it('should send POST request to /requests with payment request data', async () => {
      const paymentRequestData = createTestPaymentRequest();

      await magpie.paymentRequests.create(paymentRequestData as any);

      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        url: expect.stringContaining('/requests'),
        data: paymentRequestData
      });
    });

    it('should handle complex payment request creation with all parameters', async () => {
      const paymentRequestData = createTestPaymentRequest({
        line_items: [
          createTestLineItem({
            amount: 75000,
            description: 'Monthly Subscription',
            quantity: 1,
            image: 'https://example.com/subscription.jpg'
          }),
          createTestLineItem({
            amount: 5000,
            description: 'Setup Fee',
            quantity: 1
          })
        ],
        delivery_methods: ['email', 'sms'],
        payment_method_types: ['card', 'gcash', 'paymaya'],
        message: 'Thank you for your business!',
        require_auth: true,
        branding: {
          use_logo: true,
          primary_color: '#0066cc',
          secondary_color: '#ffffff'
        },
        metadata: {
          invoice_id: 'INV-001',
          customer_type: 'premium'
        }
      });

      await magpie.paymentRequests.create(paymentRequestData as any);

      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        data: paymentRequestData
      });
    });

    it('should handle minimal payment request creation', async () => {
      const minimalData = createTestPaymentRequest({
        line_items: [createTestLineItem({ description: 'Basic Service' })]
      });

      await magpie.paymentRequests.create(minimalData as any);

      expect(magpie.LAST_REQUEST?.data).toEqual(minimalData);
    });

    it('should use correct base URL for payment requests', async () => {
      const paymentRequestData = createTestPaymentRequest();

      await magpie.paymentRequests.create(paymentRequestData as any);

      expect(magpie.LAST_REQUEST?.config?.baseURL).toBe('https://request.magpie.im/api/v1');
    });

    it('should handle different delivery methods', async () => {
      const emailOnlyData = createTestPaymentRequest({
        delivery_methods: ['email']
      });

      await magpie.paymentRequests.create(emailOnlyData as any);

      expect((magpie.LAST_REQUEST?.data as any).delivery_methods).toEqual(['email']);

      const smsOnlyData = createTestPaymentRequest({
        delivery_methods: ['sms']
      });

      await magpie.paymentRequests.create(smsOnlyData as any);

      expect((magpie.LAST_REQUEST?.data as any).delivery_methods).toEqual(['sms']);

      const bothMethodsData = createTestPaymentRequest({
        delivery_methods: ['email', 'sms']
      });

      await magpie.paymentRequests.create(bothMethodsData as any);

      expect((magpie.LAST_REQUEST?.data as any).delivery_methods).toEqual(['email', 'sms']);
    });
  });

  describe('retrieve', () => {
    it('should send GET request to /requests/:id', async () => {
      const requestId = 'pr_test_123';

      await magpie.paymentRequests.retrieve(requestId);

      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'GET',
        url: expect.stringContaining(`/requests/${requestId}`)
      });
    });

    it('should handle payment request ID parameter correctly', async () => {
      const requestId = 'pr_special_characters_123';

      await magpie.paymentRequests.retrieve(requestId);

      expect(magpie.LAST_REQUEST?.url).toContain(requestId);
    });

    it('should use correct base URL for payment request retrieval', async () => {
      const requestId = 'pr_test_123';

      await magpie.paymentRequests.retrieve(requestId);

      expect(magpie.LAST_REQUEST?.config?.baseURL).toBe('https://request.magpie.im/api/v1');
    });
  });

  describe('resend', () => {
    it('should send POST request to /requests/:id/resend', async () => {
      const requestId = 'pr_test_123';

      await magpie.paymentRequests.resend(requestId);

      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        url: expect.stringContaining(`/requests/${requestId}/resend`)
      });
    });

    it('should not include request data for resend action', async () => {
      const requestId = 'pr_test_123';

      await magpie.paymentRequests.resend(requestId);

      expect(magpie.LAST_REQUEST?.data).toBeUndefined();
    });

    it('should handle resend for different payment request IDs', async () => {
      const requestIds = ['pr_test_123', 'pr_another_456', 'pr_final_789'];

      for (const requestId of requestIds) {
        await magpie.paymentRequests.resend(requestId);
        expect(magpie.LAST_REQUEST?.url).toContain(`/requests/${requestId}/resend`);
      }
    });

    it('should use correct base URL for resend action', async () => {
      const requestId = 'pr_test_123';

      await magpie.paymentRequests.resend(requestId);

      expect(magpie.LAST_REQUEST?.config?.baseURL).toBe('https://request.magpie.im/api/v1');
    });
  });

  describe('void', () => {
    it('should send POST request to /requests/:id/void', async () => {
      const requestId = 'pr_test_123';
      const voidParams = createTestPaymentRequestVoidParams();

      await magpie.paymentRequests.void(requestId, voidParams as any);

      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        url: expect.stringContaining(`/requests/${requestId}/void`),
        data: voidParams
      });
    });

    it('should handle different void reasons', async () => {
      const requestId = 'pr_test_123';
      
      const duplicateReason = createTestPaymentRequestVoidParams({
        reason: 'duplicate_request'
      });

      await magpie.paymentRequests.void(requestId, duplicateReason as any);

      expect(magpie.LAST_REQUEST?.data).toEqual(duplicateReason);

      const customerReason = createTestPaymentRequestVoidParams({
        reason: 'customer_cancellation'
      });

      await magpie.paymentRequests.void(requestId, customerReason as any);

      expect(magpie.LAST_REQUEST?.data).toEqual(customerReason);
    });

    it('should handle void with custom reason', async () => {
      const requestId = 'pr_test_123';
      const customVoidParams = createTestPaymentRequestVoidParams({
        reason: 'Service was completed before payment'
      });

      await magpie.paymentRequests.void(requestId, customVoidParams as any);

      expect((magpie.LAST_REQUEST?.data as any).reason).toBe('Service was completed before payment');
    });

    it('should use correct base URL for void action', async () => {
      const requestId = 'pr_test_123';
      const voidParams = createTestPaymentRequestVoidParams();

      await magpie.paymentRequests.void(requestId, voidParams as any);

      expect(magpie.LAST_REQUEST?.config?.baseURL).toBe('https://request.magpie.im/api/v1');
    });
  });

  describe('request options', () => {
    it('should handle idempotency key in create request', async () => {
      const paymentRequestData = createTestPaymentRequest();
      const idempotencyKey = 'payment_request_create_key_123';

      await magpie.paymentRequests.create(paymentRequestData as any, { idempotencyKey });

      expect(magpie.LAST_REQUEST?.headers).toMatchObject({
        'X-Idempotency-Key': idempotencyKey
      });
    });

    it('should handle idempotency key in void request', async () => {
      const requestId = 'pr_test_123';
      const voidParams = createTestPaymentRequestVoidParams();
      const idempotencyKey = 'void_key_456';

      await magpie.paymentRequests.void(requestId, voidParams as any, { idempotencyKey });

      expect(magpie.LAST_REQUEST?.headers).toMatchObject({
        'X-Idempotency-Key': idempotencyKey
      });
    });

    it('should handle request timeout option', async () => {
      const paymentRequestData = createTestPaymentRequest();

      await magpie.paymentRequests.create(paymentRequestData as any, { axiosConfig: { timeout: 15000 } });

      expect(magpie.LAST_REQUEST?.config?.timeout).toBe(15000);
    });

    it('should handle expand option', async () => {
      const requestId = 'pr_test_123';

      await magpie.paymentRequests.retrieve(requestId, { expand: ['customer', 'payment_details'] });

      expect(magpie.LAST_REQUEST?.params).toMatchObject({
        expand: ['customer', 'payment_details']
      });
    });
  });

  describe('error cases', () => {
    it('should handle empty payment request ID in retrieve', async () => {
      const emptyId = '';

      await magpie.paymentRequests.retrieve(emptyId);

      expect(magpie.LAST_REQUEST?.url).toContain('/requests');
    });

    it('should handle special characters in payment request ID', async () => {
      const requestId = 'pr_test@123#456';

      await magpie.paymentRequests.retrieve(requestId);

      expect(magpie.LAST_REQUEST?.url).toContain(requestId);
    });

    it('should handle empty line items array', async () => {
      const paymentRequestData = createTestPaymentRequest({
        line_items: []
      });

      await magpie.paymentRequests.create(paymentRequestData as any);

      expect((magpie.LAST_REQUEST?.data as any).line_items).toEqual([]);
    });

    it('should handle missing customer in create request', async () => {
      const paymentRequestData = createTestPaymentRequest({
        customer: ''
      });

      await magpie.paymentRequests.create(paymentRequestData as any);

      expect((magpie.LAST_REQUEST?.data as any).customer).toBe('');
    });
  });

  describe('line items handling', () => {
    it('should handle single line item', async () => {
      const paymentRequestData = createTestPaymentRequest({
        line_items: [createTestLineItem({
          amount: 50000,
          description: 'Premium Service'
        })]
      });

      await magpie.paymentRequests.create(paymentRequestData as any);

      expect((magpie.LAST_REQUEST?.data as any).line_items).toHaveLength(1);
      expect((magpie.LAST_REQUEST?.data as any).line_items[0].amount).toBe(50000);
    });

    it('should handle multiple line items', async () => {
      const paymentRequestData = createTestPaymentRequest({
        line_items: [
          createTestLineItem({
            amount: 25000,
            description: 'Service A',
            quantity: 2
          }),
          createTestLineItem({
            amount: 15000,
            description: 'Service B',
            quantity: 1
          }),
          createTestLineItem({
            amount: 5000,
            description: 'Processing Fee',
            quantity: 1
          })
        ]
      });

      await magpie.paymentRequests.create(paymentRequestData as any);

      expect((magpie.LAST_REQUEST?.data as any).line_items).toHaveLength(3);
      expect((magpie.LAST_REQUEST?.data as any).line_items[0].quantity).toBe(2);
      expect((magpie.LAST_REQUEST?.data as any).line_items[1].amount).toBe(15000);
    });

    it('should handle line items with all optional fields', async () => {
      const paymentRequestData = createTestPaymentRequest({
        line_items: [createTestLineItem({
          amount: 30000,
          description: 'Premium Package with Image',
          quantity: 1,
          image: 'https://example.com/package-image.jpg'
        })]
      });

      await magpie.paymentRequests.create(paymentRequestData as any);

      expect((magpie.LAST_REQUEST?.data as any).line_items[0].image).toBe('https://example.com/package-image.jpg');
    });
  });

  describe('payment method types', () => {
    it('should handle multiple payment method types', async () => {
      const paymentRequestData = createTestPaymentRequest({
        payment_method_types: ['card', 'gcash', 'paymaya', 'grabpay', 'bank_transfer']
      });

      await magpie.paymentRequests.create(paymentRequestData as any);

      expect((magpie.LAST_REQUEST?.data as any).payment_method_types).toEqual([
        'card', 'gcash', 'paymaya', 'grabpay', 'bank_transfer'
      ]);
    });

    it('should handle single payment method type', async () => {
      const paymentRequestData = createTestPaymentRequest({
        payment_method_types: ['card']
      });

      await magpie.paymentRequests.create(paymentRequestData as any);

      expect((magpie.LAST_REQUEST?.data as any).payment_method_types).toEqual(['card']);
    });

    it('should handle digital wallet payment methods', async () => {
      const paymentRequestData = createTestPaymentRequest({
        payment_method_types: ['gcash', 'paymaya', 'grabpay']
      });

      await magpie.paymentRequests.create(paymentRequestData as any);

      expect((magpie.LAST_REQUEST?.data as any).payment_method_types).toContain('gcash');
      expect((magpie.LAST_REQUEST?.data as any).payment_method_types).toContain('paymaya');
      expect((magpie.LAST_REQUEST?.data as any).payment_method_types).toContain('grabpay');
    });
  });

  describe('branding and customization', () => {
    it('should handle branding configuration', async () => {
      const paymentRequestData = createTestPaymentRequest({
        branding: {
          use_logo: true,
          logo: 'https://example.com/logo.png',
          icon: 'https://example.com/icon.png',
          primary_color: '#0066cc',
          secondary_color: '#ffffff'
        }
      });

      await magpie.paymentRequests.create(paymentRequestData as any);

      expect((magpie.LAST_REQUEST?.data as any).branding.use_logo).toBe(true);
      expect((magpie.LAST_REQUEST?.data as any).branding.primary_color).toBe('#0066cc');
    });

    it('should handle custom message in payment request', async () => {
      const customMessage = 'Thank you for your business! Please complete payment within 7 days.';
      const paymentRequestData = createTestPaymentRequest({
        message: customMessage
      });

      await magpie.paymentRequests.create(paymentRequestData as any);

      expect((magpie.LAST_REQUEST?.data as any).message).toBe(customMessage);
    });

    it('should handle metadata in payment request', async () => {
      const metadata = {
        invoice_number: 'INV-2024-001',
        customer_type: 'enterprise',
        department: 'sales',
        priority: 'high'
      };

      const paymentRequestData = createTestPaymentRequest({
        metadata
      });

      await magpie.paymentRequests.create(paymentRequestData as any);

      expect((magpie.LAST_REQUEST?.data as any).metadata).toEqual(metadata);
    });
  });

  describe('currency handling', () => {
    it('should handle PHP currency', async () => {
      const paymentRequestData = createTestPaymentRequest({
        currency: 'php'
      });

      await magpie.paymentRequests.create(paymentRequestData as any);

      expect((magpie.LAST_REQUEST?.data as any).currency).toBe('php');
    });

    it('should handle USD currency', async () => {
      const paymentRequestData = createTestPaymentRequest({
        currency: 'usd'
      });

      await magpie.paymentRequests.create(paymentRequestData as any);

      expect((magpie.LAST_REQUEST?.data as any).currency).toBe('usd');
    });
  });
});