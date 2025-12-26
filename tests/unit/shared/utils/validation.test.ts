import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidPassword,
  isValidUrl,
  isValidPhone,
  getPasswordStrength,
  isRequired,
  minLength,
  maxLength,
} from '@vhvplatform/shared/utils';

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@example.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
    });

    it('should handle empty strings', () => {
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should validate strong passwords', () => {
      expect(isValidPassword('Password123!')).toBe(true);
      expect(isValidPassword('MyP@ssw0rd')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(isValidPassword('password')).toBe(false); // No uppercase, number, special
      expect(isValidPassword('12345678')).toBe(false); // No letters
      expect(isValidPassword('Pass1!')).toBe(false); // Too short
    });

    it('should require minimum length', () => {
      expect(isValidPassword('Short1!')).toBe(false);
      expect(isValidPassword('LongPass1!')).toBe(true);
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://sub.example.com/path')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false); // Missing protocol
      expect(isValidUrl('http://')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate phone numbers', () => {
      expect(isValidPhone('+1234567890')).toBe(true);
      expect(isValidPhone('123-456-7890')).toBe(true);
      expect(isValidPhone('(123) 456-7890')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('abcdefghij')).toBe(false);
    });
  });

  describe('getPasswordStrength', () => {
    it('should return weak for simple passwords', () => {
      expect(getPasswordStrength('password')).toBe('weak');
      expect(getPasswordStrength('12345678')).toBe('weak');
    });

    it('should return medium for moderate passwords', () => {
      expect(getPasswordStrength('Password1')).toBe('medium');
    });

    it('should return strong for complex passwords', () => {
      expect(getPasswordStrength('MyP@ssw0rd123')).toBe('strong');
    });
  });

  describe('isRequired', () => {
    it('should validate required fields', () => {
      expect(isRequired('value')).toBe(true);
      expect(isRequired('')).toBe(false);
      expect(isRequired(null)).toBe(false);
      expect(isRequired(undefined)).toBe(false);
    });
  });

  describe('minLength', () => {
    it('should validate minimum length', () => {
      expect(minLength('hello', 5)).toBe(true);
      expect(minLength('hi', 5)).toBe(false);
    });
  });

  describe('maxLength', () => {
    it('should validate maximum length', () => {
      expect(maxLength('hello', 10)).toBe(true);
      expect(maxLength('very long text', 5)).toBe(false);
    });
  });
});
