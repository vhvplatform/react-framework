import { configureStore, combineReducers, Reducer, AnyAction } from '@reduxjs/toolkit';
import { ModuleRegistry } from './ModuleRegistry';

/**
 * Create Redux store with module reducers
 * @param registry - Module registry instance
 * @param initialState - Initial state
 * @param enableDevTools - Enable Redux DevTools
 * @param middleware - Additional middleware
 * @returns Configured Redux store
 */
export function createStore(
  registry: ModuleRegistry,
  initialState?: Record<string, unknown>,
  enableDevTools: boolean = true,
  middleware?: unknown[]
) {
  const moduleReducers = registry.getReducers();

  // Combine all module reducers
  const rootReducer =
    Object.keys(moduleReducers).length > 0
      ? combineReducers(moduleReducers)
      : ((state = {}) => state) as Reducer<Record<string, unknown>, AnyAction>;

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    devTools: enableDevTools,
    middleware: (getDefaultMiddleware) => {
      const defaultMiddleware = getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types
          ignoredActions: ['persist/PERSIST'],
        },
      });

      if (middleware && middleware.length > 0) {
        return defaultMiddleware.concat(middleware as never[]);
      }

      return defaultMiddleware;
    },
  });

  return store;
}

/**
 * Get the RootState type from the store
 */
export type RootState = ReturnType<ReturnType<typeof createStore>['getState']>;

/**
 * Get the AppDispatch type from the store
 */
export type AppDispatch = ReturnType<typeof createStore>['dispatch'];
