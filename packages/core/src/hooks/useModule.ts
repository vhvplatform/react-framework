import { useContext } from 'react';
import { Module } from '../types';
import { ModuleContext } from '../Application';

/**
 * Hook to access module registry
 * @returns Module context value
 */
export function useModule() {
  const context = useContext(ModuleContext);

  if (!context) {
    throw new Error('useModule must be used within an Application component');
  }

  return context;
}

/**
 * Hook to get a specific module by ID
 * @param id - Module ID
 * @returns Module or undefined
 */
export function useModuleById(id: string): Module | undefined {
  const { getModule } = useModule();
  return getModule(id);
}

/**
 * Hook to check if a module is registered
 * @param id - Module ID
 * @returns true if module is registered
 */
export function useHasModule(id: string): boolean {
  const { hasModule } = useModule();
  return hasModule(id);
}
