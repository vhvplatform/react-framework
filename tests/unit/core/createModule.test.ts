import { describe, it, expect } from 'vitest';
import { createModule } from '@longvhv/core';

describe('Core Package - createModule', () => {
  it('should create a module with required fields', () => {
    const module = createModule({
      id: 'test-module',
      name: 'Test Module',
      routes: [],
    });

    expect(module.id).toBe('test-module');
    expect(module.name).toBe('Test Module');
    expect(module.routes).toEqual([]);
  });

  it('should create module with routes', () => {
    const routes = [
      { path: '/dashboard', component: () => null },
      { path: '/settings', component: () => null },
    ];

    const module = createModule({
      id: 'test-module',
      name: 'Test Module',
      routes,
    });

    expect(module.routes).toEqual(routes);
    expect(module.routes).toHaveLength(2);
  });

  it('should create module with menu items', () => {
    const menu = [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Settings', path: '/settings' },
    ];

    const module = createModule({
      id: 'test-module',
      name: 'Test Module',
      routes: [],
      menu,
    });

    expect(module.menu).toEqual(menu);
  });

  it('should create module with permissions', () => {
    const permissions = ['read', 'write', 'delete'];

    const module = createModule({
      id: 'test-module',
      name: 'Test Module',
      routes: [],
      permissions,
    });

    expect(module.permissions).toEqual(permissions);
  });

  it('should create module with reducer', () => {
    const reducer = (state = {}, _action: { type: string }) => state;

    const module = createModule({
      id: 'test-module',
      name: 'Test Module',
      routes: [],
      reducer,
    });

    expect(module.reducer).toBe(reducer);
  });

  it('should create module with all optional fields', () => {
    const module = createModule({
      id: 'test-module',
      name: 'Test Module',
      description: 'Test module description',
      version: '1.0.0',
      icon: 'dashboard',
      routes: [],
      menu: [],
      permissions: [],
      reducer: (state = {}) => state,
    });

    expect(module.description).toBe('Test module description');
    expect(module.version).toBe('1.0.0');
    expect(module.icon).toBe('dashboard');
  });
});
