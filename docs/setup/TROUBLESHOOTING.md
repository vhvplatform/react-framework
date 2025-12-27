# Troubleshooting Guide

Common issues and solutions for SaaS Framework React installation and development.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Build Issues](#build-issues)
- [Development Issues](#development-issues)
- [Testing Issues](#testing-issues)
- [Deployment Issues](#deployment-issues)
- [Performance Issues](#performance-issues)

## Installation Issues

### Node.js Version Mismatch

**Problem:** Getting "Node.js version not supported" error

**Solution:**

```bash
# Check current version
node --version

# Install correct version using nvm (recommended)
# Verify script URL from official nvm GitHub: https://github.com/nvm-sh/nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Or download from https://nodejs.org/
```

### pnpm Not Found

**Problem:** `pnpm: command not found`

**Solution:**

```bash
# Install pnpm globally
npm install -g pnpm

# Or use npm scripts that handle pnpm
npx pnpm install
```

### Dependencies Installation Fails

**Problem:** `pnpm install` fails with errors

**Solution:**

```bash
# Clear cache and retry
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install

# If still failing, check disk space
df -h

# Try with legacy peer deps
pnpm install --legacy-peer-deps
```

### Permission Denied Errors

**Problem:** EACCES or permission denied errors during installation

**Solution:**

```bash
# For npm/pnpm global packages
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) ~/.pnpm

# For scripts
chmod +x scripts/*.sh

# Avoid using sudo with npm/pnpm
# Use nvm instead for managing Node.js
```

### Slow Installation

**Problem:** Installation takes too long

**Solution:**

```bash
# Use faster network
# Check if behind proxy/firewall

# Use quick mode for minimal installation
./scripts/setup.sh quick

# Or install production dependencies only
pnpm install --prod

# Use pnpm's parallel installation
pnpm install --prefer-offline
```

## Build Issues

### Build Fails with Type Errors

**Problem:** `pnpm build` fails with TypeScript errors

**Solution:**

```bash
# Check all type errors
pnpm type-check

# Build specific package to isolate issue
cd packages/core
pnpm build

# Clear TypeScript cache
rm -rf packages/*/dist
rm -rf packages/*/tsconfig.tsbuildinfo
pnpm build

# Update TypeScript
pnpm add -D typescript@latest
```

### Build Fails with Out of Memory

**Problem:** Build crashes with "JavaScript heap out of memory"

**Solution:**

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm build

# Or add to package.json scripts
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' pnpm -r build"
  }
}

# Build packages sequentially instead of parallel
pnpm -r --workspace-concurrency=1 build
```

### Incomplete Builds

**Problem:** Some packages not building

**Solution:**

```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm build

# Check build order (dependencies)
pnpm -r list

# Build specific package
cd packages/your-package
pnpm build

# Check for circular dependencies
pnpm list --depth=Infinity | grep -E "circular"
```

### Vite Build Issues

**Problem:** Vite build fails or produces errors

**Solution:**

```bash
# Clear Vite cache
rm -rf node_modules/.vite
rm -rf packages/**/node_modules/.vite

# Check vite.config.ts
# Ensure all plugins are compatible

# Update Vite and plugins
pnpm add -D vite@latest @vitejs/plugin-react@latest

# Try building with verbose logging
pnpm build --debug
```

## Development Issues

### Port Already in Use

**Problem:** "Port 5173 is already in use"

**Solution:**

```bash
# Find and kill process
lsof -ti:5173 | xargs kill -9

# Or use different port
pnpm dev --port 3000

# Or set in vite.config.ts
export default defineConfig({
  server: { port: 3000 }
});
```

### Hot Module Replacement Not Working

**Problem:** Changes not reflected in browser

**Solution:**

```bash
# Check if files are being watched
# Ensure not too many files (inotify limit on Linux)

# Increase watch limit (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
pnpm dev
```

### Module Not Found Errors

**Problem:** "Cannot find module '@vhvplatform/...'"

**Solution:**

```bash
# Ensure packages are built
pnpm build

# Check package.json exports
cat packages/your-package/package.json

# Reinstall dependencies
rm -rf node_modules
pnpm install

# Check TypeScript path mappings in tsconfig.json
```

### Git Hooks Failing

**Problem:** Commit blocked by pre-commit hook

**Solution:**

```bash
# Fix issues reported by hooks
pnpm lint:fix
pnpm format

# Temporarily skip hooks (not recommended)
git commit --no-verify

# Reinstall hooks
pnpm prepare
rm -rf .husky
pnpm prepare
```

### ESLint Errors

**Problem:** Too many ESLint errors

**Solution:**

```bash
# Auto-fix what can be fixed
pnpm lint:fix

# Check specific file
pnpm lint src/your-file.ts

# Disable rules temporarily in file
/* eslint-disable rule-name */

# Update ESLint configuration
# Edit .eslintrc.json to adjust rules
```

## Testing Issues

### Tests Failing

**Problem:** Tests fail unexpectedly

**Solution:**

```bash
# Run tests with verbose output
pnpm test --reporter=verbose

# Run specific test file
pnpm test path/to/test.test.ts

# Clear test cache
rm -rf node_modules/.vitest

# Check for async issues
# Ensure proper use of await in tests

# Update test dependencies
pnpm add -D vitest@latest @testing-library/react@latest
```

### Test Coverage Issues

**Problem:** Coverage reports are incorrect

**Solution:**

```bash
# Run with coverage
pnpm test:coverage

# Clear coverage cache
rm -rf coverage

# Check vitest.config.ts coverage settings
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov']
    }
  }
});
```

### Timeout Errors in Tests

**Problem:** Tests timeout

**Solution:**

```bash
# Increase timeout in test file
test('something', async () => {
  // ...
}, 10000); // 10 seconds

