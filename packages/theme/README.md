# @longvhv/theme

Theme management with dark/light mode support for the SaaS Framework.

## Features

- 🌓 **Dark/Light Mode** - Built-in support for dark and light themes
- 🔄 **System Theme** - Automatically follows system preference
- 💾 **Persistence** - Saves theme preference to localStorage
- 🎨 **Customizable** - Easy to customize colors and styles
- ⚛️ **React Context** - Simple context-based API
- 🪝 **Hooks** - Convenient hooks for theme access

## Installation

```bash
pnpm add @longvhv/theme
```

## Usage

### Setup Theme Provider

```tsx
import { ThemeProvider } from '@longvhv/theme';

function App() {
  return (
    <ThemeProvider defaultMode="system">
      <YourApp />
    </ThemeProvider>
  );
}
```

### Use Theme Hook

```tsx
import { useTheme } from '@longvhv/theme';

function MyComponent() {
  const { theme, mode, setMode, toggleMode, isDark } = useTheme();
  
  return (
    <div>
      <p>Current mode: {mode}</p>
      <p>Is dark: {isDark ? 'Yes' : 'No'}</p>
      <button onClick={toggleMode}>Toggle Theme</button>
      <button onClick={() => setMode('dark')}>Dark</button>
      <button onClick={() => setMode('light')}>Light</button>
      <button onClick={() => setMode('system')}>System</button>
    </div>
  );
}
```

### Custom Theme

```tsx
import { ThemeProvider, Theme } from '@longvhv/theme';

const customTheme: Partial<Theme> = {
  colors: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
  },
};

function App() {
  return (
    <ThemeProvider customTheme={customTheme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

### Utility Hooks

```tsx
import { useIsDark, useToggleTheme } from '@longvhv/theme';

function ThemeToggle() {
  const isDark = useIsDark();
  const toggleTheme = useToggleTheme();
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? '🌙' : '☀️'}
    </button>
  );
}
```

## API Reference

### ThemeProvider Props

- `children` - React children
- `defaultMode?` - Default theme mode ('light' | 'dark' | 'system')
- `storageKey?` - localStorage key for persistence (default: 'saas_theme_mode')
- `customTheme?` - Custom theme configuration

### useTheme Hook

Returns:
- `theme` - Current theme object
- `mode` - Current theme mode
- `setMode(mode)` - Set theme mode
- `toggleMode()` - Toggle between light and dark
- `isDark` - Whether dark mode is active

## CSS Variables

The theme provider automatically sets CSS variables:

```css
/* Colors */
--color-primary
--color-secondary
--color-success
--color-danger
--color-warning
--color-info
--color-background
--color-surface
--color-text
--color-textSecondary
--color-border

/* Spacing */
--spacing-xs
--spacing-sm
--spacing-md
--spacing-lg
--spacing-xl
--spacing-2xl
```

## Tailwind Integration

Add to your `tailwind.config.js`:

```js
module.exports = {
  darkMode: 'class',
  // ... rest of config
}
```
