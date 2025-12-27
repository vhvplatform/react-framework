# Quick Start Guide

Get started with SaaS Framework React in 5 minutes.

## 1. Setup (2 minutes)

### Automated Setup (Recommended)

```bash
# Clone & setup in one command
git clone https://github.com/vhvplatform/react-framework.git
cd react-framework
./scripts/setup.sh development
```

### Manual Setup

```bash
# Clone & install
git clone https://github.com/vhvplatform/react-framework.git
cd react-framework
pnpm install
pnpm build
```

### Verify Installation

```bash
# Run verification script
./scripts/verify-installation.sh
```

📖 **[Complete Installation Guide](../../INSTALLATION.md)** - Multiple installation methods and troubleshooting

## 2. Create App (1 minute)

```bash
# Generate new app
pnpm cli create-app my-app

# Follow prompts:
# - App name: my-app
# - API URL: http://localhost:8080
# - Enable auth: Yes
# - Enable OAuth: No (for now)
```

## 3. Run App (30 seconds)

```bash
cd my-app
pnpm install
pnpm dev
```

Open http://localhost:5173

## 4. Add Features (90 seconds)

### Add Dashboard Module

```bash
# Inside my-app directory
pnpm cli create-module dashboard
```

The CLI creates:
- ✅ Module structure
- ✅ Routes automatically configured
- ✅ Hot reload enabled
- ✅ TypeScript types

### Add Multi-language

```typescript
// src/main.tsx
import { I18nProvider } from '@vhvplatform/i18n';

<I18nProvider config={{ defaultLanguage: 'vi' }}>
  <Application modules={modules}>
    <App />
  </Application>
</I18nProvider>
```

### Add Authentication

```typescript
// src/App.tsx
import { useAuth } from '@vhvplatform/auth';

function App() {
  const { user, login, logout } = useAuth();
  
  if (!user) {
    return <LoginForm onLogin={login} />;
  }
  
  return <Dashboard user={user} onLogout={logout} />;
}
```

## Next Steps

- 📖 [Core Package](./01-CORE.md) - Learn modules
- 🔐 [Auth Package](./03-AUTH.md) - Add 2FA, OAuth
- 🌍 [I18n Package](./07-I18N.md) - Add more languages
- 📊 [CRUD Package](./08-CRUD.md) - Build data tables

## Common Patterns

### Data Fetching with CRUD

```typescript
import { useCrud, CrudTable } from '@vhvplatform/crud';

function Users() {
  const crud = useCrud({ resource: 'users', autoFetch: true });
  
  return <CrudTable data={crud.items} loading={crud.loading} />;
}
```

### Role-Based Access

```typescript
import { useRoles } from '@vhvplatform/context';

function AdminPanel() {
  const { isAdmin } = useRoles();
  
  if (!isAdmin()) return <AccessDenied />;
  
  return <AdminContent />;
}
```

---

**You're ready to build! 🚀**

Explore more: [Documentation](./00-OVERVIEW.md)
