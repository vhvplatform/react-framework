# 📚 Shared Library System Guide

Hệ thống thư viện dùng chung (@longvhv/shared) cung cấp utilities, hooks, types và constants được tối ưu để tái sử dụng trong toàn bộ ứng dụng SaaS.

## 📦 Tổng quan

Package **@longvhv/shared** chứa:
- **Utils** - Hàm tiện ích cho string, date, object, array, validation, format, storage
- **Hooks** - React hooks tái sử dụng (debounce, localStorage, pagination, v.v.)
- **Types** - TypeScript types và interfaces chung
- **Constants** - Hằng số cấu hình (API, routes, validation, v.v.)

## 🚀 Cài đặt & Sử dụng

### Import trong module

```tsx
// Import toàn bộ
import { capitalize, formatCurrency, useDebounce } from '@longvhv/shared';

// Import từ sub-path (tối ưu tree-shaking)
import { capitalize, truncate } from '@longvhv/shared/utils';
import { useDebounce, usePagination } from '@longvhv/shared/hooks';
import { API_CONFIG, STORAGE_KEYS } from '@longvhv/shared/constants';
import type { ApiResponse, PaginationMeta } from '@longvhv/shared/types';
```

## 🛠️ Utils - Hàm tiện ích

### String Utils

```tsx
import { 
  capitalize, 
  toTitleCase, 
  toKebabCase, 
  toCamelCase, 
  toSnakeCase, 
  truncate, 
  randomString,
  pluralize,
  getInitials 
} from '@longvhv/shared/utils';

// Examples
capitalize('hello world');        // "Hello world"
toTitleCase('hello world');       // "Hello World"
toKebabCase('HelloWorld');        // "hello-world"
toCamelCase('hello-world');       // "helloWorld"
toSnakeCase('HelloWorld');        // "hello_world"
truncate('Long text...', 10);     // "Long te..."
randomString(16);                 // "aB3cD4eF5gH6iJ7k"
pluralize('user', 5);             // "users"
getInitials('John Doe');          // "JD"
```

### Date Utils

```tsx
import { 
  formatDate, 
  getRelativeTime, 
  isToday, 
  isPast, 
  isFuture,
  addDays,
  startOfDay,
  endOfDay 
} from '@longvhv/shared/utils';

// Examples
formatDate(new Date());                    // "2024-12-24 10:30"
getRelativeTime(new Date(Date.now() - 3600000));  // "1 hour ago"
isToday(new Date());                       // true
isPast(new Date('2024-01-01'));            // true
isFuture(new Date('2025-01-01'));          // true
addDays(new Date(), 7);                    // Date 7 days from now
startOfDay(new Date());                    // Today at 00:00:00
endOfDay(new Date());                      // Today at 23:59:59
```

### Object Utils

```tsx
import { 
  deepClone, 
  deepMerge, 
  pick, 
  omit, 
  isEmpty,
  get,
  set 
} from '@longvhv/shared/utils';

// Examples
const obj = { a: 1, b: { c: 2 } };
const cloned = deepClone(obj);
const merged = deepMerge({ a: 1 }, { b: 2 });
const picked = pick(obj, ['a']);           // { a: 1 }
const omitted = omit(obj, ['b']);          // { a: 1 }
isEmpty({});                               // true
get(obj, 'b.c');                          // 2
set(obj, 'b.d', 3);                       // { a: 1, b: { c: 2, d: 3 } }
```

### Array Utils

```tsx
import { 
  unique, 
  uniqueBy, 
  groupBy, 
  sortBy, 
  chunk,
  flatten,
  sample,
  shuffle,
  range 
} from '@longvhv/shared/utils';

// Examples
unique([1, 2, 2, 3]);                     // [1, 2, 3]
uniqueBy([{id: 1}, {id: 1}], 'id');       // [{id: 1}]
groupBy([{type: 'a'}, {type: 'b'}], 'type'); // {a: [...], b: [...]}
sortBy([{age: 30}, {age: 20}], 'age');    // [{age: 20}, {age: 30}]
chunk([1, 2, 3, 4, 5], 2);                // [[1,2], [3,4], [5]]
flatten([[1, 2], [3, 4]]);                // [1, 2, 3, 4]
sample([1, 2, 3]);                        // Random item
shuffle([1, 2, 3]);                       // Random order
range(5);                                 // [0, 1, 2, 3, 4]
range(2, 5);                              // [2, 3, 4]
```

### Validation Utils

