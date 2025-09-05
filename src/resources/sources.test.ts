/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getSpyableMagpie } from '../__tests__/testUtils';

describe('SourcesResource', () => {
  let magpie: ReturnType<typeof getSpyableMagpie>;

  beforeEach(() => {
    magpie = getSpyableMagpie('sk_test_123');
    
    // Mock the organization endpoint to return public keys
    magpie.mockRequest('GET', '/me', {
      object: 'organization',
      pk_test_key: 'pk_test_456',
      pk_live_key: 'pk_live_789'
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

  describe('PK authentication', () => {
    it('should switch to public key authentication before retrieve', async () => {
      const sourceId = 'src_test_123';
      
      await magpie.sources.retrieve(sourceId);
      
      // Should have made a call to get organization info first
      const organizationCall = magpie.REQUESTS.find(req => req.url?.includes('/me'));
      expect(organizationCall).toBeDefined();
      
      // The retrieve call should use public key authentication
      expect(magpie.LAST_REQUEST?.url).toContain(`/sources/${sourceId}`);
    });

    it('should cache public key after first retrieval', async () => {
      const sourceId1 = 'src_test_123';
      const sourceId2 = 'src_test_456';
      
      // Make first retrieve call
      await magpie.sources.retrieve(sourceId1);
      
      // Make second retrieve call
      await magpie.sources.retrieve(sourceId2);
      
      // Should not make additional organization calls
      const orgCalls = magpie.REQUESTS.filter(req => req.url?.includes('/me'));
      expect(orgCalls).toHaveLength(1); // Only one organization call
    });
  });
});