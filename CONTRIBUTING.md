# Contributing to SaaS Framework React

We welcome contributions to the SaaS Framework React! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/saas-framework-react.git`
3. Install dependencies: `pnpm install`
4. Build packages: `pnpm build`

## 📝 Development Workflow

### Making Changes

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes in the appropriate package(s)
3. Build and test: `pnpm build && pnpm type-check`
4. Commit your changes: `git commit -m "Description of changes"`
5. Push to your fork: `git push origin feature/your-feature-name`
6. Create a Pull Request

### Package Structure

The monorepo contains these packages:

- `@longvhv/core` - Core framework functionality
- `@longvhv/api-client` - HTTP client for API integration
- `@longvhv/auth` - Authentication components and logic
- `@longvhv/ui-components` - Reusable UI components
- `@longvhv/cli` - Command-line tools

### Coding Standards

- Use TypeScript for all new code
- Follow the existing code style (enforced by Prettier and ESLint)
- Write clear, descriptive commit messages
- Add comments for complex logic
- Export types for public APIs
- Avoid `any` types where possible

### Testing

Before submitting a PR:

```bash
# Type check all packages
pnpm type-check

# Build all packages
pnpm build

# Format code
pnpm format

# Lint code
pnpm lint
```

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. A clear description of the issue
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Environment details (Node version, OS, etc.)
6. Code samples if applicable

## ✨ Feature Requests

We welcome feature requests! Please:

1. Check if the feature already exists or has been requested
2. Clearly describe the feature and its use case
3. Explain why it would be valuable
4. Provide examples if possible

## 📦 Adding New Packages

To add a new package to the monorepo:

1. Create a new directory in `packages/`
2. Add `package.json` with appropriate metadata
3. Add `tsconfig.json` extending the root config
4. Update root `tsconfig.json` references
5. Add package to `pnpm-workspace.yaml` if needed
6. Document the new package in README.md

## 🔧 Working with the CLI

When making changes to the CLI package:

1. Test CLI commands manually
2. Verify generated apps work correctly
3. Update templates if needed
4. Document new commands in README.md

## 📖 Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for new functions/classes
- Update code examples if APIs change
- Keep CHANGELOG.md up to date

## 🤝 Code Review Process

1. All PRs require at least one approval
2. Address review comments promptly
3. Keep PRs focused and reasonably sized
4. Rebase on main before merging
5. Squash commits if requested

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 💬 Questions?

Feel free to open an issue for questions or reach out to the maintainers.

Thank you for contributing! 🎉
