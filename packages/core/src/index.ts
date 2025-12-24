// Main exports
export { Application, ModuleContext } from './Application';
export { ModuleRegistry, moduleRegistry } from './ModuleRegistry';
export { createStore } from './store';
export { createModule } from './createModule';

// Hooks
export { useModule, useModuleById, useHasModule } from './hooks/useModule';

// Types
export type {
  Module,
  IModuleRegistry,
  ApplicationConfig,
  ApplicationProps,
  CreateModuleOptions,
  RootState,
  ModuleContextValue,
} from './types';

// Redux types
export type { AppDispatch } from './store';
