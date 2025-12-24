# Multi-Repo Architecture

## Overview

The framework supports multi-repository architecture where each SaaS application lives in its own repository and consumes framework packages via npm.

## Architecture

### Framework Repository
- Contains all framework packages
- Published to npm registry
- Centralized maintenance

### Application Repositories  
- Independent repositories per app
- Consume framework via npm packages
- Independent versioning and deployment

## Creating New App

### Using create-app

```bash
npx @longvhv/create-app my-saas-app
```

This creates a new repository with:
- Full project structure
- Framework dependencies installed
- Git initialized
- CI/CD configured
- Ready to deploy

### Manual Setup

```bash
mkdir my-saas-app
cd my-saas-app
npm init -y

npm install @longvhv/core @longvhv/auth @longvhv/ui-components
```

## Publishing Framework Packages

### Setup

```bash
# Install changesets (already done)
pnpm add -D @changesets/cli

# Initialize (already done)
pnpm changeset init
```

### Create Changeset

```bash
pnpm changeset
```

### Version Packages

```bash
pnpm version-packages
```

### Publish

```bash
pnpm release
```

## Private Registry

### GitHub Packages

```bash
# In app repo, create .npmrc
@longvhv:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### Custom Registry

```bash
@longvhv:registry=https://npm.company.com
//npm.company.com/:_authToken=${NPM_TOKEN}
```

## Updating Framework

### In App Repo

```bash
# Check for updates
npm outdated @longvhv/*

# Update all
npm update @longvhv/*

# Update specific
npm install @longvhv/core@latest

# Lock version
npm install @longvhv/core@1.2.3 --save-exact
```

## Benefits

### For Framework
- Centralized maintenance
- Clear versioning
- Easy distribution
- Community contributions

### For Apps
- Independent repositories
- Choose upgrade timing
- Isolated development
- Custom CI/CD
- Private per customer

### For Organizations
- Better access control
- Separate deployments
- Independent scaling
- Multi-tenant ready
- Customer isolation

## Best Practices

1. **Semantic Versioning** - Follow semver for all packages
2. **Changelogs** - Document all changes
3. **Migration Guides** - Provide upgrade paths
4. **Lock Critical Deps** - Use exact versions for stability
5. **Test Before Publish** - Verify all packages work
6. **Deprecation Policy** - Give notice before breaking changes

## Troubleshooting

### Authentication Issues

```bash
npm login --registry=https://npm.pkg.github.com
```

### Version Conflicts

```bash
npm install --legacy-peer-deps
```

### Registry Issues

Check .npmrc configuration and auth tokens
