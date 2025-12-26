# 🚀 Hướng Dẫn Bắt Đầu Nhanh

Bắt đầu với VHV Platform React Framework trong 5 phút.

## Điều Kiện Tiên Quyết

Đảm bảo bạn đã cài đặt:

- **Node.js** >= 18.0.0 ([Tải xuống](https://nodejs.org/))
- **pnpm** >= 8.0.0

### Cài Đặt pnpm

```bash
npm install -g pnpm
```

## Bước 1: Clone Repository

```bash
git clone https://github.com/vhvplatform/react-framework.git
cd react-framework
```

## Bước 2: Cài Đặt Dependencies

```bash
pnpm install
```

Lệnh này sẽ:

- Cài đặt tất cả dependencies cho monorepo
- Thiết lập workspaces cho tất cả các gói
- Chạy các script prepare (Husky hooks)

## Bước 3: Build Các Gói

```bash
pnpm build
```

Lệnh này sẽ build tất cả 22 gói trong workspace.

## Bước 4: Tạo Ứng Dụng Đầu Tiên

### Tùy Chọn A: Tạo Từ Đầu

```bash
# Chạy CLI tool
pnpm cli create-app my-first-app

# Làm theo các câu hỏi:
# - Tên app: my-first-app
# - Mô tả: My first SaaS application
# - Author: Your name
```

### Tùy Chọn B: Sử Dụng Template Có Sẵn

```bash
# Xem danh sách templates
pnpm cli list-templates

# Tạo app từ template
pnpm cli clone-app hello-world my-app
```

### Tùy Chọn C: Import Từ GitHub

```bash
# Import một repository làm template
pnpm cli import-app https://github.com/username/repo-name my-template

# Sau đó tạo app từ template đó
pnpm cli clone-app my-template my-new-app
```

## Bước 5: Chạy Ứng Dụng

```bash
# Điều hướng đến thư mục ứng dụng
cd apps/my-first-app  # hoặc examples/01-hello-world

# Cài đặt dependencies
pnpm install

# Khởi động development server
pnpm dev
```

Mở trình duyệt và truy cập `http://localhost:5173`

## Bước 6: Tạo Module Đầu Tiên

```bash
# Trong thư mục ứng dụng của bạn
pnpm cli create-module dashboard

# Điều này tạo ra:
# - src/modules/dashboard/
# - src/modules/dashboard/index.ts
# - src/modules/dashboard/routes.tsx
# - src/modules/dashboard/DashboardPage.tsx
```

Module sẽ tự động được phát hiện và đăng ký!

## Cấu Trúc Dự Án

```
react-framework/
├── packages/          # 22 gói framework
│   ├── core/         # Chức năng cốt lõi
│   ├── api-client/   # HTTP client
│   ├── auth/         # Xác thực
│   ├── ui-components/# UI components
│   └── ...           # Và nhiều hơn nữa
├── apps/             # Ứng dụng của bạn sẽ ở đây
├── examples/         # 8 ứng dụng mẫu
├── templates/        # Templates có thể tái sử dụng
└── docs/             # Tài liệu
```

## Lệnh Hữu Ích

### Development

```bash
# Chạy tất cả packages ở development mode
pnpm dev

# Build tất cả packages
pnpm build

# Dọn dẹp tất cả builds
pnpm clean
```

### Linting & Formatting

```bash
# Chạy ESLint
pnpm lint

# Chạy Prettier
pnpm format

# Kiểm tra formatting
pnpm format:check
```

### Testing

```bash
# Chạy tất cả tests
pnpm test

# Chạy tests với coverage
pnpm test:coverage

# Chạy tests ở chế độ watch
pnpm test:watch

# Chạy tests với UI
pnpm test:ui
```

### Type Checking

```bash
# Kiểm tra types trong tất cả packages
pnpm type-check
```

## Các Ứng Dụng Mẫu

Framework đi kèm với 8 ứng dụng mẫu:

1. **hello-world** - Ứng dụng đơn giản nhất
2. **basic-crud** - CRUD operations với API
3. **auth-jwt** - Xác thực JWT
4. **auth-oauth** - Xác thực OAuth (Google, GitHub)
5. **multi-language** - Đa ngôn ngữ (i18n)
6. **multi-tenant** - Multi-tenancy
7. **admin-dashboard** - Dashboard admin hoàn chỉnh
8. **ecommerce** - Ứng dụng e-commerce

### Chạy Ứng Dụng Mẫu

```bash
# Ví dụ: Chạy hello-world
cd examples/01-hello-world
pnpm install
pnpm dev
```

## Tích Hợp Backend

Framework được thiết kế để hoạt động với [@vhvplatform/go-framework](https://github.com/vhvplatform/go-framework).

### Cấu Hình API Client

```typescript
// src/config/api.ts
export const API_CONFIG = {
  baseURL: process.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
};
```

### Thiết Lập Biến Môi Trường

Tạo file `.env` trong thư mục ứng dụng của bạn:

```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=My SaaS App
VITE_APP_VERSION=1.0.0
```

## Các Bước Tiếp Theo

### 1. Khám Phá Các Gói

Tìm hiểu về các gói có sẵn:

- [Core Package](../packages/01-CORE.vi.md)
- [API Client](../packages/02-API-CLIENT.vi.md)
- [Authentication](../packages/03-AUTH.vi.md)
- [UI Components](../packages/04-UI-COMPONENTS.vi.md)

### 2. Tìm Hiểu Về Module System

- Module được tự động phát hiện
- Mỗi module có routes riêng của nó
- Module có thể phụ thuộc lẫn nhau
- Hot Module Replacement được hỗ trợ

### 3. Thiết Lập Xác Thực

Xem [Hướng dẫn xác thực](../packages/03-AUTH.vi.md) để thiết lập:

- JWT authentication
- OAuth (Google, GitHub)
- Protected routes
- Session management

### 4. Tạo UI Components

Sử dụng các component có sẵn hoặc tạo component riêng của bạn:

- Button, Card, Input, Spinner
- Form components
- Layout components
- Theme support (dark/light mode)

### 5. Thêm Đa Ngôn Ngữ

```typescript
import { useTranslation } from '@vhvplatform/i18n';

function MyComponent() {
  const { t, changeLanguage } = useTranslation();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button onClick={() => changeLanguage('vi')}>Tiếng Việt</button>
      <button onClick={() => changeLanguage('en')}>English</button>
    </div>
  );
}
```

## Hỗ Trợ

Cần giúp đỡ? Hãy xem:

- [Tài liệu đầy đủ](../README.vi.md)
- [Ví dụ chi tiết](../guides/EXAMPLE.vi.md)
- [GitHub Issues](https://github.com/vhvplatform/react-framework/issues)
- [GitHub Discussions](https://github.com/vhvplatform/react-framework/discussions)

## Khắc Phục Sự Cố

### Lỗi "Module not found"

```bash
# Đảm bảo tất cả packages đã được build
pnpm build

# Hoặc build package cụ thể
cd packages/your-package
pnpm build
```

### Port đã được sử dụng

```bash
# Thay đổi port trong vite.config.ts
export default defineConfig({
  server: {
    port: 3000, // Thay đổi số port này
  },
});
```

### Lỗi TypeScript

```bash
# Chạy type check để xem chi tiết
pnpm type-check

# Xóa cache và rebuild
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

## Các Tính Năng Nâng Cao

### AI Code Generation

```bash
# Thiết lập OpenAI API key
export OPENAI_API_KEY=sk-...

# Tạo code với AI
pnpm cli generate

# Cải thiện code hiện có
pnpm cli refine
```

Xem [Hướng dẫn AI Code Generation](../guides/AI_CODE_GENERATION.vi.md) để biết thêm chi tiết.

### Template System

```bash
# Tạo template từ app hiện có
pnpm cli create-template my-app my-template

# Chia sẻ template qua GitHub
# Push template lên GitHub repository của bạn

# Import template từ GitHub
pnpm cli import-app https://github.com/user/template-repo my-template
```

Xem [Hướng dẫn Template System](../guides/TEMPLATE_SYSTEM.vi.md) để biết thêm chi tiết.

### Multi-Repo Architecture

Nếu bạn muốn sử dụng kiến trúc multi-repo (mỗi app trong repository riêng):

Xem [Hướng dẫn Multi-Repo](../architecture/MULTI_REPO.vi.md) để biết thêm chi tiết.

## Kết Luận

Bạn đã sẵn sàng để bắt đầu xây dựng ứng dụng SaaS của mình! 🎉

Framework này cung cấp tất cả những gì bạn cần:

- ✅ Xác thực & Phân quyền
- ✅ UI Components
- ✅ API Integration
- ✅ Multi-tenancy
- ✅ Đa ngôn ngữ
- ✅ Testing utilities
- ✅ CI/CD ready
- ✅ Và nhiều hơn nữa!

Chúc bạn coding vui vẻ! 💻
