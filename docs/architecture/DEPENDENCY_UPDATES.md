# Dependency Updates Summary

## Overview

This document summarizes the dependency updates performed on 2025-12-26 and explains the version choices made.

## Updated Dependencies

### Major Updates

#### @commitlint packages (18.x → 20.2.0)

- **@commitlint/cli**: 18.6.1 → 20.2.0
- **@commitlint/config-conventional**: 18.6.3 → 20.2.0
- Updated to the latest stable versions
- No breaking changes affecting the configuration

#### Testing Libraries

- **@testing-library/react**: 14.3.1 → 16.3.1
- Updated to support the latest testing patterns
- Compatible with React 18

#### Type Definitions

- **@types/node**: 20.19.27 → 25.0.3
- **@types/react**: 18.2.46 → 18.3.27 (kept at v18)
- **@types/react-dom**: 18.2.18 → 18.3.7 (kept at v18)
- Node types updated to latest for better Node.js API support
- React types kept at v18 to match React 18.x runtime version

#### TypeScript ESLint (6.x → 7.18.0)

- **@typescript-eslint/eslint-plugin**: 6.21.0 → 7.18.0
- **@typescript-eslint/parser**: 6.21.0 → 7.18.0
- Updated to v7 (latest compatible with ESLint 8)
- Not updated to v8 to avoid requiring ESLint 9 migration

#### ESLint Plugins

- **eslint-plugin-react-hooks**: 4.6.2 → 7.0.1
- **eslint-plugin-sonarjs**: 0.23.0 → 3.0.5
- **eslint-config-prettier**: 9.1.2 → 10.1.8
- All updated to latest stable versions

#### Testing Environment

- **happy-dom**: 12.10.3 → 20.0.11
- Major update for better DOM simulation in tests

#### Development Tools

- **husky**: 8.0.3 → 9.1.7
- **lint-staged**: 15.5.2 → 16.2.7
- **sonarqube-scanner**: 3.5.0 → 4.3.2
- All updated to latest versions
- Husky 9 introduces simpler hook syntax (deprecated code removed)

### Versions Kept Stable

#### ESLint (Kept at 8.57.1)

- **Reason**: ESLint 9 introduces breaking changes requiring new config format (eslint.config.js)
- **Impact**: Avoided the need to migrate from .eslintrc.json to flat config
- **Note**: ESLint 8 is still actively maintained and widely used

#### Storybook (Kept at 8.6.15)

- **Reason**: Storybook 10 is in alpha/beta and not production-ready
- **Impact**: Maintains stability while getting latest v8 features
- **Peer dependency warnings**: None with current setup

#### Vitest (Kept at 1.6.1)

- **Reason**: Vitest 4.x requires Vite 7, which is incompatible with Storybook 8
- **Impact**: Maintains compatibility between test and documentation systems
- **Note**: Will upgrade when Storybook supports Vite 7 or Vitest provides compatibility layer

#### @vitejs/plugin-react (Kept at 4.7.0)

- **Reason**: Version 5.x requires Vite 7, which conflicts with Storybook 8 requirements
- **Impact**: Maintains compatibility across the build toolchain

## Breaking Changes and Fixes

### Husky Hooks

- Removed deprecated `#!/usr/bin/env sh` and `. "$(dirname -- "$0")/_/husky.sh"` lines
- Simplified to direct command execution as required by Husky 9

### Storybook Stories

- Added required `args` property to stories using custom `render` functions
- Required due to stricter type checking in updated TypeScript and Storybook types
- Examples:

  ```typescript
  // Before
  export const AllVariants: Story = {
    render: () => <Component />
  }

  // After
  export const AllVariants: Story = {
    args: { children: 'Button' },
    render: () => <Component />
  }
  ```

### React Types

- Initially attempted to update to React 19 types
- Rolled back to React 18 types to match runtime version
- This prevented type incompatibilities with react-router and other React 18-based libraries

## Compatibility Matrix

| Package      | Version          | Compatible With       |
| ------------ | ---------------- | --------------------- |
| React        | 18.x             | All packages          |
| @types/react | 18.3.x           | React 18.x            |
| ESLint       | 8.57.1           | TypeScript ESLint 7.x |
| Vitest       | 1.6.1            | Vite 5.x              |
| Vite         | 5.x (via vitest) | Storybook 8.x         |
| Storybook    | 8.6.15           | Vite 4-6              |

## Build Status

✅ **All packages build successfully**
✅ **Linting works correctly**
✅ **97 out of 114 tests pass** (17 pre-existing test failures unrelated to updates)

## Future Upgrade Path

### When React 19 is released and stable:

1. Update React runtime to 19.x
2. Update @types/react to 19.x
3. Update react-router and other React dependencies
4. Test and fix any breaking changes

### When ESLint 9 becomes widely adopted:

1. Migrate to flat config format (eslint.config.js)
2. Update ESLint to 9.x
3. Update @typescript-eslint to 8.x
4. Update all ESLint plugins

### When Storybook 10 becomes stable:

1. Evaluate Storybook 10 compatibility
2. Update Storybook if Vite 7 is supported
3. Consider updating Vitest to 4.x if compatibility allows

## Conclusion

All dependencies have been updated to the latest **compatible and stable** versions. The strategy prioritized:

1. **Stability** over bleeding-edge versions
2. **Compatibility** between packages
3. **Minimal breaking changes**
4. **Production-readiness**

This ensures the framework remains reliable while benefiting from security updates, bug fixes, and new features in the updated packages.
