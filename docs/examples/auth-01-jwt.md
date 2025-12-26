# Example: JWT Authentication

Complete JWT authentication implementation with login, logout, and protected routes.

## Goal

Build an app with:
- ✅ Login form
- ✅ JWT token storage
- ✅ Protected routes
- ✅ Auto logout on token expiry

## Complete Implementation

### 1. Setup

```bash
pnpm cli create-app auth-example
cd auth-example
pnpm install
```

### 2. Configure Auth Store

Edit `src/store.ts`:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@vhvplatform/auth';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 3. Login Component

Create `src/components/LoginForm.tsx`:

```typescript
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '@vhvplatform/auth';
import { useApi } from '@vhvplatform/api-client';
import { Button, Input, Card } from '@vhvplatform/ui-components';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const apiClient = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await dispatch(
        login({ 
          apiClient, 
          credentials: { email, password } 
        })
      ).unwrap();
      
      console.log('Login successful:', result.user);
      // Redirect handled by router
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold">Login</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded">
            {error}
          </div>
        )}
        
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
        
        <Input
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={loading}
        >
          Login
        </Button>
      </form>
    </Card>
  );
};
```

### 4. Protected Route Component

Create `src/components/ProtectedRoute.tsx`:

```typescript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@vhvplatform/auth';
import { Spinner } from '@vhvplatform/ui-components';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

### 5. Dashboard Component

Create `src/components/Dashboard.tsx`:

```typescript
import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '@vhvplatform/auth';
import { useAuth } from '@vhvplatform/auth';
import { Button, Card } from '@vhvplatform/ui-components';
import { useApi } from '@vhvplatform/api-client';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const apiClient = useApi();

  const handleLogout = async () => {
    await dispatch(logout({ apiClient }));
    // Redirect handled automatically
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <p className="text-lg">{user?.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <p className="text-lg">{user?.name}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <p className="text-lg capitalize">{user?.role}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
```

### 6. App Routes

Edit `src/App.tsx`:

```typescript
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@vhvplatform/auth';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

export const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <LoginForm />
        } 
      />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
      />
    </Routes>
  );
};
```

### 7. Main Entry Point

Edit `src/main.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Application } from '@vhvplatform/core';
import { ApiProvider } from '@vhvplatform/api-client';
import { store } from './store';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ApiProvider baseURL="http://localhost:8080">
          <Application
            config={{
              name: 'Auth Example',
              version: '1.0.0',
            }}
            modules={[]}
          >
            <App />
          </Application>
        </ApiProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
```

## Run the App

```bash
pnpm dev
```

## Test the Flow

1. Open http://localhost:5173
2. You'll be redirected to `/login`
3. Enter credentials:
   - Email: demo@example.com
   - Password: password123
4. Click Login
5. You'll be redirected to `/dashboard`
6. Click Logout
7. You'll be redirected back to `/login`

## How It Works

### Authentication Flow

1. **User enters credentials** → LoginForm
2. **Dispatch login action** → Redux thunk
3. **API call** → Backend validates
4. **Store token** → localStorage
5. **Update Redux state** → user, isAuthenticated
6. **Redirect** → Dashboard

### Token Storage

```typescript
// Tokens stored in localStorage
localStorage.getItem('auth_token')
localStorage.getItem('refresh_token')
```

### Auto Logout

The auth slice automatically:
- Checks token expiry
- Refreshes token before expiry
- Logs out on expiry

## Advanced Features

### Remember Me

```typescript
const [rememberMe, setRememberMe] = useState(false);

await dispatch(login({ 
  apiClient, 
  credentials: { email, password },
  rememberMe  // Store token longer
}));
```

### Loading State

```typescript
const { loading } = useAuth();

if (loading) {
  return <Spinner />;
}
```

### Error Handling

```typescript
try {
  await dispatch(login({ apiClient, credentials })).unwrap();
} catch (error: any) {
  if (error.code === 'INVALID_CREDENTIALS') {
    setError('Invalid email or password');
  } else if (error.code === 'ACCOUNT_LOCKED') {
    setError('Account is locked. Contact support.');
  } else {
    setError('Login failed. Please try again.');
  }
}
```

## Common Issues

### Token not persisting
- Check localStorage permissions
- Verify token format

### Redirect loop
- Check isAuthenticated logic
- Verify route protection

### API errors
- Ensure backend is running
- Check API_URL in .env

## Next Steps

- [OAuth Integration](./auth-02-oauth.md) - Add Google/GitHub login
- [Two-Factor Auth](./auth-03-2fa.md) - Enable 2FA
- [Password Reset](./auth-05-password-reset.md) - Reset password flow

---

**Authentication working! 🔐**

Next: [OAuth Integration](./auth-02-oauth.md) →
