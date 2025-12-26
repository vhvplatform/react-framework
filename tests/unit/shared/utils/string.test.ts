import { describe, it, expect } from 'vitest';
import {
  capitalize,
  truncate,
  toKebabCase,
  toCamelCase,
  toSnakeCase,
  pluralize,
  getInitials,
} from '@vhvplatform/shared/utils';

describe('String Utils', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
    });

    it('should handle already capitalized strings', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });

    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      const text = 'This is a very long text that needs to be truncated';
      expect(truncate(text, 20)).toBe('This is a very long...');
    });

    it('should not truncate short strings', () => {
      const text = 'Short';
      expect(truncate(text, 20)).toBe('Short');
    });

    it('should use custom suffix', () => {
      const text = 'This is a long text';
      expect(truncate(text, 10, '...')).toContain('...');
    });
  });

  describe('toKebabCase', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(toKebabCase('helloWorld')).toBe('hello-world');
      expect(toKebabCase('myVariableName')).toBe('my-variable-name');
    });

    it('should convert spaces to hyphens', () => {
      expect(toKebabCase('hello world')).toBe('hello-world');
    });

    it('should handle already kebab-case strings', () => {
      expect(toKebabCase('hello-world')).toBe('hello-world');
    });
  });

  describe('toCamelCase', () => {
    it('should convert kebab-case to camelCase', () => {
      expect(toCamelCase('hello-world')).toBe('helloWorld');
      expect(toCamelCase('my-variable-name')).toBe('myVariableName');
    });

    it('should convert spaces to camelCase', () => {
      expect(toCamelCase('hello world')).toBe('helloWorld');
    });

    it('should handle already camelCase strings', () => {
      expect(toCamelCase('helloWorld')).toBe('helloWorld');
    });
  });

  describe('toSnakeCase', () => {
    it('should convert camelCase to snake_case', () => {
      expect(toSnakeCase('helloWorld')).toBe('hello_world');
      expect(toSnakeCase('myVariableName')).toBe('my_variable_name');
    });

    it('should convert spaces to underscores', () => {
      expect(toSnakeCase('hello world')).toBe('hello_world');
    });
  });

  describe('pluralize', () => {
    it('should pluralize words correctly', () => {
      expect(pluralize('cat', 2)).toBe('cats');
      expect(pluralize('dog', 3)).toBe('dogs');
    });

    it('should not pluralize for count of 1', () => {
      expect(pluralize('cat', 1)).toBe('cat');
    });

    it('should handle custom plural forms', () => {
      expect(pluralize('child', 2, 'children')).toBe('children');
      expect(pluralize('person', 5, 'people')).toBe('people');
    });
  });

  describe('getInitials', () => {
    it('should get initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Jane Smith')).toBe('JS');
    });

    it('should handle single name', () => {
      expect(getInitials('John')).toBe('J');
    });

    it('should handle empty string', () => {
      expect(getInitials('')).toBe('');
    });

    it('should handle multiple names', () => {
      expect(getInitials('John Michael Doe')).toBe('JD');
    });
  });
});
