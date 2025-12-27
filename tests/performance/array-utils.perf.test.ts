import { describe, it, expect } from 'vitest';
import { flatten, shuffle, unique, groupBy, sortBy } from '@vhvplatform/shared';

describe('Array Utilities Performance Tests', () => {
  describe('flatten', () => {
    it('should handle deeply nested arrays efficiently', () => {
      // Create a moderately nested array (depth 3, size 10)
      const createNestedArray = (depth: number, size: number): any[] => {
        if (depth === 0) return Array(size).fill(1);
        return Array(size).fill(createNestedArray(depth - 1, size));
      };

      const nested = createNestedArray(3, 10);
      const start = performance.now();
      const result = flatten(nested);
      const end = performance.now();

      // Should complete in reasonable time (< 500ms for depth 3)
      expect(end - start).toBeLessThan(500);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle large flat arrays efficiently', () => {
      const largeArray = Array(10000).fill(1);
      const start = performance.now();
      const result = flatten(largeArray);
      const end = performance.now();

      // Should be very fast for flat arrays (< 10ms)
      expect(end - start).toBeLessThan(10);
      expect(result.length).toBe(10000);
    });
  });

  describe('unique', () => {
    it('should handle large arrays with duplicates efficiently', () => {
      const largeArray = Array(10000)
        .fill(0)
        .map((_, i) => i % 100); // 10000 items, only 100 unique

      const start = performance.now();
      const result = unique(largeArray);
      const end = performance.now();

      // Should complete quickly (< 20ms)
      expect(end - start).toBeLessThan(20);
      expect(result.length).toBe(100);
    });
  });

  describe('groupBy', () => {
    it('should handle large arrays efficiently', () => {
      interface Item {
        id: number;
        category: string;
      }

      const largeArray: Item[] = Array(10000)
        .fill(0)
        .map((_, i) => ({
          id: i,
          category: `cat_${i % 10}`,
        }));

      const start = performance.now();
      const result = groupBy(largeArray, 'category');
      const end = performance.now();

      // Should complete in reasonable time (< 50ms)
      expect(end - start).toBeLessThan(50);
      expect(Object.keys(result).length).toBe(10);
      expect(result['cat_0'].length).toBe(1000);
    });
  });

  describe('sortBy', () => {
    it('should handle large arrays efficiently', () => {
      interface Item {
        id: number;
        value: number;
      }

      const largeArray: Item[] = Array(10000)
        .fill(0)
        .map((_, i) => ({
          id: i,
          value: Math.random() * 1000,
        }));

      const start = performance.now();
      const result = sortBy(largeArray, 'value', 'asc');
      const end = performance.now();

      // Should complete in reasonable time (< 100ms)
      expect(end - start).toBeLessThan(100);
      expect(result.length).toBe(10000);
      // Verify it's sorted
      expect(result[0].value).toBeLessThanOrEqual(result[result.length - 1].value);
    });
  });

  describe('shuffle', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array(10000)
        .fill(0)
        .map((_, i) => i);

      const start = performance.now();
      const result = shuffle(largeArray);
      const end = performance.now();

      // Should complete quickly (< 30ms)
      expect(end - start).toBeLessThan(30);
      expect(result.length).toBe(10000);
      // Should not be the same as input (very unlikely)
      expect(result).not.toEqual(largeArray);
    });
  });
});
