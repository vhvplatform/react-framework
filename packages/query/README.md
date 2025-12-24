# @longvhv/query

React Query integration for server state management in the SaaS Framework.

## Features

- 🔄 **Data Fetching** - Simplified data fetching with caching
- 🔀 **Mutations** - Easy create, update, delete operations
- ⚡ **Optimistic Updates** - Instant UI updates before server response
- 📄 **Pagination** - Built-in pagination support
- 🔍 **Search & Filter** - Query key helpers for search and filtering
- 🎣 **Hooks** - Convenient hooks for common patterns
- 📦 **Pre-configured** - Sensible defaults out of the box

## Installation

```bash
pnpm add @longvhv/query @tanstack/react-query
```

## Usage

### Setup Query Provider

```tsx
import { QueryProvider } from '@longvhv/query';

function App() {
  return (
    <QueryProvider>
      <YourApp />
    </QueryProvider>
  );
}
```

### Fetch Data

```tsx
import { useFetch } from '@longvhv/query';
import { api } from '@longvhv/api-client';

function UserList() {
  const { data, isLoading, error } = useFetch(
    'users',
    () => api.get('/users')
  );
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Mutations

```tsx
import { useMutate, useInvalidateQueries } from '@longvhv/query';
import { api } from '@longvhv/api-client';

function CreateUser() {
  const invalidate = useInvalidateQueries();
  
  const { mutate, isPending } = useMutate(
    (data) => api.post('/users', data),
    {
      onSuccess: () => {
        invalidate('users');
      },
    }
  );
  
  const handleSubmit = (data) => {
    mutate(data);
  };
  
  return <UserForm onSubmit={handleSubmit} loading={isPending} />;
}
```

### Optimistic Updates

```tsx
import { useOptimisticMutation } from '@longvhv/query';
import { api } from '@longvhv/api-client';

function UpdateUser() {
  const { mutate } = useOptimisticMutation(
    (data) => api.put(`/users/${data.id}`, data),
    ['users', data.id]
  );
  
  const handleUpdate = (updates) => {
    mutate(updates);
  };
  
  return <UserForm onSubmit={handleUpdate} />;
}
```

### Pagination

```tsx
import { useFetch, paginationKey } from '@longvhv/query';
import { api } from '@longvhv/api-client';

function PaginatedList() {
  const [page, setPage] = useState(1);
  const perPage = 10;
  
  const { data, isLoading } = useFetch(
    paginationKey('users', { page, perPage }),
    () => api.get('/users', { params: { page, perPage } })
  );
  
  return (
    <>
      <List data={data?.data} />
      <Pagination
        currentPage={page}
        totalPages={data?.totalPages}
        onPageChange={setPage}
      />
    </>
  );
}
```

### Search & Filter

```tsx
import { useFetch, filterKey, searchKey } from '@longvhv/query';

function SearchableList() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'active' });
  
  const { data } = useFetch(
    combineKeys('users', searchKey('users', search), filterKey('users', filters)),
    () => api.get('/users', { params: { search, ...filters } })
  );
  
  return (
    <>
      <SearchInput value={search} onChange={setSearch} />
      <FilterSelect value={filters} onChange={setFilters} />
      <List data={data} />
    </>
  );
}
```

### Prefetch Data

```tsx
import { usePrefetch } from '@longvhv/query';

function UserCard({ userId }) {
  const prefetch = usePrefetch();
  
  const handleMouseEnter = () => {
    prefetch(['users', userId], () => api.get(`/users/${userId}`));
  };
  
  return (
    <div onMouseEnter={handleMouseEnter}>
      <Link to={`/users/${userId}`}>View User</Link>
    </div>
  );
}
```

## API Reference

### QueryProvider

```tsx
<QueryProvider client={customQueryClient}>
  {children}
</QueryProvider>
```

### Hooks

#### useFetch
```tsx
const { data, isLoading, error, refetch } = useFetch(
  key,
  fetchFunction,
  variables?,
  options?
);
```

#### useMutate
```tsx
const { mutate, mutateAsync, isPending, error } = useMutate(
  mutationFunction,
  options?
);
```

#### useOptimisticMutation
```tsx
const { mutate, isPending } = useOptimisticMutation(
  mutationFunction,
  queryKey,
  options?
);
```

#### useInvalidateQueries
```tsx
const invalidate = useInvalidateQueries();
invalidate('users'); // or ['users', userId]
```

#### usePrefetch
```tsx
const prefetch = usePrefetch();
await prefetch('users', fetchFunction);
```

### Query Key Helpers

- `paginationKey(baseKey, { page, perPage })` - Build pagination key
- `filterKey(baseKey, filters)` - Build filter key
- `searchKey(baseKey, searchTerm)` - Build search key
- `combineKeys(...keys)` - Combine multiple keys

## Configuration

### Custom Query Client

```tsx
import { QueryClient, QueryProvider } from '@longvhv/query';

const customQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 3,
    },
  },
});

<QueryProvider client={customQueryClient}>
  <App />
</QueryProvider>
```

## Best Practices

1. **Use descriptive query keys** - Make keys readable and consistent
2. **Invalidate on mutations** - Always invalidate related queries after mutations
3. **Use optimistic updates** - For better UX on updates
4. **Prefetch on hover** - Improve perceived performance
5. **Handle errors** - Always handle loading and error states
