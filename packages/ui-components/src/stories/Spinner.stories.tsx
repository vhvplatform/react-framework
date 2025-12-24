import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from '../Spinner';

/**
 * Spinner component for loading states.
 * Supports different sizes, colors, and optional text labels.
 */
const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable loading spinner component with support for different sizes, colors, and optional loading text.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the spinner',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'white', 'gray'],
      description: 'Color of the spinner',
    },
    text: {
      control: 'text',
      description: 'Optional text to display below the spinner',
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default spinner
 */
export const Default: Story = {
  args: {},
};

/**
 * Small spinner
 */
export const Small: Story = {
  args: {
    size: 'sm',
  },
};

/**
 * Medium spinner (default)
 */
export const Medium: Story = {
  args: {
    size: 'md',
  },
};

/**
 * Large spinner
 */
export const Large: Story = {
  args: {
    size: 'lg',
  },
};

/**
 * Extra large spinner
 */
export const ExtraLarge: Story = {
  args: {
    size: 'xl',
  },
};

/**
 * Primary color (default)
 */
export const Primary: Story = {
  args: {
    color: 'primary',
  },
};

/**
 * Secondary color
 */
export const Secondary: Story = {
  args: {
    color: 'secondary',
  },
};

/**
 * White color (for dark backgrounds)
 */
export const White: Story = {
  args: {
    color: 'white',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Gray color
 */
export const Gray: Story = {
  args: {
    color: 'gray',
  },
};

/**
 * Spinner with text
 */
export const WithText: Story = {
  args: {
    text: 'Loading...',
  },
};

/**
 * Loading data
 */
export const LoadingData: Story = {
  args: {
    size: 'lg',
    text: 'Loading data...',
  },
};

/**
 * Processing
 */
export const Processing: Story = {
  args: {
    size: 'md',
    text: 'Processing your request...',
    color: 'primary',
  },
};

/**
 * Uploading
 */
export const Uploading: Story = {
  args: {
    size: 'lg',
    text: 'Uploading files...',
    color: 'secondary',
  },
};

/**
 * All sizes comparison
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-8 items-center">
      <div className="text-center">
        <Spinner size="sm" />
        <p className="mt-2 text-sm text-gray-600">Small</p>
      </div>
      <div className="text-center">
        <Spinner size="md" />
        <p className="mt-2 text-sm text-gray-600">Medium</p>
      </div>
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-2 text-sm text-gray-600">Large</p>
      </div>
      <div className="text-center">
        <Spinner size="xl" />
        <p className="mt-2 text-sm text-gray-600">Extra Large</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available spinner sizes',
      },
    },
  },
};

/**
 * All colors comparison
 */
export const AllColors: Story = {
  render: () => (
    <div className="flex gap-8 items-center">
      <div className="text-center">
        <Spinner color="primary" />
        <p className="mt-2 text-sm text-gray-600">Primary</p>
      </div>
      <div className="text-center">
        <Spinner color="secondary" />
        <p className="mt-2 text-sm text-gray-600">Secondary</p>
      </div>
      <div className="text-center">
        <Spinner color="gray" />
        <p className="mt-2 text-sm text-gray-600">Gray</p>
      </div>
      <div className="text-center p-4 bg-gray-800 rounded">
        <Spinner color="white" />
        <p className="mt-2 text-sm text-white">White</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available spinner colors',
      },
    },
  },
};

/**
 * Full page loading
 */
export const FullPageLoading: Story = {
  render: () => (
    <div
      className="flex items-center justify-center bg-gray-50 rounded-lg"
      style={{ width: '600px', height: '400px' }}
    >
      <Spinner size="xl" text="Loading your dashboard..." />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of a full-page loading state',
      },
    },
  },
};

/**
 * Inline loading
 */
export const InlineLoading: Story = {
  render: () => (
    <div className="p-6 bg-white rounded-lg shadow-md" style={{ width: '400px' }}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="flex items-center justify-center py-12">
        <Spinner size="md" text="Loading activities..." />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of an inline loading state within a card',
      },
    },
  },
};

/**
 * Button loading state
 */
export const ButtonLoading: Story = {
  render: () => (
    <button
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-wait"
      disabled
    >
      <Spinner size="sm" color="white" className="mr-2" />
      Processing...
    </button>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of using spinner in a button loading state',
      },
    },
  },
};
