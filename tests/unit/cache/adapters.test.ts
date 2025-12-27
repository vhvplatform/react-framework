import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryCacheAdapter, BrowserCacheAdapter } from '@vhvplatform/cache';

describe('Cache Package', () => {
  describe('MemoryCacheAdapter', () => {
    let cache: MemoryCacheAdapter;

    beforeEach(() => {
      cache = new MemoryCacheAdapter();
    });

    it('should set and get values', async () => {
      await cache.set('key1', 'value1');
      const value = await cache.get('key1');

      expect(value).toBe('value1');
    });

    it('should return null for non-existent keys', async () => {
      const value = await cache.get('non-existent');
      expect(value).toBeNull();
    });

    it('should check if key exists', async () => {
      await cache.set('key1', 'value1');

      expect(await cache.has('key1')).toBe(true);
      expect(await cache.has('key2')).toBe(false);
    });

    it('should delete keys', async () => {
      await cache.set('key1', 'value1');
      await cache.delete('key1');

      expect(await cache.has('key1')).toBe(false);
      expect(await cache.get('key1')).toBeNull();
    });

    it('should clear all keys', async () => {
      await cache.set('key1', 'value1');
      await cache.set('key2', 'value2');
      await cache.clear();

      expect(await cache.has('key1')).toBe(false);
      expect(await cache.has('key2')).toBe(false);
    });

    it('should handle TTL expiration', async () => {
      await cache.set('key1', 'value1', 100); // 100ms TTL
      expect(await cache.get('key1')).toBe('value1');

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(await cache.get('key1')).toBeNull();
    });

    it('should get all keys', async () => {
      await cache.set('key1', 'value1');
      await cache.set('key2', 'value2');

      const keys = await cache.keys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys.length).toBe(2);
    });

    it('should store different data types', async () => {
      await cache.set('string', 'value');
      await cache.set('number', 123);
      await cache.set('boolean', true);
      await cache.set('object', { key: 'value' });
      await cache.set('array', [1, 2, 3]);

      expect(await cache.get('string')).toBe('value');
      expect(await cache.get('number')).toBe(123);
      expect(await cache.get('boolean')).toBe(true);
      expect(await cache.get('object')).toEqual({ key: 'value' });
      expect(await cache.get('array')).toEqual([1, 2, 3]);
    });

    // Edge case tests
    describe('Edge Cases', () => {
      it('should handle null and undefined values', async () => {
        await cache.set('null-key', null);
        await cache.set('undefined-key', undefined);

        expect(await cache.get('null-key')).toBeNull();
        expect(await cache.get('undefined-key')).toBeUndefined();
      });

      it('should handle empty string keys', async () => {
        await cache.set('', 'empty-key-value');
        expect(await cache.get('')).toBe('empty-key-value');
      });

      it('should handle very long keys', async () => {
        const longKey = 'k'.repeat(1000);
        await cache.set(longKey, 'value');
        expect(await cache.get(longKey)).toBe('value');
      });

      it('should handle very large values', async () => {
        const largeValue = { data: 'x'.repeat(100000) };
        await cache.set('large', largeValue);
        expect(await cache.get('large')).toEqual(largeValue);
      });

      it('should handle special characters in keys', async () => {
        const specialKeys = ['key.with.dots', 'key:with:colons', 'key-with-dashes', 'key/with/slashes'];
        for (const key of specialKeys) {
          await cache.set(key, `value-${key}`);
          expect(await cache.get(key)).toBe(`value-${key}`);
        }
      });

      it('should handle concurrent operations', async () => {
        const promises = [];
        for (let i = 0; i < 100; i++) {
          promises.push(cache.set(`key${i}`, `value${i}`));
        }
        await Promise.all(promises);

        const keys = await cache.keys();
        expect(keys.length).toBe(100);
      });

      it('should handle getMany and setMany', async () => {
        await cache.setMany([
          { key: 'k1', value: 'v1' },
          { key: 'k2', value: 'v2' },
          { key: 'k3', value: 'v3' },
        ]);

        const values = await cache.getMany(['k1', 'k2', 'k3']);
        expect(values).toEqual(['v1', 'v2', 'v3']);
      });

      it('should handle deleteMany', async () => {
        await cache.set('d1', 'value1');
        await cache.set('d2', 'value2');
        await cache.set('d3', 'value3');

        await cache.deleteMany(['d1', 'd3']);

        expect(await cache.has('d1')).toBe(false);
        expect(await cache.has('d2')).toBe(true);
        expect(await cache.has('d3')).toBe(false);
      });

      it('should handle TTL of zero (no expiration)', async () => {
        await cache.set('no-ttl', 'value', 0);
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(await cache.get('no-ttl')).toBe('value');
      });

      it('should handle updating existing key', async () => {
        await cache.set('update-key', 'value1');
        expect(await cache.get('update-key')).toBe('value1');

        await cache.set('update-key', 'value2');
        expect(await cache.get('update-key')).toBe('value2');
      });

      it('should handle deleting non-existent key', async () => {
        await expect(cache.delete('non-existent')).resolves.not.toThrow();
      });

      it('should handle clearing empty cache', async () => {
        await expect(cache.clear()).resolves.not.toThrow();
      });

      it('should handle deeply nested objects', async () => {
        const deepObject = {
          level1: {
            level2: {
              level3: {
                level4: {
                  value: 'deep',
                },
              },
            },
          },
        };
        await cache.set('deep', deepObject);
        expect(await cache.get('deep')).toEqual(deepObject);
      });

      it('should handle circular references gracefully', async () => {
        const circular: Record<string, unknown> = { name: 'test' };
        circular.self = circular;
        // This should not throw during set
        await expect(cache.set('circular', circular)).resolves.not.toThrow();
      });
    });
  });

  describe('BrowserCacheAdapter', () => {
    let cache: BrowserCacheAdapter;

    beforeEach(() => {
      cache = new BrowserCacheAdapter();
      localStorage.clear();
    });

    it('should set and get values from localStorage', async () => {
      await cache.set('key1', 'value1');
      const value = await cache.get('key1');

      expect(value).toBe('value1');
    });

    it('should return null for non-existent keys', async () => {
      const value = await cache.get('non-existent');
      expect(value).toBeNull();
    });

    it('should delete keys', async () => {
      await cache.set('key1', 'value1');
      await cache.delete('key1');

      expect(await cache.get('key1')).toBeNull();
    });

    it('should clear all keys', async () => {
      await cache.set('key1', 'value1');
      await cache.set('key2', 'value2');
      await cache.clear();

      expect(await cache.get('key1')).toBeNull();
      expect(await cache.get('key2')).toBeNull();
    });

    it('should serialize and deserialize objects', async () => {
      const obj = { name: 'Test', age: 30, active: true };
      await cache.set('object', obj);

      const retrieved = await cache.get('object');
      expect(retrieved).toEqual(obj);
    });

    it('should handle arrays', async () => {
      const arr = [1, 2, 3, 4, 5];
      await cache.set('array', arr);

      const retrieved = await cache.get('array');
      expect(retrieved).toEqual(arr);
    });

    // Edge case tests
    describe('Edge Cases', () => {
      it('should handle TTL expiration', async () => {
        await cache.set('ttl-key', 'value', 100); // 100ms TTL
        expect(await cache.get('ttl-key')).toBe('value');

        await new Promise((resolve) => setTimeout(resolve, 150));
        expect(await cache.get('ttl-key')).toBeNull();
      });

      it('should handle storage prefix correctly', () => {
        const cache1 = new BrowserCacheAdapter({ prefix: 'app1' });
        const cache2 = new BrowserCacheAdapter({ prefix: 'app2' });

        cache1.set('key', 'value1');
        cache2.set('key', 'value2');

        expect(cache1.get('key')).resolves.toBe('value1');
        expect(cache2.get('key')).resolves.toBe('value2');
      });

      it('should handle sessionStorage', async () => {
        const sessionCache = new BrowserCacheAdapter({ storage: 'sessionStorage' });
        await sessionCache.set('session-key', 'session-value');
        expect(await sessionCache.get('session-key')).toBe('session-value');
      });

      it('should handle keys method with prefix filtering', async () => {
        await cache.set('key1', 'value1');
        await cache.set('key2', 'value2');

        const keys = await cache.keys();
        expect(keys).toContain('key1');
        expect(keys).toContain('key2');
      });

      it('should handle nested objects', async () => {
        const nested = {
          user: {
            name: 'John',
            address: {
              street: '123 Main',
              city: 'NYC',
            },
          },
        };
        await cache.set('nested', nested);
        expect(await cache.get('nested')).toEqual(nested);
      });

      it('should handle null values', async () => {
        await cache.set('null-key', null);
        expect(await cache.get('null-key')).toBeNull();
      });

      it('should handle empty strings', async () => {
        await cache.set('empty', '');
        expect(await cache.get('empty')).toBe('');
      });

      it('should handle special characters in values', async () => {
        const special = 'Value with "quotes" and \n newlines \t tabs';
        await cache.set('special', special);
        expect(await cache.get('special')).toBe(special);
      });

      it('should handle large data sets', async () => {
        const largeArray = Array.from({ length: 1000 }, (_, i) => ({
          id: i,
          name: `Item ${i}`,
        }));
        await cache.set('large-data', largeArray);
        expect(await cache.get('large-data')).toEqual(largeArray);
      });

      it('should handle concurrent operations', async () => {
        const promises = [];
        for (let i = 0; i < 50; i++) {
          promises.push(cache.set(`concurrent${i}`, `value${i}`));
        }
        await Promise.all(promises);

        const keys = await cache.keys();
        expect(keys.length).toBeGreaterThanOrEqual(50);
      });

      it('should handle has method correctly', async () => {
        await cache.set('exists', 'value');
        expect(await cache.has('exists')).toBe(true);
        expect(await cache.has('not-exists')).toBe(false);
      });
    });
  });
});
