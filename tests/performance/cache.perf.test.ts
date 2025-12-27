import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryCacheAdapter } from '@vhvplatform/cache';

describe('MemoryCacheAdapter Performance Tests', () => {
  let cache: MemoryCacheAdapter;

  beforeEach(() => {
    cache = new MemoryCacheAdapter({
      defaultTTL: 60000,
      maxSize: 1000,
      debug: false,
    });
  });

  afterEach(() => {
    cache.destroy();
  });

  describe('set operations', () => {
    it('should handle bulk set operations efficiently', async () => {
      const numItems = 1000;
      const items = Array(numItems)
        .fill(0)
        .map((_, i) => ({
          key: `key_${i}`,
          value: { id: i, data: `data_${i}` },
        }));

      const start = performance.now();
      await cache.setMany(items);
      const end = performance.now();

      // Should complete in reasonable time (< 100ms)
      expect(end - start).toBeLessThan(100);
      expect(cache.size()).toBe(numItems);
    });

    it('should handle individual set operations efficiently', async () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        await cache.set(`key_${i}`, { id: i, data: `data_${i}` });
      }
      const end = performance.now();

      // Should complete in reasonable time (< 150ms)
      expect(end - start).toBeLessThan(150);
      expect(cache.size()).toBe(1000);
    });
  });

  describe('get operations', () => {
    beforeEach(async () => {
      // Pre-populate cache
      const items = Array(1000)
        .fill(0)
        .map((_, i) => ({
          key: `key_${i}`,
          value: { id: i, data: `data_${i}` },
        }));
      await cache.setMany(items);
    });

    it('should handle bulk get operations efficiently', async () => {
      const keys = Array(1000)
        .fill(0)
        .map((_, i) => `key_${i}`);

      const start = performance.now();
      const results = await cache.getMany(keys);
      const end = performance.now();

      // Should complete quickly (< 50ms)
      expect(end - start).toBeLessThan(50);
      expect(results.length).toBe(1000);
    });

    it('should handle individual get operations efficiently', async () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        await cache.get(`key_${i}`);
      }
      const end = performance.now();

      // Should complete in reasonable time (< 100ms)
      expect(end - start).toBeLessThan(100);
    });
  });

  describe('eviction strategy', () => {
    it('should evict old entries when exceeding max size', async () => {
      const smallCache = new MemoryCacheAdapter({
        maxSize: 100,
        debug: false,
      });

      // Add 150 items
      for (let i = 0; i < 150; i++) {
        await smallCache.set(`key_${i}`, { id: i, data: `data_${i}` });
      }

      // Should only have maxSize items
      expect(smallCache.size()).toBe(100);

      // Oldest items should be evicted
      const firstKey = await smallCache.get('key_0');
      const lastKey = await smallCache.get('key_149');

      expect(firstKey).toBeNull(); // Evicted
      expect(lastKey).not.toBeNull(); // Still present

      smallCache.destroy();
    });

    it('should handle eviction efficiently', async () => {
      const smallCache = new MemoryCacheAdapter({
        maxSize: 100,
        debug: false,
      });

      const start = performance.now();
      // Add 1000 items, triggering multiple evictions
      for (let i = 0; i < 1000; i++) {
        await smallCache.set(`key_${i}`, { id: i, data: `data_${i}` });
      }
      const end = performance.now();

      // Should complete in reasonable time even with evictions (< 200ms)
      expect(end - start).toBeLessThan(200);
      expect(smallCache.size()).toBe(100);

      smallCache.destroy();
    });
  });

  describe('expiration cleanup', () => {
    it('should handle expired entries efficiently', async () => {
      const shortTTLCache = new MemoryCacheAdapter({
        defaultTTL: 100, // 100ms
        debug: false,
      });

      // Add 1000 items
      for (let i = 0; i < 1000; i++) {
        await shortTTLCache.set(`key_${i}`, { id: i, data: `data_${i}` });
      }

      expect(shortTTLCache.size()).toBe(1000);

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Try to get an expired item - should trigger cleanup
      const start = performance.now();
      const result = await shortTTLCache.get('key_0');
      const end = performance.now();

      expect(result).toBeNull();
      // Individual get should still be fast even with expiration check
      expect(end - start).toBeLessThan(10);

      shortTTLCache.destroy();
    });
  });

  describe('memory management', () => {
    it('should handle large values efficiently', async () => {
      const largeValue = {
        data: Array(1000).fill({ nested: 'data', items: [1, 2, 3, 4, 5] }),
      };

      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        await cache.set(`large_key_${i}`, largeValue);
      }
      const end = performance.now();

      // Should complete in reasonable time (< 100ms)
      expect(end - start).toBeLessThan(100);
      expect(cache.size()).toBe(100);
    });

    it('should clear cache quickly', async () => {
      // Add 1000 items
      for (let i = 0; i < 1000; i++) {
        await cache.set(`key_${i}`, { id: i, data: `data_${i}` });
      }

      const start = performance.now();
      await cache.clear();
      const end = performance.now();

      // Should be very fast (< 10ms)
      expect(end - start).toBeLessThan(10);
      expect(cache.size()).toBe(0);
    });
  });
});
