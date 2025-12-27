# Installation Guide

Complete installation guide for SaaS Framework React with multiple setup methods to suit different use cases.

## Table of Contents

- [Quick Install](#quick-install)
- [Installation Methods](#installation-methods)
  - [Method 1: Automated Setup (Recommended)](#method-1-automated-setup-recommended)
  - [Method 2: Development Setup](#method-2-development-setup)
  - [Method 3: Production Server Setup](#method-3-production-server-setup)
  - [Method 4: Manual Installation](#method-4-manual-installation)
  - [Method 5: Docker Installation](#method-5-docker-installation)
- [Installation Presets](#installation-presets)
- [Post-Installation](#post-installation)
- [Troubleshooting](#troubleshooting)

## Quick Install

For the fastest setup experience:

```bash
# Clone repository
git clone https://github.com/vhvplatform/react-framework.git
cd react-framework

# Run automated setup
chmod +x scripts/setup.sh
./scripts/setup.sh development

# Verify installation
./scripts/verify-installation.sh

# Start development
pnpm dev
```

## Installation Methods

### Method 1: Automated Setup (Recommended)

The unified setup script provides three installation modes:

#### Quick Mode
Minimal installation for exploring the framework:

```bash
./scripts/setup.sh quick
```

**What it does:**
- ✓ Checks prerequisites (Node.js, pnpm)
- ✓ Installs production dependencies only
- ✓ Creates basic environment file
- ⊘ Skips build and validation

**Use when:**
- You want to quickly explore the framework
- You need minimal installation footprint
- You're in a CI/CD environment

#### Development Mode
Complete development environment:

```bash
./scripts/setup.sh development
```

**What it does:**
- ✓ Checks prerequisites
- ✓ Installs all dependencies (dev + prod)
- ✓ Builds all packages
- ✓ Creates development environment file
- ✓ Sets up Git hooks
- ✓ Runs validation checks

**Use when:**
- You're contributing to the framework
- You need full development features
- You want to create custom applications

#### Production Mode
Optimized build for deployment:

```bash
./scripts/setup.sh production
```

**What it does:**
- ✓ Checks prerequisites
- ✓ Installs dependencies
- ✓ Builds with production optimizations
- ✓ Creates production environment file
- ✓ Runs validation checks
- ⊘ Skips Git hooks setup

**Use when:**
- You're preparing for production deployment
- You need optimized builds
- You're setting up a staging environment

### Method 2: Development Setup

Enhanced development setup with additional options:

```bash
# Standard development setup
./scripts/setup-dev.sh

# Skip build step (if packages already built)
./scripts/setup-dev.sh --skip-build

# Skip validation (for faster setup)
./scripts/setup-dev.sh --skip-validation

# View help
./scripts/setup-dev.sh --help
```

**Features:**
- ✓ Detailed progress output
- ✓ Automatic prerequisite checking
- ✓ Disk space validation
- ✓ Git hooks configuration
- ✓ Development tools setup

### Method 3: Production Server Setup

For deploying to a production server (Ubuntu/Debian):

```bash
# Full server setup (requires root)
sudo ./scripts/setup-server.sh

# Customize installation
sudo ./scripts/setup-server.sh --no-nginx    # Skip Nginx
sudo ./scripts/setup-server.sh --no-pm2     # Skip PM2
sudo ./scripts/setup-server.sh --no-certbot # Skip Certbot

# Skip confirmation prompts
sudo ./scripts/setup-server.sh --skip-confirm

# View help
./scripts/setup-server.sh --help
```

**What it installs:**
- ✓ Node.js 18.x
- ✓ pnpm package manager
- ✓ Nginx web server (optional)
- ✓ PM2 process manager (optional)
- ✓ Certbot for SSL/TLS (optional)
- ✓ UFW firewall configuration
- ✓ Deployment directory structure
- ✓ Configuration templates

**Features:**
- ✓ OS detection and validation
- ✓ Modular installation options
- ✓ Automatic firewall configuration
- ✓ Ready-to-use configuration templates
- ✓ PM2 ecosystem file
- ✓ Nginx site configuration

### Method 4: Manual Installation

For custom or step-by-step installation:

#### Prerequisites

```bash
# Check versions
node --version   # Should be ≥18.0.0
pnpm --version   # Should be ≥8.0.0
git --version    # Recommended
```

#### Step-by-Step

```bash
# 1. Clone repository
git clone https://github.com/vhvplatform/react-framework.git
cd react-framework

# 2. Install pnpm (if not installed)
npm install -g pnpm

# 3. Install dependencies
pnpm install

# 4. Build packages
pnpm build

# 5. Create environment file
cat > .env << 'EOF'
NODE_ENV=development
VITE_API_URL=http://localhost:8080
PUBLIC_URL=http://localhost:5173
LOG_LEVEL=debug
EOF

# 6. Verify installation
./scripts/verify-installation.sh

# 7. Setup Git hooks (optional)
pnpm prepare

# 8. Run validation
pnpm type-check
pnpm lint
```

### Method 5: Docker Installation

For containerized development or deployment:

#### Development with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f react-framework

# Stop services
docker-compose down
```

#### Production Docker Build

```bash
# Build image
docker build -t react-framework:latest .

# Run container
docker run -d \
  --name react-framework \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e VITE_API_URL=https://api.example.com \
  react-framework:latest

# View logs
docker logs -f react-framework
```

#### Kubernetes Deployment

```bash
# Apply manifests
kubectl apply -f k8s/

# Or use Helm
helm install react-framework ./helm/react-framework

# Check status
kubectl get pods -l app=react-framework
```

## Installation Presets

### Preset 1: Quick Start (5 minutes)

For new users who want to get started quickly:

```bash
git clone https://github.com/vhvplatform/react-framework.git
cd react-framework
./scripts/setup.sh quick
pnpm build
pnpm dev
```

### Preset 2: Full Development (10 minutes)

For contributors and developers:

```bash
git clone https://github.com/vhvplatform/react-framework.git
cd react-framework
./scripts/setup-dev.sh
pnpm dev
```

### Preset 3: Production Server (15 minutes)

For server deployment:

```bash
# On server
sudo ./scripts/setup-server.sh

# In deployment directory
cd /var/www/react-framework
git clone YOUR_REPO .
pnpm install
pnpm build

# Configure and start
pm2 start ecosystem.config.js
sudo systemctl reload nginx
```

### Preset 4: Docker Development (5 minutes)

For containerized development:

```bash
git clone https://github.com/vhvplatform/react-framework.git
cd react-framework
docker-compose up -d
```

### Preset 5: Kubernetes Production (20 minutes)

For microservices deployment:

```bash
# Build and push image
docker build -t your-registry/react-framework:v1.0.0 .
docker push your-registry/react-framework:v1.0.0

# Deploy to Kubernetes
kubectl create namespace production
helm install react-framework ./helm/react-framework \
  --namespace production \
  --values ./helm/react-framework/values-prod.yaml

# Verify deployment
kubectl get pods -n production
```

## Post-Installation

### Verify Installation

Run the verification script:

```bash
./scripts/verify-installation.sh
```

This checks:
- ✓ System requirements (Node.js, pnpm)
- ✓ Dependencies installation
- ✓ Package builds
- ✓ Configuration files
- ✓ Project structure
- ✓ Optional tools

### First Steps

After successful installation:

#### 1. Create Your First App

```bash
# Using CLI
pnpm cli create-app my-app

# Navigate to app
cd my-app

# Install dependencies
pnpm install

# Start development
pnpm dev
```

#### 2. Create a Module

```bash
# Inside your app directory
pnpm cli create-module dashboard
```

#### 3. Explore Examples

```bash
# View example applications
ls examples/

# Run an example
cd examples/basic-app
pnpm install
pnpm dev
```

#### 4. Run Tests

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run in watch mode
pnpm test:watch
```

### Configuration

#### Environment Variables

Edit `.env` file to customize:

```bash
# Development
NODE_ENV=development
VITE_API_URL=http://localhost:8080
PUBLIC_URL=http://localhost:5173
LOG_LEVEL=debug

# Production
NODE_ENV=production
VITE_API_URL=https://api.example.com
PUBLIC_URL=https://example.com
LOG_LEVEL=error
```

#### VS Code Setup

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Troubleshooting

### Common Issues

#### 1. pnpm install fails

```bash
# Clear cache and retry
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### 2. Build errors

```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm build
```

#### 3. Port already in use

```bash
# Find and kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
pnpm dev --port 3000
```

#### 4. TypeScript errors

```bash
# Check types
pnpm type-check

# Check specific package
cd packages/core
pnpm type-check
```

#### 5. Git hooks not working

```bash
# Reinstall hooks
pnpm prepare

# Check Husky installation
ls -la .husky/
```

#### 6. Permission denied on scripts

```bash
# Make scripts executable
chmod +x scripts/*.sh
```

#### 7. Node version mismatch

```bash
# Install correct Node.js version
# Using nvm (recommended)
nvm install 18
nvm use 18

# Or download from https://nodejs.org/
```

#### 8. Disk space issues

```bash
# Check disk space
df -h

# Clean pnpm cache
pnpm store prune

# Remove build artifacts
pnpm clean
```

### Getting Help

If you encounter issues:

1. **Check Documentation**
   - [Quick Start Guide](docs/setup/QUICK-START.md)
   - [Development Setup](docs/setup/SETUP-DEV.md)
   - [Troubleshooting Guide](docs/setup/TROUBLESHOOTING.md)

2. **Run Diagnostics**
   ```bash
   ./scripts/verify-installation.sh
   ```

3. **Search Issues**
   - [GitHub Issues](https://github.com/vhvplatform/react-framework/issues)
   - [Discussions](https://github.com/vhvplatform/react-framework/discussions)

4. **Create Issue**
   - Include output from `./scripts/verify-installation.sh`
   - Include error messages
   - Include system information (OS, Node version, etc.)

### System Requirements

**Minimum:**
- Node.js 18.0.0 or higher
- pnpm 8.0.0 or higher
- 2GB RAM
- 1GB free disk space

**Recommended:**
- Node.js 20.x (LTS)
- pnpm 8.x or higher
- 4GB+ RAM
- 5GB+ free disk space
- Git 2.x
- VS Code with extensions

**For Production:**
- Node.js 18.x or 20.x (LTS)
- 4GB+ RAM
- 10GB+ free disk space
- Nginx or similar reverse proxy
- PM2 or similar process manager
- SSL/TLS certificate

## Next Steps

After successful installation:

1. **Learn the Framework**
   - [Framework Overview](docs/packages/00-OVERVIEW.md)
   - [Core Package](docs/packages/01-CORE.md)
   - [Architecture Guide](docs/architecture/IMPLEMENTATION_SUMMARY.md)

2. **Build Your App**
   - [Create Your First App](docs/setup/QUICK-START.md)
   - [Template System](docs/guides/TEMPLATE_SYSTEM.md)
   - [AI Code Generation](docs/guides/AI_CODE_GENERATION.md)

3. **Deploy**
   - [Deployment Guide](DEPLOYMENT.md)
   - [Docker Setup](docs/setup/SETUP-DOCKER.md)
   - [Kubernetes Guide](docs/architecture/MICROSERVICES_DEVELOPER_GUIDE.md)

4. **Contribute**
   - [Contributing Guide](CONTRIBUTING.md)
   - [Development Workflow](docs/architecture/PARALLEL_DEVELOPMENT.md)

---

**Need immediate help?**
- 📧 Email: support@example.com
- 💬 [GitHub Discussions](https://github.com/vhvplatform/react-framework/discussions)
- 🐛 [Report Bug](https://github.com/vhvplatform/react-framework/issues/new)
