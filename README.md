# 🚀 SaaS Framework React

A comprehensive React + Vite framework for building multiple SaaS applications in a monorepo architecture. Fully integrated with [@longvhv/saas-framework-go](https://github.com/longvhv/saas-framework-go) backend.

## ✨ Features

- 🏗️ **Modular Architecture** - Build applications with independent, reusable modules
- 🔐 **Authentication** - JWT and OAuth (Google, GitHub) support out of the box
- 🌐 **API Integration** - Seamless integration with @longvhv/saas-framework-go backend
- 🎨 **UI Components** - Pre-built Tailwind CSS components
- 📦 **Monorepo** - Manage multiple packages with pnpm workspaces
- 🛠️ **CLI Tools** - Generate apps and modules with interactive commands
- 🔥 **Hot Module Replacement** - Fast development with Vite
- 📘 **TypeScript** - Full type safety across all packages
- 🎯 **Redux Toolkit** - Predictable state management
- 🛣️ **React Router v6** - Dynamic routing with protected routes

## 📦 Packages

### @longvhv/core
Core framework functionality including:
- Application lifecycle management
- Module registry with dependency resolution
- Redux store integration
- React Router integration

### @longvhv/api-client
HTTP client for @longvhv/saas-framework-go backend:
- Axios-based with interceptors
- Automatic JWT token handling
- Request/Response transformation
- Error handling and 401 redirects

### @longvhv/auth
Authentication package with:
- Redux slice for auth state
- JWT authentication
- OAuth support (Google, GitHub)
- Login form component
- OAuth button component
- Protected route component
- useAuth hook

### @longvhv/ui-components
Tailwind CSS components:
- Button (primary, secondary, danger variants)
- Card
- Input (with label and error handling)
- Spinner

### @longvhv/cli
Command-line tools:
- `create-app` - Generate new application from template
- `create-module` - Generate module in existing app

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- pnpm >= 8
- @longvhv/saas-framework-go backend running

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

## 📖 Usage Examples

### Creating an Application

```bash
pnpm cli create-app
```

The CLI will prompt you for:
- Application name
- API URL (your @longvhv/saas-framework-go backend)
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
import { Application } from '@longvhv/core';
import { ApiProvider } from '@longvhv/api-client';
import { authReducer } from '@longvhv/auth';
import App from './App';

const apiConfig = {
  baseURL: 'http://localhost:8080',
  getToken: () => localStorage.getItem('saas_auth_token'),
  setToken: (token: string | null) => {
    if (token) localStorage.setItem('saas_auth_token', token);
    else localStorage.removeItem('saas_auth_token');
  },
  onUnauthorized: () => window.location.href = '/login',
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
import { createModule } from '@longvhv/core';
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
import { useAuth } from '@longvhv/auth';
import { Button } from '@longvhv/ui-components';

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
import { ProtectedRoute } from '@longvhv/auth';
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
import { LoginForm, OAuthButton } from '@longvhv/auth';
import { Card } from '@longvhv/ui-components';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <LoginForm onSuccess={() => window.location.href = '/'} />
        
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
import { useApi } from '@longvhv/api-client';

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

The framework integrates seamlessly with @longvhv/saas-framework-go:

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
import { Button, Card, Input, Spinner } from '@longvhv/ui-components';

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

For support, email support@longvhv.com or join our Slack channel.

## 🙏 Acknowledgments

Built with:
- React 18
- TypeScript 5
- Vite 5
- Redux Toolkit 2
- React Router v6
- Tailwind CSS 3
- Axios

Integrated with [@longvhv/saas-framework-go](https://github.com/longvhv/saas-framework-go) backend framework.
