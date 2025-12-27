import { describe, it, expect, vi } from 'vitest';
import {
  clamp,
  randomInt,
  roundToDecimal,
  toFixed,
  inRange,
  toPercentage,
  lerp,
  isEven,
  isOdd,
  sum,
  average,
} from '@vhvplatform/shared/utils';

describe('Number Utils', () => {
  describe('clamp', () => {
    it('should clamp value within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('should handle negative ranges', () => {
      expect(clamp(-5, -10, -1)).toBe(-5);
      expect(clamp(-15, -10, -1)).toBe(-10);
      expect(clamp(0, -10, -1)).toBe(-1);
    });

    it('should handle equal min and max', () => {
      expect(clamp(5, 10, 10)).toBe(10);
      expect(clamp(15, 10, 10)).toBe(10);
    });

    it('should handle decimal numbers', () => {
      expect(clamp(5.5, 0, 10)).toBe(5.5);
      expect(clamp(-0.5, 0, 10)).toBe(0);
      expect(clamp(10.5, 0, 10)).toBe(10);
    });
  });

  describe('randomInt', () => {
    it('should generate random integer within range', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(1, 10);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it('should handle single value range', () => {
      expect(randomInt(5, 5)).toBe(5);
    });

    it('should handle negative ranges', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(-10, -1);
        expect(result).toBeGreaterThanOrEqual(-10);
        expect(result).toBeLessThanOrEqual(-1);
      }
    });

    it('should use random distribution', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      expect(randomInt(1, 10)).toBe(1);
      vi.restoreAllMocks();

      vi.spyOn(Math, 'random').mockReturnValue(0.99);
      expect(randomInt(1, 10)).toBe(10);
      vi.restoreAllMocks();
    });
  });

  describe('roundToDecimal', () => {
    it('should round to specified decimal places', () => {
      expect(roundToDecimal(3.14159, 2)).toBe(3.14);
      expect(roundToDecimal(3.14159, 0)).toBe(3);
      expect(roundToDecimal(3.14159, 4)).toBe(3.1416);
    });

    it('should handle negative numbers', () => {
      expect(roundToDecimal(-3.14159, 2)).toBe(-3.14);
    });

    it('should handle zero decimals', () => {
      expect(roundToDecimal(3.7, 0)).toBe(4);
      expect(roundToDecimal(3.2, 0)).toBe(3);
    });

    it('should handle large decimal places', () => {
      expect(roundToDecimal(1.123456789, 6)).toBe(1.123457);
    });
  });

  describe('toFixed', () => {
    it('should format number to fixed decimal places', () => {
      expect(toFixed(3.14159, 2)).toBe('3.14');
      expect(toFixed(10, 2)).toBe('10.00');
    });

    it('should handle negative numbers', () => {
      expect(toFixed(-3.14, 1)).toBe('-3.1');
    });

    it('should handle zero decimals', () => {
      expect(toFixed(3.7, 0)).toBe('4');
    });
  });

  describe('inRange', () => {
    it('should check if number is in range (inclusive)', () => {
      expect(inRange(5, 0, 10)).toBe(true);
      expect(inRange(0, 0, 10)).toBe(true);
      expect(inRange(10, 0, 10)).toBe(true);
      expect(inRange(-1, 0, 10)).toBe(false);
      expect(inRange(11, 0, 10)).toBe(false);
    });

    it('should handle negative ranges', () => {
      expect(inRange(-5, -10, 0)).toBe(true);
      expect(inRange(-11, -10, 0)).toBe(false);
    });

    it('should handle decimal numbers', () => {
      expect(inRange(5.5, 5, 6)).toBe(true);
      expect(inRange(4.9, 5, 6)).toBe(false);
    });
  });

  describe('toPercentage', () => {
    it('should calculate percentage', () => {
      expect(toPercentage(50, 100)).toBe(50);
      expect(toPercentage(25, 100)).toBe(25);
      expect(toPercentage(100, 100)).toBe(100);
    });

    it('should handle decimal places', () => {
      expect(toPercentage(1, 3, 2)).toBe(33.33);
      expect(toPercentage(2, 3, 1)).toBe(66.7);
    });

    it('should return 0 when total is 0', () => {
      expect(toPercentage(50, 0)).toBe(0);
    });

    it('should handle values greater than total', () => {
      expect(toPercentage(150, 100)).toBe(150);
    });

    it('should handle negative values', () => {
      expect(toPercentage(-25, 100)).toBe(-25);
    });
  });

  describe('lerp', () => {
    it('should interpolate between two values', () => {
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(0, 10, 0.5)).toBe(5);
      expect(lerp(0, 10, 1)).toBe(10);
    });

    it('should clamp t value', () => {
      expect(lerp(0, 10, -0.5)).toBe(0);
      expect(lerp(0, 10, 1.5)).toBe(10);
    });

    it('should handle negative ranges', () => {
      expect(lerp(-10, 10, 0.5)).toBe(0);
    });

    it('should handle decimal values', () => {
      expect(lerp(0, 1, 0.25)).toBe(0.25);
    });
  });

  describe('isEven', () => {
    it('should check if number is even', () => {
      expect(isEven(2)).toBe(true);
      expect(isEven(4)).toBe(true);
      expect(isEven(0)).toBe(true);
      expect(isEven(-2)).toBe(true);
    });

    it('should return false for odd numbers', () => {
      expect(isEven(1)).toBe(false);
      expect(isEven(3)).toBe(false);
      expect(isEven(-1)).toBe(false);
    });
  });

  describe('isOdd', () => {
    it('should check if number is odd', () => {
      expect(isOdd(1)).toBe(true);
      expect(isOdd(3)).toBe(true);
      expect(isOdd(-1)).toBe(true);
    });

    it('should return false for even numbers', () => {
      expect(isOdd(2)).toBe(false);
      expect(isOdd(4)).toBe(false);
      expect(isOdd(0)).toBe(false);
      expect(isOdd(-2)).toBe(false);
    });
  });

  describe('sum', () => {
    it('should sum array of numbers', () => {
      expect(sum([1, 2, 3, 4, 5])).toBe(15);
    });

    it('should handle empty array', () => {
      expect(sum([])).toBe(0);
    });

    it('should handle negative numbers', () => {
      expect(sum([-1, -2, -3])).toBe(-6);
    });

    it('should handle mixed positive and negative', () => {
      expect(sum([10, -5, 3, -2])).toBe(6);
    });

    it('should handle decimal numbers', () => {
      expect(sum([1.5, 2.5, 3.5])).toBe(7.5);
    });

    it('should handle single element', () => {
      expect(sum([42])).toBe(42);
    });
  });

  describe('average', () => {
    it('should calculate average of numbers', () => {
      expect(average([1, 2, 3, 4, 5])).toBe(3);
    });

    it('should return 0 for empty array', () => {
      expect(average([])).toBe(0);
    });

    it('should handle negative numbers', () => {
      expect(average([-2, -4, -6])).toBe(-4);
    });

    it('should handle decimal results', () => {
      expect(average([1, 2, 3])).toBe(2);
      expect(average([1, 2, 4])).toBeCloseTo(2.33, 2);
    });

    it('should handle single element', () => {
      expect(average([42])).toBe(42);
    });

    it('should handle mixed values', () => {
      expect(average([10, -10, 5, -5])).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large numbers', () => {
      expect(clamp(Number.MAX_SAFE_INTEGER, 0, Number.MAX_SAFE_INTEGER)).toBe(
        Number.MAX_SAFE_INTEGER
      );
    });

    it('should handle very small numbers', () => {
      expect(roundToDecimal(0.0000001, 8)).toBe(0.0000001);
    });

    it('should handle Infinity', () => {
      expect(clamp(Infinity, 0, 100)).toBe(100);
      expect(clamp(-Infinity, 0, 100)).toBe(0);
    });

    it('should handle zero in calculations', () => {
      expect(sum([0, 0, 0])).toBe(0);
      expect(average([0, 0, 0])).toBe(0);
    });

    it('toPercentage should handle precision', () => {
      expect(toPercentage(1, 3, 10)).toBe(33.3333333333);
    });
  });
});
