import { Module, CreateModuleOptions } from './types';

/**
 * Helper function to create a module with type safety
 * @param options - Module options
 * @returns Module object
 */
export function createModule(options: CreateModuleOptions): Module {
  const {
    id,
    name,
    version = '1.0.0',
    dependencies = [],
    reducer,
    routes = [],
    initialize,
    config = {},
  } = options;

  return {
    id,
    name,
    version,
    dependencies,
    reducer,
    routes,
    initialize,
    config,
  };
}
