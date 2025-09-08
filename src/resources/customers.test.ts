/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { createTestCustomer, getSpyableMagpie } from '../__tests__/testUtils';

describe('CustomersResource', () => {
  let magpie: ReturnType<typeof getSpyableMagpie>;

  beforeEach(() => {
    magpie = getSpyableMagpie('sk_test_123');
  });

  describe('create', () => {
    it('should send POST request to /customers', async () => {
      const customerData = createTestCustomer();
      
      await magpie.customers.create(customerData as any);
      
      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        url: expect.stringContaining('/customers'),
        data: customerData
      });
    });

    it('should handle minimal customer creation', async () => {
      const minimalData = { email: 'test@example.com' };
      
      await magpie.customers.create(minimalData);
      
      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        data: minimalData
      });
    });

    it('should handle customer creation with metadata', async () => {
      const customerData = {
        ...createTestCustomer(),
        metadata: {
          source: 'website',
          campaign: 'summer-2024'
        }
      };
      
      await magpie.customers.create(customerData as any);
      
      expect(magpie.LAST_REQUEST?.data).toEqual(customerData);
    });
  });

  describe('retrieve', () => {
    it('should send GET request to /customers/:id', async () => {
      const customerId = 'cus_test_123';
      
      await magpie.customers.retrieve(customerId);
      
      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'GET',
        url: expect.stringContaining(`/customers/${customerId}`)
      });
    });

    it('should handle customer ID parameter correctly', async () => {
      const customerId = 'cus_special_characters_123';
      
      await magpie.customers.retrieve(customerId);
      
      expect(magpie.LAST_REQUEST?.url).toContain(encodeURIComponent(customerId));
    });
  });

  describe('update', () => {
    it('should send PUT request to /customers/:id', async () => {
      const customerId = 'cus_test_123';
      const updateData = { name: 'Updated Name' };
      
      await magpie.customers.update(customerId, updateData);
      
      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'PUT',
        url: expect.stringContaining(`/customers/${customerId}`),
        data: updateData
      });
    });

    it('should handle partial updates', async () => {
      const customerId = 'cus_test_123';
      const updateData = { 
        email: 'newemail@example.com',
        metadata: { updated: 'true' }
      };
      
      await magpie.customers.update(customerId, updateData);
      
      expect(magpie.LAST_REQUEST?.data).toEqual(updateData);
    });

    it('should handle empty update data', async () => {
      const customerId = 'cus_test_123';
      const updateData = {};
      
      await magpie.customers.update(customerId, updateData);
      
      expect(magpie.LAST_REQUEST?.data).toEqual(updateData);
    });
  });

  describe('retrieveByEmail', () => {
    it('should send GET request to /customers/by_email/:email endpoint', async () => {
      const email = 'test@example.com';
      
      await magpie.customers.retrieveByEmail(email);
      
      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'GET',
        url: expect.stringContaining('/customers/by_email/test@example.com')
      });
    });
  });

  describe('attachSource', () => {
    it('should send POST request to /customers/:id/sources', async () => {
      const customerId = 'cus_test_123';
      const sourceId = 'src_test_456';
      
      await magpie.customers.attachSource(customerId, sourceId);
      
      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        url: expect.stringContaining(`/customers/${customerId}/sources`),
        data: { source: sourceId }
      });
    });
  });

  describe('detachSource', () => {
    it('should send DELETE request to /customers/:id/sources/:sourceId', async () => {
      const customerId = 'cus_test_123';
      const sourceId = 'src_test_456';
      
      await magpie.customers.detachSource(customerId, sourceId);
      
      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'DELETE',
        url: expect.stringContaining(`/customers/${customerId}/sources/${sourceId}`)
      });
    });
  });

  describe('request options', () => {
    it('should handle idempotency key in create request', async () => {
      const customerData = createTestCustomer();
      const idempotencyKey = 'test_key_123';
      
      await magpie.customers.create(customerData as any, { idempotencyKey });
      
      expect(magpie.LAST_REQUEST?.headers).toMatchObject({
        'X-Idempotency-Key': idempotencyKey
      });
    });

    it('should handle idempotency key in update request', async () => {
      const customerId = 'cus_test_123';
      const updateData = { name: 'Updated Name' };
      const idempotencyKey = 'update_key_456';
      
      await magpie.customers.update(customerId, updateData, { idempotencyKey });
      
      expect(magpie.LAST_REQUEST?.headers).toMatchObject({
        'X-Idempotency-Key': idempotencyKey
      });
    });
  });

  describe('error cases', () => {
    it('should handle invalid customer ID format', async () => {
      const invalidId = '';
      
      // This would typically be validated by the API, but we test the request is sent
      await magpie.customers.retrieve(invalidId);
      
      expect(magpie.LAST_REQUEST?.url).toContain('/customers');
    });

    it('should handle special characters in customer ID', async () => {
      const customerId = 'cus_test@123#456';
      
      await magpie.customers.retrieve(customerId);
      
      // Should include the customer ID in the URL path
      expect(magpie.LAST_REQUEST?.url).toContain(customerId);
    });
  });
});