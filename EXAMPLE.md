# Example: Complete SaaS Application

This example demonstrates how to build a complete SaaS application using the framework.

## Project Structure

```
my-saas-app/
├── src/
│   ├── main.tsx              # Application entry point
│   ├── App.tsx               # Root component
│   ├── index.css             # Global styles
│   ├── modules/              # Application modules
│   │   ├── dashboard/
│   │   │   ├── index.ts
│   │   │   ├── routes.tsx
│   │   │   ├── components/
│   │   │   │   └── Dashboard.tsx
│   │   │   └── store/
│   │   │       └── dashboardSlice.ts
│   │   ├── users/
│   │   │   ├── index.ts
│   │   │   ├── routes.tsx
│   │   │   ├── components/
│   │   │   │   ├── UserList.tsx
│   │   │   │   └── UserDetail.tsx
│   │   │   └── api.ts
│   │   └── settings/
│   │       ├── index.ts
│   │       └── components/
│   │           └── Settings.tsx
│   └── components/           # Shared components
│       ├── Layout.tsx
│       └── Navigation.tsx
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## 1. Application Entry Point (main.tsx)

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Application } from '@longvhv/core';
import { ApiProvider } from '@longvhv/api-client';
import { authReducer } from '@longvhv/auth';
import App from './App';
import './index.css';

// Import modules
import { dashboardModule } from './modules/dashboard';
import { usersModule } from './modules/users';
import { settingsModule } from './modules/settings';

// API Configuration for @longvhv/saas-framework-go
const apiConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  getToken: () => localStorage.getItem('saas_auth_token'),
  setToken: (token: string | null) => {
    if (token) {
      localStorage.setItem('saas_auth_token', token);
    } else {
      localStorage.removeItem('saas_auth_token');
    }
  },
  onUnauthorized: () => {
    window.location.href = '/login';
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApiProvider config={apiConfig}>
      <Application
        config={{
          name: 'My SaaS App',
          apiUrl: apiConfig.baseURL,
          enableDevTools: import.meta.env.DEV,
        }}
        modules={[
          {
            id: 'auth',
            name: 'Authentication',
            version: '1.0.0',
            reducer: authReducer,
          },
          dashboardModule,
          usersModule,
          settingsModule,
        ]}
      >
        <App />
      </Application>
    </ApiProvider>
  </React.StrictMode>
);
```

## 2. Dashboard Module

### modules/dashboard/index.ts
```tsx
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
    // Load initial data, register event listeners, etc.
  },
});
```

### modules/dashboard/routes.tsx
```tsx
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@longvhv/auth';
import { Dashboard } from './components/Dashboard';

export const routes: RouteObject[] = [
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
];
```

### modules/dashboard/components/Dashboard.tsx
```tsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Spinner } from '@longvhv/ui-components';
import { useAuth } from '@longvhv/auth';
import { fetchStats, selectDashboard } from '../store/dashboardSlice';

export function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { stats, loading } = useSelector(selectDashboard);

  useEffect(() => {
    dispatch(fetchStats() as never);
  }, [dispatch]);

  if (loading) {
    return <Spinner size="lg" text="Loading dashboard..." />;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Welcome back, {user?.name}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Users">
          <p className="text-4xl font-bold text-blue-600">
            {stats.totalUsers}
          </p>
        </Card>
        
        <Card title="Active Sessions">
          <p className="text-4xl font-bold text-green-600">
            {stats.activeSessions}
          </p>
        </Card>
        
        <Card title="Revenue">
          <p className="text-4xl font-bold text-purple-600">
            ${stats.revenue}
          </p>
        </Card>
      </div>

      <Card title="Quick Actions" className="mt-6">
        <div className="flex gap-4">
          <Button variant="primary">Create User</Button>
          <Button variant="secondary">View Reports</Button>
          <Button variant="success">Export Data</Button>
        </div>
      </Card>
    </div>
  );
}
```

### modules/dashboard/store/dashboardSlice.ts
```tsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiClient } from '@longvhv/api-client';

interface DashboardStats {
  totalUsers: number;
  activeSessions: number;
  revenue: number;
}

interface DashboardState {
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: {
    totalUsers: 0,
    activeSessions: 0,
    revenue: 0,
  },
  loading: false,
  error: null,
};

export const fetchStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { extra }) => {
    const apiClient = extra as ApiClient;
    return await apiClient.get<DashboardStats>('/api/dashboard/stats');
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stats';
      });
  },
});

export default dashboardSlice.reducer;

export const selectDashboard = (state: { dashboard: DashboardState }) =>
  state.dashboard;
```

## 3. Users Module with API Integration

### modules/users/api.ts
```tsx
import { useApi } from '@longvhv/api-client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export function useUsersApi() {
  const apiClient = useApi();

  const getUsers = async () => {
    return await apiClient.get<User[]>('/api/users');
  };

  const getUser = async (id: string) => {
    return await apiClient.get<User>(`/api/users/${id}`);
  };

  const createUser = async (data: Omit<User, 'id' | 'createdAt'>) => {
    return await apiClient.post<User>('/api/users', data);
  };

  const updateUser = async (id: string, data: Partial<User>) => {
    return await apiClient.put<User>(`/api/users/${id}`, data);
  };

  const deleteUser = async (id: string) => {
    return await apiClient.delete(`/api/users/${id}`);
  };

  return {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
  };
}
```

### modules/users/components/UserList.tsx
```tsx
import { useEffect, useState } from 'react';
import { Card, Button, Spinner } from '@longvhv/ui-components';
import { useUsersApi, User } from '../api';

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { getUsers, deleteUser } = useUsersApi();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      await deleteUser(id);
      await loadUsers();
    }
  };

  if (loading) {
    return <Spinner size="lg" text="Loading users..." />;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button variant="primary">Add User</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Created</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
```

## 4. Authentication Flow

### App.tsx with Auth
```tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm, ProtectedRoute, OAuthButton } from '@longvhv/auth';
import { Card } from '@longvhv/ui-components';
import { Layout } from './components/Layout';

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <Card title="Login">
          <LoginForm onSuccess={() => (window.location.href = '/dashboard')} />
          
          <div className="mt-4 space-y-2">
            <OAuthButton
              config={{
                provider: 'google',
                authUrl: 'http://localhost:8080/api/auth/oauth/google',
                clientId: process.env.VITE_GOOGLE_CLIENT_ID!,
                redirectUri: `${window.location.origin}/oauth/callback`,
                scopes: ['email', 'profile'],
              }}
            />
            
            <OAuthButton
              config={{
                provider: 'github',
                authUrl: 'http://localhost:8080/api/auth/oauth/github',
                clientId: process.env.VITE_GITHUB_CLIENT_ID!,
                redirectUri: `${window.location.origin}/oauth/callback`,
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      />
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
```

## 5. Environment Configuration

### .env
```bash
# API Configuration
VITE_API_URL=http://localhost:8080

# OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GITHUB_CLIENT_ID=your-github-client-id
```

## 6. Running the Application

```bash
# Development
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 7. Backend Integration (@longvhv/saas-framework-go)

Make sure your Go backend is running with these endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `GET /api/auth/oauth/{provider}` - OAuth authorization
- `POST /api/auth/oauth/{provider}/callback` - OAuth callback
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

This example demonstrates a complete SaaS application with authentication, module system, API integration, and UI components!
