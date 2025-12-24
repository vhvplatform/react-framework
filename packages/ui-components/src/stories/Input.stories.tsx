import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../Input';
import { useState } from 'react';

/**
 * Input component with label, error handling, and validation support.
 * Perfect for forms with built-in accessibility and styling.
 */
const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A flexible input component with support for labels, error messages, helper text, and various sizes. Built with accessibility in mind.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text displayed above the input',
    },
    error: {
      control: 'text',
      description: 'Error message displayed below the input',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the input when no error',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the input field',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Makes the input full width',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input',
    },
    required: {
      control: 'boolean',
      description: 'Marks the input as required',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default input
 */
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

/**
 * Input with label
 */
export const WithLabel: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
  },
};

/**
 * Input with helper text
 */
export const WithHelperText: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    helperText: 'We will never share your email with anyone.',
  },
};

/**
 * Input with error
 */
export const WithError: Story = {
  args: {
    label: 'Password',
    type: 'password',
    error: 'Password must be at least 8 characters',
  },
};

/**
 * Required input
 */
export const Required: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'John Doe',
    required: true,
  },
};

/**
 * Disabled input
 */
export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    placeholder: 'Cannot edit',
    disabled: true,
    value: 'This field is disabled',
  },
};

/**
 * Small size input
 */
export const SmallSize: Story = {
  args: {
    label: 'Small Input',
    size: 'sm',
    placeholder: 'Small size',
  },
};

/**
 * Medium size input (default)
 */
export const MediumSize: Story = {
  args: {
    label: 'Medium Input',
    size: 'md',
    placeholder: 'Medium size',
  },
};

/**
 * Large size input
 */
export const LargeSize: Story = {
  args: {
    label: 'Large Input',
    size: 'lg',
    placeholder: 'Large size',
  },
};

/**
 * Full width input
 */
export const FullWidth: Story = {
  args: {
    label: 'Full Width Input',
    fullWidth: true,
    placeholder: 'This input spans full width',
  },
};

/**
 * Different input types
 */
export const InputTypes: Story = {
  render: () => (
    <div className="space-y-4" style={{ width: '400px' }}>
      <Input label="Text" type="text" placeholder="Text input" />
      <Input label="Email" type="email" placeholder="email@example.com" />
      <Input label="Password" type="password" placeholder="Enter password" />
      <Input label="Number" type="number" placeholder="123" />
      <Input label="Date" type="date" />
      <Input label="Tel" type="tel" placeholder="+1 (555) 123-4567" />
      <Input label="URL" type="url" placeholder="https://example.com" />
      <Input label="Search" type="search" placeholder="Search..." />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Various HTML input types supported by the component',
      },
    },
  },
};

/**
 * Form validation example
 */
export const FormValidation: Story = {
  render: () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validateEmail = (value: string) => {
      if (!value) {
        setEmailError('Email is required');
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
        setEmailError('Invalid email address');
      } else {
        setEmailError('');
      }
    };

    const validatePassword = (value: string) => {
      if (!value) {
        setPasswordError('Password is required');
      } else if (value.length < 8) {
        setPasswordError('Password must be at least 8 characters');
      } else {
        setPasswordError('');
      }
    };

    return (
      <div className="space-y-4" style={{ width: '400px' }}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            validateEmail(e.target.value);
          }}
          onBlur={(e) => validateEmail(e.target.value)}
          error={emailError}
          placeholder="you@example.com"
          required
          fullWidth
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e.target.value);
          }}
          onBlur={(e) => validatePassword(e.target.value)}
          error={passwordError}
          placeholder="Enter password"
          required
          fullWidth
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive form validation example with real-time error feedback',
      },
    },
  },
};

/**
 * All sizes comparison
 */
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4" style={{ width: '400px' }}>
      <Input label="Small" size="sm" placeholder="Small input" />
      <Input label="Medium" size="md" placeholder="Medium input (default)" />
      <Input label="Large" size="lg" placeholder="Large input" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available input sizes',
      },
    },
  },
};

/**
 * Login form example
 */
export const LoginForm: Story = {
  render: () => (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow-md" style={{ width: '400px' }}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        required
        fullWidth
        helperText="Enter your registered email"
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        required
        fullWidth
      />
      <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        Sign In
      </button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete login form example using Input components',
      },
    },
  },
};
