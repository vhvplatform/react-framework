# @vhvplatform/config

Shared configuration presets for @vhvplatform framework applications.

## Installation

```bash
npm install --save-dev @vhvplatform/config
```

## Usage

### ESLint Configuration

Create `.eslintrc.js` in your project:

```javascript
module.exports = {
  extends: ['@vhvplatform/config/eslint'],
};
```

Or in `eslint.config.js`:

```javascript
import config from '@vhvplatform/config/eslint';

export default config;
```

### Prettier Configuration

Create `prettier.config.js` in your project:

```javascript
import config from '@vhvplatform/config/prettier';

export default config;
```

Or in `package.json`:

```json
{
  "prettier": "@vhvplatform/config/prettier"
}
```

### TypeScript Configuration

Create `tsconfig.json` in your project:

```json
{
  "extends": "@vhvplatform/config/tsconfig",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

## Included Configurations

### ESLint

- ESLint recommended rules
- TypeScript recommended rules
- React recommended rules
- React Hooks rules
- Custom rules for @vhvplatform framework

### Prettier

- Semi-colons enabled
- Single quotes
- Trailing commas (ES5)
- 100 character line width
- 2 space indentation

### TypeScript

- ES2020 target
- ESNext module
- Strict mode enabled
- React JSX support
- Bundler module resolution

## Customization

You can override any configuration in your local config files:

```javascript
import baseConfig from '@vhvplatform/config/eslint';

export default {
  ...baseConfig,
  rules: {
    ...baseConfig.rules,
    // Your custom rules
    'no-console': 'warn',
  },
};
```

## License

MIT
