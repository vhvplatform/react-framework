# Example: Hello World App

The simplest possible SaaS Framework React application.

## Goal

Create a minimal app that:
- ✅ Uses the core framework
- ✅ Displays "Hello World"
- ✅ Has basic routing
- ✅ Takes 5 minutes

## Step 1: Create App

```bash
pnpm cli create-app hello-world
cd hello-world
pnpm install
```

## Step 2: Main Application File

Edit `src/main.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Application } from '@longvhv/core';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

// App component
function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Hello World! 👋
        </h1>
        <p className="text-gray-600">
          Welcome to SaaS Framework React
        </p>
      </div>
    </div>
  );
}

// Bootstrap application
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Application 
        config={{ 
          name: 'Hello World App',
          version: '1.0.0'
        }}
        modules={[]}
      >
        <App />
      </Application>
    </BrowserRouter>
  </React.StrictMode>
);
```

## Step 3: Run

```bash
pnpm dev
```

Open http://localhost:5173

You should see "Hello World! 👋"

## What's Happening?

1. **Application Component** wraps your app and provides:
   - Redux store
   - Module registry
   - Routing context

2. **No modules** - Empty array for now

3. **Tailwind CSS** - Used for styling

## Next Steps

### Add a Module

Create a home module:

```bash
pnpm cli create-module home
```

This generates:
```
src/modules/home/
  ├── index.ts
  ├── Home.tsx
  └── routes.tsx
```

### Update main.tsx

```typescript
import { loadModulesFromGlob } from '@longvhv/core';

// Auto-load modules
const modules = await loadModulesFromGlob(
  import.meta.glob('./modules/*/index.ts')
);

<Application modules={modules}>
  <App />
</Application>
```

### Module will render automatically!

The framework will:
1. Discover the module
2. Register its routes
3. Render on navigation

## Common Issues

### "Module not found"
- Run `pnpm build` first
- Check import paths

### Styles not working
- Ensure Tailwind is configured
- Check `tailwind.config.js`

### Port in use
```bash
pnpm dev --port 3000
```

## Variations

### With TypeScript strict mode

```typescript
// src/main.tsx
import type { FC } from 'react';

const App: FC = () => {
  return (
    <div className="...">
      <h1>Hello World! 👋</h1>
    </div>
  );
};
```

### With Props

```typescript
interface AppProps {
  title: string;
}

const App: FC<AppProps> = ({ title }) => {
  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
};

// Usage
<App title="Hello World! 👋" />
```

## Related Examples

- [Basic CRUD App](./02-basic-crud.md) - Add data management
- [Multi-language App](./03-multilingual.md) - Add i18n
- [Authentication](./auth-01-jwt.md) - Add login

---

**Congratulations! Your first app is running! 🎉**

Next: [Basic CRUD App](./02-basic-crud.md) →
