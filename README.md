# 🚀 SaaS Framework React

[![CI](https://github.com/longvhv/saas-framework-react/actions/workflows/ci.yml/badge.svg)](https://github.com/longvhv/saas-framework-react/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive, production-ready React + Vite framework for building multiple SaaS applications in a monorepo architecture. Built with modern best practices, full TypeScript support, and enterprise-grade tooling.

## ✨ Key Features

### 🏗️ Architecture & Development

- **Modular Architecture** - Build applications with independent, reusable modules
- **Auto-Discovery** - Modules are automatically discovered and registered
- **Hot Module Replacement** - Instant reload without application restart
- **Parallel Development** - Multiple developers can work simultaneously on different modules
- **Monorepo Structure** - Efficient package management with pnpm workspaces
- **Full TypeScript** - End-to-end type safety across all packages

### 🎨 UI & Theming

- **UI Components** - Pre-built Tailwind CSS components (Button, Card, Input, Spinner)
- **Dark/Light Mode** - Built-in theme management with system preference support
- **Responsive Design** - Mobile-first, accessible components
- **Toast Notifications** - Beautiful notifications with react-hot-toast

### 🔐 Authentication & Security

- **JWT Authentication** - Secure token-based authentication
- **OAuth Support** - Google and GitHub OAuth integration
- **Protected Routes** - Route guards for authenticated pages
- **Session Persistence** - Automatic token refresh and storage

### 🌐 API & Data Management

- **HTTP Client** - Axios-based client with interceptors
- **React Query** - Server state management with caching
- **Optimistic Updates** - Instant UI updates before server response
- **Error Handling** - Centralized error management and retry logic

### 🏢 Multi-Tenancy

- **Tenant Context** - Complete tenant, user, and site management
- **Feature Flags** - Per-tenant feature enablement
- **Usage Limits** - Quota management and tracking
- **Role-Based Access** - Hierarchical permission system

### 🛠️ Developer Experience

- **CLI Tools** - Interactive app and module generation
- **Testing Utilities** - Vitest, Testing Library, and custom helpers
- **ESLint + Prettier** - Consistent code formatting
- **Husky Hooks** - Pre-commit linting and validation
- **Conventional Commits** - Enforced commit message standards
- **Changesets** - Automated version management

### 🚀 CI/CD

- **GitHub Actions** - Automated testing, linting, and type checking
- **Automated Releases** - Changeset-based versioning and publishing
- **Code Coverage** - Codecov integration
- **Build Artifacts** - Automatic artifact generation and storage

### 📦 Additional Features

- **Form Handling** - React Hook Form with Zod validation
- **CRUD Operations** - Full-featured CRUD with hooks and tables
- **Caching** - RAM, browser, and Redis-ready adapters
- **Internationalization** - Multi-language support (Vietnamese, English, +4 more)
- **Media Processing** - Image, video, Excel, and PDF utilities
- **Vietnamese Utils** - Vietnamese text processing and validation

## 📦 Packages (17 Total)

### Core Packages

#### @longvhv/core

Core framework functionality:

- Application lifecycle management
- Module registry with dependency resolution
- Redux store integration
- React Router integration
- Auto-discovery system
- Hot Module Replacement support

#### @longvhv/api-client

HTTP client for backend integration:

- Axios-based with interceptors
- Automatic JWT token handling
- Request/Response transformation
- Error handling and 401 redirects

#### @longvhv/auth

Authentication and authorization:

- Redux slice for auth state
- JWT authentication
- OAuth support (Google, GitHub)
- Login/Logout components
- Protected route component
- useAuth hook

#### @longvhv/ui-components

Tailwind CSS component library:

- Button (primary, secondary, danger variants)
- Card (with header and footer)
- Input (with label and error handling)
- Spinner (loading indicator)

### New Production-Ready Packages

#### @longvhv/testing

Testing utilities and helpers:

- Vitest setup with browser mocks
- Testing Library custom render
- Test data generators
- Async helpers (waitForCondition, delay)
- Mock utilities (localStorage, sessionStorage, API responses)

#### @longvhv/theme

Theme management system:

- Dark/Light mode support
- System preference detection
- localStorage persistence
- Customizable theme colors
- CSS variable integration
- React Context API

#### @longvhv/notifications

Toast notification system:

- react-hot-toast integration
- Success, error, warning, info types
- Promise-based notifications
- Loading states
- Customizable position and duration

#### @longvhv/query

React Query integration:

- Pre-configured QueryClient
- Custom hooks (useFetch, useMutate)
- Optimistic updates
- Pagination helpers
- Query key utilities
- Prefetching support

### Utility Packages

#### @longvhv/shared

50+ utility functions and hooks:

- String, date, object, array utilities
- Validation helpers
- Format functions
- Storage utilities
- React hooks (useDebounce, useLocalStorage, usePagination)

#### @longvhv/forms

Form handling:

- React Hook Form integration
- Zod validation
- Form field components
- Error handling

#### @longvhv/context

Multi-tenant context management:

- User context
- Tenant context
- Site context
- Role management hooks
- Permission checking

#### @longvhv/crud

CRUD operations:

- useCrud hook
- CrudTable component
- useCrudForm hook
- Generic CRUD patterns

#### @longvhv/cache

Caching system:

- Memory cache adapter
- Browser cache adapter
- Redis-ready interface
- TTL support

#### @longvhv/i18n

Internationalization:

- 6 language support (Vietnamese, English, Spanish, Chinese, Japanese, Korean)
- 200+ translations
- Language switcher component
- useTranslation hook

#### @longvhv/media

Media processing utilities:

- Image optimization
- Video processing
- Excel file handling
- PDF processing (placeholder)

#### @longvhv/vietnamese

Vietnamese-specific utilities:

- Text processing (remove tones, slug generation)
- Validation (names, phone numbers, addresses)
- Vietnamese collation
- Currency formatting

#### @longvhv/cli

Command-line tools:

- `create-app` - Generate new application
- `create-module` - Generate module in existing app
- Interactive prompts
- Template-based generation

## 🚀 Quick Start

### Prerequisites

```bash
Node.js >= 18.0.0
pnpm >= 8.0.0
```

### Installation

```bash
# Clone the repository
git clone https://github.com/longvhv/saas-framework-react.git
cd saas-framework-react

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Development

```bash
# Start development mode (watches all packages)
pnpm dev

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm type-check
```

### Create Your First App

```bash
# Generate a new application
pnpm cli create-app my-app

# Navigate to the app
cd apps/my-app

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Create a Module

```bash
# Inside your app directory
pnpm cli create-module dashboard

# This creates:
# - src/modules/dashboard/
# - src/modules/dashboard/routes.tsx
# - src/modules/dashboard/index.ts
# - src/modules/dashboard/DashboardPage.tsx
```

## 📚 Usage Examples

### Theme Management

```tsx
import { ThemeProvider, useTheme } from '@longvhv/theme';

function App() {
  return (
    <ThemeProvider defaultMode="system">
      <YourApp />
    </ThemeProvider>
  );
}

function ThemeToggle() {
  const { isDark, toggleMode } = useTheme();
  return <button onClick={toggleMode}>{isDark ? '🌙 Dark' : '☀️ Light'}</button>;
}
```

### Notifications

```tsx
import { NotificationProvider, useNotifications } from '@longvhv/notifications';

function App() {
  return (
    <>
      <NotificationProvider />
      <YourApp />
    </>
  );
}

function MyComponent() {
  const notifications = useNotifications();

  const handleSave = async () => {
    await notifications.promise(api.save(data), {
      loading: 'Saving...',
      success: 'Saved successfully!',
      error: 'Failed to save',
    });
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### React Query

```tsx
import { QueryProvider, useFetch, useMutate } from '@longvhv/query';

function App() {
  return (
    <QueryProvider>
      <YourApp />
    </QueryProvider>
  );
}

function UserList() {
  const { data, isLoading } = useFetch('users', () => api.get('/users'));

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Authentication

```tsx
import { useAuth } from '@longvhv/auth';

function Profile() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 🏗️ Architecture Overview

### Monorepo Structure

```
saas-framework-react/
├── packages/           # All framework packages
│   ├── core/          # Core framework
│   ├── api-client/    # HTTP client
│   ├── auth/          # Authentication
│   ├── ui-components/ # UI library
│   ├── testing/       # Test utilities
│   ├── theme/         # Theme system
│   ├── notifications/ # Notifications
│   ├── query/         # React Query
│   ├── forms/         # Form handling
│   ├── shared/        # Utilities
│   ├── context/       # Multi-tenant context
│   ├── crud/          # CRUD operations
│   ├── cache/         # Caching
│   ├── i18n/          # Internationalization
│   ├── media/         # Media processing
│   ├── vietnamese/    # Vietnamese utils
│   └── cli/           # CLI tools
├── .github/
│   └── workflows/     # CI/CD workflows
│       ├── ci.yml     # Test, lint, build
│       └── release.yml # Automated releases
├── .husky/            # Git hooks
├── .changeset/        # Version management
├── tests/             # Shared test utilities
└── examples/          # Example applications
```

### Module System

The framework uses a module-based architecture where each module:

- Is self-contained with its own routes, components, and logic
- Automatically registers itself with the core framework
- Can depend on other modules
- Supports hot module replacement
- Can be developed independently

## 🧪 Testing

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage
```

### Writing Tests

```typescript
import { render, screen, waitFor } from '@longvhv/testing';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('handles async operations', async () => {
    render(<MyComponent />);
    await waitFor(() => {
      expect(screen.getByText('Loaded')).toBeInTheDocument();
    });
  });
});
```

## 🔧 Configuration

### TypeScript

All packages use a shared TypeScript configuration with:

- Strict mode enabled
- ES2020 target
- React JSX transform
- Path mapping for workspace packages

### ESLint

Configured with:

- TypeScript support
- React and React Hooks rules
- Prettier integration
- Custom rules for unused variables

### Prettier

Consistent formatting with:

- 2 space indentation
- Single quotes
- Trailing commas
- Semi-colons

## 📝 Contributing

We use conventional commits and changesets for version management.

### Commit Message Format

```
type(scope): subject

body

footer
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

### Creating a Changeset

```bash
# After making changes
pnpm changeset

# Follow the prompts to describe your changes
# Commit the generated changeset file
```

### Pre-commit Hooks

The following runs automatically before each commit:

- ESLint fixes
- Prettier formatting
- Commit message validation

## 🚢 Deployment & Publishing

### CI/CD Pipeline

The framework includes automated GitHub Actions workflows:

**CI Workflow** (runs on push/PR):

- Linting
- Type checking
- Building all packages
- Running tests
- Coverage reporting

**Release Workflow** (runs on main branch):

- Creates version PR with changesets
- Publishes packages to npm
- Generates changelogs

### Manual Publishing

```bash
# Create a changeset
pnpm changeset

# Version packages
pnpm changeset:version

# Publish to npm
pnpm changeset:publish
```

## 📖 Documentation

Each package includes comprehensive README documentation:

- Installation instructions
- API reference
- Usage examples
- Type definitions

See individual package READMEs for detailed documentation.

## 🛡️ Security

- JWT token management with automatic refresh
- Secure storage (httpOnly cookies recommended)
- CSRF protection ready
- OAuth integration
- Role-based access control
- Input validation with Zod

## ⚡ Performance

- Tree-shakeable packages
- Code splitting support
- Lazy loading
- React Query caching
- Optimistic UI updates
- Memoization utilities

## 🐛 Troubleshooting

### Build Issues

```bash
# Clean all builds
pnpm clean

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Rebuild packages
pnpm build
```

### Type Errors

```bash
# Run type check
pnpm type-check

# Check specific package
cd packages/your-package
pnpm type-check
```

### Test Failures

```bash
# Run tests in watch mode
pnpm test:watch

# Run specific test file
pnpm test path/to/test.test.ts
```

## 📄 License

MIT © longvhv

## 🤝 Support

- 📧 Email: support@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/longvhv/saas-framework-react/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/longvhv/saas-framework-react/discussions)

## 🎯 Roadmap

- [ ] Storybook integration
- [ ] E2E testing with Playwright
- [ ] SSR support with Vite SSR
- [ ] Mobile app with React Native
- [ ] GraphQL support
- [ ] WebSocket integration
- [ ] Analytics integration
- [ ] Performance monitoring

---

Built with ❤️ by longvhv
