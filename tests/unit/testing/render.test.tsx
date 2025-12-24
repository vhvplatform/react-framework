import { describe, it, expect } from 'vitest';
import { render, screen } from '@longvhv/testing';

describe('Testing Render Utilities', () => {
  describe('renderWithProviders', () => {
    it('should render a simple component', () => {
      const TestComponent = () => <div>Test Content</div>;
      render(<TestComponent />);

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render with props', () => {
      const TestComponent = ({ text }: { text: string }) => <div>{text}</div>;
      render(<TestComponent text="Custom Text" />);

      expect(screen.getByText('Custom Text')).toBeInTheDocument();
    });

    it('should allow querying by test id', () => {
      const TestComponent = () => <div data-testid="test-element">Content</div>;
      render(<TestComponent />);

      expect(screen.getByTestId('test-element')).toBeInTheDocument();
    });

    it('should render nested components', () => {
      const Parent = () => (
        <div>
          <Child />
        </div>
      );
      const Child = () => <span>Child Content</span>;

      render(<Parent />);
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });
  });

  describe('screen queries', () => {
    it('should find elements by role', () => {
      const TestComponent = () => <button>Click Me</button>;
      render(<TestComponent />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should find elements by label text', () => {
      const TestComponent = () => (
        <div>
          <label htmlFor="input">Name</label>
          <input id="input" />
        </div>
      );
      render(<TestComponent />);

      expect(screen.getByLabelText('Name')).toBeInTheDocument();
    });

    it('should find elements by placeholder', () => {
      const TestComponent = () => <input placeholder="Enter text" />;
      render(<TestComponent />);

      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });
  });
});
