/**
 * Test helper to wait for specific condition
 */
export async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  timeout = 5000,
  interval = 50
): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * Mock localStorage for testing
 */
export function mockLocalStorage(): void {
  const store: Record<string, string> = {};
  
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach(key => delete store[key]);
      },
      get length() {
        return Object.keys(store).length;
      },
      key: (index: number) => Object.keys(store)[index] || null,
    },
    writable: true,
  });
}

/**
 * Mock sessionStorage for testing
 */
export function mockSessionStorage(): void {
  const store: Record<string, string> = {};
  
  Object.defineProperty(window, 'sessionStorage', {
    value: {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach(key => delete store[key]);
      },
      get length() {
        return Object.keys(store).length;
      },
      key: (index: number) => Object.keys(store)[index] || null,
    },
    writable: true,
  });
}

/**
 * Create mock API response
 */
export function createMockResponse<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Suppress console errors/warnings during tests
 */
export function suppressConsole(): () => void {
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = () => {};
  console.warn = () => {};
  
  return () => {
    console.error = originalError;
    console.warn = originalWarn;
  };
}

/**
 * Create a delay for testing async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate random test data
 */
export const testData = {
  email: () => `test${Math.random().toString(36).substring(7)}@example.com`,
  name: () => `Test User ${Math.random().toString(36).substring(7)}`,
  id: () => Math.random().toString(36).substring(7),
  number: (min = 0, max = 1000) => Math.floor(Math.random() * (max - min + 1)) + min,
  boolean: () => Math.random() > 0.5,
  date: () => new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
};
