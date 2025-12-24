import { describe, it, expect } from 'vitest';
import {
  isValidVietnamesePhone,
  isValidVietnameseIDCard,
  isValidVietnameseTaxCode,
  isValidVietnamesePostalCode,
  isValidVietnameseName,
} from '@longvhv/vietnamese';

describe('Vietnamese Validation', () => {
  describe('isValidVietnamesePhone', () => {
    it('should validate correct Vietnamese phone numbers', () => {
      // Mobile operators
      expect(isValidVietnamesePhone('0987654321')).toBe(true); // Viettel
      expect(isValidVietnamesePhone('0912345678')).toBe(true); // Vinaphone
      expect(isValidVietnamesePhone('0909123456')).toBe(true); // Mobifone
    });

    it('should reject invalid Vietnamese phone numbers', () => {
      expect(isValidVietnamesePhone('0123456789')).toBe(false); // Invalid prefix
      expect(isValidVietnamesePhone('123456')).toBe(false); // Too short
      expect(isValidVietnamesePhone('01234567890')).toBe(false); // Too long
      expect(isValidVietnamesePhone('abc1234567')).toBe(false); // Non-numeric
    });

    it('should handle formatted phone numbers', () => {
      expect(isValidVietnamesePhone('098-765-4321')).toBe(true);
      expect(isValidVietnamesePhone('098 765 4321')).toBe(true);
    });

    it('should handle international format', () => {
      expect(isValidVietnamesePhone('+84987654321')).toBe(true);
      expect(isValidVietnamesePhone('84987654321')).toBe(true);
    });
  });

  describe('isValidVietnameseIDCard', () => {
    it('should validate correct ID cards', () => {
      // Old CMND (9 digits)
      expect(isValidVietnameseIDCard('123456789')).toBe(true);
      
      // New CCCD (12 digits)
      expect(isValidVietnameseIDCard('001234567890')).toBe(true);
    });

    it('should reject invalid ID cards', () => {
      expect(isValidVietnameseIDCard('123')).toBe(false); // Too short
      expect(isValidVietnameseIDCard('1234567890123')).toBe(false); // Too long
      expect(isValidVietnameseIDCard('abc123456')).toBe(false); // Non-numeric
    });

    it('should handle empty or null values', () => {
      expect(isValidVietnameseIDCard('')).toBe(false);
    });
  });

  describe('isValidVietnameseTaxCode', () => {
    it('should validate correct tax codes', () => {
      // Individual (10 digits)
      expect(isValidVietnameseTaxCode('0123456789')).toBe(true);
      
      // Company (10 or 13 digits)
      expect(isValidVietnameseTaxCode('0123456789')).toBe(true);
      expect(isValidVietnameseTaxCode('0123456789001')).toBe(true);
    });

    it('should reject invalid tax codes', () => {
      expect(isValidVietnameseTaxCode('123')).toBe(false); // Too short
      expect(isValidVietnameseTaxCode('12345678901234')).toBe(false); // Too long
      expect(isValidVietnameseTaxCode('abc1234567')).toBe(false); // Non-numeric
    });

    it('should handle formatted tax codes', () => {
      expect(isValidVietnameseTaxCode('0123456789-001')).toBe(true);
    });
  });

  describe('isValidVietnamesePostalCode', () => {
    it('should validate correct postal codes', () => {
      expect(isValidVietnamesePostalCode('100000')).toBe(true); // Hanoi
      expect(isValidVietnamesePostalCode('700000')).toBe(true); // HCMC
      expect(isValidVietnamesePostalCode('550000')).toBe(true); // Da Nang
    });

    it('should reject invalid postal codes', () => {
      expect(isValidVietnamesePostalCode('123')).toBe(false); // Too short
      expect(isValidVietnamesePostalCode('1234567')).toBe(false); // Too long
      expect(isValidVietnamesePostalCode('abc123')).toBe(false); // Non-numeric
    });

    it('should handle empty values', () => {
      expect(isValidVietnamesePostalCode('')).toBe(false);
    });
  });

  describe('isValidVietnameseName', () => {
    it('should validate correct Vietnamese names', () => {
      expect(isValidVietnameseName('Nguyễn Văn A')).toBe(true);
      expect(isValidVietnameseName('Trần Thị B')).toBe(true);
      expect(isValidVietnameseName('Lê Hoàng C')).toBe(true);
    });

    it('should reject invalid names', () => {
      expect(isValidVietnameseName('123')).toBe(false); // Numbers only
      expect(isValidVietnameseName('A')).toBe(false); // Too short
      expect(isValidVietnameseName('Name123')).toBe(false); // Contains numbers
    });

    it('should handle names with special characters', () => {
      expect(isValidVietnameseName('Nguyễn Văn A-B')).toBe(true);
      expect(isValidVietnameseName("O'Brien")).toBe(true);
    });

    it('should require minimum length', () => {
      expect(isValidVietnameseName('AB')).toBe(false);
      expect(isValidVietnameseName('ABC')).toBe(true);
    });
  });
});
