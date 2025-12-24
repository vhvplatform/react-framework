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
});