# Or globally in vitest.config.ts
export default defineConfig({
  test: {
    testTimeout: 10000
  }
});
```

## Deployment Issues

### Docker Build Fails

**Problem:** Docker image build fails

**Solution:**

```bash
# Check Dockerfile syntax
docker build --no-cache -t react-framework .

# Use multi-stage build to reduce size
# Check Docker daemon has enough resources

# Clear Docker cache
docker system prune -a

# Check .dockerignore
cat .dockerignore
```

### Kubernetes Deployment Issues

**Problem:** Pods not starting

**Solution:**

```bash
# Check pod status
kubectl get pods -l app=react-framework

# View pod logs
kubectl logs -f <pod-name>

# Describe pod for events
kubectl describe pod <pod-name>

# Check image pull
kubectl get events --sort-by='.lastTimestamp'

# Verify configmap and secrets
kubectl get configmap
kubectl get secrets
```

### Nginx Configuration Issues

**Problem:** Nginx not serving app correctly

**Solution:**

```bash
# Test Nginx configuration
sudo nginx -t

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Verify root path and permissions
ls -la /var/www/react-framework

# Check Nginx is running
sudo systemctl status nginx

# Reload configuration
sudo systemctl reload nginx
```

### PM2 Process Crashes

**Problem:** PM2 process keeps restarting

**Solution:**

```bash
# Check PM2 logs
pm2 logs react-framework

# Check process status
pm2 status

# Increase max memory restart limit
pm2 start ecosystem.config.js --max-memory-restart 2G

# Check for unhandled errors in app
# Add error handlers in your code

# Update PM2
npm install -g pm2@latest
pm2 update
```

### SSL Certificate Issues

**Problem:** SSL/TLS certificate errors

**Solution:**

```bash
# Renew certificate with Certbot
sudo certbot renew

# Test certificate
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal

# Check Nginx SSL configuration
sudo nginx -t

# Ensure ports 80 and 443 are open
sudo ufw status
```

## Performance Issues

### Slow Build Times

**Problem:** Builds take too long

**Solution:**

```bash
# Use parallel builds (default with pnpm)
pnpm build

# Skip unnecessary builds
pnpm build --filter=./packages/core

# Use incremental builds
# TypeScript uses tsbuildinfo files

# Increase resources
export NODE_OPTIONS="--max-old-space-size=4096"

# Use caching in CI/CD
# Cache node_modules and build artifacts
```

### Slow Development Server

**Problem:** Dev server is slow

**Solution:**

```bash
# Reduce watched files
# Add to vite.config.ts:
export default defineConfig({
  server: {
    watch: {
      ignored: ['**/node_modules/**', '**/dist/**']
    }
  }
});

# Use SWC instead of Babel (if applicable)
# Install @vitejs/plugin-react-swc

# Disable source maps in development
# (Not recommended but faster)

# Close unnecessary applications
# Ensure sufficient RAM available
```

### Large Bundle Size

**Problem:** Production bundle is too large

**Solution:**

```bash
# Analyze bundle
pnpm build
pnpm vite-bundle-analyzer

# Enable code splitting
# Use dynamic imports
const Component = lazy(() => import('./Component'));

# Tree shaking - remove unused exports
# Check your imports

# Use production build
NODE_ENV=production pnpm build

# Compress assets
# Enable gzip/brotli in Nginx
```

### Memory Leaks

**Problem:** Application memory usage keeps growing

**Solution:**

```bash
# Profile with Chrome DevTools
# Use Memory tab to find leaks

# Common causes:
# - Event listeners not cleaned up
# - setInterval/setTimeout not cleared
# - Large objects in closures
# - Circular references

# Use React DevTools Profiler
# Find components re-rendering unnecessarily

# Check for memory leaks in tests
# Use --detect-leaks flag with Jest/Vitest
```

## Getting More Help

### Run Diagnostics

```bash
# Verify installation
./scripts/verify-installation.sh

# Check system resources
df -h              # Disk space
free -h            # Memory
node --version     # Node.js
pnpm --version     # pnpm
```

### Collect Information

When reporting issues, include:

1. **System Information**

   ```bash
   uname -a                    # OS
   node --version              # Node.js
   pnpm --version              # pnpm
   ./scripts/verify-installation.sh  # Full diagnostics
   ```

2. **Error Messages**
   - Full error output
   - Stack traces
   - Log files

3. **Steps to Reproduce**
   - What you did
   - What you expected
   - What actually happened

### Resources

- [Installation Guide](../INSTALLATION.md)
- [Quick Start](./QUICK-START.md)
- [GitHub Issues](https://github.com/vhvplatform/react-framework/issues)
- [GitHub Discussions](https://github.com/vhvplatform/react-framework/discussions)

### Community Support

- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Questions and community help
- **Documentation**: Complete guides and API reference

---

**Still need help?** Open an issue with:

- Output from `./scripts/verify-installation.sh`
- Relevant error messages
- Steps to reproduce
- System information
