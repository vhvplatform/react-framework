import { describe, it, expect } from 'vitest';
import { z } from 'zod';

describe('Forms Package - Zod Validators', () => {
  describe('String validators', () => {
    it('should validate required string', () => {
      const schema = z.object({
        name: z.string().min(1),
      });

      expect(() => schema.parse({ name: '' })).toThrow();
      expect(schema.parse({ name: 'John' })).toEqual({ name: 'John' });
    });

    it('should validate string length', () => {
      const schema = z.object({
        password: z.string().min(8).max(20),
      });

      expect(() => schema.parse({ password: 'short' })).toThrow();
      expect(() => schema.parse({ password: 'toolongpasswordexceedslimit' })).toThrow();
      expect(schema.parse({ password: 'validpass' })).toEqual({ password: 'validpass' });
    });

    it('should validate email format', () => {
      const schema = z.object({
        email: z.string().email(),
      });

      expect(() => schema.parse({ email: 'invalid' })).toThrow();
      expect(schema.parse({ email: 'user@example.com' })).toEqual({ email: 'user@example.com' });
    });

    it('should validate URL format', () => {
      const schema = z.object({
        website: z.string().url(),
      });

      expect(() => schema.parse({ website: 'not-a-url' })).toThrow();
      expect(schema.parse({ website: 'https://example.com' })).toEqual({
        website: 'https://example.com',
      });
    });
  });

  describe('Number validators', () => {
    it('should validate number range', () => {
      const schema = z.object({
        age: z.number().min(18).max(120),
      });

      expect(() => schema.parse({ age: 10 })).toThrow();
      expect(() => schema.parse({ age: 150 })).toThrow();
      expect(schema.parse({ age: 25 })).toEqual({ age: 25 });
    });

    it('should validate positive numbers', () => {
      const schema = z.object({
        price: z.number().positive(),
      });

      expect(() => schema.parse({ price: -10 })).toThrow();
      expect(() => schema.parse({ price: 0 })).toThrow();
      expect(schema.parse({ price: 10 })).toEqual({ price: 10 });
    });

    it('should validate integer', () => {
      const schema = z.object({
        count: z.number().int(),
      });

      expect(() => schema.parse({ count: 10.5 })).toThrow();
      expect(schema.parse({ count: 10 })).toEqual({ count: 10 });
    });
  });

  describe('Array validators', () => {
    it('should validate array length', () => {
      const schema = z.object({
        tags: z.array(z.string()).min(1).max(5),
      });

      expect(() => schema.parse({ tags: [] })).toThrow();
      expect(() => schema.parse({ tags: ['a', 'b', 'c', 'd', 'e', 'f'] })).toThrow();
      expect(schema.parse({ tags: ['tag1', 'tag2'] })).toEqual({ tags: ['tag1', 'tag2'] });
    });

    it('should validate array items', () => {
      const schema = z.object({
        emails: z.array(z.string().email()),
      });

      expect(() => schema.parse({ emails: ['valid@email.com', 'invalid'] })).toThrow();
      expect(schema.parse({ emails: ['user1@email.com', 'user2@email.com'] })).toEqual({
        emails: ['user1@email.com', 'user2@email.com'],
      });
    });
  });

  describe('Object validators', () => {
    it('should validate nested objects', () => {
      const schema = z.object({
        user: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
      });

      expect(() =>
        schema.parse({
          user: { name: 'John', email: 'invalid' },
        })
      ).toThrow();

      expect(
        schema.parse({
          user: { name: 'John', email: 'john@example.com' },
        })
      ).toEqual({
        user: { name: 'John', email: 'john@example.com' },
      });
    });

    it('should validate optional fields', () => {
      const schema = z.object({
        name: z.string(),
        nickname: z.string().optional(),
      });

      expect(schema.parse({ name: 'John' })).toEqual({ name: 'John' });
      expect(schema.parse({ name: 'John', nickname: 'Johnny' })).toEqual({
        name: 'John',
        nickname: 'Johnny',
      });
    });
  });

  describe('Custom validators', () => {
    it('should validate with custom refinement', () => {
      const schema = z
        .object({
          password: z.string(),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: 'Passwords do not match',
          path: ['confirmPassword'],
        });

      expect(() =>
        schema.parse({
          password: 'password123',
          confirmPassword: 'different',
        })
      ).toThrow();

      expect(
        schema.parse({
          password: 'password123',
          confirmPassword: 'password123',
        })
      ).toEqual({
        password: 'password123',
        confirmPassword: 'password123',
      });
    });
  });

  // Additional edge case tests
  describe('Edge Cases and Advanced Validation', () => {
    describe('required', () => {
      it('should handle whitespace-only strings', () => {
        const rule = validators.required();
        expect(rule('   ')).toBeNull(); // whitespace is considered a value
      });

      it('should handle zero as valid value', () => {
        const rule = validators.required();
        expect(rule(0)).toBeNull();
      });

      it('should handle false as valid value', () => {
        const rule = validators.required();
        expect(rule(false)).toBeNull();
      });

      it('should handle empty array as valid value', () => {
        const rule = validators.required();
        expect(rule([])).toBeNull();
      });
    });

    describe('email', () => {
      it('should reject email with multiple @ symbols', () => {
        const rule = validators.email();
        expect(rule('user@@example.com')).toBeTruthy();
      });

      it('should reject email without domain', () => {
        const rule = validators.email();
        expect(rule('user@')).toBeTruthy();
      });

      it('should reject email with spaces', () => {
        const rule = validators.email();
        expect(rule('user @example.com')).toBeTruthy();
        expect(rule('user@ example.com')).toBeTruthy();
      });

      it('should handle email with plus sign', () => {
        const rule = validators.email();
        expect(rule('user+tag@example.com')).toBeNull();
      });

      it('should handle email with dots in local part', () => {
        const rule = validators.email();
        expect(rule('first.last@example.com')).toBeNull();
      });

      it('should handle email with subdomain', () => {
        const rule = validators.email();
        expect(rule('user@mail.example.com')).toBeNull();
      });
    });

    describe('minLength and maxLength', () => {
      it('should handle unicode characters correctly', () => {
        const minRule = validators.minLength(3);
        expect(minRule('😀😁😂')).toBeNull(); // 3 emoji chars
      });

      it('should handle empty string with minLength', () => {
        const rule = validators.minLength(1);
        expect(rule('')).toBeNull(); // returns null for empty (per implementation)
      });

      it('should handle boundary values for maxLength', () => {
        const rule = validators.maxLength(10);
        expect(rule('a'.repeat(10))).toBeNull();
        expect(rule('a'.repeat(11))).toBeTruthy();
      });
    });

    describe('pattern', () => {
      it('should handle complex regex patterns', () => {
        const rule = validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/);
        expect(rule('Weak123')).toBeNull(); // meets criteria: uppercase, lowercase, number, 8+ chars
        expect(rule('weak123')).toBeTruthy(); // no uppercase
        expect(rule('WEAK123')).toBeTruthy(); // no lowercase
        expect(rule('WeakAbc')).toBeTruthy(); // no number
      });

      it('should handle special character patterns', () => {
        const rule = validators.pattern(/^[!@#$%^&*]+$/);
        expect(rule('!@#$')).toBeNull();
        expect(rule('abc')).toBeTruthy();
      });

      it('should handle phone number patterns', () => {
        const rule = validators.pattern(/^\d{3}-\d{3}-\d{4}$/);
        expect(rule('123-456-7890')).toBeNull();
        expect(rule('1234567890')).toBeTruthy();
      });
    });

    describe('min and max', () => {
      it('should handle negative numbers', () => {
        const minRule = validators.min(-10);
        expect(minRule(-5)).toBeNull();
        expect(minRule(-15)).toBeTruthy();

        const maxRule = validators.max(-5);
        expect(maxRule(-10)).toBeNull();
        expect(maxRule(-3)).toBeTruthy();
      });

      it('should handle decimal numbers', () => {
        const minRule = validators.min(1.5);
        expect(minRule(1.6)).toBeNull();
        expect(minRule(1.4)).toBeTruthy();
      });

      it('should handle zero boundary', () => {
        const minRule = validators.min(0);
        expect(minRule(0)).toBeNull();
        expect(minRule(-1)).toBeTruthy();

        const maxRule = validators.max(0);
        expect(maxRule(0)).toBeNull();
        expect(maxRule(1)).toBeTruthy();
      });

      it('should handle very large numbers', () => {
        const minRule = validators.min(Number.MAX_SAFE_INTEGER - 1);
        expect(minRule(Number.MAX_SAFE_INTEGER)).toBeNull();
      });
    });

    describe('Combined validations', () => {
      it('should work with multiple validators on same field', () => {
        const requiredRule = validators.required();
        const minLengthRule = validators.minLength(3);
        const maxLengthRule = validators.maxLength(10);

        const value = 'valid';
        expect(requiredRule(value)).toBeNull();
        expect(minLengthRule(value)).toBeNull();
        expect(maxLengthRule(value)).toBeNull();
      });

      it('should validate email with length constraints', () => {
        const emailRule = validators.email();
        const maxLengthRule = validators.maxLength(50);

        const validEmail = 'user@example.com';
        expect(emailRule(validEmail)).toBeNull();
        expect(maxLengthRule(validEmail)).toBeNull();

        const tooLongEmail = 'a'.repeat(50) + '@example.com';
        expect(maxLengthRule(tooLongEmail)).toBeTruthy();
      });
    });

    describe('Custom error messages', () => {
      it('should use custom message for required', () => {
        const rule = validators.required('Please fill this field');
        expect(rule('')).toBe('Please fill this field');
      });

      it('should use custom message for email', () => {
        const rule = validators.email('Please enter a valid email');
        expect(rule('invalid')).toBe('Please enter a valid email');
      });

      it('should use custom message for minLength', () => {
        const rule = validators.minLength(5, 'Too short!');
        expect(rule('abc')).toBe('Too short!');
      });

      it('should use custom message for pattern', () => {
        const rule = validators.pattern(/^\d+$/, 'Only numbers allowed');
        expect(rule('abc')).toBe('Only numbers allowed');
      });
    });
  });
});
