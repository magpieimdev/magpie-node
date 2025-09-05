/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createTestOrganization, getSpyableMagpie } from '../__tests__/testUtils';
import type { Organization } from '../types/organization';

describe('OrganizationsResource', () => {
  let magpie: ReturnType<typeof getSpyableMagpie>;

  beforeEach(() => {
    magpie = getSpyableMagpie('sk_test_123');
  });

  describe('me', () => {
    it('should send GET request to /me', async () => {
      const mockOrganization = createTestOrganization() as Organization;
      magpie.mockRequest('GET', '/me', mockOrganization);
      
      const result = await magpie.organizations.me();
      
      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'GET',
        url: expect.stringContaining('/me')
      });
      
      expect(result).toMatchObject(mockOrganization);
    });

    it('should return organization with correct structure', async () => {
      const customOrg = createTestOrganization({
        title: 'Custom Test Org',
        status: 'pending',
        branding: {
          icon: null,
          logo: 'https://example.com/logo.png',
          use_logo: true,
          brand_color: '#123456',
          accent_color: '#789abc'
        }
      }) as Organization;

      magpie.mockRequest('GET', '/me', customOrg);
      
      const result = await magpie.organizations.me();
      
      expect(result.object).toBe('organization');
      expect(result.title).toBe('Custom Test Org');
      expect(result.status).toBe('pending');
      expect(result.branding.use_logo).toBe(true);
      expect(result.branding.brand_color).toBe('#123456');
    });

    it('should handle minimal organization data', async () => {
      const minimalOrg = createTestOrganization({
        business_address: '123 Test Street, Test City',
        payment_method_settings: {},
        rates: {},
        metadata: {}
      }) as Organization;

      magpie.mockRequest('GET', '/me', minimalOrg);
      
      const result = await magpie.organizations.me();
      
      expect(result.object).toBe('organization');
      expect(result.business_address).toBe('123 Test Street, Test City');
      expect(result.payment_method_settings).toEqual({});
      expect(result.rates).toEqual({});
      expect(result.metadata).toEqual({});
    });

    it('should handle different payment method settings', async () => {
      const orgWithPaymentMethods = createTestOrganization({
        payment_method_settings: {
          card: {
            mid: 'card_mid_123',
            gateway: { id: 'gateway_1', name: 'Custom Gateway' },
            rate: { mdr: 0.035, fixed_fee: 1500, formula: 'mdr_plus_fixed' },
            status: 'approved'
          },
          gcash: {
            mid: null,
            gateway: null,
            rate: { mdr: 0.025, fixed_fee: 0, formula: 'mdr_plus_fixed' },
            status: 'pending'
          },
          paymaya: {
            mid: 'paymaya_mid_456',
            gateway: null,
            rate: { mdr: 0.018, fixed_fee: 0, formula: 'mdr_plus_fixed' },
            status: 'rejected'
          }
        },
        rates: {
          card: { mdr: 0.035, fixed_fee: 1500 },
          gcash: { mdr: 0.025, fixed_fee: 0 },
          paymaya: { mdr: 0.018, fixed_fee: 0 }
        }
      }) as Organization;

      magpie.mockRequest('GET', '/me', orgWithPaymentMethods);
      
      const result = await magpie.organizations.me();
      
      expect(result.payment_method_settings.card?.mid).toBe('card_mid_123');
      expect(result.payment_method_settings.card?.status).toBe('approved');
      expect(result.payment_method_settings.gcash?.status).toBe('pending');
      expect(result.payment_method_settings.paymaya?.status).toBe('rejected');
      expect(result.rates.card?.mdr).toBe(0.035);
      expect(result.rates.gcash?.fixed_fee).toBe(0);
    });

    it('should handle different payout settings', async () => {
      const orgWithPayoutSettings = createTestOrganization({
        payout_settings: {
          schedule: 'manual',
          delivery_type: 'express',
          bank_code: 'CUSTOM_BANK',
          account_number: '9876543210',
          account_name: 'Custom Payout Account'
        }
      }) as Organization;

      magpie.mockRequest('GET', '/me', orgWithPayoutSettings);
      
      const result = await magpie.organizations.me();
      
      expect(result.payout_settings.schedule).toBe('manual');
      expect(result.payout_settings.delivery_type).toBe('express');
      expect(result.payout_settings.bank_code).toBe('CUSTOM_BANK');
      expect(result.payout_settings.account_number).toBe('9876543210');
    });
  });

  describe('request options', () => {
    it('should handle idempotency key', async () => {
      const mockOrganization = createTestOrganization() as Organization;
      magpie.mockRequest('GET', '/me', mockOrganization);
      
      const idempotencyKey = 'test_idempotency_key';
      await magpie.organizations.me({ idempotencyKey });
      
      expect(magpie.LAST_REQUEST?.headers).toMatchObject({
        'X-Idempotency-Key': idempotencyKey
      });
    });

    it('should handle expand options', async () => {
      const mockOrganization = createTestOrganization() as Organization;
      magpie.mockRequest('GET', '/me', mockOrganization);
      
      await magpie.organizations.me({ expand: ['payment_method_settings', 'payout_settings'] });
      
      expect(magpie.LAST_REQUEST?.params).toMatchObject({
        expand: ['payment_method_settings', 'payout_settings']
      });
    });

    it('should handle multiple request options combined', async () => {
      const mockOrganization = createTestOrganization() as Organization;
      magpie.mockRequest('GET', '/me', mockOrganization);
      
      const options = {
        idempotencyKey: 'combined_test_key',
        expand: ['branding'],
        retryable: false
      };
      
      await magpie.organizations.me(options);
      
      expect(magpie.LAST_REQUEST?.headers).toMatchObject({
        'X-Idempotency-Key': 'combined_test_key'
      });
      expect(magpie.LAST_REQUEST?.params).toMatchObject({
        expand: ['branding']
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors gracefully', async () => {
      const errorResponse = {
        error: {
          type: 'api_error',
          code: 'organization_not_found',
          message: 'Organization not found'
        }
      };

      magpie.mockRequest('GET', '/me', errorResponse, 404);
      
      await expect(magpie.organizations.me()).rejects.toThrow();
    });

    it('should handle authentication errors', async () => {
      const authError = {
        error: {
          type: 'authentication_error',
          code: 'invalid_api_key',
          message: 'Invalid API key provided'
        }
      };

      magpie.mockRequest('GET', '/me', authError, 401);
      
      await expect(magpie.organizations.me()).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      // Mock a network error
      magpie.mockNetworkError('GET', '/me');
      
      await expect(magpie.organizations.me()).rejects.toThrow();
    });
  });

  describe('response metadata', () => {
    it('should include lastResponse metadata', async () => {
      const mockOrganization = createTestOrganization() as Organization;
      magpie.mockRequest('GET', '/me', mockOrganization, 200, {
        'request-id': 'req_test_12345'
      });
      
      const result = await magpie.organizations.me();
      
      expect(result.lastResponse).toBeDefined();
      expect(result.lastResponse.statusCode).toBe(200);
      expect(result.lastResponse.requestId).toBe('req_test_12345');
    });

    it('should handle different status codes', async () => {
      const mockOrganization = createTestOrganization() as Organization;
      magpie.mockRequest('GET', '/me', mockOrganization, 202, {
        'request-id': 'req_accepted_789'
      });
      
      const result = await magpie.organizations.me();
      
      expect(result.lastResponse.statusCode).toBe(202);
      expect(result.lastResponse.requestId).toBe('req_accepted_789');
    });
  });

  describe('key extraction for sources authentication', () => {
    it('should provide test keys for test secret key', async () => {
      const testSecretKey = 'sk_test_12345';
      const testOrgClient = getSpyableMagpie(testSecretKey);
      
      const orgWithKeys = createTestOrganization({
        pk_test_key: 'pk_test_abcdef',
        sk_test_key: testSecretKey,
        pk_live_key: 'pk_live_xyz789',
        sk_live_key: 'sk_live_uvw456'
      }) as Organization;

      testOrgClient.mockRequest('GET', '/me', orgWithKeys);
      
      const result = await testOrgClient.organizations.me();
      
      expect(result.pk_test_key).toBe('pk_test_abcdef');
      expect(result.sk_test_key).toBe(testSecretKey);
      expect(result.pk_live_key).toBe('pk_live_xyz789');
      expect(result.sk_live_key).toBe('sk_live_uvw456');
    });

    it('should provide live keys for live secret key', async () => {
      const liveSecretKey = 'sk_live_98765';
      const liveOrgClient = getSpyableMagpie(liveSecretKey);
      
      const orgWithKeys = createTestOrganization({
        pk_test_key: 'pk_test_test123',
        sk_test_key: 'sk_test_test123',
        pk_live_key: 'pk_live_live456',
        sk_live_key: liveSecretKey
      }) as Organization;

      liveOrgClient.mockRequest('GET', '/me', orgWithKeys);
      
      const result = await liveOrgClient.organizations.me();
      
      expect(result.pk_live_key).toBe('pk_live_live456');
      expect(result.sk_live_key).toBe(liveSecretKey);
    });
  });
});
