import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  waitForCondition,
  mockLocalStorage,
  mockSessionStorage,
  createMockResponse,
  suppressConsole,
  delay,
  testData,
} from '@vhvplatform/testing';

describe('Testing Utilities', () => {
  describe('waitForCondition', () => {
    it('should resolve when condition becomes true', async () => {
      let count = 0;
      const condition = () => {
        count++;
        return count >= 3;
      };

      await waitForCondition(condition, 1000, 10);
      expect(count).toBeGreaterThanOrEqual(3);
    });

    it('should timeout if condition never becomes true', async () => {
      const condition = () => false;

      await expect(waitForCondition(condition, 100, 10)).rejects.toThrow(
        'Condition not met within 100ms'
      );
    });

    it('should resolve immediately if condition is already true', async () => {
      const condition = () => true;
      await expect(waitForCondition(condition, 1000, 10)).resolves.toBeUndefined();
    });

    it('should handle async conditions', async () => {
      let count = 0;
      const condition = async () => {
        count++;
        return count >= 2;
      };

      await waitForCondition(condition, 1000, 10);
      expect(count).toBeGreaterThanOrEqual(2);
    });
  });

  describe('mockLocalStorage', () => {
    beforeEach(() => {
      mockLocalStorage();
    });

    it('should allow setting and getting items', () => {
      localStorage.setItem('test', 'value');
      expect(localStorage.getItem('test')).toBe('value');
    });

    it('should return null for non-existent items', () => {
      expect(localStorage.getItem('nonexistent')).toBeNull();
    });

    it('should remove items', () => {
      localStorage.setItem('test', 'value');
      localStorage.removeItem('test');
      expect(localStorage.getItem('test')).toBeNull();
    });

    it('should clear all items', () => {
      localStorage.setItem('test1', 'value1');
      localStorage.setItem('test2', 'value2');
      localStorage.clear();
      expect(localStorage.getItem('test1')).toBeNull();
      expect(localStorage.getItem('test2')).toBeNull();
    });

    it('should return correct length', () => {
      localStorage.setItem('test1', 'value1');
      localStorage.setItem('test2', 'value2');
      expect(localStorage.length).toBe(2);
    });

    it('should return key by index', () => {
      localStorage.setItem('test1', 'value1');
      localStorage.setItem('test2', 'value2');
      expect(localStorage.key(0)).toBe('test1');
      expect(localStorage.key(1)).toBe('test2');
      expect(localStorage.key(2)).toBeNull();
    });
  });

  describe('mockSessionStorage', () => {
    beforeEach(() => {
      mockSessionStorage();
    });

    it('should allow setting and getting items', () => {
      sessionStorage.setItem('test', 'value');
      expect(sessionStorage.getItem('test')).toBe('value');
    });

    it('should remove items', () => {
      sessionStorage.setItem('test', 'value');
      sessionStorage.removeItem('test');
      expect(sessionStorage.getItem('test')).toBeNull();
    });

    it('should clear all items', () => {
      sessionStorage.setItem('test1', 'value1');
      sessionStorage.setItem('test2', 'value2');
      sessionStorage.clear();
      expect(sessionStorage.getItem('test1')).toBeNull();
    });
  });

  describe('createMockResponse', () => {
    it('should create a response with data and default status', async () => {
      const data = { id: 1, name: 'Test' };
      const response = createMockResponse(data);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');

      const json = await response.json();
      expect(json).toEqual(data);
    });

    it('should create a response with custom status', async () => {
      const data = { error: 'Not found' };
      const response = createMockResponse(data, 404);

      expect(response.status).toBe(404);
      const json = await response.json();
      expect(json).toEqual(data);
    });

    it('should handle empty data', async () => {
      const response = createMockResponse({});
      const json = await response.json();
      expect(json).toEqual({});
    });
  });

  describe('suppressConsole', () => {
    it('should suppress console.error', () => {
      const errorSpy = vi.spyOn(console, 'error');
      
      const restore = suppressConsole();
      
      console.error('test error');
      expect(errorSpy).toHaveBeenCalledTimes(0);

      restore();
      console.error('test error');
      expect(errorSpy).toHaveBeenCalledWith('test error');

      errorSpy.mockRestore();
    });

    it('should suppress console.warn', () => {
      const warnSpy = vi.spyOn(console, 'warn');
      
      const restore = suppressConsole();

      console.warn('test warning');
      expect(warnSpy).toHaveBeenCalledTimes(0);

      restore();
      console.warn('test warning');
      expect(warnSpy).toHaveBeenCalledWith('test warning');

      warnSpy.mockRestore();
    });

    it('should restore original console methods', () => {
      const originalError = console.error;
      const originalWarn = console.warn;

      const restore = suppressConsole();
      expect(console.error).not.toBe(originalError);
      expect(console.warn).not.toBe(originalWarn);

      restore();
      expect(console.error).toBe(originalError);
      expect(console.warn).toBe(originalWarn);
    });
  });

  describe('delay', () => {
    it('should delay execution', async () => {
      const start = Date.now();
      await delay(100);
      const elapsed = Date.now() - start;

      expect(elapsed).toBeGreaterThanOrEqual(90); // Allow some margin
      expect(elapsed).toBeLessThan(200);
    });

    it('should resolve with undefined', async () => {
      const result = await delay(10);
      expect(result).toBeUndefined();
    });
  });

  describe('testData', () => {
    it('should generate unique emails', () => {
      const email1 = testData.email();
      const email2 = testData.email();

      expect(email1).toMatch(/@example\.com$/);
      expect(email2).toMatch(/@example\.com$/);
      expect(email1).not.toBe(email2);
    });

    it('should generate unique names', () => {
      const name1 = testData.name();
      const name2 = testData.name();

      expect(name1).toContain('Test User');
      expect(name2).toContain('Test User');
      expect(name1).not.toBe(name2);
    });

    it('should generate unique IDs', () => {
      const id1 = testData.id();
      const id2 = testData.id();

      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
      expect(id1).not.toBe(id2);
    });

    it('should generate numbers within range', () => {
      const num = testData.number(10, 20);
      expect(num).toBeGreaterThanOrEqual(10);
      expect(num).toBeLessThanOrEqual(20);
    });

    it('should generate default range numbers', () => {
      const num = testData.number();
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThanOrEqual(1000);
    });

    it('should generate boolean values', () => {
      const bool = testData.boolean();
      expect(typeof bool).toBe('boolean');
    });

    it('should generate dates', () => {
      const date = testData.date();
      expect(date).toBeInstanceOf(Date);
      expect(date.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should generate random boolean distribution', () => {
      const results = Array.from({ length: 100 }, () => testData.boolean());
      const trueCount = results.filter((r) => r === true).length;
      const falseCount = results.filter((r) => r === false).length;

      // Should have some distribution of true and false
      expect(trueCount).toBeGreaterThan(0);
      expect(falseCount).toBeGreaterThan(0);
    });
  });
});
