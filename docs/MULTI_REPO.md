# Multi-Repo Architecture

## Overview

The @longvhv framework supports multi-repository architecture where each SaaS application lives in its own repository and consumes framework packages via npm.

## Architecture

### Framework Repository

- Contains all framework packages (`@longvhv/*`)
- Published to npm registry (public or private)
- Centralized maintenance and updates
- Semantic versioning for all packages

### Application Repositories

- Independent repositories per app
- Consume framework via npm packages
- Independent versioning and deployment
- Custom business logic and features
- Private per customer if needed

## Creating New App

### Using create-app CLI

The easiest way to create a new SaaS application:

```bash
npx @longvhv/create-app my-saas-app
```

This creates a new repository with:

- Full project structure (src, public, scripts)
- Framework dependencies installed from npm
- Git initialized with initial commit
- CI/CD configured (GitHub Actions, GitLab CI)
- Deployment ready (Vercel, AWS, Docker)
- TypeScript, ESLint, Prettier configured

#### Interactive Prompts

The CLI will ask you to choose:

1. **Template**: blank, integration-portal, crm, admin-dashboard
2. **Framework Version**: latest or specific version
3. **Package Registry**: npm public, GitHub Packages, custom
4. **Git Initialization**: yes/no
5. **CI/CD Setup**: GitHub Actions, GitLab CI, none
6. **Deployment Target**: Vercel, AWS, Docker, none

#### CLI Options

```bash
npx @longvhv/create-app my-saas-app \
  --template blank \
  --version latest \
  --registry https://registry.npmjs.org \
  --skip-git \
  --skip-install
```

### Manual Setup

If you prefer to set up manually:

```bash
# Create new directory
mkdir my-saas-app
cd my-saas-app

# Initialize npm project
npm init -y

# Install framework packages
npm install @longvhv/core \
            @longvhv/auth \
            @longvhv/api-client \
            @longvhv/ui-components \
            @longvhv/theme \
            @longvhv/forms \
            @longvhv/notifications \
            @longvhv/query

# Install dev dependencies
npm install --save-dev \
            @longvhv/config \
            @vitejs/plugin-react \
            typescript \
            vite \
            vitest

# Initialize git
git init
```

## Publishing Framework Packages

### Prerequisites

```bash
# Ensure you have proper credentials
npm login

# Or for private registries
npm login --registry=https://npm.pkg.github.com
```

### Using Changesets Workflow

