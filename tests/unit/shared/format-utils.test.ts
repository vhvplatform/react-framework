import { describe, it, expect } from 'vitest';
import { formatCurrency, formatNumber, formatPercent, formatFileSize } from '@longvhv/shared';

describe('Shared Utilities - Format Functions', () => {
  describe('formatCurrency', () => {
    it('should format currency with default USD', () => {
      expect(formatCurrency(1234.56)).toContain('1,234.56');
    });

    it('should format currency with custom currency', () => {
      const result = formatCurrency(1000, 'EUR');
      expect(result).toBeDefined();
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toContain('0');
    });

    it('should handle negative numbers', () => {
      const result = formatCurrency(-100);
      expect(result).toBeDefined();
    });
  });

  describe('formatNumber', () => {
    it('should format number with commas', () => {
      expect(formatNumber(1234567)).toContain('1,234,567');
    });

    it('should handle decimals', () => {
      expect(formatNumber(1234.567, 2)).toContain('1,234.57');
    });

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0');
    });
  });

  describe('formatPercent', () => {
    it('should format as percentage', () => {
      expect(formatPercent(0.5)).toContain('50');
    });

    it('should handle decimal precision', () => {
      expect(formatPercent(0.12345, 2)).toContain('12.35');
    });

    it('should handle zero', () => {
      expect(formatPercent(0)).toContain('0');
    });

    it('should handle 100%', () => {
      expect(formatPercent(1)).toContain('100');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(formatFileSize(500)).toBe('500 B');
    });

    it('should format KB', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
    });

    it('should format MB', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
    });

    it('should format GB', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('should handle decimal places', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });

    it('should handle zero', () => {
      expect(formatFileSize(0)).toBe('0 B');
    });
  });
});
