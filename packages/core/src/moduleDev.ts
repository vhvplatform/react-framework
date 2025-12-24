import { Module } from './types';

/**
 * Development utilities for easier module development
 */

// Extend ImportMeta to include hot
declare global {
  interface ImportMeta {
    hot?: {
      accept: (deps?: string | string[] | ((deps: unknown) => void), callback?: (deps: unknown) => void) => void;
    };
  }
}

/**
 * Create a module development wrapper that provides hot reload support
 * This allows modules to be reloaded without restarting the application
 */
export function createModuleDevWrapper(
  moduleFactory: () => Module,
  options?: {
    hot?: boolean;
    onReload?: () => void;
  }
): Module {
  const module = moduleFactory();

  // Enable hot module replacement if available
  if (options?.hot && typeof import.meta.hot !== 'undefined') {
    import.meta.hot.accept(() => {
      console.log(`Hot reloading module: ${module.id}`);
      if (options.onReload) {
        options.onReload();
      }
    });
  }

  return module;
}

/**
 * Module development mode helper
 * Provides isolated environment for testing a single module
 */
export interface ModuleDevConfig {
  /**
   * Module to test
   */
  module: Module;

  /**
   * Mock dependencies (other modules this module depends on)
   */
  mockDependencies?: Record<string, Partial<Module>>;

  /**
   * Enable debug logging
   */
  debug?: boolean;
}

/**
 * Setup module for isolated development/testing
 */
export function setupModuleDev(config: ModuleDevConfig): {
  module: Module;
  cleanup: () => void;
} {
  const { module, mockDependencies = {}, debug = false } = config;

  if (debug) {
    console.log(`[ModuleDev] Setting up module: ${module.id}`);
    console.log(`[ModuleDev] Dependencies:`, module.dependencies);
  }

  // Create mock modules for dependencies
  const mocks: Module[] = [];
  if (module.dependencies) {
    for (const depId of module.dependencies) {
      const mockModule: Module = {
        id: depId,
        name: `Mock ${depId}`,
        version: '1.0.0',
        ...mockDependencies[depId],
      };
      mocks.push(mockModule);
      
      if (debug) {
        console.log(`[ModuleDev] Created mock for dependency: ${depId}`);
      }
    }
  }

  // Cleanup function
  const cleanup = () => {
    if (debug) {
      console.log(`[ModuleDev] Cleaning up module: ${module.id}`);
    }
  };

  return {
    module,
    cleanup,
  };
}

/**
 * Watch for module changes and reload
 * Useful for development with multiple modules
 */
export function watchModuleChanges(
  modulePath: string,
  onReload: (module: Module) => void
): () => void {
  if (typeof import.meta.hot === 'undefined') {
    console.warn('Hot module replacement not available');
    return () => {};
  }

  import.meta.hot.accept(modulePath, (newModule: unknown) => {
    if (newModule) {
      console.log(`Module reloaded: ${modulePath}`);
      
      const moduleObj = newModule as Record<string, unknown>;
      
      // Find the module export
      let module: Module | undefined;
      if ('default' in moduleObj) {
        module = moduleObj.default as Module;
      } else {
        for (const key in moduleObj) {
          if (key.endsWith('Module')) {
            module = moduleObj[key] as Module;
            break;
          }
        }
      }

      if (module) {
        onReload(module);
      }
    }
  });

  return () => {
    // Cleanup
  };
}

/**
 * Log module information for debugging
 */
export function logModuleInfo(module: Module): void {
  console.group(`📦 Module: ${module.name} (${module.id})`);
  console.log('Version:', module.version);
  console.log('Dependencies:', module.dependencies || 'None');
  console.log('Has Routes:', !!module.routes);
  console.log('Has Reducer:', !!module.reducer);
  console.log('Has Initialize:', !!module.initialize);
  console.log('Config:', module.config || 'None');
  console.groupEnd();
}

/**
 * Validate module structure
 */
export function validateModule(module: Module): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!module.id || typeof module.id !== 'string') {
    errors.push('Module must have a valid id (string)');
  }

  if (!module.name || typeof module.name !== 'string') {
    errors.push('Module must have a valid name (string)');
  }

  if (!module.version || typeof module.version !== 'string') {
    errors.push('Module must have a valid version (string)');
  }

  if (module.id && !/^[a-z0-9-]+$/.test(module.id)) {
    errors.push('Module id must be lowercase alphanumeric with hyphens');
  }

  if (module.dependencies && !Array.isArray(module.dependencies)) {
    errors.push('Module dependencies must be an array');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
