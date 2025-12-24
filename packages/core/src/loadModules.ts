import { Module } from './types';

/**
 * Dynamically load modules from a directory
 * This enables auto-discovery of modules without manual imports
 */
export async function loadModules(moduleContext: Record<string, () => Promise<unknown>>): Promise<Module[]> {
  const modules: Module[] = [];

  for (const path in moduleContext) {
    try {
      const moduleExport = await moduleContext[path]();
      
      // Find the module export (could be default or named export ending with 'Module')
      let module: Module | undefined;
      
      if (moduleExport && typeof moduleExport === 'object') {
        const exportObj = moduleExport as Record<string, unknown>;
        
        // Check for default export
        if ('default' in exportObj && isModule(exportObj.default)) {
          module = exportObj.default as Module;
        } else {
          // Check for named exports ending with 'Module'
          for (const key in exportObj) {
            if (key.endsWith('Module') && isModule(exportObj[key])) {
              module = exportObj[key] as Module;
              break;
            }
          }
        }
      }

      if (module) {
        modules.push(module);
      } else {
        console.warn(`No valid module found in ${path}`);
      }
    } catch (error) {
      console.error(`Failed to load module from ${path}:`, error);
    }
  }

  return modules;
}

/**
 * Type guard to check if an object is a valid Module
 */
function isModule(obj: unknown): boolean {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const module = obj as Partial<Module>;
  return (
    typeof module.id === 'string' &&
    typeof module.name === 'string' &&
    typeof module.version === 'string'
  );
}

/**
 * Load modules using Vite's import.meta.glob
 * This is the recommended way for Vite applications
 * 
 * @example
 * ```tsx
 * // In your main.tsx
 * const modules = await loadModulesFromGlob(
 *   import.meta.glob('./modules/*\/index.ts')
 * );
 * ```
 */
export async function loadModulesFromGlob(
  globImport: Record<string, () => Promise<unknown>>
): Promise<Module[]> {
  return loadModules(globImport);
}

/**
 * Load modules eagerly (all at once)
 * Use this if you want all modules loaded immediately
 * 
 * @example
 * ```tsx
 * const modules = loadModulesEager(
 *   import.meta.glob('./modules/*\/index.ts', { eager: true })
 * );
 * ```
 */
export function loadModulesEager(
  eagerImports: Record<string, unknown>
): Module[] {
  const modules: Module[] = [];

  for (const path in eagerImports) {
    try {
      const moduleExport = eagerImports[path];
      
      let module: Module | undefined;
      
      if (moduleExport && typeof moduleExport === 'object') {
        const exportObj = moduleExport as Record<string, unknown>;
        
        if ('default' in exportObj && isModule(exportObj.default)) {
          module = exportObj.default as Module;
        } else {
          for (const key in exportObj) {
            if (key.endsWith('Module') && isModule(exportObj[key])) {
              module = exportObj[key] as Module;
              break;
            }
          }
        }
      }

      if (module) {
        modules.push(module);
      }
    } catch (error) {
      console.error(`Failed to load module from ${path}:`, error);
    }
  }

  return modules;
}
