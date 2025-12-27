# Local Development Setup

Complete guide for setting up SaaS Framework React on your local machine.

## Prerequisites

### Required
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** 8+ (`npm install -g pnpm`)
- **Git** ([Download](https://git-scm.com/))

### Optional
- **VS Code** with ESLint, Prettier extensions
- **Docker** for backend services

## Quick Setup (Automated)

### Method 1: Unified Setup Script

```bash
# Clone repository
git clone https://github.com/vhvplatform/react-framework.git
cd react-framework

# Run automated setup
./scripts/setup.sh development
```

The script will:
✅ Check prerequisites
✅ Install dependencies
✅ Build all packages
✅ Run validation
✅ Create .env file
✅ Setup Git hooks

### Method 2: Enhanced Development Script

```bash
# Clone repository
git clone https://github.com/vhvplatform/react-framework.git
cd react-framework

# Run development setup
./scripts/setup-dev.sh

# Or with options
./scripts/setup-dev.sh --skip-build       # Skip package build
./scripts/setup-dev.sh --skip-validation  # Skip validation checks
./scripts/setup-dev.sh --help             # Show all options
```

### Method 3: Quick Exploration

For minimal installation to quickly explore the framework:

```bash
# Clone repository
git clone https://github.com/vhvplatform/react-framework.git
cd react-framework

# Quick install
./scripts/setup-quick.sh

# Then complete setup when ready
./scripts/setup.sh development
```

📖 **[Complete Installation Guide](../../INSTALLATION.md)** - All installation methods and options

## Manual Setup

### 1. Clone & Install

```bash
git clone https://github.com/vhvplatform/react-framework.git
cd react-framework
pnpm install
```

### 2. Build Packages

```bash
pnpm build  # Builds all 13 packages
```

### 3. Verify Installation

```bash
pnpm typecheck  # Type checking
pnpm lint       # Linting  
pnpm cli --help # Test CLI
```

## Development Workflow

### Start Development

```bash
# All packages with HMR
pnpm dev

# Specific package
cd packages/core && pnpm dev
```

### Create New App

```bash
pnpm cli create-app my-app
cd my-app
pnpm install
pnpm dev  # http://localhost:5173
```

### Create New Module

```bash
pnpm cli create-module dashboard
# Module auto-discovered!
```

### Build & Test

```bash
pnpm build      # Build all
pnpm test       # Run tests
pnpm lint:fix   # Fix linting
pnpm format     # Format code
```

## Configuration

### Environment Variables

Create `.env`:
```bash
NODE_ENV=development
API_URL=http://localhost:8080
PUBLIC_URL=http://localhost:5173
```

### VS Code Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Debugging

### VS Code

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug App",
      "program": "${workspaceFolder}/node_modules/.bin/vite",
      "args": ["dev"]
    }
  ]
}
```

### Browser DevTools

1. Open DevTools (F12)
2. Source maps enabled by default
3. Set breakpoints in TypeScript files

## Troubleshooting

### pnpm install fails
```bash
pnpm store prune
rm pnpm-lock.yaml
pnpm install
```

### Build errors
```bash
pnpm clean
pnpm build
```

### Port in use
```bash
lsof -ti:5173 | xargs kill -9
# Or use different port
pnpm dev --port 3000
```

## Next Steps

1. ✅ Development environment ready
2. → [Quick Start Guide](./QUICK-START.md)
3. → [Core Package](./01-CORE.md)
4. → [Best Practices](./BEST-PRACTICES.md)

## Getting Help

- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [GitHub Issues](https://github.com/vhvplatform/react-framework/issues)
- [Example Apps](../EXAMPLE.md)

---

**Ready to build! 🚀**