```tsx
import { 
  isValidEmail, 
  isValidPassword, 
  isValidUsername,
  isValidUrl,
  isValidPhone,
  isRequired,
  minLength,
  maxLength,
  inRange,
  getPasswordStrength 
} from '@longvhv/shared/utils';

// Examples
isValidEmail('user@example.com');          // true
isValidPassword('Abc123!@#');              // true
isValidUsername('john_doe');               // true
isValidUrl('https://example.com');         // true
isValidPhone('+1234567890');               // true
isRequired('value');                       // true
minLength('hello', 3);                     // true
maxLength('hello', 10);                    // true
inRange(5, 1, 10);                        // true
getPasswordStrength('Abc123!@#');          // { score: 6, level: 'very-strong' }
```

### Format Utils

```tsx
import { 
  formatCurrency, 
  formatNumber, 
  formatPercentage,
  formatFileSize,
  formatPhoneNumber,
  formatCompactNumber 
} from '@longvhv/shared/utils';

// Examples
formatCurrency(1234.56);                   // "$1,234.56"
formatCurrency(1234.56, 'VND', 'vi-VN');   // "1.234,56 ₫"
formatNumber(1234.567, 2);                 // "1,234.57"
formatPercentage(0.756);                   // "75.60%"
formatFileSize(1024 * 1024);               // "1 MB"
formatPhoneNumber('1234567890');           // "(123) 456-7890"
formatCompactNumber(1234567);              // "1.2M"
```

### Storage Utils

```tsx
import { storage, sessionStorage } from '@longvhv/shared/utils';

// localStorage
storage.set('user', { id: 1, name: 'John' });
const user = storage.get('user');
storage.has('user');                       // true
storage.remove('user');
storage.clear();

// sessionStorage
sessionStorage.set('temp', 'data');
const temp = sessionStorage.get('temp');
```

## 🎣 Hooks - React Hooks

### useDebounce

Delay cập nhật giá trị cho đến khi user ngừng typing:

```tsx
import { useDebounce } from '@longvhv/shared/hooks';

function SearchInput() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    // Chỉ gọi API khi user ngừng typing 500ms
    if (debouncedSearch) {
      searchAPI(debouncedSearch);
    }
  }, [debouncedSearch]);

  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
}
```

### useLocalStorage

Sync React state với localStorage:

```tsx
import { useLocalStorage } from '@longvhv/shared/hooks';

function ThemeToggle() {
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current: {theme}
    </button>
  );
}
```

### useMediaQuery

Responsive breakpoints:

```tsx
import { 
  useMediaQuery, 
  useIsMobile, 
  useIsTablet, 
  useIsDesktop 
} from '@longvhv/shared/hooks';

function ResponsiveComponent() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const isLarge = useMediaQuery('(min-width: 1440px)');

  if (isMobile) return <MobileView />;
  if (isTablet) return <TabletView />;
  return <DesktopView />;
}
```

### usePagination

Quản lý pagination logic:

```tsx
import { usePagination } from '@longvhv/shared/hooks';

function UserList({ users }: { users: User[] }) {
  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    previousPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({
    totalItems: users.length,
    itemsPerPage: 10,
  });

  const visibleUsers = users.slice(startIndex, endIndex);

  return (
    <>
      <ul>
        {visibleUsers.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>
      
      <button onClick={previousPage} disabled={!canGoPrevious}>Previous</button>
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={nextPage} disabled={!canGoNext}>Next</button>
    </>
  );
}
```

### useToggle

Toggle boolean state:

```tsx
import { useToggle } from '@longvhv/shared/hooks';

function Modal() {
  const [isOpen, toggle, setIsOpen] = useToggle(false);

  return (
    <>
      <button onClick={toggle}>Toggle Modal</button>
      {isOpen && <div>Modal Content</div>}
      <button onClick={() => setIsOpen(false)}>Force Close</button>
    </>
  );
}
```

### useAsync

Quản lý async operations:

```tsx
import { useAsync } from '@longvhv/shared/hooks';

function UserProfile({ userId }: { userId: string }) {
  const { data, loading, error, execute, reset } = useAsync(
    () => fetchUser(userId),
    true // Execute immediately
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  return (
    <>
      <div>{data.name}</div>
      <button onClick={execute}>Refresh</button>
      <button onClick={reset}>Reset</button>
    </>
  );
}
```

## 📝 Types - TypeScript Types

