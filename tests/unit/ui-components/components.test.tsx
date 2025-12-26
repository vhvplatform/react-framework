import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button, Card, Input, Spinner } from '@vhvplatform/ui-components';

describe('UI Components', () => {
  describe('Button', () => {
    it('should render with text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should call onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);

      fireEvent.click(screen.getByText('Click'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should render primary variant', () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByText('Primary');
      expect(button).toHaveClass('bg-blue-600');
    });

    it('should render secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByText('Secondary');
      expect(button).toHaveClass('bg-gray-600');
    });

    it('should render danger variant', () => {
      render(<Button variant="danger">Danger</Button>);
      const button = screen.getByText('Danger');
      expect(button).toHaveClass('bg-red-600');
    });

    it('should render small size', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByText('Small');
      expect(button).toHaveClass('text-sm');
    });

    it('should render medium size', () => {
      render(<Button size="md">Medium</Button>);
      const button = screen.getByText('Medium');
      expect(button).toHaveClass('text-base');
    });

    it('should render large size', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByText('Large');
      expect(button).toHaveClass('text-lg');
    });

    it('should render as disabled', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByText('Disabled');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50');
    });

    it('should not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );

      fireEvent.click(screen.getByText('Disabled'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should render full width', () => {
      render(<Button fullWidth>Full Width</Button>);
      const button = screen.getByText('Full Width');
      expect(button).toHaveClass('w-full');
    });

    it('should apply custom className', () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByText('Custom');
      expect(button).toHaveClass('custom-class');
    });

    it('should handle type attribute', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByText('Submit');
      expect(button).toHaveAttribute('type', 'submit');
    });
  });

  describe('Card', () => {
    it('should render with children', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('should render with title', () => {
      render(<Card title="Card Title">Content</Card>);
      expect(screen.getByText('Card Title')).toBeInTheDocument();
    });

    it('should render without title', () => {
      render(<Card>Content only</Card>);
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<Card className="custom-card">Content</Card>);
      expect(container.firstChild).toHaveClass('custom-card');
    });
  });

  describe('Input', () => {
    it('should render input field', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Input label="Username" />);
      expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('should handle value changes', () => {
      const handleChange = vi.fn();
      render(<Input value="" onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });

      expect(handleChange).toHaveBeenCalled();
    });

    it('should render error message', () => {
      render(<Input error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should apply error styling when error present', () => {
      render(<Input error="Error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500');
    });

    it('should render different input types', () => {
      const { rerender } = render(<Input type="email" />);
      let input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');

      rerender(<Input type="password" />);
      input = screen.getByRole('textbox', { hidden: true }) as HTMLInputElement;
      expect(input.type).toBe('password');
    });

    it('should handle disabled state', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('should handle required attribute', () => {
      render(<Input required />);
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    it('should apply custom className', () => {
      render(<Input className="custom-input" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-input');
    });
  });

  describe('Spinner', () => {
    it('should render spinner', () => {
      const { container } = render(<Spinner />);
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should render with custom size', () => {
      const { container } = render(<Spinner size="lg" />);
      const spinner = container.querySelector('.w-12');
      expect(spinner).toBeInTheDocument();
    });

    it('should render small size', () => {
      const { container } = render(<Spinner size="sm" />);
      const spinner = container.querySelector('.w-4');
      expect(spinner).toBeInTheDocument();
    });

    it('should render medium size', () => {
      const { container } = render(<Spinner size="md" />);
      const spinner = container.querySelector('.w-8');
      expect(spinner).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<Spinner className="custom-spinner" />);
      expect(container.firstChild).toHaveClass('custom-spinner');
    });
  });
});
