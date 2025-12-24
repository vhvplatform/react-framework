import { Module, IModuleRegistry } from './types';
import { Reducer } from '@reduxjs/toolkit';
import { RouteObject } from 'react-router-dom';

/**
 * Module Registry implementation
 * Manages module registration, initialization, and dependency resolution
 */
export class ModuleRegistry implements IModuleRegistry {
  private modules: Map<string, Module> = new Map();
  private initialized: Set<string> = new Set();

  /**
   * Register a new module
   * @param module - Module to register
   * @throws Error if module with same ID already exists
   */
  register(module: Module): void {
    if (this.modules.has(module.id)) {
      throw new Error(`Module with id "${module.id}" is already registered`);
    }

    // Validate dependencies
    if (module.dependencies) {
      for (const depId of module.dependencies) {
        if (!this.modules.has(depId)) {
          console.warn(
            `Module "${module.id}" depends on "${depId}" which is not yet registered`
          );
        }
      }
    }

    this.modules.set(module.id, module);
    console.log(`Module "${module.id}" (${module.name}) registered successfully`);
  }

  /**
   * Get a registered module by ID
   * @param id - Module ID
   * @returns Module or undefined if not found
   */
  getModule(id: string): Module | undefined {
    return this.modules.get(id);
  }

  /**
   * Get all registered modules
   * @returns Array of all modules
   */
  getAllModules(): Module[] {
    return Array.from(this.modules.values());
  }

  /**
   * Initialize all registered modules in dependency order
   * @throws Error if circular dependencies detected or dependency missing
   */
  async initializeAll(): Promise<void> {
    const initOrder = this.resolveInitializationOrder();

    for (const moduleId of initOrder) {
      await this.initializeModule(moduleId);
    }

    console.log('All modules initialized successfully');
  }

  /**
   * Initialize a specific module
   * @param moduleId - ID of the module to initialize
   */
  private async initializeModule(moduleId: string): Promise<void> {
    if (this.initialized.has(moduleId)) {
      return;
    }

    const module = this.modules.get(moduleId);
    if (!module) {
      throw new Error(`Module "${moduleId}" not found`);
    }

    // Initialize dependencies first
    if (module.dependencies) {
      for (const depId of module.dependencies) {
        await this.initializeModule(depId);
      }
    }

    // Initialize the module
    if (module.initialize) {
      console.log(`Initializing module "${module.id}"...`);
      await module.initialize();
    }

    this.initialized.add(moduleId);
  }

  /**
   * Resolve initialization order using topological sort
   * @returns Array of module IDs in initialization order
   * @throws Error if circular dependency detected
   */
  private resolveInitializationOrder(): string[] {
    const order: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (moduleId: string) => {
      if (visited.has(moduleId)) {
        return;
      }

      if (visiting.has(moduleId)) {
        throw new Error(`Circular dependency detected involving module "${moduleId}"`);
      }

      visiting.add(moduleId);

      const module = this.modules.get(moduleId);
      if (module?.dependencies) {
        for (const depId of module.dependencies) {
          if (!this.modules.has(depId)) {
            throw new Error(
              `Module "${moduleId}" depends on "${depId}" which is not registered`
            );
          }
          visit(depId);
        }
      }

      visiting.delete(moduleId);
      visited.add(moduleId);
      order.push(moduleId);
    };

    for (const moduleId of this.modules.keys()) {
      visit(moduleId);
    }

    return order;
  }

  /**
   * Get all reducers from registered modules
   * @returns Object with module IDs as keys and reducers as values
   */
  getReducers(): Record<string, Reducer> {
    const reducers: Record<string, Reducer> = {};

    for (const [id, module] of this.modules) {
      if (module.reducer) {
        reducers[id] = module.reducer;
      }
    }

    return reducers;
  }

  /**
   * Get all routes from registered modules
   * @returns Array of route objects
   */
  getRoutes(): RouteObject[] {
    const routes: RouteObject[] = [];

    for (const module of this.modules.values()) {
      if (module.routes) {
        routes.push(...module.routes);
      }
    }

    return routes;
  }

  /**
   * Check if a module is registered
   * @param id - Module ID
   * @returns true if module is registered
   */
  hasModule(id: string): boolean {
    return this.modules.has(id);
  }

  /**
   * Unregister a module
   * @param id - Module ID
   */
  unregister(id: string): void {
    this.modules.delete(id);
    this.initialized.delete(id);
    console.log(`Module "${id}" unregistered`);
  }

  /**
   * Clear all modules
   */
  clear(): void {
    this.modules.clear();
    this.initialized.clear();
    console.log('All modules cleared');
  }
}

// Export singleton instance
export const moduleRegistry = new ModuleRegistry();
