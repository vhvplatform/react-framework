# Parallel Module Development Guide

This guide explains how to efficiently develop multiple modules simultaneously in the SaaS Framework React.

## 🚀 Quick Start

### Auto-Discovery Setup

The framework now supports automatic module discovery, eliminating the need to manually import and register each module:

```tsx
// src/main.tsx
import { loadModulesFromGlob } from '@longvhv/core';

// Auto-discover all modules in src/modules directory
const modules = await loadModulesFromGlob(
  import.meta.glob('./modules/*/index.ts')
);

<Application modules={modules}>
  <App />
</Application>
```

### Benefits

✅ **No Manual Imports** - Create modules and they're automatically discovered
✅ **Hot Module Replacement** - Changes reload instantly without restart
✅ **Parallel Development** - Work on multiple modules simultaneously
✅ **Team Collaboration** - Multiple developers can work on different modules
✅ **Faster Iteration** - No need to modify main.tsx for each new module

## 📦 Creating Modules for Parallel Development

### 1. Create Multiple Modules

```bash
# Create modules in parallel
pnpm cli create-module dashboard
pnpm cli create-module users
pnpm cli create-module settings
pnpm cli create-module analytics
```

All modules are automatically discovered and registered!

### 2. Module Structure

Each module is self-contained:

```
src/modules/
├── dashboard/
│   ├── index.ts          # Module definition (auto-discovered)
│   ├── routes.tsx        # Routes
│   ├── components/       # Components
│   └── store/           # Redux state
├── users/
│   ├── index.ts
│   └── ...
└── analytics/
    ├── index.ts
    └── ...
```

### 3. Module Export Pattern

Modules must export a variable ending with `Module` for auto-discovery:

```tsx
// src/modules/dashboard/index.ts
import { createModule } from '@longvhv/core';

// ✅ Correct - ends with 'Module'
export const dashboardModule = createModule({
  id: 'dashboard',
  name: 'Dashboard',
  version: '1.0.0',
  // ...
});

// ✅ Also supported - default export
export default dashboardModule;

// ❌ Wrong - will not be auto-discovered
export const dashboard = createModule({ /* ... */ });
```

## 🔥 Hot Module Replacement

### Enable HMR for Modules

Modules created with the CLI automatically include HMR support:

```tsx
// Auto-generated in module index.ts
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log('Hot reloading module');
  });
}
```

### Manual HMR Setup

For custom setups:

```tsx
import { createModuleDevWrapper } from '@longvhv/core';

export const myModule = createModuleDevWrapper(
  () => createModule({
    id: 'my-module',
    // ...
  }),
  {
    hot: true,
    onReload: () => {
      console.log('Module reloaded!');
    },
  }
);
```

## 👥 Team Collaboration

### Workflow for Multiple Developers

**Developer A - Working on Dashboard:**
```bash
git checkout -b feature/dashboard-module
pnpm cli create-module dashboard
# Develop dashboard module
git commit -m "Add dashboard module"
```

**Developer B - Working on Users (simultaneously):**
```bash
git checkout -b feature/users-module
pnpm cli create-module users
# Develop users module
git commit -m "Add users module"
```

Both modules are auto-discovered - no conflicts in main.tsx!

### Merge Strategy

Since modules are auto-discovered, merging is conflict-free:

```bash
# Both branches can be merged without conflicts
git merge feature/dashboard-module
git merge feature/users-module
```

## 🛠️ Development Tools

### Module Validation

Validate module structure during development:

```tsx
import { validateModule, logModuleInfo } from '@longvhv/core';

const validation = validateModule(myModule);
if (!validation.valid) {
  console.error('Module errors:', validation.errors);
}

// Log detailed module info
logModuleInfo(myModule);
```

### Isolated Module Testing

Test modules in isolation:

```tsx
import { setupModuleDev } from '@longvhv/core';

const { module, cleanup } = setupModuleDev({
  module: dashboardModule,
  mockDependencies: {
    'auth': {
      // Mock auth module
    },
  },
  debug: true,
});

// Test your module
// ...

cleanup();
```

