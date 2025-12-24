import { describe, it, expect, beforeEach } from 'vitest';
import { ModuleRegistry } from '@longvhv/core';

describe('Core Package - ModuleRegistry', () => {
  let registry: ModuleRegistry;

  beforeEach(() => {
    registry = new ModuleRegistry();
  });

  describe('register', () => {
    it('should register a module', () => {
      const module = {
        id: 'test-module',
        name: 'Test Module',
        routes: [],
      };

      registry.register(module);
      expect(registry.get('test-module')).toEqual(module);
    });

    it('should throw error when registering duplicate module', () => {
      const module = {
        id: 'test-module',
        name: 'Test Module',
        routes: [],
      };

      registry.register(module);
      expect(() => registry.register(module)).toThrow();
    });

    it('should register multiple modules', () => {
      const module1 = { id: 'module-1', name: 'Module 1', routes: [] };
      const module2 = { id: 'module-2', name: 'Module 2', routes: [] };

      registry.register(module1);
      registry.register(module2);

      expect(registry.get('module-1')).toEqual(module1);
      expect(registry.get('module-2')).toEqual(module2);
    });
  });

  describe('get', () => {
    it('should get registered module', () => {
      const module = {
        id: 'test-module',
        name: 'Test Module',
        routes: [],
      };

      registry.register(module);
      expect(registry.get('test-module')).toEqual(module);
    });

    it('should return undefined for non-existent module', () => {
      expect(registry.get('non-existent')).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('should return all registered modules', () => {
      const module1 = { id: 'module-1', name: 'Module 1', routes: [] };
      const module2 = { id: 'module-2', name: 'Module 2', routes: [] };

      registry.register(module1);
      registry.register(module2);

      const modules = registry.getAll();
      expect(modules).toHaveLength(2);
      expect(modules).toContainEqual(module1);
      expect(modules).toContainEqual(module2);
    });

    it('should return empty array when no modules registered', () => {
      expect(registry.getAll()).toEqual([]);
    });
  });

  describe('unregister', () => {
    it('should unregister a module', () => {
      const module = {
        id: 'test-module',
        name: 'Test Module',
        routes: [],
      };

      registry.register(module);
      registry.unregister('test-module');

      expect(registry.get('test-module')).toBeUndefined();
    });

    it('should not throw when unregistering non-existent module', () => {
      expect(() => registry.unregister('non-existent')).not.toThrow();
    });
  });

  describe('has', () => {
    it('should return true for registered module', () => {
      const module = {
        id: 'test-module',
        name: 'Test Module',
        routes: [],
      };

      registry.register(module);
      expect(registry.has('test-module')).toBe(true);
    });

    it('should return false for non-existent module', () => {
      expect(registry.has('non-existent')).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all modules', () => {
      const module1 = { id: 'module-1', name: 'Module 1', routes: [] };
      const module2 = { id: 'module-2', name: 'Module 2', routes: [] };

      registry.register(module1);
      registry.register(module2);
      registry.clear();

      expect(registry.getAll()).toEqual([]);
    });
  });
});
