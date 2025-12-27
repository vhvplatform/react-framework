import { describe, it, expect, vi } from 'vitest';
import {
  unique,
  uniqueBy,
  groupBy,
  sortBy,
  chunk,
  flatten,
  sample,
  shuffle,
  range,
} from '@vhvplatform/shared/utils';

describe('Array Utils', () => {
  describe('unique', () => {
    it('should remove duplicate values', () => {
      expect(unique([1, 2, 2, 3, 3, 3, 4])).toEqual([1, 2, 3, 4]);
      expect(unique(['a', 'b', 'a', 'c', 'b'])).toEqual(['a', 'b', 'c']);
    });

    it('should handle empty arrays', () => {
      expect(unique([])).toEqual([]);
    });

    it('should preserve order of first occurrence', () => {
      expect(unique([3, 1, 2, 1, 3])).toEqual([3, 1, 2]);
    });

    it('should handle arrays with one element', () => {
      expect(unique([1])).toEqual([1]);
    });
  });

  describe('uniqueBy', () => {
    it('should remove duplicates by specified key', () => {
      const arr = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 1, name: 'Bob' },
      ];
      expect(uniqueBy(arr, 'id')).toEqual([
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ]);
    });

    it('should handle empty arrays', () => {
      expect(uniqueBy([], 'id')).toEqual([]);
    });

    it('should preserve first occurrence', () => {
      const arr = [
        { id: 1, value: 'first' },
        { id: 1, value: 'second' },
        { id: 2, value: 'third' },
      ];
      const result = uniqueBy(arr, 'id');
      expect(result[0].value).toBe('first');
      expect(result.length).toBe(2);
    });
  });

  describe('groupBy', () => {
    it('should group items by specified key', () => {
      const arr = [
        { type: 'fruit', name: 'apple' },
        { type: 'vegetable', name: 'carrot' },
        { type: 'fruit', name: 'banana' },
      ];
      const result = groupBy(arr, 'type');
      expect(result.fruit).toHaveLength(2);
      expect(result.vegetable).toHaveLength(1);
    });

    it('should handle empty arrays', () => {
      expect(groupBy([], 'key')).toEqual({});
    });

    it('should handle numeric keys', () => {
      const arr = [
        { age: 20, name: 'John' },
        { age: 30, name: 'Jane' },
        { age: 20, name: 'Bob' },
      ];
      const result = groupBy(arr, 'age');
      expect(result['20']).toHaveLength(2);
      expect(result['30']).toHaveLength(1);
    });
  });

  describe('sortBy', () => {
    it('should sort by key in ascending order', () => {
      const arr = [
        { id: 3, name: 'c' },
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
      ];
      const result = sortBy(arr, 'id', 'asc');
      expect(result[0].id).toBe(1);
      expect(result[2].id).toBe(3);
    });

    it('should sort by key in descending order', () => {
      const arr = [
        { id: 1, name: 'a' },
        { id: 3, name: 'c' },
        { id: 2, name: 'b' },
      ];
      const result = sortBy(arr, 'id', 'desc');
      expect(result[0].id).toBe(3);
      expect(result[2].id).toBe(1);
    });

    it('should not mutate original array', () => {
      const arr = [{ id: 2 }, { id: 1 }];
      const original = [...arr];
      sortBy(arr, 'id');
      expect(arr).toEqual(original);
    });

    it('should handle string sorting', () => {
      const arr = [{ name: 'charlie' }, { name: 'alice' }, { name: 'bob' }];
      const result = sortBy(arr, 'name');
      expect(result[0].name).toBe('alice');
      expect(result[2].name).toBe('charlie');
    });
  });

  describe('chunk', () => {
    it('should split array into chunks of specified size', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should handle empty arrays', () => {
      expect(chunk([], 2)).toEqual([]);
    });

    it('should handle chunk size larger than array', () => {
      expect(chunk([1, 2, 3], 5)).toEqual([[1, 2, 3]]);
    });

    it('should handle chunk size of 1', () => {
      expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    });

    it('should handle exact division', () => {
      expect(chunk([1, 2, 3, 4], 2)).toEqual([
        [1, 2],
        [3, 4],
      ]);
    });
  });

  describe('flatten', () => {
    it('should flatten nested arrays', () => {
      expect(flatten([1, [2, 3], [4, [5, 6]]])).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should handle already flat arrays', () => {
      expect(flatten([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    });

    it('should handle empty arrays', () => {
      expect(flatten([])).toEqual([]);
    });

    it('should handle deeply nested arrays', () => {
      expect(flatten([1, [2, [3, [4, [5]]]]])).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle mixed types', () => {
      expect(flatten(['a', ['b', 'c'], ['d']])).toEqual(['a', 'b', 'c', 'd']);
    });
  });

  describe('sample', () => {
    it('should return an element from array', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = sample(arr);
      expect(arr).toContain(result);
    });

    it('should return undefined for empty array', () => {
      expect(sample([])).toBeUndefined();
    });

    it('should return the only element in single-element array', () => {
      expect(sample([42])).toBe(42);
    });

    it('should use random selection', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const arr = [1, 2, 3, 4, 5];
      const result = sample(arr);
      expect(result).toBeDefined();
      vi.restoreAllMocks();
    });
  });

  describe('shuffle', () => {
    it('should return array with same length', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = shuffle(arr);
      expect(result).toHaveLength(arr.length);
    });

    it('should contain all original elements', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = shuffle(arr);
      arr.forEach((item) => {
        expect(result).toContain(item);
      });
    });

    it('should not mutate original array', () => {
      const arr = [1, 2, 3, 4, 5];
      const original = [...arr];
      shuffle(arr);
      expect(arr).toEqual(original);
    });

    it('should handle single element array', () => {
      expect(shuffle([1])).toEqual([1]);
    });

    it('should handle empty array', () => {
      expect(shuffle([])).toEqual([]);
    });
  });

  describe('range', () => {
    it('should generate range from 0 to end when only one argument', () => {
      expect(range(5)).toEqual([0, 1, 2, 3, 4]);
    });

    it('should generate range from start to end', () => {
      expect(range(2, 6)).toEqual([2, 3, 4, 5]);
    });

    it('should handle step parameter', () => {
      expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
    });

    it('should handle negative ranges', () => {
      expect(range(-3, 2)).toEqual([-3, -2, -1, 0, 1]);
    });

    it('should return empty array when start equals end', () => {
      expect(range(5, 5)).toEqual([]);
    });

    it('should handle large step sizes', () => {
      expect(range(0, 20, 5)).toEqual([0, 5, 10, 15]);
    });

    it('should handle step of 1 (default)', () => {
      expect(range(1, 5)).toEqual([1, 2, 3, 4]);
    });
  });

  describe('Edge Cases', () => {
    it('unique should handle null and undefined', () => {
      expect(unique([null, undefined, null, undefined])).toEqual([null, undefined]);
    });

    it('chunk should handle edge cases', () => {
      expect(chunk([1], 1)).toEqual([[1]]);
      expect(chunk([1, 2, 3, 4, 5, 6], 3)).toEqual([
        [1, 2, 3],
        [4, 5, 6],
      ]);
    });

    it('groupBy should handle boolean keys', () => {
      const arr = [
        { active: true, name: 'a' },
        { active: false, name: 'b' },
        { active: true, name: 'c' },
      ];
      const result = groupBy(arr, 'active');
      expect(result['true']).toHaveLength(2);
      expect(result['false']).toHaveLength(1);
    });

    it('sortBy should handle equal values', () => {
      const arr = [
        { value: 1, name: 'a' },
        { value: 1, name: 'b' },
        { value: 1, name: 'c' },
      ];
      const result = sortBy(arr, 'value');
      expect(result).toHaveLength(3);
    });

    it('flatten should handle empty nested arrays', () => {
      expect(flatten([[], [1], [], [2, 3]])).toEqual([1, 2, 3]);
    });
  });
});