## ⚡ Performance Optimization

### Eager Loading

For production, load all modules at once:

```tsx
import { loadModulesEager } from '@longvhv/core';

const modules = loadModulesEager(
  import.meta.glob('./modules/*/index.ts', { eager: true })
);
```

### Lazy Loading

Load modules on-demand:

```tsx
// Load specific module when needed
const dashboardModule = await import('./modules/dashboard');
```

## 🎯 Best Practices

### 1. Module Naming Convention

- **Module ID**: lowercase-with-hyphens (e.g., `user-management`)
- **Export Name**: camelCaseModule (e.g., `userManagementModule`)
- **Component Name**: PascalCase (e.g., `UserManagement`)

### 2. Module Dependencies

Declare dependencies explicitly:

```tsx
export const dashboardModule = createModule({
  id: 'dashboard',
  name: 'Dashboard',
  dependencies: ['auth', 'analytics'], // Required modules
  // ...
});
```

### 3. Module Isolation

Keep modules independent:

```tsx
// ✅ Good - Module is self-contained
export const usersModule = createModule({
  id: 'users',
  reducer: usersReducer,
  routes: usersRoutes,
  // Everything the module needs
});

// ❌ Bad - Importing from other modules
import { dashboardHelper } from '../dashboard/helpers';
```

### 4. Shared Code

Use shared directories for common code:

```
src/
├── modules/          # Independent modules
├── shared/          # Shared utilities
│   ├── hooks/
│   ├── utils/
│   └── types/
└── components/      # Shared components
```

## 🔍 Debugging

### Debug Module Loading

Enable debug logging:

```tsx
import { loadModulesFromGlob } from '@longvhv/core';

const modules = await loadModulesFromGlob(
  import.meta.glob('./modules/*/index.ts')
);

console.log('Loaded modules:', modules.map(m => m.id));
```

### Common Issues

**Module Not Found:**
- Ensure export name ends with `Module`
- Check file path matches glob pattern
- Verify index.ts exists in module directory

**Dependency Errors:**
- Check module dependencies are registered
- Verify dependency module IDs are correct
- Use `logModuleInfo()` to inspect module

**HMR Not Working:**
- Ensure Vite dev server is running
- Check browser console for HMR errors
- Verify `import.meta.hot` is available

## 📊 Example: Complete Workflow

### 1. Setup Project

```bash
pnpm cli create-app my-saas-app
cd my-saas-app
pnpm install
```

### 2. Create Modules

```bash
# Create multiple modules
pnpm cli create-module dashboard
pnpm cli create-module users
pnpm cli create-module settings
```

### 3. Start Development

```bash
pnpm dev
```

### 4. Develop in Parallel

- Open multiple editors/terminals
- Work on different modules simultaneously
- Changes hot-reload automatically
- No need to restart or modify main.tsx

### 5. Test Integration

All modules are automatically integrated through the Application component!

## 🚀 Advanced: Custom Module Loader

Create a custom loader for specific needs:

```tsx
import { loadModules } from '@longvhv/core';

// Load modules with custom logic
const customModules = await loadModules({
  ...import.meta.glob('./modules/*/index.ts'),
  ...import.meta.glob('./plugins/*/index.ts'), // Additional sources
});

// Filter modules
const productionModules = customModules.filter(
  m => !m.config?.devOnly
);
```

## 📝 Summary

**Key Features for Parallel Development:**

1. ✅ **Auto-Discovery** - No manual imports needed
2. ✅ **Hot Reload** - Instant feedback on changes
3. ✅ **Isolated Development** - Work independently on modules
4. ✅ **Zero Configuration** - Works out of the box
5. ✅ **Team Friendly** - No merge conflicts
6. ✅ **Type Safe** - Full TypeScript support

**Workflow:**
```bash
create module → develop → hot reload → test → commit
```

No need to touch main.tsx or configure anything else!

Happy parallel development! 🎉
