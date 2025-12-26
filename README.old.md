# 🚀 SaaS Framework React

A comprehensive React + Vite framework for building multiple SaaS applications in a monorepo architecture. Fully integrated with [@vhvplatform/go-framework](https://github.com/vhvplatform/go-framework) backend.

## ✨ Features

- 🏗️ **Modular Architecture** - Build applications with independent, reusable modules
- 🔄 **Auto-Discovery** - Modules are automatically discovered and registered
- 🔥 **Hot Module Replacement** - Instant reload without restart
- 👥 **Parallel Development** - Multiple developers can work on different modules simultaneously
- 🔐 **Authentication** - JWT and OAuth (Google, GitHub) support out of the box
- 🌍 **Multi-Language** - Vietnamese & English with 200+ translations
- 🏢 **Multi-Tenant** - Complete tenant, user, and site context management
- 📋 **CRUD Operations** - Full-featured CRUD with hooks, tables, and validation
- 💾 **Caching** - RAM, browser, and Redis-ready cache adapters
- 📝 **Forms** - Advanced form management with validation
- 🖼️ **Media Processing** - Image, video, Excel, and PDF processing
- 🇻🇳 **Vietnamese Utils** - Text processing, validation, and formatting for Vietnamese
- 🌐 **API Integration** - Seamless integration with @vhvplatform/go-framework backend
- 🎨 **UI Components** - Pre-built Tailwind CSS components
- 📦 **Monorepo** - Manage multiple packages with pnpm workspaces
- 🛠️ **CLI Tools** - Generate apps and modules with interactive commands
- 📘 **TypeScript** - Full type safety across all packages
- 🎯 **Redux Toolkit** - Predictable state management
- 🛣️ **React Router v6** - Dynamic routing with protected routes

## 📦 Packages (13 Total)

### @vhvplatform/core

Core framework functionality including:

- Application lifecycle management
- Module registry with dependency resolution
- Redux store integration
- React Router integration
- Auto-discovery system
- Hot Module Replacement support

### @vhvplatform/api-client

HTTP client for @vhvplatform/go-framework backend:

- Axios-based with interceptors
- Automatic JWT token handling
- Request/Response transformation
- Error handling and 401 redirects

### @vhvplatform/auth

Authentication package with:

- Redux slice for auth state
- JWT authentication
- OAuth support (Google, GitHub)
- Login form component
- OAuth button component
- Protected route component
- useAuth hook

### @vhvplatform/ui-components

Tailwind CSS components:

- Button (primary, secondary, danger variants)
- Card
- Input (with label and error handling)
- Spinner

### @vhvplatform/shared (New!)

Shared utilities and helpers:

- **Utils**: 50+ functions (string, date, object, array, validation, format, storage)
- **Hooks**: 6+ React hooks (useDebounce, useLocalStorage, usePagination, v.v.)
- **Types**: Common TypeScript types and interfaces
- **Constants**: App-wide constants (API config, routes, validation rules)

See [SHARED_LIBRARY.md](./SHARED_LIBRARY.md) for complete documentation.

### @vhvplatform/cli

Command-line tools:

- `create-app` - Generate new application from template
- `create-module` - Generate module in existing app

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- pnpm >= 8
- @vhvplatform/go-framework backend running

### Installation

```bash
# Clone the repository
git clone https://github.com/vhvplatform/react-framework.git
cd react-framework

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Create Your First App

```bash
# Create a new application
pnpm cli create-app my-saas-app

# Navigate to the app
cd my-saas-app

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Your app will be available at `http://localhost:3000`

## 🔄 Parallel Module Development

The framework supports automatic module discovery for easier parallel development:

```bash
# Create multiple modules - they're auto-discovered!
pnpm cli create-module dashboard
pnpm cli create-module users
pnpm cli create-module analytics
```

**No need to manually import or register modules!** They're automatically discovered from `src/modules/`:

```tsx
// src/main.tsx - Auto-discovery setup
import { loadModulesFromGlob } from '@vhvplatform/core';

const modules = await loadModulesFromGlob(import.meta.glob('./modules/*/index.ts'));

<Application modules={modules}>
  <App />
</Application>;
```

**Benefits:**

- ✅ Work on multiple modules simultaneously
- ✅ No merge conflicts in main.tsx
- ✅ Hot reload support
- ✅ Team collaboration friendly

See [PARALLEL_DEVELOPMENT.md](./PARALLEL_DEVELOPMENT.md) for complete guide.

## 📖 Usage Examples

### Creating an Application

```bash
pnpm cli create-app
```

The CLI will prompt you for:

- Application name
- API URL (your @vhvplatform/go-framework backend)
- Authentication options (JWT, OAuth)
- OAuth providers (Google, GitHub)

### Creating a Module

```bash
# Navigate to your app directory
cd my-saas-app

# Create a new module
pnpm cli create-module dashboard
```

The CLI will prompt you for:

- Module name
- Module ID
- Route configuration
- Redux state options

### Using the Framework in Code

#### Application Setup

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Application } from '@vhvplatform/core';
import { ApiProvider } from '@vhvplatform/api-client';
import { authReducer } from '@vhvplatform/auth';
import App from './App';

