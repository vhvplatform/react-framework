# SaaS Framework React - Example Applications

Complete, runnable example applications demonstrating all framework features.

## 📦 Examples

### 01. Hello World
**Path:** `01-hello-world/`
**Description:** Simplest possible application
**Features:**
- Minimal setup
- Tailwind CSS styling
- Module system ready
- Perfect starting point

**Run:**
```bash
cd 01-hello-world
pnpm install
pnpm dev
```

### 02. Basic CRUD
**Path:** `02-basic-crud/`
**Description:** Complete CRUD operations
**Features:**
- User management (Create, Read, Update, Delete)
- Data table with sorting
- Modal dialogs
- Real-time updates

**Run:**
```bash
cd 02-basic-crud
pnpm install
pnpm dev
```

**Backend Required:** See backend setup below

### 03. JWT Authentication
**Path:** `03-auth-jwt/`
**Description:** JWT authentication system
**Features:**
- Login/logout flows
- Protected routes
- Token storage & refresh
- Session persistence

**Run:**
```bash
cd 03-auth-jwt
pnpm install
pnpm dev
```

**Demo Credentials:**
- Email: demo@example.com
- Password: password123

### 04. OAuth Authentication
**Path:** `04-auth-oauth/`
**Description:** OAuth integration (Google, GitHub)
**Features:**
- Social login buttons
- OAuth flow handling
- Account linking
- Multi-provider support

### 05. Multi-Language
**Path:** `05-multi-language/`
**Description:** 6-language support
**Features:**
- Vietnamese, English, Spanish, Chinese, Japanese, Korean
- Language switcher
- Auto-detection
- 720+ translations

### 06. Multi-Tenant SaaS
**Path:** `06-multi-tenant/`
**Description:** Complete multi-tenant application
**Features:**
- Tenant context
- Role-based access control (RBAC)
- Feature flags
- Usage limits
- Tenant switching

### 07. Admin Dashboard
**Path:** `07-admin-dashboard/`
**Description:** Full-featured admin panel
**Features:**
- User management
- Analytics dashboard
- Settings panel
- Activity logs

### 08. E-commerce Platform
**Path:** `08-ecommerce/`
**Description:** E-commerce application
**Features:**
- Product catalog
- Shopping cart
- Checkout process
- Order management

## 🚀 Quick Start

### Prerequisites

```bash
# Ensure you're in the monorepo root
cd /path/to/react-framework

# Build all packages first
pnpm install
pnpm build
```

### Run an Example

```bash
# Navigate to example
cd examples/01-hello-world

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open http://localhost:5173

## 🔧 Backend Setup

Some examples require the backend API:

```bash
# Clone backend repository
git clone https://github.com/vhvplatform/go-framework.git
cd go-framework

# Start with Docker
docker-compose up -d

# API runs on http://localhost:8080
```

## 📁 Example Structure

Each example follows this structure:

```
example-name/
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite config
├── tailwind.config.js    # Tailwind config
├── index.html            # HTML template
├── README.md             # Example documentation
└── src/
    ├── main.tsx          # Entry point
    ├── App.tsx           # Main component
    ├── index.css         # Global styles
    ├── components/       # Components
    ├── pages/            # Page components
    └── store.ts          # Redux store (if needed)
```

## 💡 Features by Example

| Example | Auth | CRUD | i18n | Multi-Tenant | UI Components |
|---------|------|------|------|--------------|---------------|
| 01-hello-world | ❌ | ❌ | ❌ | ❌ | Basic |
| 02-basic-crud | ❌ | ✅ | ❌ | ❌ | Table, Modal |
| 03-auth-jwt | ✅ | ❌ | ❌ | ❌ | Forms |
| 04-auth-oauth | ✅ | ❌ | ❌ | ❌ | OAuth Buttons |
| 05-multi-language | ❌ | ❌ | ✅ | ❌ | Switcher |
| 06-multi-tenant | ✅ | ✅ | ✅ | ✅ | All |
| 07-admin-dashboard | ✅ | ✅ | ✅ | ✅ | Advanced |
| 08-ecommerce | ✅ | ✅ | ✅ | ❌ | Product UI |

## 🎓 Learning Path

### Beginner
1. Start with `01-hello-world` - Understand basic setup
2. Try `02-basic-crud` - Learn CRUD operations
3. Add auth with `03-auth-jwt` - Implement authentication

### Intermediate
1. `05-multi-language` - Add internationalization
2. `04-auth-oauth` - Social login
3. `06-multi-tenant` - Multi-tenant architecture

### Advanced
1. `07-admin-dashboard` - Build complete admin panel
2. `08-ecommerce` - Full application
3. Combine features for your own app

## 🔗 Related Documentation

- [Setup Guide](../docs/SETUP-DEV.md) - Development environment setup
- [Quick Start](../docs/QUICK-START.md) - 5-minute guide
- [Package Docs](../docs/00-OVERVIEW.md) - Complete API reference
- [Best Practices](../docs/BEST-PRACTICES.md) - Recommended patterns

## 🐛 Troubleshooting

### Example won't start

```bash
# Rebuild packages
cd ../.. # Go to monorepo root
pnpm build

# Try example again
cd examples/01-hello-world
pnpm install
pnpm dev
```

### Backend connection errors

Ensure backend is running:
```bash
cd path/to/go-framework
docker-compose ps
```

### Module not found errors

Install all dependencies:
```bash
# In monorepo root
pnpm install
pnpm build
```

## 🤝 Contributing

Want to add an example? See [CONTRIBUTING.md](../CONTRIBUTING.md)

## 📄 License

MIT License - See [LICENSE](../LICENSE)

---

**Start building:** Pick an example and run it! 🚀
