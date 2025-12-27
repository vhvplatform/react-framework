import { createContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { moduleRegistry } from './ModuleRegistry';
import { createStore } from './store';
import { ApplicationProps, ModuleContextValue } from './types';

/**
 * Module context for accessing module registry
 */
export const ModuleContext = createContext<ModuleContextValue | null>(null);

/**
 * Application component
 * Main entry point for the SaaS framework
 */
export function Application({ config, modules = [], children }: ApplicationProps) {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Create store instance - memoized to prevent recreation on every render
  const store = useMemo(() => {
    return createStore(
      moduleRegistry,
      config.initialState,
      config.enableDevTools ?? true,
      config.middleware
    );
  }, [config.initialState, config.enableDevTools, config.middleware]);

  // Memoized module context callbacks to prevent re-creation
  const getModule = useCallback((id: string) => moduleRegistry.getModule(id), []);
  const getAllModules = useCallback(() => moduleRegistry.getAllModules(), []);
  const hasModule = useCallback((id: string) => moduleRegistry.hasModule(id), []);

  // Module context value - now with memoized callbacks
  const moduleContextValue = useMemo<ModuleContextValue>(
    () => ({
      getModule,
      getAllModules,
      hasModule,
    }),
    [getModule, getAllModules, hasModule]
  );

  // Initialize application
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log(`Initializing application: ${config.name}`);

        // Register all modules
        for (const module of modules) {
          moduleRegistry.register(module);
        }

        // Initialize all modules
        await moduleRegistry.initializeAll();

        setInitialized(true);
        console.log('Application initialized successfully');
      } catch (err) {
        console.error('Application initialization failed:', err);
        setError(err as Error);
      }
    };

    initializeApp();
  }, [config.name, modules]);

  // Memoize error component to prevent re-creation
  const errorComponent = useMemo(() => {
    if (!error) return null;
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Application Error</h1>
        <p>{error.message}</p>
        <pre>{error.stack}</pre>
      </div>
    );
  }, [error]);

  // Memoize loading component to prevent re-creation
  const loadingComponent = useMemo(() => {
    if (initialized) return null;
    return (
      <div style={{ padding: '20px' }}>
        <h1>Loading {config.name}...</h1>
        <p>Initializing modules...</p>
      </div>
    );
  }, [initialized, config.name]);

  // Error state
  if (error) {
    return errorComponent;
  }

  // Loading state
  if (!initialized) {
    return loadingComponent;
  }

  // Get routes from modules - memoized to prevent recalculation
  const routes = useMemo(() => moduleRegistry.getRoutes(), [initialized]);

  return (
    <Provider store={store}>
      <ModuleContext.Provider value={moduleContextValue}>
        <BrowserRouter>
          {children}
          {routes.length > 0 && (
            <Routes>
              {routes.map((route, index) => {
                const key = route.path || `route-${index}`;
                // React Router's Route component accepts RouteObject properties
                // Using any here is acceptable for framework infrastructure
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return <Route key={key} {...(route as any)} />;
              })}
            </Routes>
          )}
        </BrowserRouter>
      </ModuleContext.Provider>
    </Provider>
  );
}