const apiConfig = {
  baseURL: 'http://localhost:8080',
  getToken: () => localStorage.getItem('saas_auth_token'),
  setToken: (token: string | null) => {
    if (token) localStorage.setItem('saas_auth_token', token);
    else localStorage.removeItem('saas_auth_token');
  },
  onUnauthorized: () => (window.location.href = '/login'),
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApiProvider config={apiConfig}>
      <Application
        config={{
          name: 'My SaaS App',
          apiUrl: 'http://localhost:8080',
          enableDevTools: true,
        }}
        modules={[
          {
            id: 'auth',
            name: 'Authentication',
            version: '1.0.0',
            reducer: authReducer,
          },
        ]}
      >
        <App />
      </Application>
    </ApiProvider>
  </React.StrictMode>
);
```

#### Creating a Module

```tsx
// src/modules/dashboard/index.ts
import { createModule } from '@vhvplatform/core';
import { routes } from './routes';
import dashboardReducer from './store/dashboardSlice';

export const dashboardModule = createModule({
  id: 'dashboard',
  name: 'Dashboard',
  version: '1.0.0',
  routes,
  reducer: dashboardReducer,
  initialize: async () => {
    console.log('Dashboard module initialized');
  },
});
```

#### Using Authentication

```tsx
// src/components/Profile.tsx
import { useAuth } from '@vhvplatform/auth';
import { Button } from '@vhvplatform/ui-components';

export function Profile() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Email: {user?.email}</p>
      <Button onClick={logout} variant="danger">
        Logout
      </Button>
    </div>
  );
}
```

#### Protected Routes

```tsx
// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@vhvplatform/auth';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

#### Using OAuth

```tsx
// src/pages/Login.tsx
import { LoginForm, OAuthButton } from '@vhvplatform/auth';
import { Card } from '@vhvplatform/ui-components';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <LoginForm onSuccess={() => (window.location.href = '/')} />

        <div className="mt-4">
          <OAuthButton
            config={{
              provider: 'google',
              authUrl: 'http://localhost:8080/api/auth/oauth/google',
              clientId: 'your-google-client-id',
              redirectUri: 'http://localhost:3000/oauth/callback',
              scopes: ['email', 'profile'],
            }}
          />
        </div>
      </Card>
    </div>
  );
}
```

#### Making API Calls

```tsx
// src/modules/users/api.ts
import { useApi } from '@vhvplatform/api-client';

export function useUsers() {
  const apiClient = useApi();

  const getUsers = async () => {
    return await apiClient.get('/api/users');
  };

  const createUser = async (data: any) => {
    return await apiClient.post('/api/users', data);
  };

  return { getUsers, createUser };
}
```

## 🏗️ Architecture

### Module System

Modules are self-contained units that can include:

- **Routes** - React Router routes
- **State** - Redux reducers
- **Components** - React components
- **Services** - Business logic
- **Dependencies** - Other modules they depend on

Modules are registered with the Application component and initialized in dependency order.

### State Management

Redux Toolkit is used for global state management:

- Each module can provide its own reducer
- Reducers are automatically combined
- TypeScript support for all state

### API Integration

The framework integrates seamlessly with @vhvplatform/go-framework:

**Authentication Endpoints:**

- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/register` - Register new user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/oauth/{provider}/callback` - OAuth callback

**Response Format:**

```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

**Error Format:**

```json
{
  "success": false,
  "message": "Error message",
  "code": "ERROR_CODE"
}
```

## 🎨 UI Components

All components use Tailwind CSS and support theming:

```tsx
import { Button, Card, Input, Spinner } from '@vhvplatform/ui-components';

// Button variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>

// Card with title
<Card title="My Card" hoverable>
  Content goes here
</Card>

// Input with label and error
<Input
  label="Email"
  type="email"
  error="Invalid email"
  fullWidth
/>

