# Example 02: Basic CRUD

Complete CRUD operations with data table.

## Features

- ✅ User management (Create, Read, Update, Delete)
- ✅ Data table with sorting
- ✅ Modal dialog for forms
- ✅ Real-time data updates
- ✅ Loading states

## Run

```bash
cd 02-basic-crud
pnpm install
pnpm dev
```

## Backend Required

This example needs the backend API running:

```bash
# In another terminal
git clone https://github.com/vhvplatform/go-framework.git
cd go-framework
docker-compose up -d
```

API runs on http://localhost:8080

## Code Structure

```
src/
├── main.tsx    # Entry point with providers
├── store.ts    # Redux store
├── App.tsx     # Main CRUD component
└── index.css   # Styles
```

## Key Concepts

### useCrud Hook
```typescript
const crud = useCrud<User>({ 
  resource: 'users',
  autoFetch: true,
});

// CRUD operations
crud.fetchAll();
crud.create(data);
crud.update(id, data);
crud.remove(id);
```

### CrudTable Component
```typescript
<CrudTable
  data={items}
  loading={loading}
  config={{ columns, actions }}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

## Next Steps

- Add authentication (example 03)
- Add multi-language (example 05)
- Add advanced filtering (example 07)
