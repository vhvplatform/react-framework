import type { Meta } from '@storybook/react';

/**
 * Welcome to the SaaS Framework React UI Component Library!
 * 
 * This Storybook showcases all the reusable UI components built with React, TypeScript, and Tailwind CSS.
 */
const meta = {
  title: 'Introduction',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# SaaS Framework React - UI Components

Welcome to the **SaaS Framework React** component library! This comprehensive collection of production-ready components is designed to accelerate your SaaS application development.

## 🎨 What's Inside

Our component library includes:

- **Button** - Versatile button component with 6 variants, 3 sizes, and loading states
- **Card** - Flexible container component with customizable padding, shadows, and hover effects
- **Input** - Fully-featured input component with labels, validation, and error handling
- **Spinner** - Elegant loading indicator with multiple sizes and colors

## 🚀 Built With

- **React 18** - Latest React with hooks and modern patterns
- **TypeScript 5** - Full type safety and IntelliSense support
- **Tailwind CSS 3** - Utility-first CSS framework for rapid styling
- **Vite 5** - Lightning-fast build tool and dev server
- **Storybook 8** - Component development and documentation

## ✨ Features

All components are:
- ✅ **Type-safe** - Full TypeScript support with detailed prop types
- ✅ **Accessible** - Built with ARIA attributes and keyboard navigation
- ✅ **Responsive** - Mobile-first design that works on all screen sizes
- ✅ **Themeable** - Easily customizable with Tailwind CSS
- ✅ **Tested** - Comprehensive unit test coverage (80-95%)
- ✅ **Documented** - Interactive documentation with live examples

## 📚 How to Use

Navigate through the sidebar to explore each component:

1. **View Examples** - See component variants and use cases
2. **Interact** - Use the Controls panel to modify props in real-time
3. **Copy Code** - Use the code snippets in the Docs tab
4. **Customize** - Apply your own styles and branding

## 🎯 Getting Started

\`\`\`tsx
import { Button, Card, Input, Spinner } from '@longvhv/ui-components';

function MyApp() {
  return (
    <Card title="Welcome">
      <Input label="Email" type="email" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
\`\`\`

## 📖 Documentation

Each component includes:
- **Props API** - Complete prop documentation with types
- **Stories** - Multiple examples showing different use cases
- **Controls** - Interactive prop editor in the Controls panel
- **Code** - Copy-paste ready code snippets

## 🔗 Links

- [GitHub Repository](https://github.com/longvhv/saas-framework-react)
- [Package Documentation](../../README.md)
- [Contributing Guide](../../CONTRIBUTING.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

---

**Happy coding!** 🎉
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const Welcome = {
  render: () => (
    <div className="max-w-4xl mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          SaaS Framework React
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Production-Ready UI Component Library
        </p>
        <p className="text-lg text-gray-500">
          Built with React, TypeScript, and Tailwind CSS
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-3xl mb-3">🎨</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Beautiful Design
          </h3>
          <p className="text-gray-600">
            Modern, clean components styled with Tailwind CSS for a professional look.
          </p>
        </div>

        <div className="p-6 bg-green-50 rounded-lg border border-green-200">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            High Performance
          </h3>
          <p className="text-gray-600">
            Optimized components built with React best practices and memoization.
          </p>
        </div>

        <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-3xl mb-3">🔒</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Type Safety
          </h3>
          <p className="text-gray-600">
            Full TypeScript support with comprehensive type definitions.
          </p>
        </div>

        <div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-3xl mb-3">♿</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Accessible
          </h3>
          <p className="text-gray-600">
            Built with ARIA attributes and keyboard navigation support.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Start</h2>
        <div className="bg-white p-4 rounded border border-gray-300 font-mono text-sm">
          <div className="text-gray-600">// Install the package</div>
          <div className="text-blue-600 mb-3">npm install @longvhv/ui-components</div>
          <div className="text-gray-600">// Import and use components</div>
          <div className="text-purple-600">import {'{ Button, Card }'} from '@longvhv/ui-components';</div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          Explore the components in the sidebar to get started →
        </p>
        <div className="flex gap-4 justify-center">
          <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
            4 Components
          </span>
          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
            85% Coverage
          </span>
          <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
            TypeScript
          </span>
        </div>
      </div>
    </div>
  ),
};