// Loading spinner
<Spinner size="lg" color="primary" text="Loading..." />
```

## 🔧 Development

### Project Structure

```
.
├── packages/
│   ├── core/              # Core framework
│   ├── api-client/        # API client
│   ├── auth/              # Authentication
│   ├── ui-components/     # UI components
│   └── cli/               # CLI tools
├── package.json           # Root workspace config
├── pnpm-workspace.yaml    # Workspace definition
└── tsconfig.json          # TypeScript config
```

### Scripts

```bash
# Build all packages
pnpm build

# Watch mode for development
pnpm dev

# Type checking
pnpm type-check

# Linting
pnpm lint

# Format code
pnpm format

# Clean all build artifacts
pnpm clean
```

### Adding a New Package

1. Create package directory in `packages/`
2. Add `package.json` and `tsconfig.json`
3. Update root `tsconfig.json` references
4. Build the package

## 🔐 Security

- JWT tokens stored in localStorage with automatic injection
- CSRF protection for OAuth flows
- Automatic 401 redirect
- Token refresh support
- Input validation and sanitization

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines first.

## 🐛 Issues

Found a bug? Please open an issue on GitHub.

## 📞 Support

For support, email support@vhvplatform.com or join our Slack channel.

## 🙏 Acknowledgments

Built with:

- React 18
- TypeScript 5
- Vite 5
- Redux Toolkit 2
- React Router v6
- Tailwind CSS 3
- Axios

Integrated with [@vhvplatform/go-framework](https://github.com/vhvplatform/go-framework) backend framework.

### @vhvplatform/i18n

Internationalization support:

- Vietnamese & English translations
- 200+ pre-defined translations
- React Context-based
- LocalStorage persistence
- Variable interpolation
- Components: LanguageSwitcher
- Hooks: useI18n, useTranslation
- Utils: formatDate, formatCurrency

### @vhvplatform/crud

Complete CRUD operations:

- useCrud hook with fetchAll, create, update, delete
- useCrudForm with validation
- useTable hooks (selection, sorting, filtering)
- CrudTable component
- Built-in validators
- Auto-fetch, pagination support

### @vhvplatform/cache

Multi-layer caching system:

- MemoryCacheAdapter (RAM cache with TTL)
- BrowserCacheAdapter (localStorage/sessionStorage)
- Redis support ready
- Batch operations
- Statistics tracking

### @vhvplatform/context

Multi-tenant context management:

- CurrentUser with permissions
- Tenant management with plans & limits
- Site/location management
- Application context
- Hooks: useCurrentUser, useCurrentTenant, usePermissions
- Features: switchTenant, hasPermission, hasRole

### @vhvplatform/forms

Advanced form management:

- Complete form state management
- Field-level and form-level validation
- Built-in validators (required, email, pattern)
- Dirty and touched state tracking
- TypeScript support

### @vhvplatform/media

Media file processing:

- **Image**: resize, crop, rotate, compress, thumbnail, format conversion
- **Video**: metadata, thumbnail extraction, validation
- **Excel**: read/write, export, CSV conversion, multi-sheet
- **PDF**: page count, text extraction (ready for integration)

### @vhvplatform/vietnamese

Vietnamese language utilities:

- **Text**: removeVietnameseTones, vietnameseToSlug, sort, highlight
- **Validation**: phone, ID card, tax code, postal code, name, bank account
- **Formatting**: phone, currency, date (Vietnamese locale)

## 🌟 New Features Highlights

### Multi-Language (i18n)

```tsx
import { I18nProvider, useTranslation, LanguageSwitcher } from '@vhvplatform/i18n';

function App() {
  return (
    <I18nProvider config={{ defaultLanguage: 'vi' }}>
      <MyApp />
    </I18nProvider>
  );
}

function MyComponent() {
  const { t } = useTranslation();
  return (
    <>
      <h1>{t('common.welcome')}</h1>
      <LanguageSwitcher />
    </>
  );
}
```

### Multi-Tenant Context

```tsx
import { AppContextProvider, useCurrentUser, useCurrentTenant } from '@vhvplatform/context';

function App() {
  return (
    <AppContextProvider
      config={{
        application: { name: 'My SaaS', version: '1.0.0' },
        endpoints: { user: '/api/me', tenant: '/api/tenant' },
      }}
    >
      <Dashboard />
    </AppContextProvider>
  );
}

function Dashboard() {
  const user = useCurrentUser();
  const tenant = useCurrentTenant();

  return (
    <div>
      Welcome {user?.name} from {tenant?.name}!
    </div>
  );
}
```

### CRUD Operations

```tsx
import { useCrud, CrudTable } from '@vhvplatform/crud';