```tsx
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationMeta,
  QueryParams,
  SortConfig,
  FilterConfig,
  ValidationError,
  ID,
  BaseEntity,
  Timestamps,
  UserRole,
  Permission,
  LoadingState,
  ResourceState,
  ListState,
} from '@longvhv/shared/types';

// Usage examples
const response: ApiResponse<User> = await api.get('/users/1');

const users: PaginatedResponse<User[]> = await api.get('/users', {
  page: 1,
  limit: 20,
});

interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
}

interface UsersState extends ListState<User> {
  // Additional state properties
}
```

## 🎯 Constants - Hằng số

```tsx
import {
  API_CONFIG,
  STORAGE_KEYS,
  QUERY_KEYS,
  ROUTES,
  HTTP_STATUS,
  DATE_FORMATS,
  VALIDATION,
  PAGINATION,
  NOTIFICATION_DURATION,
  DEBOUNCE_DELAY,
} from '@longvhv/shared/constants';

// Examples
const timeout = API_CONFIG.DEFAULT_TIMEOUT;         // 30000
const pageSize = API_CONFIG.DEFAULT_PAGE_SIZE;      // 20

const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

if (response.status === HTTP_STATUS.UNAUTHORIZED) {
  redirectTo(ROUTES.LOGIN);
}

if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
  showError('Password too short');
}

const delay = DEBOUNCE_DELAY.SEARCH;                // 300ms
```

## 🏗️ Cấu trúc thư mục

```
packages/shared/
├── src/
│   ├── types/
│   │   └── index.ts          # Common types
│   ├── constants/
│   │   └── index.ts          # App constants
│   ├── utils/
│   │   ├── string.ts         # String utilities
│   │   ├── date.ts           # Date utilities
│   │   ├── object.ts         # Object utilities
│   │   ├── array.ts          # Array utilities
│   │   ├── validation.ts     # Validation functions
│   │   ├── format.ts         # Formatting functions
│   │   ├── storage.ts        # Storage helpers
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useDebounce.ts    # Debounce hook
│   │   ├── useLocalStorage.ts # localStorage hook
│   │   ├── useMediaQuery.ts  # Media query hook
│   │   ├── usePagination.ts  # Pagination hook
│   │   ├── useToggle.ts      # Toggle hook
│   │   ├── useAsync.ts       # Async hook
│   │   └── index.ts
│   └── index.ts              # Main export
├── package.json
└── tsconfig.json
```

## 💡 Best Practices

### 1. Import từ sub-paths cho tree-shaking

```tsx
// ✅ Good - Chỉ import những gì cần
import { capitalize } from '@longvhv/shared/utils';

// ❌ Bad - Import toàn bộ package
import shared from '@longvhv/shared';
```

### 2. Sử dụng TypeScript types

```tsx
// ✅ Good - Type-safe
import type { ApiResponse } from '@longvhv/shared/types';

function fetchUser(id: string): Promise<ApiResponse<User>> {
  // ...
}
```

### 3. Tái sử dụng constants

```tsx
// ✅ Good - Dùng constants
import { STORAGE_KEYS } from '@longvhv/shared/constants';
localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

// ❌ Bad - Hard-code strings
localStorage.setItem('saas_auth_token', token);
```

### 4. Compose utilities

```tsx
import { capitalize, truncate } from '@longvhv/shared/utils';

function formatTitle(title: string): string {
  return truncate(capitalize(title), 50);
}
```

## 🎨 Ví dụ thực tế

### Form với validation

```tsx
import { useState } from 'react';
import { isValidEmail, isRequired, getPasswordStrength } from '@longvhv/shared/utils';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!isRequired(email)) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    const strength = getPasswordStrength(password);
    if (strength.level === 'weak') {
      newErrors.password = 'Mật khẩu quá yếu';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Submit form
    }
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
```

### Search với debounce

```tsx
import { useState, useEffect } from 'react';
import { useDebounce } from '@longvhv/shared/hooks';
import { formatCompactNumber } from '@longvhv/shared/utils';

function UserSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      searchUsers(debouncedQuery).then(setResults);
    }
  }, [debouncedQuery]);

  return (
    <>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
      />
      <div>Found {formatCompactNumber(results.length)} results</div>
    </>
  );
}
```

### Responsive layout

```tsx
import { useIsMobile, useIsTablet, useIsDesktop } from '@longvhv/shared/hooks';

function Dashboard() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  return (
    <div className={`dashboard ${isMobile ? 'mobile' : ''}`}>
      {isDesktop && <Sidebar />}
      <MainContent />
      {(isTablet || isDesktop) && <RightPanel />}
    </div>
  );
}
```

## 🚀 Mở rộng thư viện

Để thêm utilities mới:

