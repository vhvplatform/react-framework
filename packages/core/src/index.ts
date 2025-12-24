// Main exports
export { Application, ModuleContext } from './Application';
export { ModuleRegistry, moduleRegistry } from './ModuleRegistry';
export { createStore } from './store';
export { createModule } from './createModule';
export { loadModules, loadModulesFromGlob, loadModulesEager } from './loadModules';

// Development utilities
export {
  createModuleDevWrapper,
  setupModuleDev,
  watchModuleChanges,
  logModuleInfo,
  validateModule,
} from './moduleDev';

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

export type { ModuleDevConfig } from './moduleDev';

// Redux types
export type { AppDispatch } from './store';