function Users() {
  const crud = useCrud({
    resource: 'users',
    autoFetch: true,
  });

  return (
    <CrudTable
      data={crud.items}
      loading={crud.loading}
      config={{
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
        ],
        actions: { edit: true, delete: true },
      }}
      onEdit={(user) => crud.setItem(user)}
      onDelete={(user) => crud.remove(user.id)}
    />
  );
}
```

### Vietnamese Utilities

```tsx
import {
  vietnameseToSlug,
  isValidVietnamesePhone,
  formatVietnameseCurrency,
} from '@vhvplatform/vietnamese';

vietnameseToSlug('Xin chào Việt Nam'); // "xin-chao-viet-nam"
isValidVietnamesePhone('0987654321'); // true
formatVietnameseCurrency(1000000); // "1.000.000₫"
```

### Media Processing

```tsx
import { resizeImage, extractVideoThumbnail, readExcelFile } from '@vhvplatform/media';

// Image
const resized = await resizeImage(file, { width: 800, quality: 0.9 });

// Video
const thumbnail = await extractVideoThumbnail(videoFile, 5);

// Excel
const workbook = await readExcelFile(excelFile);
const data = workbook.sheets[0].json;
```

## 📚 Documentation

- [PARALLEL_DEVELOPMENT.md](./PARALLEL_DEVELOPMENT.md) - Guide for parallel module development
- [SHARED_LIBRARY.md](./SHARED_LIBRARY.md) - Complete shared utilities reference
- [EXAMPLE.md](./EXAMPLE.md) - Full application example
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines

## 🏗️ Architecture

The framework uses a modular architecture where each module:

- Has its own routes, components, and Redux reducers
- Can depend on other modules
- Supports lazy loading
- Integrates automatically via auto-discovery

## 🔐 Authentication Flow

1. User logs in with email/password or OAuth
2. JWT token is stored in localStorage
3. API client automatically injects token in requests
4. 401 responses trigger automatic logout
5. Protected routes check authentication state

## 📊 State Management

- **Redux Toolkit** for global state
- **Automatic reducer registration** from modules
- **TypeScript support** for state types
- **Module-specific slices** for isolation

## 🛠️ Development Tools

### Auto-Discovery System

```tsx
import { loadModulesFromGlob } from '@vhvplatform/core';

const modules = await loadModulesFromGlob(import.meta.glob('./modules/*/index.ts'));
```

### Development Utilities

```tsx
import { validateModule, logModuleInfo, setupModuleDev } from '@vhvplatform/core';

// Validate module
const validation = validateModule(myModule);

// Debug info
logModuleInfo(myModule);

// Test in isolation
const { module, cleanup } = setupModuleDev({
  module: dashboardModule,
  mockDependencies: { auth: {...} }
});
```

## 🌐 Backend Integration

Fully compatible with [@vhvplatform/go-framework](https://github.com/vhvplatform/go-framework):

**API Endpoints:**

- POST `/api/auth/login` - JWT login
- POST `/api/auth/register` - Register user
- POST `/api/auth/oauth/{provider}/callback` - OAuth callback
- GET `/api/auth/me` - Get current user
- POST `/api/tenant/switch` - Switch tenant
- POST `/api/site/switch` - Switch site

**Response Format:**

```json
{
  "success": true,
  "data": { ... },
  "message": "Success"
}
```

## 🎯 Use Cases

Perfect for building:

- Multi-tenant SaaS applications
- Admin dashboards
- CRM systems
- E-commerce platforms
- Content management systems
- Internal tools
- Vietnamese-focused applications

## 📈 Package Statistics

| Package       | Purpose              | Size   | Dependencies         |
| ------------- | -------------------- | ------ | -------------------- |
| core          | Framework core       | Medium | React, Redux, Router |
| api-client    | API communication    | Small  | Axios                |
| auth          | Authentication       | Small  | Redux Toolkit        |
| ui-components | UI library           | Small  | Tailwind CSS         |
| shared        | Utilities            | Medium | None                 |
| cli           | Code generation      | Small  | Inquirer             |
| i18n          | Internationalization | Small  | React                |
| crud          | CRUD operations      | Medium | api-client, shared   |
| cache         | Caching              | Small  | None                 |
| context       | Multi-tenant         | Small  | api-client           |
| forms         | Form management      | Medium | ui-components        |
| media         | Media processing     | Large  | xlsx, pdfjs-dist     |
| vietnamese    | Vietnamese utils     | Small  | None                 |

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## 📄 License

MIT

## 🙏 Acknowledgments

Built with:

- React 18.2
- TypeScript 5.3
- Vite 5.0
- Redux Toolkit 2.0
- React Router v6
- Tailwind CSS 3.4
- pnpm workspaces

---

**Ready to build amazing SaaS applications! 🚀**