The framework uses [@changesets/cli](https://github.com/changesets/changesets) for version management.

#### 1. Create a Changeset

When you make changes to a package:

```bash
pnpm changeset
```

This will:

- Prompt you to select changed packages
- Ask for the version bump type (major, minor, patch)
- Request a summary of changes
- Create a markdown file in `.changeset/`

#### 2. Version Packages

Before releasing, update package versions:

```bash
pnpm version-packages
```

This will:

- Consume all changesets
- Update package.json versions
- Update CHANGELOG.md files
- Update dependency versions across packages

#### 3. Publish to Registry

```bash
pnpm release
```

This will:

- Build all packages (`pnpm build`)
- Publish to npm registry (`changeset publish`)
- Push git tags

### Publishing to GitHub Packages

```bash
pnpm publish:github
```

This publishes to GitHub Packages registry.

## Package Registry Configuration

### Public NPM Registry

Default configuration in root `package.json`:

```json
{
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org"
  }
}
```

### GitHub Packages (Private)

#### In Framework Repository

Create `.npmrc`:

```bash
@longvhv:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

#### In Application Repository

When using `create-app` with GitHub Packages:

```bash
npx @longvhv/create-app my-app \
  --registry https://npm.pkg.github.com
```

This creates `.npmrc`:

```bash
@longvhv:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

Set environment variable:

```bash
export NPM_TOKEN=your_github_token
```

#### In CI/CD (GitHub Actions)

```yaml
- name: Install dependencies
  run: npm ci
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Custom Private Registry

For enterprise/custom registries:

```bash
npx @longvhv/create-app my-app \
  --registry https://npm.company.com
```

In `.npmrc`:

```bash
@longvhv:registry=https://npm.company.com
//npm.company.com/:_authToken=${NPM_TOKEN}
```

## Updating Framework in Apps

### Check for Updates

```bash
# Check outdated @longvhv packages
npm outdated @longvhv/*
```

### Update All Framework Packages

```bash
# Update to latest versions
npm update @longvhv/*

# Or update each package individually
npm install @longvhv/core@latest
npm install @longvhv/auth@latest
```

### Update to Specific Version

```bash
# Install exact version
npm install @longvhv/core@1.2.3 --save-exact

# Install semver range
npm install @longvhv/core@^1.2.0
```

### Lock Critical Dependencies

For production stability:

```bash
# Use exact versions
npm install --save-exact @longvhv/core@1.2.3

# Or in package.json
{
  "dependencies": {
    "@longvhv/core": "1.2.3"
  }
}
```

## Version Management Strategy

### Framework Packages

Follow [Semantic Versioning](https://semver.org/):

- **Major (1.0.0 → 2.0.0)**: Breaking changes
- **Minor (1.0.0 → 1.1.0)**: New features, backwards compatible
- **Patch (1.0.0 → 1.0.1)**: Bug fixes, backwards compatible

### Application Versioning

Applications can version independently:

```json
{
  "name": "my-saas-app",
  "version": "2.5.3",
  "dependencies": {
    "@longvhv/core": "^1.0.0"
  }
}
```

## Benefits

### For Framework Maintainers

- **Centralized maintenance**: One place for all framework code
- **Clear versioning**: Semantic versioning for predictable updates
- **Easy distribution**: Publish to npm, users install
- **Community contributions**: Public packages enable contributions
- **Change tracking**: Changesets provide clear changelog

### For Application Developers

- **Independent repositories**: Full control over your app
- **Choose upgrade timing**: Update framework when ready
- **Isolated development**: No interference with other apps
- **Custom CI/CD**: Configure pipelines per app needs
- **Private per customer**: Each customer gets own repo

### For Organizations

- **Better access control**: Separate repos for different teams
- **Separate deployments**: Deploy apps independently
- **Independent scaling**: Scale each app based on needs
- **Multi-tenant ready**: One framework, many apps
- **Customer isolation**: Private repos per customer

## Best Practices

### 1. Semantic Versioning

Always follow semver for framework packages:

```bash
# Bug fix
pnpm changeset
# Select: patch

# New feature
pnpm changeset
# Select: minor

# Breaking change
pnpm changeset
# Select: major
```

### 2. Comprehensive Changelogs

Document all changes in changesets:

```markdown
---
'@longvhv/core': minor
---

Add support for lazy loading modules
```

### 3. Migration Guides

For breaking changes, provide migration guides:

```markdown
## Migrating from v1 to v2

### Breaking Changes

1. `Application` constructor now requires `modules` array
2. `useAuth()` hook renamed to `useAuthentication()`

### Migration Steps

...
```

### 4. Lock Critical Dependencies

Use exact versions for stability:

```json
{
  "dependencies": {
    "@longvhv/core": "1.2.3",
    "@longvhv/auth": "1.2.3"
  }
}
```

### 5. Test Before Publishing

Always test packages before publishing:

```bash
# Build all packages
pnpm build

# Run tests
pnpm test

# Check types
pnpm type-check

# Lint code
pnpm lint
```

### 6. Deprecation Policy

Give advance notice before breaking changes:

1. Mark as deprecated in version N
2. Remove in version N+1 (major)
3. Provide migration path

```typescript
/**
 * @deprecated Use useAuthentication() instead. Will be removed in v2.0.0
 */
export function useAuth() {
  return useAuthentication();
}
```

### 7. Version Ranges in Apps

Use semantic version ranges wisely:

```json
{
  "dependencies": {
    "@longvhv/core": "^1.2.0", // ✅ Accepts minor/patch updates
    "@longvhv/auth": "~1.2.0", // ✅ Accepts only patch updates
    "@longvhv/api-client": "1.2.0" // ⚠️ Exact version, no auto-updates
  }
}
```

## Continuous Integration

### Framework Repository

Example GitHub Actions workflow:

```yaml
name: Publish Packages

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install

      - name: Build packages
        run: pnpm build

      - name: Create Release PR or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Application Repository

Example generated by `create-app`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test

      - name: Build
        run: npm run build
```

## Troubleshooting

### Authentication Issues

**Problem**: Unable to install private packages

**Solution**:

```bash
# Login to registry
npm login --registry=https://npm.pkg.github.com

# Or set token in .npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN" >> .npmrc

# Or use environment variable
export NPM_TOKEN=your_token
```

### Version Conflicts

**Problem**: Peer dependency conflicts

**Solution**:

```bash
# Use legacy peer deps
npm install --legacy-peer-deps

# Or in .npmrc
legacy-peer-deps=true
```

### Registry Issues

**Problem**: Wrong registry being used

**Solution**:

Check `.npmrc` configuration:

```bash
# View current config
npm config list

# Set scoped registry
npm config set @longvhv:registry https://npm.pkg.github.com

# Or in .npmrc
@longvhv:registry=https://npm.pkg.github.com
```

### Build Failures

**Problem**: TypeScript errors after framework update

**Solution**:

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check for breaking changes
npm outdated @longvhv/*

# Review CHANGELOG for migration guide
```

### Missing Dependencies

**Problem**: Module not found errors

**Solution**:

```bash
# Install missing peer dependencies
npm install react@^18.2.0 react-dom@^18.2.0

# Or check package.json for required peers
npm info @longvhv/core peerDependencies
```

## Example Workflow

### 1. Create New Feature in Framework

```bash
cd saas-framework-react

# Create feature branch
git checkout -b feature/add-analytics

# Make changes to packages/analytics
# ...

# Create changeset
pnpm changeset
# Select: @longvhv/analytics - minor
# Summary: "Add analytics tracking support"

# Commit and push
git add .
git commit -m "feat: add analytics package"
git push
```

### 2. Release Framework Update

```bash
# Merge PR to main
# On main branch:

# Version packages
pnpm version-packages

# Review changes in package.json and CHANGELOG.md
git add .
git commit -m "chore: version packages"

# Publish
pnpm release

# Packages are now published to npm
```

### 3. Update Application

```bash
cd my-saas-app

# Check for updates
npm outdated @longvhv/*

# Update to latest
npm install @longvhv/analytics@latest

# Test the update
npm test
npm run build

# Commit and deploy
git add package.json package-lock.json
git commit -m "chore: update framework to v1.2.0"
git push
```

## Migration from Monorepo

If you have existing apps in the monorepo:

### Step 1: Extract Application

```bash
# Create new repository
mkdir my-existing-app
cd my-existing-app
git init

# Copy app code
cp -r ../saas-framework-react/examples/my-app/* .
```

### Step 2: Update Dependencies

Replace workspace dependencies with npm packages:

```json
{
  "dependencies": {
    "@longvhv/core": "workspace:*"  // ❌ Remove
    "@longvhv/core": "^1.0.0"       // ✅ Add
  }
}
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Test and Deploy

```bash
npm run dev
npm run build
npm test
```

## Resources

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Semantic Versioning](https://semver.org/)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [GitHub Packages](https://docs.github.com/en/packages)
- [Framework Documentation](https://github.com/longvhv/saas-framework-react)

## Support

For issues or questions:

- **Framework Issues**: [GitHub Issues](https://github.com/longvhv/saas-framework-react/issues)
- **Documentation**: [Framework Docs](https://github.com/longvhv/saas-framework-react/docs)
- **Community**: [Discussions](https://github.com/longvhv/saas-framework-react/discussions)
