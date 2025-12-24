# Examples & Use Cases

Comprehensive examples for every package and common scenarios.

## 📚 Examples by Category

### Getting Started
- [Hello World App](./examples/01-hello-world.md) - Simplest possible app
- [Basic CRUD App](./examples/02-basic-crud.md) - Simple user management
- [Multi-language App](./examples/03-multilingual.md) - 6 language support

### Authentication & Authorization
- [JWT Authentication](./examples/auth-01-jwt.md) - Basic login/logout
- [OAuth Integration](./examples/auth-02-oauth.md) - Google, GitHub login
- [Two-Factor Auth](./examples/auth-03-2fa.md) - Enable 2FA
- [Session Management](./examples/auth-04-sessions.md) - Multi-device sessions
- [Password Reset](./examples/auth-05-password-reset.md) - Complete flow
- [Email Verification](./examples/auth-06-email-verify.md) - Email confirmation

### Multi-Tenant & RBAC
- [Multi-Tenant Setup](./examples/tenant-01-setup.md) - Tenant context
- [Role-Based Access](./examples/tenant-02-rbac.md) - Admin, user, guest roles
- [Feature Flags](./examples/tenant-03-features.md) - Enable/disable features
- [Usage Limits](./examples/tenant-04-limits.md) - API quotas, storage limits
- [Tenant Switching](./examples/tenant-05-switching.md) - Switch between tenants

### CRUD Operations
- [User Management](./examples/crud-01-users.md) - Complete user CRUD
- [Product Catalog](./examples/crud-02-products.md) - E-commerce products
- [Data Table](./examples/crud-03-table.md) - Advanced table with sorting
- [Form Validation](./examples/crud-04-validation.md) - Complex validation
- [Bulk Operations](./examples/crud-05-bulk.md) - Multi-select actions

### UI Components
- [Modal Dialog](./examples/ui-01-modal.md) - Confirmation dialogs
- [Toast Notifications](./examples/ui-02-toast.md) - Success, error messages
- [Data Table](./examples/ui-03-table.md) - Sortable, filterable table
- [Forms](./examples/ui-04-forms.md) - Complete forms with validation
- [Dropdown Menu](./examples/ui-05-dropdown.md) - Custom dropdowns

### Internationalization
- [Basic i18n](./examples/i18n-01-basic.md) - Setup translations
- [Dynamic Language](./examples/i18n-02-dynamic.md) - Runtime language switch
- [Custom Translations](./examples/i18n-03-custom.md) - Add your translations
- [Date & Currency](./examples/i18n-04-formatting.md) - Format by locale

### API Integration
- [API Calls](./examples/api-01-basic.md) - GET, POST, PUT, DELETE
- [File Upload](./examples/api-02-upload.md) - Upload with progress
- [Request Retry](./examples/api-03-retry.md) - Auto-retry failed requests
- [Request Cache](./examples/api-04-cache.md) - Cache API responses
- [GraphQL](./examples/api-05-graphql.md) - GraphQL queries
- [Batch Requests](./examples/api-06-batch.md) - Multiple requests at once

### Caching
- [Memory Cache](./examples/cache-01-memory.md) - RAM cache
- [Browser Cache](./examples/cache-02-browser.md) - localStorage cache
- [API Response Cache](./examples/cache-03-api.md) - Cache API data

### Media Processing
- [Image Upload](./examples/media-01-image.md) - Upload and resize
- [Video Thumbnail](./examples/media-02-video.md) - Extract video poster
- [Excel Export](./examples/media-03-excel.md) - Export data to Excel
- [PDF Generation](./examples/media-04-pdf.md) - Generate PDF reports

### Vietnamese Support
- [Vietnamese Text](./examples/vn-01-text.md) - Process Vietnamese text
- [Phone Validation](./examples/vn-02-validation.md) - Vietnamese phone
- [Currency Format](./examples/vn-03-currency.md) - VND formatting

### Advanced Patterns
- [Module Lazy Loading](./examples/adv-01-lazy.md) - Load modules on-demand
- [Code Splitting](./examples/adv-02-splitting.md) - Optimize bundle size
- [Error Boundaries](./examples/adv-03-errors.md) - Error handling
- [Performance](./examples/adv-04-performance.md) - Optimization tips
- [Testing](./examples/adv-05-testing.md) - Unit & integration tests

### Full Applications
- [Admin Dashboard](./examples/app-01-admin.md) - Complete admin panel
- [E-commerce](./examples/app-02-ecommerce.md) - Product catalog & cart
- [Blog Platform](./examples/app-03-blog.md) - CMS with posts
- [SaaS Boilerplate](./examples/app-04-saas.md) - Multi-tenant SaaS

## 🎯 Examples by Package

### @longvhv/core
- Module registration and lifecycle
- Dynamic module loading
- Module events and hooks
- Redux integration

### @longvhv/api-client  
- HTTP requests with retry
- File upload with progress
- Request caching
- GraphQL integration

### @longvhv/auth
- Login/logout flows
- OAuth integration
- 2FA setup
- Session management

### @longvhv/ui-components
- All 16 components with variants
- Form patterns
- Layout patterns
- Accessibility examples

### @longvhv/shared
- 70+ utility functions
- 12 React hooks
- Common patterns

### @longvhv/i18n
- Multi-language setup
- Custom translations
- Locale formatting

### @longvhv/crud
- Complete CRUD patterns
- Table with sorting/filtering
- Form validation

### @longvhv/cache
- Multi-layer caching
- Cache strategies
- TTL management

### @longvhv/context
- Multi-tenant setup
- RBAC implementation
- Feature flags

### @longvhv/forms
- Form validation
- Async validation
- Complex forms

### @longvhv/media
- Image processing
- Video handling
- Excel/PDF generation

### @longvhv/vietnamese
- Text processing
- Validation
- Formatting

## 📖 How to Use Examples

Each example includes:
- ✅ Complete working code
- ✅ Step-by-step explanation
- ✅ Common pitfalls
- ✅ Best practices
- ✅ Related examples

### Running Examples

```bash
# Clone repository
git clone https://github.com/longvhv/saas-framework-react.git
cd saas-framework-react

# Install dependencies
pnpm install
pnpm build

# Run example
pnpm cli create-app example-app
cd example-app
# Copy example code from docs
pnpm dev
```

## 🎓 Learning Path

### Beginner
1. [Hello World](./examples/01-hello-world.md)
2. [Basic CRUD](./examples/02-basic-crud.md)
3. [Authentication](./examples/auth-01-jwt.md)

### Intermediate
1. [Multi-language](./examples/03-multilingual.md)
2. [RBAC](./examples/tenant-02-rbac.md)
3. [Advanced CRUD](./examples/crud-03-table.md)

### Advanced
1. [Multi-Tenant SaaS](./examples/tenant-01-setup.md)
2. [Module System](./examples/adv-01-lazy.md)
3. [Full Application](./examples/app-04-saas.md)

---

**Start learning:** [Hello World Example](./examples/01-hello-world.md) →
