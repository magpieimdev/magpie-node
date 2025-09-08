/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { createTestCustomer, getSpyableMagpie } from '../__tests__/testUtils';

describe('CustomersResource', () => {
  let magpie: ReturnType<typeof getSpyableMagpie>;

  beforeEach(() => {
    magpie = getSpyableMagpie('sk_test_123');
  });

  describe('create', () => {
    it('should send POST request to /customers with name moved to metadata', async () => {
      const customerData = createTestCustomer();
      
      await magpie.customers.create(customerData as any);
      
      // Name should be moved from top-level to metadata
      const expectedData: any = {
        ...customerData,
        metadata: {
          name: customerData.name
        }
      };
      delete expectedData.name;
      
      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        url: expect.stringContaining('/customers'),
        data: expectedData
      });
    });

    it('should handle minimal customer creation', async () => {
      const minimalData = { email: 'test@example.com', description: 'Test customer' };
      
      await magpie.customers.create(minimalData);
      
      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'POST',
        data: minimalData
      });
    });

    it('should handle customer creation with metadata and preserve existing metadata', async () => {
      const customerData: any = {
        ...createTestCustomer(),
        metadata: {
          source: 'website',
          campaign: 'summer-2024'
        }
      };
      
      await magpie.customers.create(customerData);
      
      // Name should be moved to metadata while preserving existing metadata
      const expectedData: any = {
        ...customerData,
        metadata: {
          ...customerData.metadata,
          name: customerData.name
        }
      };
      delete expectedData.name;
      
      expect(magpie.LAST_REQUEST?.data).toEqual(expectedData);
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
    it('should send PUT request to /customers/:id with name moved to metadata', async () => {
      const customerId = 'cus_test_123';
      const updateData = { name: 'Updated Name', description: 'Updated description' };
      
      await magpie.customers.update(customerId, updateData);
      
      // Name should be moved to metadata
      const expectedData = {
        metadata: {
          name: 'Updated Name'
        }
      };
      
      expect(magpie.LAST_REQUEST).toMatchObject({
        method: 'PUT',
        url: expect.stringContaining(`/customers/${customerId}`),
        data: expectedData
      });
    });

    it('should handle partial updates', async () => {
      const customerId = 'cus_test_123';
      const updateData = { 
        email: 'newemail@example.com',
        description: 'Test customer',
        metadata: { updated: 'true' }
      };
      
      await magpie.customers.update(customerId, updateData);
      
      expect(magpie.LAST_REQUEST?.data).toEqual(updateData);
    });

    it('should handle empty update data', async () => {
      const customerId = 'cus_test_123';
      const updateData = {};
      
      await magpie.customers.update(customerId, updateData);
      
      // Empty update data should result in empty metadata object
      expect(magpie.LAST_REQUEST?.data).toEqual({
        metadata: {}
      });
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

  describe('name handling', () => {
    beforeEach(() => {
      // Mock response with name in metadata
      const customerWithNameInMetadata = {
        id: 'cus_test_123',
        object: 'customer',
        email: 'test@example.com',
        description: '',
        mobile_number: null,
        livemode: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        metadata: {
          name: 'John Doe',
          other_field: 'value'
        }
      };
      
      magpie.mockRequest('GET', '/customers/cus_test_123', customerWithNameInMetadata);
      magpie.mockRequest('GET', '/customers/by_email/test@example.com', customerWithNameInMetadata);
      magpie.mockRequest('POST', '/customers/', customerWithNameInMetadata);
      magpie.mockRequest('PUT', '/customers/cus_test_123', customerWithNameInMetadata);
    });

    it('should extract name from metadata in retrieve response', async () => {
      const result = await magpie.customers.retrieve('cus_test_123');
      
      expect(result.name).toBe('John Doe');
      expect(result.metadata.name).toBe('John Doe');
    });

    it('should extract name from metadata in retrieveByEmail response', async () => {
      const result = await magpie.customers.retrieveByEmail('test@example.com');
      
      expect(result.name).toBe('John Doe');
      expect(result.metadata.name).toBe('John Doe');
    });

    it('should extract name from metadata in create response', async () => {
      const customerData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        description: 'Test customer'
      };
      
      const result = await magpie.customers.create(customerData);
      
      expect(result.name).toBe('John Doe'); // From mock response
    });

    it('should extract name from metadata in update response', async () => {
      const updateData = { name: 'Jane Smith' };
      
      const result = await magpie.customers.update('cus_test_123', updateData);
      
      expect(result.name).toBe('John Doe'); // From mock response
    });

    it('should handle customer creation with name and existing metadata', async () => {
      const customerData = {
        name: 'Test Name',
        email: 'test@example.com',
        description: 'Test customer',
        metadata: {
          existing_field: 'existing_value'
        }
      };
      
      await magpie.customers.create(customerData);
      
      // Should preserve existing metadata and add name
      expect(magpie.LAST_REQUEST?.data).toEqual({
        email: 'test@example.com',
        description: 'Test customer',
        metadata: {
          existing_field: 'existing_value',
          name: 'Test Name'
        }
      });
    });

    it('should handle customer update with name and existing metadata', async () => {
      const updateData = {
        name: 'Updated Name',
        description: 'Updated description',
        metadata: {
          existing_field: 'existing_value'
        }
      };
      
      await magpie.customers.update('cus_test_123', updateData);
      
      // Should preserve existing metadata and add/update name
      expect(magpie.LAST_REQUEST?.data).toEqual({
        description: 'Updated description',
        metadata: {
          existing_field: 'existing_value',
          name: 'Updated Name'
        }
      });
    });

    it('should handle customers without name in metadata', async () => {
      const customerWithoutName = {
        id: 'cus_test_456',
        object: 'customer',
        email: 'test2@example.com',
        description: '',
        mobile_number: null,
        livemode: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        metadata: {
          other_field: 'value'
        }
      };
      
      magpie.mockRequest('GET', '/customers/cus_test_456', customerWithoutName);
      
      const result = await magpie.customers.retrieve('cus_test_456');
      
      expect(result.name).toBeUndefined();
      expect(result.metadata.other_field).toBe('value');
    });
  });
});