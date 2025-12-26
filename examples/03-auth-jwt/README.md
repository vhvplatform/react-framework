# Example 03: JWT Authentication

Complete JWT authentication with login, logout, and protected routes.

## Features

- ✅ JWT token authentication
- ✅ Login form with validation
- ✅ Protected routes
- ✅ Auto token refresh
- ✅ Session persistence
- ✅ Automatic redirect

## Run

```bash
cd 03-auth-jwt
pnpm install
pnpm dev
```

## Backend Required

```bash
# Start backend API
cd ../go-framework
docker-compose up -d
```

## Demo Credentials

- Email: `demo@example.com`
- Password: `password123`

## Authentication Flow

1. User enters credentials
2. API validates and returns JWT token
3. Token stored in localStorage
4. User redirected to dashboard
5. All API requests include token
6. Auto-refresh before expiry
7. Logout clears token

## Code Structure

```
src/
├── main.tsx                 # Entry with providers
├── store.ts                 # Redux with auth
├── App.tsx                  # Routes
├── components/
│   └── ProtectedRoute.tsx  # Route guard
└── pages/
    ├── LoginPage.tsx       # Login form
    └── DashboardPage.tsx   # Protected dashboard
```

## Key Concepts

### Login
```typescript
await dispatch(login({ 
  apiClient, 
  credentials: { email, password } 
})).unwrap();
```

### Protected Routes
```typescript
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

### Auto Logout
- Token expiry checked automatically
- Refreshed before expiry
- Logout on invalid token

## Next Steps

- Add OAuth (example 04)
- Add 2FA (see docs)
- Add password reset
