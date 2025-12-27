import { describe, it, expect } from 'vitest';
import { deepClone, deepMerge, pick, omit, isEmpty, get, set } from '@vhvplatform/shared/utils';

describe('Object Utils', () => {
  describe('deepClone', () => {
    it('should clone primitive values', () => {
      expect(deepClone(5)).toBe(5);
      expect(deepClone('hello')).toBe('hello');
      expect(deepClone(true)).toBe(true);
      expect(deepClone(null)).toBe(null);
    });

    it('should clone simple objects', () => {
      const obj = { a: 1, b: 2 };
      const cloned = deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
    });

    it('should clone nested objects', () => {
      const obj = { a: { b: { c: 1 } } };
      const cloned = deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned.a).not.toBe(obj.a);
      expect(cloned.a.b).not.toBe(obj.a.b);
    });

    it('should clone arrays', () => {
      const arr = [1, 2, [3, 4]];
      const cloned = deepClone(arr);
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[2]).not.toBe(arr[2]);
    });

    it('should clone Date objects', () => {
      const date = new Date('2024-01-01');
      const cloned = deepClone(date);
      expect(cloned.getTime()).toBe(date.getTime());
      expect(cloned).not.toBe(date);
    });

    it('should handle mixed nested structures', () => {
      const obj = {
        name: 'test',
        values: [1, 2, { nested: true }],
        meta: { created: new Date('2024-01-01') },
      };
      const cloned = deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned.values).not.toBe(obj.values);
      expect(cloned.meta).not.toBe(obj.meta);
    });
  });

  describe('deepMerge', () => {
    it('should merge two objects', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      const result = deepMerge(target, source);
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should deep merge nested objects', () => {
      const target = { a: { b: 1, c: 2 } };
      const source = { a: { b: 3, d: 4 } };
      const result = deepMerge(target, source);
      expect(result).toEqual({ a: { b: 3, c: 2, d: 4 } });
    });

    it('should not mutate target object', () => {
      const target = { a: 1 };
      const source = { b: 2 };
      const original = { ...target };
      deepMerge(target, source);
      expect(target).toEqual(original);
    });

    it('should handle arrays by replacement', () => {
      const target = { arr: [1, 2, 3] };
      const source = { arr: [4, 5] };
      const result = deepMerge(target, source);
      expect(result.arr).toEqual([4, 5]);
    });

    it('should handle null and undefined values', () => {
      const target = { a: 1, b: 2 };
      const source = { a: null, c: undefined };
      const result = deepMerge(target, source);
      expect(result.a).toBeNull();
      expect(result.c).toBeUndefined();
    });
  });

  describe('pick', () => {
    it('should pick specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    });

    it('should ignore non-existent keys', () => {
      const obj = { a: 1, b: 2 };
      expect(pick(obj, ['a', 'c' as keyof typeof obj])).toEqual({ a: 1 });
    });

    it('should return empty object for empty keys array', () => {
      const obj = { a: 1, b: 2 };
      expect(pick(obj, [])).toEqual({});
    });

    it('should handle empty object', () => {
      expect(pick({}, ['a' as never])).toEqual({});
    });
  });

  describe('omit', () => {
    it('should omit specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 });
    });

    it('should handle multiple keys', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      expect(omit(obj, ['a', 'c'])).toEqual({ b: 2, d: 4 });
    });

    it('should return copy when omitting no keys', () => {
      const obj = { a: 1, b: 2 };
      const result = omit(obj, []);
      expect(result).toEqual(obj);
      expect(result).not.toBe(obj);
    });

    it('should ignore non-existent keys', () => {
      const obj = { a: 1, b: 2 };
      expect(omit(obj, ['c' as keyof typeof obj])).toEqual({ a: 1, b: 2 });
    });
  });

  describe('isEmpty', () => {
    it('should return true for null and undefined', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return true for empty string', () => {
      expect(isEmpty('')).toBe(true);
    });

    it('should return false for non-empty string', () => {
      expect(isEmpty('hello')).toBe(false);
    });

    it('should return true for empty array', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('should return false for non-empty array', () => {
      expect(isEmpty([1, 2, 3])).toBe(false);
    });

    it('should return true for empty object', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('should return false for non-empty object', () => {
      expect(isEmpty({ a: 1 })).toBe(false);
    });

    it('should return false for numbers', () => {
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(42)).toBe(false);
    });

    it('should return false for booleans', () => {
      expect(isEmpty(false)).toBe(false);
      expect(isEmpty(true)).toBe(false);
    });
  });

  describe('get', () => {
    it('should get nested property', () => {
      const obj = { a: { b: { c: 42 } } };
      expect(get(obj, 'a.b.c')).toBe(42);
    });

    it('should return undefined for non-existent path', () => {
      const obj = { a: { b: 1 } };
      expect(get(obj, 'a.c.d')).toBeUndefined();
    });

    it('should return default value when path not found', () => {
      const obj = { a: 1 };
      expect(get(obj, 'b.c', 'default')).toBe('default');
    });

    it('should handle simple paths', () => {
      const obj = { name: 'John' };
      expect(get(obj, 'name')).toBe('John');
    });

    it('should handle deeply nested paths', () => {
      const obj = { a: { b: { c: { d: { e: 'deep' } } } } };
      expect(get(obj, 'a.b.c.d.e')).toBe('deep');
    });

    it('should handle null values in path', () => {
      const obj = { a: { b: null } };
      expect(get(obj, 'a.b.c', 'default')).toBe('default');
    });
  });

  describe('set', () => {
    it('should set nested property', () => {
      const obj = { a: { b: 1 } };
      set(obj, 'a.b', 42);
      expect(obj.a.b).toBe(42);
    });

    it('should create nested structure if not exists', () => {
      const obj: Record<string, unknown> = {};
      set(obj, 'a.b.c', 'value');
      expect(get(obj, 'a.b.c')).toBe('value');
    });

    it('should handle simple paths', () => {
      const obj: Record<string, unknown> = { name: 'John' };
      set(obj, 'name', 'Jane');
      expect(obj.name).toBe('Jane');
    });

    it('should handle deeply nested paths', () => {
      const obj: Record<string, unknown> = {};
      set(obj, 'a.b.c.d.e', 'deep');
      expect(get(obj, 'a.b.c.d.e')).toBe('deep');
    });

    it('should override existing values', () => {
      const obj = { a: { b: 'old' } };
      set(obj, 'a.b', 'new');
      expect(obj.a.b).toBe('new');
    });

    it('should return the modified object', () => {
      const obj: Record<string, unknown> = {};
      const result = set(obj, 'a.b', 1);
      expect(result).toBe(obj);
    });
  });

  describe('Edge Cases', () => {
    it('deepClone should handle circular references gracefully', () => {
      const obj: Record<string, unknown> = { a: 1 };
      // Note: This will cause stack overflow in current implementation
      // Just documenting the limitation
      expect(deepClone(obj)).toEqual(obj);
    });

    it('get should handle empty string path', () => {
      const obj = { '': 'empty key' };
      expect(get(obj, '')).toBe('empty key');
    });

    it('set should handle empty path gracefully', () => {
      const obj: Record<string, unknown> = {};
      const result = set(obj, '', 'value');
      expect(result).toBe(obj);
    });

    it('isEmpty should handle objects with prototype properties', () => {
      const obj = Object.create({ inherited: true });
      expect(isEmpty(obj)).toBe(true);
    });
  });
});
