# Storybook Configuration

This directory contains the Storybook configuration for the SaaS Framework React UI component library.

## 📚 What is Storybook?

Storybook is an open-source tool for building UI components and pages in isolation. It streamlines UI development, testing, and documentation.

## 🚀 Running Storybook

### Development Mode

Start Storybook in development mode with hot reload:

```bash
npm run storybook
# or
pnpm storybook
```

This will start Storybook on `http://localhost:6006`

### Build for Production

Build a static version of Storybook:

```bash
npm run build-storybook
# or
pnpm build-storybook
```

The static files will be generated in the `storybook-static` directory.

## 📁 Configuration Files

### `main.ts`

The main configuration file that defines:
- **Stories location**: Where Storybook finds your story files
- **Addons**: Extensions that add extra functionality
- **Framework**: React with Vite integration
- **Docs**: Automatic documentation generation

### `preview.ts`

The preview configuration that controls:
- **Global decorators**: Wrappers around all stories
- **Parameters**: Default settings for all stories
- **Themes**: Background colors and themes
- **Controls**: How props are edited in the UI

## 🎨 Writing Stories

Stories are written in the `packages/*/src/stories/` directories. Each component has its own story file.

### Story Structure

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from '../MyComponent';

const meta = {
  title: 'Components/MyComponent',
  component: MyComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // component props
  },
};
```

## 🔌 Installed Addons

- **@storybook/addon-links** - Link between stories
- **@storybook/addon-essentials** - Essential Storybook features
  - Docs - Auto-generated documentation
  - Controls - Dynamic prop editing
  - Actions - Event handler debugging
  - Viewport - Responsive design testing
  - Backgrounds - Background color switching
  - Toolbars - Custom toolbar items
- **@storybook/addon-interactions** - Test user interactions

## 📖 Documentation

Each story automatically generates documentation that includes:
- Component description
- Props table with types
- Interactive controls
- Code snippets
- Multiple examples

## 🎯 Best Practices

### 1. Organize Stories

Group related components under the same category:

```tsx
title: 'Components/Button'  // ✅ Good
title: 'Button'             // ❌ Less organized
```

### 2. Use Controls

Define argTypes for better control panel experience:

```tsx
argTypes: {
  variant: {
    control: 'select',
    options: ['primary', 'secondary', 'danger'],
    description: 'Button variant',
  },
}
```

### 3. Add Descriptions

Document your components and stories:

```tsx
parameters: {
  docs: {
    description: {
      component: 'A detailed component description...',
      story: 'What this specific story demonstrates...',
    },
  },
}
```

### 4. Show All Variants

Create comprehensive examples:

```tsx
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};
```

### 5. Interactive Examples

Use render functions for stateful examples:

```tsx
export const WithValidation: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    
    return (
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={error}
      />
    );
  },
};
```

## 🛠️ Customization

### Adding New Addons

1. Install the addon:
```bash
npm install -D @storybook/addon-name
```

2. Register in `main.ts`:
```ts
addons: [
  '@storybook/addon-name',
]
```

### Modifying Themes

Edit `preview.ts` to customize backgrounds, typography, etc.

### Global Styles

Import global CSS in `preview.ts`:
```ts
import '../packages/ui-components/src/styles.css';
```

## 📚 Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Writing Stories](https://storybook.js.org/docs/react/writing-stories/introduction)
- [Component Story Format (CSF)](https://storybook.js.org/docs/react/api/csf)
- [Addons](https://storybook.js.org/addons)

## 🤝 Contributing

When adding new components:

1. Create the component in `packages/*/src/`
2. Write comprehensive stories in `packages/*/src/stories/`
3. Include multiple examples showing different use cases
4. Add descriptions and documentation
5. Test in Storybook before committing

## 💡 Tips

- Use keyboard shortcuts: Press `?` in Storybook to see all shortcuts
- Use the search bar to quickly find components
- Export stories to Figma, Zeplin, or other design tools
- Share your Storybook by deploying the static build
- Use Storybook's testing capabilities with `@storybook/testing-library`

---

Happy documenting! 📖✨
