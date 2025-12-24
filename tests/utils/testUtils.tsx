import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';

/**
 * Create a mock Redux store for testing
 */
export function createMockStore(initialState = {}) {
  return configureStore({
    reducer: {
      auth: (state = { user: null, isAuthenticated: false }, action) => state,
      // Add other reducers as needed
    },
    preloadedState: initialState,
  });
}

/**
 * Create a wrapper component with all providers
 */
export function createWrapper(options: {
  store?: ReturnType<typeof createMockStore>;
  router?: boolean;
} = {}) {
  const { store = createMockStore(), router = true } = options;

  return function Wrapper({ children }: { children: ReactNode }) {
    const wrapped = <Provider store={store}>{children}</Provider>;
    
    if (router) {
      return <BrowserRouter>{wrapped}</BrowserRouter>;
    }
    
    return wrapped;
  };
}

/**
 * Render component with all necessary providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options: RenderOptions & {
    store?: ReturnType<typeof createMockStore>;
    router?: boolean;
  } = {}
) {
  const { store, router, ...renderOptions } = options;
  
  return render(ui, {
    wrapper: createWrapper({ store, router }),
    ...renderOptions,
  });
}

/**
 * Wait for a condition to be true
 */
export function waitFor(
  condition: () => boolean,
  { timeout = 1000, interval = 50 } = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const check = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout waiting for condition'));
      } else {
        setTimeout(check, interval);
      }
    };
    
    check();
  });
}
