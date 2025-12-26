# 🤝 Hướng Dẫn Đóng Góp

Cảm ơn bạn đã quan tâm đến việc đóng góp cho VHV Platform React Framework! Chúng tôi đánh giá cao mọi đóng góp từ cộng đồng.

## 🌐 Ngôn Ngữ

- [English](CONTRIBUTING.md)
- **Tiếng Việt** (Tài liệu này)

## 📋 Mục Lục

- [Code of Conduct](#code-of-conduct)
- [Bắt Đầu](#bắt-đầu)
- [Quy Trình Phát Triển](#quy-trình-phát-triển)
- [Quy Tắc Commit](#quy-tắc-commit)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Tài Liệu](#tài-liệu)

## Code of Conduct

Dự án này tuân theo Code of Conduct. Bằng việc tham gia, bạn đồng ý tuân thủ các quy tắc này. Vui lòng báo cáo hành vi không chấp nhận được cho team maintainers.

## Bắt Đầu

### 1. Fork Repository

Nhấp vào nút "Fork" ở góc trên bên phải của trang repository.

### 2. Clone Fork Của Bạn

```bash
git clone https://github.com/YOUR-USERNAME/react-framework.git
cd react-framework
```

### 3. Thêm Upstream Remote

```bash
git remote add upstream https://github.com/vhvplatform/react-framework.git
```

### 4. Cài Đặt Dependencies

```bash
pnpm install
```

### 5. Tạo Branch

```bash
git checkout -b feature/ten-tinh-nang-cua-ban
```

## Quy Trình Phát Triển

### 1. Giữ Fork Của Bạn Cập Nhật

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### 2. Thực Hiện Thay Đổi

- Viết code của bạn
- Tuân thủ coding standards
- Thêm tests nếu cần thiết
- Cập nhật tài liệu

### 3. Chạy Tests

```bash
# Chạy tất cả tests
pnpm test

# Chạy linter
pnpm lint

# Chạy type check
pnpm type-check

# Kiểm tra formatting
pnpm format:check
```

### 4. Build Project

```bash
pnpm build
```

Đảm bảo tất cả packages build thành công.

### 5. Commit Thay Đổi

```bash
git add .
git commit -m "feat: thêm tính năng mới"
```

Xem [Quy Tắc Commit](#quy-tắc-commit) để biết format commit message.

### 6. Push Lên Fork

```bash
git push origin feature/ten-tinh-nang-cua-ban
```

### 7. Tạo Pull Request

Truy cập repository GitHub và tạo Pull Request từ branch của bạn đến branch `main` của upstream repository.

## Quy Tắc Commit

Chúng tôi sử dụng [Conventional Commits](https://www.conventionalcommits.org/) cho commit messages.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: Tính năng mới
- **fix**: Sửa lỗi
- **docs**: Chỉ thay đổi tài liệu
- **style**: Thay đổi không ảnh hưởng đến ý nghĩa của code (white-space, formatting, v.v.)
- **refactor**: Thay đổi code không phải fix bug hay thêm feature
- **perf**: Thay đổi code cải thiện hiệu năng
- **test**: Thêm tests hoặc sửa tests hiện có
- **build**: Thay đổi ảnh hưởng đến build system hoặc dependencies
- **ci**: Thay đổi CI configuration files và scripts
- **chore**: Thay đổi khác không sửa src hoặc test files
- **revert**: Revert commit trước đó

### Scope

Scope có thể là tên package hoặc feature:

- `core`
- `auth`
- `api-client`
- `ui-components`
- `docs`
- v.v.

### Examples

```bash
# Tính năng mới
git commit -m "feat(auth): thêm OAuth Google authentication"

# Sửa lỗi
git commit -m "fix(api-client): sửa lỗi timeout trong request"

# Tài liệu
git commit -m "docs(readme): cập nhật hướng dẫn cài đặt"

# Refactor
git commit -m "refactor(core): tối ưu hóa module discovery"

# Breaking change
git commit -m "feat(auth)!: thay đổi API authentication

BREAKING CHANGE: phương thức login hiện yêu cầu tham số email thay vì username"
```

### Commit Message Guidelines

- Sử dụng thì hiện tại ("add feature" không phải "added feature")
- Sử dụng chữ thường cho subject
- Không kết thúc subject bằng dấu chấm
- Subject không quá 72 ký tự
- Tách subject và body bằng một dòng trống
- Body giải thích "what" và "why", không phải "how"

## Pull Request Process

### 1. Trước Khi Submit PR

- [ ] Code của bạn tuân thủ coding standards
- [ ] Tất cả tests pass
- [ ] Bạn đã thêm tests cho tính năng mới
- [ ] Bạn đã cập nhật tài liệu
- [ ] Commit messages tuân theo conventional commits
- [ ] Branch của bạn được rebase với main mới nhất

### 2. PR Description

Pull request của bạn nên bao gồm:

- **Mô tả rõ ràng** về thay đổi
- **Lý do** cho thay đổi
- **Liên kết** đến related issues
- **Screenshots** (nếu có thay đổi UI)
- **Breaking changes** (nếu có)

### 3. PR Template

```markdown
## Mô Tả

Mô tả ngắn gọn về thay đổi của bạn.

## Loại Thay Đổi

- [ ] Bug fix
- [ ] Tính năng mới
- [ ] Breaking change
- [ ] Cập nhật tài liệu

## Động Cơ và Context

Tại sao thay đổi này cần thiết? Nó giải quyết vấn đề gì?

Fixes #(issue number)

## Làm Thế Nào Để Test?

Mô tả các bước để test thay đổi của bạn.

## Screenshots (nếu có)

Thêm screenshots nếu có thay đổi UI.

## Checklist

- [ ] Code của tôi tuân thủ coding standards
- [ ] Tôi đã review code của mình
- [ ] Tôi đã comment code, đặc biệt ở các phần khó hiểu
- [ ] Tôi đã cập nhật tài liệu
- [ ] Thay đổi của tôi không tạo ra warnings mới
- [ ] Tôi đã thêm tests cho thay đổi của mình
- [ ] Tất cả tests (mới và cũ) đều pass
```

### 4. Code Review

- Maintainers sẽ review PR của bạn
- Giải quyết các comments và suggestions
- Push các updates lên branch của bạn
- PR sẽ được merge khi được approve

## Coding Standards

### TypeScript

- Sử dụng TypeScript cho tất cả code
- Tránh sử dụng `any`, sử dụng `unknown` nếu cần
- Định nghĩa types cho tất cả function parameters và return values
- Sử dụng interfaces cho object types
- Sử dụng enums cho constants

```typescript
// ✅ Tốt
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ Không tốt
function getUser(id: any): any {
  // ...
}
```

### React

- Sử dụng functional components và hooks
- Sử dụng TypeScript với React
- Tránh inline styles, sử dụng Tailwind CSS
- Sử dụng proper prop types

```typescript
// ✅ Tốt
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', onClick, children }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};

// ❌ Không tốt
export const Button = (props: any) => {
  return <button style={{ color: 'blue' }}>{props.children}</button>;
};
```

### Naming Conventions

- **Files**: `kebab-case.ts`, `PascalCase.tsx` (components)
- **Variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`
- **Functions**: `camelCase`
- **Components**: `PascalCase`

```typescript
// Files
// button.ts
// Button.tsx
// use-auth.ts

// Variables và Functions
const userName = 'John';
function getUserName() {}

// Constants
const API_URL = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;

// Types và Interfaces
interface UserProfile {}
type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

// Components
const UserProfile = () => {};
```

### Code Organization

- Một component mỗi file
- Group related files trong folders
- Sử dụng index files để export
- Tách business logic khỏi UI components

```
packages/auth/
├── src/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   ├── LoginForm.test.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-auth.test.ts
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   └── index.ts
```

### Comments

- Viết comments cho complex logic
- Sử dụng JSDoc cho public APIs
- Tránh obvious comments

```typescript
// ✅ Tốt - Giải thích complex logic
/**
 * Tính toán score dựa trên nhiều factors.
 * Score = (base * multiplier) + bonus - penalty
 */
function calculateScore(base: number, multiplier: number): number {
  // ...
}

// ❌ Không tốt - Obvious comment
// Set user name
const userName = 'John';
```

## Testing

### Unit Tests

- Viết unit tests cho tất cả business logic
- Aim for 80%+ code coverage
- Sử dụng descriptive test names

```typescript
import { describe, it, expect } from 'vitest';
import { calculateScore } from './score';

describe('calculateScore', () => {
  it('should return correct score for positive values', () => {
    expect(calculateScore(10, 2)).toBe(20);
  });

  it('should handle zero values', () => {
    expect(calculateScore(0, 5)).toBe(0);
  });

  it('should handle negative multipliers', () => {
    expect(calculateScore(10, -1)).toBe(-10);
  });
});
```

### Component Tests

- Test component behavior, không phải implementation
- Sử dụng Testing Library
- Test user interactions

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### Integration Tests

- Test workflows hoàn chỉnh
- Test tương tác giữa các components
- Sử dụng realistic test data

## Tài Liệu

### Khi Nào Cập Nhật Tài Liệu

Cập nhật tài liệu khi:

- Thêm tính năng mới
- Thay đổi API
- Sửa bugs đáng kể
- Cải thiện performance
- Thay đổi cách sử dụng

### Types Tài Liệu

1. **README**: Tổng quan và hướng dẫn cài đặt
2. **API Docs**: API reference và examples
3. **Guides**: Tutorials và best practices
4. **Code Comments**: Inline documentation

### Viết Tài Liệu Tốt

- Rõ ràng và ngắn gọn
- Cung cấp examples
- Bao gồm cả "why" và "how"
- Giữ tài liệu cập nhật
- Viết bằng cả tiếng Việt và tiếng Anh

## Báo Lỗi

### Trước Khi Tạo Issue

- Tìm kiếm existing issues
- Đảm bảo bạn đang sử dụng phiên bản mới nhất
- Xác định vấn đề có thể reproduce

### Tạo Bug Report

Bao gồm:

- **Mô tả rõ ràng** về bug
- **Các bước để reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (nếu có)
- **Environment details** (OS, Node version, v.v.)
- **Possible solution** (nếu bạn có)

## Đề Xuất Tính Năng

### Trước Khi Đề Xuất

- Tìm kiếm existing feature requests
- Đảm bảo tính năng phù hợp với scope của project
- Cân nhắc cost/benefit

### Tạo Feature Request

Bao gồm:

- **Use case** rõ ràng
- **Proposed solution**
- **Alternatives considered**
- **Possible implementation** (nếu bạn có)

## Câu Hỏi

Có câu hỏi? Bạn có thể:

- Mở discussion trên GitHub
- Tham gia community chat
- Email maintainers

## License

Bằng việc đóng góp, bạn đồng ý rằng contributions của bạn sẽ được cấp phép theo MIT License.

## Cảm Ơn!

Cảm ơn bạn đã dành thời gian đóng góp! 🎉

Mọi đóng góp, dù lớn hay nhỏ, đều được đánh giá cao và giúp làm cho project này tốt hơn cho mọi người.
