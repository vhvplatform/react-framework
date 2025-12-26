import { describe, it, expect } from 'vitest';
import { paginationKey, filterKey, searchKey, combineKeys } from '@vhvplatform/query';

describe('Query Key Utilities', () => {
  describe('paginationKey', () => {
    it('should generate pagination key', () => {
      const key = paginationKey('users', { page: 1, perPage: 10 });

      expect(key).toEqual(['users', 'page', '1', 'perPage', '10']);
    });

    it('should handle different page numbers', () => {
      const key1 = paginationKey('users', { page: 1, perPage: 10 });
      const key2 = paginationKey('users', { page: 2, perPage: 10 });

      expect(key1).not.toEqual(key2);
      expect(key2).toContain('2');
    });

    it('should handle different page sizes', () => {
      const key1 = paginationKey('users', { page: 1, perPage: 10 });
      const key2 = paginationKey('users', { page: 1, perPage: 20 });

      expect(key1).not.toEqual(key2);
      expect(key2).toContain('20');
    });
  });

  describe('filterKey', () => {
    it('should generate filter key', () => {
      const key = filterKey('users', { status: 'active' });

      expect(key).toContain('users');
      expect(key).toContain('filters');
      expect(key).toContain('status');
      expect(key).toContain('active');
    });

    it('should sort filter keys alphabetically', () => {
      const key1 = filterKey('users', { status: 'active', role: 'admin' });
      const key2 = filterKey('users', { role: 'admin', status: 'active' });

      expect(key1).toEqual(key2);
    });

    it('should handle multiple filters', () => {
      const key = filterKey('users', { status: 'active', role: 'admin', verified: 'true' });

      expect(key).toContain('status');
      expect(key).toContain('role');
      expect(key).toContain('verified');
    });

    it('should handle empty filters', () => {
      const key = filterKey('users', {});

      expect(key).toEqual(['users', 'filters']);
    });

    it('should convert filter values to strings', () => {
      const key = filterKey('users', { age: 25, active: true });

      expect(key).toContain('25');
      expect(key).toContain('true');
    });
  });

  describe('searchKey', () => {
    it('should generate search key', () => {
      const key = searchKey('users', 'john');

      expect(key).toEqual(['users', 'search', 'john']);
    });

    it('should handle empty search term', () => {
      const key = searchKey('users', '');

      expect(key).toEqual(['users', 'search', '']);
    });

    it('should handle special characters in search', () => {
      const key = searchKey('users', 'john@example.com');

      expect(key).toContain('john@example.com');
    });
  });

  describe('combineKeys', () => {
    it('should combine string keys', () => {
      const key = combineKeys('users', 'active', 'admin');

      expect(key).toEqual(['users', 'active', 'admin']);
    });

    it('should combine array keys', () => {
      const key = combineKeys(['users', 'list'], ['page', '1']);

      expect(key).toEqual(['users', 'list', 'page', '1']);
    });

    it('should combine mixed keys', () => {
      const key = combineKeys('users', ['page', '1'], 'active');

      expect(key).toEqual(['users', 'page', '1', 'active']);
    });

    it('should handle empty arrays', () => {
      const key = combineKeys('users', [], 'active');

      expect(key).toEqual(['users', 'active']);
    });

    it('should flatten nested arrays', () => {
      const key = combineKeys(['users', ['nested']], 'key');

      expect(key).toEqual(['users', 'nested', 'key']);
    });
  });

  describe('Integration', () => {
    it('should combine pagination and filter keys', () => {
      const base = 'users';
      const pagination = paginationKey(base, { page: 1, perPage: 10 });
      const filters = filterKey(base, { status: 'active' });

      const combined = combineKeys(pagination, filters);

      expect(combined).toContain('users');
      expect(combined).toContain('page');
      expect(combined).toContain('filters');
    });

    it('should combine search and filter keys', () => {
      const base = 'users';
      const search = searchKey(base, 'john');
      const filters = filterKey(base, { role: 'admin' });

      const combined = combineKeys(search, filters);

      expect(combined).toContain('users');
      expect(combined).toContain('search');
      expect(combined).toContain('filters');
    });
  });
});
