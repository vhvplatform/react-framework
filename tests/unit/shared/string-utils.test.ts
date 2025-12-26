import { describe, it, expect } from 'vitest';
import { capitalize, slugify, truncate, pluralize, getInitials } from '@vhvplatform/shared';

describe('Shared Utilities - String Functions', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A');
    });

    it('should not affect already capitalized strings', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });

    it('should only capitalize first letter', () => {
      expect(capitalize('hello world')).toBe('Hello world');
    });
  });

  describe('slugify', () => {
    it('should convert to lowercase and replace spaces', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should remove special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world');
    });

    it('should handle multiple spaces', () => {
      expect(slugify('hello   world')).toBe('hello-world');
    });

    it('should handle leading/trailing spaces', () => {
      expect(slugify('  hello world  ')).toBe('hello-world');
    });

    it('should handle empty string', () => {
      expect(slugify('')).toBe('');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      const text = 'This is a very long string that needs to be truncated';
      expect(truncate(text, 20)).toBe('This is a very lo...');
    });

    it('should not truncate short strings', () => {
      expect(truncate('Short', 20)).toBe('Short');
    });

    it('should handle exact length', () => {
      expect(truncate('Exact', 5)).toBe('Exact');
    });

    it('should use custom suffix', () => {
      expect(truncate('Long string here', 10, '---')).toBe('Long st---');
    });
  });

  describe('pluralize', () => {
    it('should return singular for count of 1', () => {
      expect(pluralize('item', 1)).toBe('item');
    });

    it('should return plural for count > 1', () => {
      expect(pluralize('item', 2)).toBe('items');
      expect(pluralize('item', 5)).toBe('items');
    });

    it('should return plural for count of 0', () => {
      expect(pluralize('item', 0)).toBe('items');
    });

    it('should use custom plural form', () => {
      expect(pluralize('child', 2, 'children')).toBe('children');
      expect(pluralize('person', 5, 'people')).toBe('people');
    });
  });

  describe('getInitials', () => {
    it('should get initials from single name', () => {
      expect(getInitials('John')).toBe('J');
    });

    it('should get initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    it('should get initials from multiple names (first and last)', () => {
      expect(getInitials('John Michael Doe')).toBe('JD');
    });

    it('should handle empty string', () => {
      expect(getInitials('')).toBe('');
    });

    it('should handle lowercase names', () => {
      expect(getInitials('john doe')).toBe('JD');
    });

    it('should handle extra spaces', () => {
      expect(getInitials('  John   Doe  ')).toBe('JD');
    });
  });
});
