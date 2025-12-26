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
  });
});
