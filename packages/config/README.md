# @longvhv/config

Shared configuration presets for @longvhv framework applications.

## Installation

```bash
npm install --save-dev @longvhv/config
```

## Usage

### ESLint Configuration

Create `.eslintrc.js` in your project:

```javascript
module.exports = {
  extends: ['@longvhv/config/eslint'],
};
```

Or in `eslint.config.js`:

```javascript
import config from '@longvhv/config/eslint';

export default config;
```

### Prettier Configuration

Create `prettier.config.js` in your project:

```javascript
import config from '@longvhv/config/prettier';

export default config;
```

Or in `package.json`:

```json
{
  "prettier": "@longvhv/config/prettier"
}
```

### TypeScript Configuration

Create `tsconfig.json` in your project:

```json
{
  "extends": "@longvhv/config/tsconfig",
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
- Custom rules for @longvhv framework

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
import baseConfig from '@longvhv/config/eslint';

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