1. Tạo file trong thư mục tương ứng (`utils/`, `hooks/`, v.v.)
2. Export từ `index.ts` trong thư mục đó
3. Rebuild package: `pnpm build`

```bash
cd packages/shared
# Add new utility
echo 'export function myUtil() { }' >> src/utils/custom.ts
# Export it
echo "export * from './custom';" >> src/utils/index.ts
# Rebuild
pnpm build
```

## 📚 Tài liệu bổ sung

- [API Documentation](./API.md)
- [Type Reference](./TYPES.md)
- [Contributing Guide](../../CONTRIBUTING.md)

## ✅ Tóm tắt

Package **@longvhv/shared** cung cấp:
- ✅ 50+ utility functions
- ✅ 6+ React hooks tái sử dụng
- ✅ Comprehensive TypeScript types
- ✅ Configurable constants
- ✅ Full tree-shaking support
- ✅ Type-safe APIs
- ✅ Zero external dependencies (trừ React)

Sử dụng shared library giúp:
- 🎯 Tránh code trùng lặp
- 🚀 Tăng tốc độ phát triển
- 🔧 Dễ bảo trì
- 🎨 Consistent codebase
- 📦 Bundle size tối ưu

### useClickOutside

Phát hiện click bên ngoài element:

```tsx
import { useClickOutside } from '@longvhv/shared/hooks';
import { useRef } from 'react';

function Dropdown() {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useClickOutside(ref, () => setIsOpen(false));

  return (
    <div ref={ref}>
      <button onClick={() => setIsOpen(true)}>Open</button>
      {isOpen && <div>Dropdown Content</div>}
    </div>
  );
}
```

### useWindowSize

Track kích thước cửa sổ:

```tsx
import { useWindowSize } from '@longvhv/shared/hooks';

function WindowInfo() {
  const { width, height } = useWindowSize();

  return <div>Window: {width}x{height}</div>;
}
```

### useInterval

Declarative interval hook:

```tsx
import { useInterval } from '@longvhv/shared/hooks';

function Clock() {
  const [time, setTime] = useState(new Date());

  useInterval(() => {
    setTime(new Date());
  }, 1000); // Update every second

  return <div>{time.toLocaleTimeString()}</div>;
}
```

### usePrevious

Lưu giá trị trước đó:

```tsx
import { usePrevious } from '@longvhv/shared/hooks';

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### useCopyToClipboard

Copy text vào clipboard:

```tsx
import { useCopyToClipboard } from '@longvhv/shared/hooks';

