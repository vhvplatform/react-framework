# @longvhv/testing

Testing utilities with Vitest and Testing Library helpers for the SaaS Framework.

## Features

- 🧪 **Test Utilities** - Helper functions for common testing scenarios
- 🎭 **Mocking** - Easy mocking of localStorage, sessionStorage, and API responses
- ⚛️ **React Testing** - Custom render function with providers
- ⏰ **Async Helpers** - Wait for conditions and delays
- 📊 **Test Data** - Random test data generators
- 🔧 **Setup** - Pre-configured Vitest setup with browser mocks

## Installation

```bash
pnpm add -D @longvhv/testing
```

## Usage

### Test Utilities

```typescript
import { waitForCondition, delay, testData } from '@longvhv/testing';

// Wait for a condition
await waitForCondition(() => element.classList.contains('active'));

// Create delay
await delay(1000);

// Generate test data
const email = testData.email();
const name = testData.name();
```

### Mocking

```typescript
import { mockLocalStorage, mockSessionStorage, createMockResponse } from '@longvhv/testing';

// Mock localStorage
mockLocalStorage();

// Mock sessionStorage
mockSessionStorage();

// Create mock API response
const response = createMockResponse({ id: 1, name: 'Test' });
```

### React Testing

```typescript
import { render, screen, waitFor } from '@longvhv/testing';

test('renders component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

## API Reference

### Test Utilities

- `waitForCondition(condition, timeout?, interval?)` - Wait for a condition to be true
- `delay(ms)` - Create a delay
- `testData` - Random test data generators
- `suppressConsole()` - Suppress console errors/warnings

### Mocking

- `mockLocalStorage()` - Mock localStorage
- `mockSessionStorage()` - Mock sessionStorage
- `createMockResponse(data, status?)` - Create mock API response

### Setup

The package includes a Vitest setup file that mocks:
- `window.matchMedia`
- `IntersectionObserver`
- `ResizeObserver`
