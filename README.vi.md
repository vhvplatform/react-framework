# 🚀 SaaS Framework React

[![CI](https://github.com/longvhv/saas-framework-react/actions/workflows/ci.yml/badge.svg)](https://github.com/longvhv/saas-framework-react/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Framework React + Vite toàn diện, sẵn sàng cho production để xây dựng nhiều ứng dụng SaaS. Hỗ trợ cả kiến trúc **monorepo** và **multi-repo**. Được xây dựng với các thực hành hiện đại tốt nhất, hỗ trợ TypeScript đầy đủ và công cụ cấp doanh nghiệp.

## 🌐 Ngôn Ngữ

- [English Documentation](README.md)
- **Tiếng Việt** (Tài liệu này)

## 🎯 Tùy Chọn Kiến Trúc

### Monorepo (Mặc định)

Làm việc trên nhiều ứng dụng trong một repository duy nhất với các gói được chia sẻ. Lý tưởng cho:

- Các nhóm nhỏ đến trung bình
- Tích hợp chặt chẽ giữa các ứng dụng
- Phát triển và tạo nguyên mẫu nhanh chóng

### Multi-Repo (Mới!)

Mỗi ứng dụng nằm trong repository riêng của nó, sử dụng các gói framework qua npm. Hoàn hảo cho:

- Các nhóm và tổ chức lớn
- Triển khai ứng dụng độc lập
- Ứng dụng dành riêng cho khách hàng
- Kiểm soát truy cập và bảo mật tốt hơn

[📖 Hướng Dẫn Kiến Trúc Multi-Repo →](docs/architecture/MULTI_REPO.vi.md)

## ✨ Tính Năng Chính

### 🏗️ Kiến Trúc & Phát Triển

- **Hỗ trợ Multi-Repo** - Tạo ứng dụng độc lập sử dụng các gói framework qua npm (MỚI!)
- **Kiến Trúc Module** - Xây dựng ứng dụng với các module độc lập, có thể tái sử dụng
- **Tự Động Phát Hiện** - Các module được tự động phát hiện và đăng ký
- **Hot Module Replacement** - Tải lại ngay lập tức mà không cần khởi động lại ứng dụng
- **Phát Triển Song Song** - Nhiều lập trình viên có thể làm việc đồng thời trên các module khác nhau
- **Cấu Trúc Monorepo** - Quản lý gói hiệu quả với pnpm workspaces
- **TypeScript Đầy Đủ** - An toàn về kiểu dữ liệu từ đầu đến cuối trên tất cả các gói

### 🎨 UI & Giao Diện

- **UI Components** - Các component Tailwind CSS có sẵn (Button, Card, Input, Spinner)
- **Chế Độ Sáng/Tối** - Quản lý giao diện tích hợp với hỗ trợ tùy chọn hệ thống
- **Thiết Kế Responsive** - Các component mobile-first, dễ tiếp cận
- **Thông Báo Toast** - Thông báo đẹp mắt với react-hot-toast

### 🔐 Xác Thực & Bảo Mật

- **Xác Thực JWT** - Xác thực an toàn dựa trên token
- **Hỗ Trợ OAuth** - Tích hợp OAuth với Google và GitHub
- **Protected Routes** - Bảo vệ route cho các trang yêu cầu xác thực
- **Session Persistence** - Tự động làm mới và lưu trữ token

### 🌐 API & Quản Lý Dữ Liệu

- **HTTP Client** - Client dựa trên Axios với interceptors
- **React Query** - Quản lý trạng thái server với caching
- **Optimistic Updates** - Cập nhật UI ngay lập tức trước khi có phản hồi từ server
- **Xử Lý Lỗi** - Quản lý lỗi tập trung và logic thử lại

### 🏢 Multi-Tenancy

- **Tenant Context** - Quản lý hoàn chỉnh tenant, user và site
- **Feature Flags** - Bật/tắt tính năng cho từng tenant
- **Usage Limits** - Quản lý và theo dõi hạn mức sử dụng
- **Role-Based Access** - Hệ thống phân quyền theo cấp bậc

### 🛠️ Trải Nghiệm Lập Trình Viên

- **Công Cụ CLI** - Tạo ứng dụng và module tương tác
- **AI Code Generator** - Tạo code React, Flutter và Go bằng AI (OpenAI, GitHub Copilot, hoặc Gemini)
- **Hệ Thống Template** - Import ứng dụng từ GitHub và tạo template có thể tái sử dụng
- **Testing Utilities** - Vitest, Testing Library và các helper tùy chỉnh
- **ESLint + Prettier** - Định dạng code nhất quán
- **Husky Hooks** - Kiểm tra và xác thực trước khi commit
- **Conventional Commits** - Tiêu chuẩn commit message được thực thi
- **Changesets** - Quản lý phiên bản tự động

### 🚀 CI/CD

- **GitHub Actions** - Tự động testing, linting và type checking
- **Automated Releases** - Versioning và publishing dựa trên changeset
- **Code Coverage** - Tích hợp Codecov
- **Build Artifacts** - Tự động tạo và lưu trữ artifacts

### 📦 Tính Năng Bổ Sung

- **Xử Lý Form** - React Hook Form với xác thực Zod
- **CRUD Operations** - CRUD đầy đủ tính năng với hooks và tables
- **Caching** - Các adapter cho RAM, browser và Redis
- **Đa Ngôn Ngữ** - Hỗ trợ đa ngôn ngữ (Tiếng Việt, English, +4 ngôn ngữ khác)
- **Xử Lý Media** - Tiện ích cho hình ảnh, video, Excel và PDF
- **Vietnamese Utils** - Xử lý và xác thực văn bản tiếng Việt

## 📦 Các Gói (22 Tổng Số)

### Gói Cốt Lõi

#### @vhvplatform/core

- Quản lý vòng đời ứng dụng
- Registry module với giải quyết dependencies
- Tích hợp Redux store
- Tích hợp React Router
- Hệ thống tự động phát hiện
- Hỗ trợ Hot Module Replacement

#### @vhvplatform/api-client

- Client dựa trên Axios với interceptors
- Xử lý JWT token tự động
- Chuyển đổi Request/Response
- Xử lý lỗi và chuyển hướng 401

#### @vhvplatform/auth

- Redux slice cho auth state
- Xác thực JWT
- Hỗ trợ OAuth (Google, GitHub)
- Các component Login/Logout
- Component protected route
- Hook useAuth

#### @vhvplatform/ui-components

- Thư viện component Tailwind CSS
- Button (primary, secondary, danger variants)
- Card (với header và footer)
- Input (với label và xử lý lỗi)
- Spinner (loading indicator)

### Các Gói Production-Ready Mới

#### @vhvplatform/testing

- Tiện ích và helper testing
- Thiết lập Vitest với browser mocks
- Custom render của Testing Library
- Generators dữ liệu test

#### @vhvplatform/theme

- Quản lý theme dark/light
- Hook useTheme
- Component ThemeProvider
- Lưu trữ và đồng bộ preferences

#### @vhvplatform/query

- Wrapper React Query
- Cấu hình mặc định cho caching
- Helper cho mutations và queries
- Optimistic updates

#### @vhvplatform/i18n

- Hệ thống i18n đầy đủ
- 6 ngôn ngữ được hỗ trợ (VI, EN, FR, DE, ES, JA)
- 200+ chuỗi được dịch
- Chuyển đổi ngôn ngữ động

#### @vhvplatform/context

- Quản lý context đa cấp độ
- Tenant context provider
- User context provider
- Site context provider

#### @vhvplatform/cache

- Hệ thống caching linh hoạt
- RAM cache adapter
- Browser cache adapter
- Giao diện Redis-ready

#### @vhvplatform/forms

- Quản lý form nâng cao
- Tích hợp React Hook Form
- Xác thực với Zod
- Xử lý lỗi tích hợp

#### @vhvplatform/crud

- Các hook CRUD operations
- Tích hợp bảng
- Phân trang và sắp xếp
- Tìm kiếm và lọc

#### @vhvplatform/media

- Xử lý hình ảnh (resize, crop)
- Xử lý video
- Đọc/ghi Excel
- Render PDF

#### @vhvplatform/vietnamese

- Tiện ích tiếng Việt
- Xác thực số điện thoại
- Định dạng tiền tệ (VND)
- Xử lý văn bản tiếng Việt

#### @vhvplatform/notifications

- Hệ thống thông báo
- Toast notifications
- Push notifications
- Email notifications

#### @vhvplatform/cli

- Công cụ CLI
- Tạo ứng dụng
- Tạo module
- Import/Export templates

#### @vhvplatform/create-app

- Template dự án
- Thiết lập Vite
- Cấu hình TypeScript
- Thiết lập ESLint/Prettier

#### @vhvplatform/shared

- Tiện ích dùng chung
- Helper functions
- Type definitions
- Constants

#### @vhvplatform/config

- Quản lý cấu hình
- Biến môi trường
- Cấu hình ứng dụng
- Feature flags

#### @vhvplatform/templates

- Quản lý template
- Import từ GitHub
- Tạo apps từ templates
- Registry templates

#### @vhvplatform/app-adapter

- Adapter cho các apps
- Import động
- Hot reload
- Cô lập module

#### @vhvplatform/ai-codegen

- AI code generation
- Tích hợp OpenAI
- Hỗ trợ GitHub Copilot
- Tạo React/Flutter/Go code

## 🚀 Bắt Đầu Nhanh

### Điều Kiện Tiên Quyết

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Cài Đặt

```bash
# Clone repository
git clone https://github.com/vhvplatform/react-framework.git
cd react-framework

# Cài đặt dependencies
pnpm install

# Build tất cả các gói
pnpm build

# Chạy development mode
pnpm dev
```

### Tạo Ứng Dụng Đầu Tiên

#### Tùy Chọn 1: Từ Đầu

```bash
# Tạo ứng dụng mới
pnpm cli create-app my-app

# Điều hướng đến app
cd apps/my-app

# Cài đặt dependencies
pnpm install

# Khởi động development server
pnpm dev
```

#### Tùy Chọn 2: Từ Template

```bash
# Liệt kê các template có sẵn
pnpm cli list-templates

# Tạo app từ template
pnpm cli clone-app integration-portal my-portal

# Điều hướng và chạy
cd my-portal
pnpm install
pnpm dev
```

#### Tùy Chọn 3: Import từ GitHub

```bash
# Import một repository làm template
pnpm cli import-app https://github.com/username/repo my-template

# Tạo app từ template đã import
pnpm cli clone-app my-template my-app
```

#### Tùy Chọn 4: Tạo Bằng AI

```bash
# Thiết lập OpenAI API key
export OPENAI_API_KEY=sk-...

# Tạo code mới bằng AI
pnpm cli generate

# Cải thiện/nâng cấp code hiện có
pnpm cli refine

# Làm theo hướng dẫn để:
# - Tạo React components/pages
# - Tạo Flutter widgets/screens
# - Tạo Go API endpoints
# - Tạo ứng dụng full-stack
# - Cải thiện và nâng cao code hiện có
```

Xem [Bắt Đầu Nhanh Với Template](./docs/guides/TEMPLATE_QUICK_START.vi.md) và [Hướng Dẫn Tạo Code Bằng AI](./docs/guides/AI_CODE_GENERATION.vi.md) để biết thêm chi tiết.

### Tạo Module

```bash
# Bên trong thư mục app của bạn
pnpm cli create-module dashboard

# Điều này tạo ra:
# - src/modules/dashboard/
# - src/modules/dashboard/routes.tsx
# - src/modules/dashboard/index.ts
# - src/modules/dashboard/DashboardPage.tsx
```

## 📚 Tài Liệu

📚 **[Tài Liệu Đầy Đủ](./docs/README.vi.md)** - Duyệt tất cả tài liệu được tổ chức theo chủ đề

### Hướng Dẫn Bắt Đầu Nhanh

- [Bắt Đầu Nhanh](./docs/setup/QUICK-START.vi.md) - Bắt đầu trong 5 phút
- [Thiết Lập Môi Trường Phát Triển](./docs/setup/SETUP-DEV.vi.md) - Thiết lập môi trường dev của bạn
- [Thiết Lập Docker](./docs/setup/SETUP-DOCKER.vi.md) - Chạy với Docker
- [Thiết Lập Server](./docs/setup/SETUP-SERVER.vi.md) - Triển khai lên production

### Hướng Dẫn & Tutorials

- [Tạo Code Bằng AI](./docs/guides/AI_CODE_GENERATION.vi.md) - Tạo code với AI
- [Bắt Đầu Nhanh Với Template](./docs/guides/TEMPLATE_QUICK_START.vi.md) - Tạo template có thể tái sử dụng
- [Hướng Dẫn Hệ Thống Template](./docs/guides/TEMPLATE_SYSTEM.vi.md) - Tính năng template nâng cao
- [Thiết Lập Storybook](./docs/guides/STORYBOOK_SETUP.vi.md) - Phát triển component với Storybook

### Kiến Trúc & Triển Khai

- **[Hướng Dẫn Phát Triển Microservices](./docs/architecture/MICROSERVICES_DEVELOPER_GUIDE.vi.md)** - Hướng dẫn đầy đủ về microservices trên Kubernetes
- [Kiến Trúc Multi-Repo](./docs/architecture/MULTI_REPO.vi.md) - Triển khai apps trong các repository riêng biệt
- [Tóm Tắt Triển Khai](./docs/architecture/IMPLEMENTATION_SUMMARY.vi.md) - Tổng quan triển khai framework
- [Phát Triển Song Song](./docs/architecture/PARALLEL_DEVELOPMENT.vi.md) - Chiến lược cộng tác nhóm

### Tài Liệu Gói

- [Tổng Quan Framework](./docs/packages/00-OVERVIEW.vi.md) - Tổng quan kiến trúc và các gói
- [Gói Core](./docs/packages/01-CORE.vi.md) - Chức năng cốt lõi của framework
- [API Client](./docs/packages/02-API-CLIENT.vi.md) - HTTP client và tích hợp API
- [Xác Thực](./docs/packages/03-AUTH.vi.md) - Xác thực JWT và OAuth
- [UI Components](./docs/packages/04-UI-COMPONENTS.vi.md) - Các component React có sẵn
- [Tiện Ích Dùng Chung](./docs/packages/05-SHARED.vi.md) - Tiện ích và helper dùng chung
- [Công Cụ CLI](./docs/packages/06-CLI.vi.md) - Giao diện dòng lệnh

Mỗi gói cũng bao gồm README riêng với hướng dẫn cài đặt, tham khảo API, ví dụ sử dụng và định nghĩa kiểu.

## 🛡️ Bảo Mật

- Quản lý JWT token với tự động làm mới
- Lưu trữ an toàn (khuyến nghị httpOnly cookies)
- CSRF protection ready
- Tích hợp OAuth
- Kiểm soát truy cập dựa trên vai trò
- Xác thực đầu vào với Zod

## ⚡ Hiệu Năng

- Các gói có thể tree-shake
- Hỗ trợ code splitting
- Lazy loading
- React Query caching
- Optimistic UI updates
- Tiện ích memoization

## 🧪 Testing

```bash
# Chạy tất cả tests
pnpm test

# Chạy tests ở chế độ watch
pnpm test:watch

# Chạy tests với UI
pnpm test:ui

# Tạo coverage report
pnpm test:coverage
```

## 🐛 Khắc Phục Sự Cố

### Vấn Đề Build

```bash
# Dọn dẹp tất cả builds
pnpm clean

# Cài đặt lại dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Rebuild packages
pnpm build
```

### Lỗi Kiểu

```bash
# Chạy type check
pnpm type-check

# Kiểm tra gói cụ thể
cd packages/your-package
pnpm type-check
```

### Test Failures

```bash
# Chạy tests ở chế độ watch
pnpm test:watch

# Chạy file test cụ thể
pnpm test path/to/test.test.ts
```

## 🤝 Đóng Góp

Chúng tôi hoan nghênh các đóng góp! Vui lòng xem [Hướng Dẫn Đóng Góp](./docs/contributing/CONTRIBUTING.vi.md) của chúng tôi để biết thêm chi tiết.

## 📄 Giấy Phép

MIT © vhvplatform

## 💬 Hỗ Trợ

- 📧 Email: support@vhvplatform.com
- 🐛 Issues: [GitHub Issues](https://github.com/vhvplatform/react-framework/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/vhvplatform/react-framework/discussions)

## 🙏 Cảm Ơn

Cảm ơn tất cả các [contributors](https://github.com/vhvplatform/react-framework/graphs/contributors) đã giúp dự án này tốt hơn!
