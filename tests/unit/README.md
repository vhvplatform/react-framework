# Unit Tests

This directory contains comprehensive unit tests for all packages in the SaaS Framework React monorepo.

## 📊 Test Coverage

Total: **185+ tests** across **46 test files**

### Packages Tested

- ✅ **@longvhv/shared** (45+ tests) - Utils & hooks
- ✅ **@longvhv/vietnamese** (20+ tests) - Vietnamese utilities
- ✅ **@longvhv/i18n** (15+ tests) - Internationalization
- ✅ **@longvhv/forms** (12+ tests) - Form management
- ✅ **@longvhv/cache** (15+ tests) - Caching system
- ✅ **@longvhv/context** (12+ tests) - Context management
- ✅ **@longvhv/auth** (10+ tests) - Authentication
- ✅ **@longvhv/crud** (10+ tests) - CRUD operations
- ✅ **@longvhv/media** (12+ tests) - Media processing
- ✅ **@longvhv/api-client** (8+ tests) - API client
- ✅ **@longvhv/core** (8+ tests) - Core framework
- ✅ **@longvhv/ui-components** (15+ tests) - UI components
- ✅ **@longvhv/cli** (5+ tests) - CLI tools

## 🚀 Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run tests with UI
pnpm test:ui

# Run specific package tests
pnpm test tests/unit/shared

# Run specific test file
pnpm test tests/unit/shared/utils/string.test.ts
```

## 📁 Directory Structure

```
tests/
├── setup.ts              # Global test setup
├── utils/                # Test utilities
│   └── testUtils.tsx     # Helper functions
├── mocks/                # Mock data & providers
└── unit/                 # Unit tests
    ├── shared/           # @longvhv/shared tests
    │   ├── utils/        # Utility function tests
    │   └── hooks/        # React hook tests
    ├── vietnamese/       # Vietnamese utils tests
    ├── i18n/             # i18n tests
    ├── forms/            # Form tests
    ├── cache/            # Cache tests
    ├── context/          # Context tests
    ├── auth/             # Auth tests
    ├── crud/             # CRUD tests
    ├── media/            # Media tests
    ├── api-client/       # API client tests
    ├── core/             # Core tests
    ├── ui-components/    # Component tests
    └── cli/              # CLI tests
```

## 🧪 Test Technologies

- **Vitest** - Fast unit test framework
- **React Testing Library** - Component testing
- **Happy-DOM** - Lightweight DOM implementation
- **@testing-library/jest-dom** - Custom matchers

## 📝 Test Patterns

### Utility Function Tests

```typescript
describe('capitalize', () => {
  it('should capitalize first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('should handle empty string', () => {
    expect(capitalize('')).toBe('');
  });
});
```

### React Hook Tests

```typescript
describe('useDebounce', () => {
  it('should debounce value updates', async () => {
    const { result } = renderHook(() => useDebounce('test', 500));
    // Test debouncing behavior
  });
});
```

### Component Tests

```typescript
describe('Button', () => {
  it('should render button text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

## ✅ Test Quality Standards

- **Descriptive Names**: Clear test descriptions
- **AAA Pattern**: Arrange, Act, Assert
- **Edge Cases**: Test boundary conditions
- **Mocking**: Mock external dependencies
- **Coverage**: Aim for 80%+ coverage

## 🎯 Coverage Goals

| Category | Target |
|----------|--------|
| Utilities | 90%+ |
| Hooks | 85%+ |
| Components | 80%+ |
| Integrations | 75%+ |

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