function CopyButton({ text }: { text: string }) {
  const { copy, copied, error } = useCopyToClipboard();

  return (
    <button onClick={() => copy(text)}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
```

### useOnlineStatus

Theo dõi trạng thái online/offline:

```tsx
import { useOnlineStatus } from '@longvhv/shared/hooks';

function NetworkStatus() {
  const isOnline = useOnlineStatus();

  return (
    <div>
      Status: {isOnline ? '🟢 Online' : '🔴 Offline'}
    </div>
  );
}
```

## 🔧 Utils Bổ sung

### URL Utils

Xử lý URL và query strings:

```tsx
import { 
  buildUrl, 
  parseQueryString, 
  objectToQueryString,
  getDomain,
  isAbsoluteUrl,
  joinUrl 
} from '@longvhv/shared/utils';

// Build URL with params
const url = buildUrl('https://api.example.com/users', { page: 1, limit: 10 });
// "https://api.example.com/users?page=1&limit=10"

// Parse query string
const params = parseQueryString('?page=1&limit=10');
// { page: '1', limit: '10' }

// Object to query string
const qs = objectToQueryString({ page: 1, limit: 10 });
// "page=1&limit=10"

// Get domain
getDomain('https://example.com/path');  // "example.com"

// Check absolute URL
isAbsoluteUrl('https://example.com');  // true
isAbsoluteUrl('/path');                // false

// Join URL paths
joinUrl('https://api.com', 'v1', 'users');  // "https://api.com/v1/users"
```

### Number Utils

Xử lý số học:

```tsx
import { 
  clamp, 
  randomInt, 
  roundToDecimal, 
  toFixed,
  inRange,
  toPercentage,
  lerp,
  isEven,
  isOdd,
  sum,
  average 
} from '@longvhv/shared/utils';

// Clamp value
clamp(150, 0, 100);           // 100

// Random integer
randomInt(1, 10);             // Random 1-10

// Round to decimal
roundToDecimal(3.14159, 2);   // 3.14

// Fixed decimals (string)
toFixed(3.14159, 2);          // "3.14"

// Check range
inRange(5, 1, 10);            // true

// Percentage
toPercentage(50, 200);        // 25

// Linear interpolation
lerp(0, 100, 0.5);           // 50

// Even/Odd
isEven(4);                    // true
isOdd(5);                     // true

// Sum/Average
sum([1, 2, 3, 4, 5]);        // 15
average([1, 2, 3, 4, 5]);    // 3
```

### Color Utils

Xử lý màu sắc:

```tsx
import { 
  hexToRgb, 
  rgbToHex, 
  isValidHexColor,
  lightenColor,
  darkenColor,
  randomColor,
  getContrastColor 
} from '@longvhv/shared/utils';

// Hex to RGB
hexToRgb('#ff5733');          // { r: 255, g: 87, b: 51 }

// RGB to Hex
rgbToHex(255, 87, 51);        // "#ff5733"

// Validate hex color
isValidHexColor('#ff5733');   // true

// Lighten color
lightenColor('#ff5733', 20);  // Lighter shade

// Darken color
darkenColor('#ff5733', 20);   // Darker shade

// Random color
randomColor();                // "#a3c5e7"

// Get contrast color (black or white)
getContrastColor('#ff5733');  // "#ffffff"
```

### File Utils

Xử lý files:

```tsx
import { 
  downloadFile,
  readFileAsText,
  readFileAsDataURL,
  getFileExtension,
  getFileNameWithoutExtension,
  isImageFile,
  isVideoFile,
  isAudioFile,
  formatFileSize 
} from '@longvhv/shared/utils';

// Download file
downloadFile(blob, 'report.pdf');
downloadFile('https://example.com/file.pdf', 'file.pdf');

// Read file as text
const text = await readFileAsText(file);

// Read file as data URL (for images)
const dataUrl = await readFileAsDataURL(imageFile);

// Get file extension
getFileExtension('document.pdf');  // "pdf"

// Get name without extension
getFileNameWithoutExtension('doc.pdf');  // "doc"

// Check file types
isImageFile('photo.jpg');     // true
isVideoFile('movie.mp4');     // true
isAudioFile('song.mp3');      // true

// Format file size
formatFileSize(1024);         // "1 KB"
formatFileSize(1048576);      // "1 MB"
```

## 📊 Tổng kết Tính năng

### Utils (70+ functions)
- ✅ String: 9 functions
- ✅ Date: 8 functions
- ✅ Object: 7 functions
- ✅ Array: 10 functions
- ✅ Validation: 11 functions
- ✅ Format: 6 functions
- ✅ Storage: 2 wrappers
- ✅ URL: 6 functions (mới)
- ✅ Number: 11 functions (mới)
- ✅ Color: 7 functions (mới)
- ✅ File: 10 functions (mới)

### Hooks (12 hooks)
- ✅ useDebounce
- ✅ useLocalStorage
- ✅ useMediaQuery (+ 3 variants)
- ✅ usePagination
- ✅ useToggle
- ✅ useAsync
- ✅ useClickOutside (mới)
- ✅ useWindowSize (mới)
- ✅ useInterval (mới)
- ✅ usePrevious (mới)
- ✅ useCopyToClipboard (mới)
- ✅ useOnlineStatus (mới)

### Types & Constants
- ✅ 20+ TypeScript types
- ✅ 10+ Configuration constants

## 🎯 Best Practices

### Tree-shaking Optimization

Để tối ưu bundle size, import từ sub-paths:

```tsx
// ❌ Không tối ưu - import toàn bộ
import { capitalize } from '@longvhv/shared';

// ✅ Tối ưu - import từ sub-path
import { capitalize } from '@longvhv/shared/utils';
import { useDebounce } from '@longvhv/shared/hooks';
```

### TypeScript Integration

Sử dụng types để đảm bảo type safety:

```tsx
import type { ApiResponse, PaginationMeta } from '@longvhv/shared/types';

const response: ApiResponse<User[]> = await api.get('/users');
const meta: PaginationMeta = response.meta;
```

### Performance Tips

1. **Memo expensive computations** khi dùng với utils
2. **Debounce user inputs** với useDebounce
3. **Use proper dependencies** trong hooks
4. **Optimize re-renders** với usePrevious

## 🚀 Ready to Use

Tất cả utilities và hooks đã sẵn sàng sử dụng trong toàn bộ ứng dụng SaaS của bạn!

```bash
# Build shared library
cd packages/shared
pnpm build

# Use in your modules
import { formatCurrency, useDebounce, hexToRgb } from '@longvhv/shared';
```
