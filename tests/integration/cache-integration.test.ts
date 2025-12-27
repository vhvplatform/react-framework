import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryCacheAdapter } from '@vhvplatform/cache';
import { deepClone } from '@vhvplatform/shared/utils';

/**
 * Integration tests verify that different modules work together correctly
 */
describe('Integration Tests', () => {
  describe('Cache + Shared Utils Integration', () => {
    let cache: MemoryCacheAdapter;

    beforeEach(() => {
      cache = new MemoryCacheAdapter();
    });

    it('should cache and retrieve cloned objects without reference issues', async () => {
      // Original object
      const original = {
        user: { name: 'John', age: 30 },
        settings: { theme: 'dark', notifications: true },
      };

      // Clone and cache
      const cloned = deepClone(original);
      await cache.set('user-data', cloned);

      // Modify original
      original.user.name = 'Jane';
      original.settings.theme = 'light';

      // Retrieve from cache
      const cached = await cache.get('user-data');

      // Cached data should match the cloned version, not the modified original
      expect(cached).toEqual({
        user: { name: 'John', age: 30 },
        settings: { theme: 'dark', notifications: true },
      });
      expect(cached).not.toEqual(original);
    });

    it('should handle complex data workflows with multiple operations', async () => {
      // Simulate a real-world scenario
      const users = [
        { id: 1, name: 'Alice', role: 'admin', active: true },
        { id: 2, name: 'Bob', role: 'user', active: true },
        { id: 3, name: 'Charlie', role: 'user', active: false },
      ];

      // Cache users
      await cache.set('users', users);

      // Retrieve and modify
      const cachedUsers = await cache.get<typeof users>('users');
      if (!cachedUsers) throw new Error('Users not found in cache');

      // Filter active users
      const activeUsers = cachedUsers.filter(u => u.active);
      await cache.set('active-users', activeUsers);

      // Deep clone for safe mutation
      const userToUpdate = deepClone(activeUsers[0]);
      userToUpdate.name = 'Alicia';
      
      // Update in cache
      const updatedActiveUsers = activeUsers.map(u => 
        u.id === userToUpdate.id ? userToUpdate : u
      );
      await cache.set('active-users', updatedActiveUsers);

      // Verify original data unchanged
      const originalCached = await cache.get<typeof users>('users');
      expect(originalCached?.[0].name).toBe('Alice');

      // Verify updated data
      const updatedCached = await cache.get<typeof activeUsers>('active-users');
      expect(updatedCached?.[0].name).toBe('Alicia');
      expect(updatedCached).toHaveLength(2); // Only active users
    });

    it('should handle TTL expiration with data transformations', async () => {
      const data = {
        timestamp: Date.now(),
        values: [1, 2, 3, 4, 5],
      };

      // Cache with short TTL
      await cache.set('temp-data', data, 100);

      // Retrieve immediately
      const retrieved = await cache.get('temp-data');
      expect(retrieved).toEqual(data);

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 150));

      // Should be expired
      const expired = await cache.get('temp-data');
      expect(expired).toBeNull();
    });

    it('should handle concurrent cache operations safely', async () => {
      // Simulate concurrent writes
      const operations = [];
      for (let i = 0; i < 100; i++) {
        operations.push(
          cache.set(`key-${i}`, { id: i, data: `value-${i}` })
        );
      }

      await Promise.all(operations);

      // Verify all keys exist
      const keys = await cache.keys();
      expect(keys.length).toBe(100);

      // Verify random samples
      const sample1 = await cache.get('key-0');
      const sample2 = await cache.get('key-50');
      const sample3 = await cache.get('key-99');

      expect(sample1).toEqual({ id: 0, data: 'value-0' });
      expect(sample2).toEqual({ id: 50, data: 'value-50' });
      expect(sample3).toEqual({ id: 99, data: 'value-99' });
    });

    it('should handle batch operations efficiently', async () => {
      // Create batch data
      const entries = Array.from({ length: 50 }, (_, i) => ({
        key: `batch-${i}`,
        value: { id: i, name: `Item ${i}` },
      }));

      // Batch set
      await cache.setMany(entries);

      // Batch get
      const keys = entries.map(e => e.key);
      const values = await cache.getMany(keys);

      // Verify all retrieved
      expect(values).toHaveLength(50);
      expect(values[0]).toEqual({ id: 0, name: 'Item 0' });
      expect(values[49]).toEqual({ id: 49, name: 'Item 49' });

      // Batch delete half
      const keysToDelete = keys.slice(0, 25);
      await cache.deleteMany(keysToDelete);

      // Verify deletion
      const remainingKeys = await cache.keys();
      expect(remainingKeys).toHaveLength(25);
    });
  });

  describe('Multiple Cache Instances', () => {
    it('should maintain isolation between cache instances', async () => {
      const cache1 = new MemoryCacheAdapter();
      const cache2 = new MemoryCacheAdapter();

      // Set different values in each cache
      await cache1.set('shared-key', 'value1');
      await cache2.set('shared-key', 'value2');

      // Each cache should maintain its own value
      expect(await cache1.get('shared-key')).toBe('value1');
      expect(await cache2.get('shared-key')).toBe('value2');

      // Clear one cache shouldn't affect the other
      await cache1.clear();
      expect(await cache1.get('shared-key')).toBeNull();
      expect(await cache2.get('shared-key')).toBe('value2');
    });
  });

  describe('Error Handling Integration', () => {
    it('should gracefully handle errors in complex workflows', async () => {
      const cache = new MemoryCacheAdapter();

      // Attempt to process data that doesn't exist
      const data = await cache.get('non-existent');
      expect(data).toBeNull();

      // Set valid data
      await cache.set('valid', { id: 1 });

      // Attempt operations on valid and invalid keys
      const results = await cache.getMany(['valid', 'invalid', 'also-invalid']);
      expect(results[0]).toEqual({ id: 1 });
      expect(results[1]).toBeNull();
      expect(results[2]).toBeNull();
    });
  });
});
