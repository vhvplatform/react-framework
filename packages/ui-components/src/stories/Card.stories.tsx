import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../Card';

/**
 * Card component for containing content with consistent styling.
 * Supports titles, different padding options, shadows, and hover effects.
 */
const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A flexible card component for grouping related content. Supports customizable padding, shadows, titles, and hover effects.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Optional title displayed at the top of the card',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Padding size for card content',
    },
    shadow: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'Shadow depth for the card',
    },
    hoverable: {
      control: 'boolean',
      description: 'Adds a hover effect that increases shadow',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic card with default styling
 */
export const Default: Story = {
  args: {
    children: (
      <div>
        <p>This is a default card with medium padding and shadow.</p>
      </div>
    ),
  },
};

/**
 * Card with title
 */
export const WithTitle: Story = {
  args: {
    title: 'Card Title',
    children: (
      <div>
        <p className="text-gray-600">
          This card includes a title section at the top. The title is separated by a border and has
          its own padding.
        </p>
      </div>
    ),
  },
};

/**
 * Card with no padding
 */
export const NoPadding: Story = {
  args: {
    padding: 'none',
    children: (
      <div className="p-4">
        <p>This card has no default padding. You can add your own padding as needed.</p>
      </div>
    ),
  },
};

/**
 * Card with small padding
 */
export const SmallPadding: Story = {
  args: {
    padding: 'sm',
    children: <p>Card with small padding</p>,
  },
};

/**
 * Card with large padding
 */
export const LargePadding: Story = {
  args: {
    padding: 'lg',
    children: <p>Card with large padding for more spacious layouts</p>,
  },
};

/**
 * Card with no shadow
 */
export const NoShadow: Story = {
  args: {
    shadow: 'none',
    children: <p>Card without any shadow - flat design</p>,
  },
};

/**
 * Card with small shadow
 */
export const SmallShadow: Story = {
  args: {
    shadow: 'sm',
    children: <p>Card with small, subtle shadow</p>,
  },
};

/**
 * Card with large shadow
 */
export const LargeShadow: Story = {
  args: {
    shadow: 'lg',
    children: <p>Card with large, prominent shadow</p>,
  },
};

/**
 * Card with extra large shadow
 */
export const ExtraLargeShadow: Story = {
  args: {
    shadow: 'xl',
    children: <p>Card with extra large shadow for maximum depth</p>,
  },
};

/**
 * Hoverable card
 */
export const Hoverable: Story = {
  args: {
    hoverable: true,
    title: 'Hover Me',
    children: <p>This card increases its shadow on hover. Try hovering over it!</p>,
  },
};

/**
 * Card with rich content
 */
export const RichContent: Story = {
  args: {
    title: 'User Profile',
    hoverable: true,
    children: (
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            JD
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">John Doe</h3>
            <p className="text-sm text-gray-500">Software Engineer</p>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-3">
          <p className="text-sm text-gray-600">
            Passionate about building great user experiences and scalable applications.
          </p>
        </div>
      </div>
    ),
  },
};

/**
 * Dashboard stats card
 */
export const StatsCard: Story = {
  args: {
    shadow: 'md',
    hoverable: true,
    children: (
      <div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">$45,231</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-2 flex items-center text-sm">
          <span className="text-green-600 font-medium">↑ 12%</span>
          <span className="text-gray-500 ml-2">from last month</span>
        </div>
      </div>
    ),
  },
};

/**
 * All shadow sizes
 */
export const AllShadows: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4" style={{ width: '600px' }}>
      <Card shadow="none">
        <p className="font-medium">No Shadow</p>
      </Card>
      <Card shadow="sm">
        <p className="font-medium">Small Shadow</p>
      </Card>
      <Card shadow="md">
        <p className="font-medium">Medium Shadow</p>
      </Card>
      <Card shadow="lg">
        <p className="font-medium">Large Shadow</p>
      </Card>
      <Card shadow="xl">
        <p className="font-medium">Extra Large Shadow</p>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available shadow sizes',
      },
    },
  },
};
