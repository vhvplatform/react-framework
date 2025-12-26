import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@vhvplatform/theme';
import { mockLocalStorage } from '@vhvplatform/testing';

// Test component that uses the theme
const TestComponent = () => {
  const { theme, mode, isDark, setMode, toggleMode } = useTheme();

  return (
    <div>
      <div data-testid="mode">{mode}</div>
      <div data-testid="is-dark">{isDark.toString()}</div>
      <div data-testid="theme-mode">{theme.mode}</div>
      <div data-testid="primary-color">{theme.colors.primary}</div>
      <button onClick={() => setMode('dark')} data-testid="set-dark">
        Dark
      </button>
      <button onClick={() => setMode('light')} data-testid="set-light">
        Light
      </button>
      <button onClick={() => setMode('system')} data-testid="set-system">
        System
      </button>
      <button onClick={toggleMode} data-testid="toggle">
        Toggle
      </button>
    </div>
  );
};

describe('Theme Package', () => {
  beforeEach(() => {
    mockLocalStorage();
    localStorage.clear();

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)' ? false : true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  describe('ThemeProvider', () => {
    it('should provide default light theme', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('mode')).toHaveTextContent('system');
      expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
    });

    it('should initialize with custom default mode', () => {
      render(
        <ThemeProvider defaultMode="dark">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('mode')).toHaveTextContent('dark');
      expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
    });

    it('should load saved mode from localStorage', () => {
      localStorage.setItem('saas_theme_mode', 'dark');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    });

    it('should use custom storage key', () => {
      localStorage.setItem('custom_key', 'dark');

      render(
        <ThemeProvider storageKey="custom_key">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    });

    it('should provide theme colors', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('primary-color')).toHaveTextContent('#3b82f6');
    });

    it('should throw error when useTheme is used outside provider', () => {
      const ErrorComponent = () => {
        try {
          useTheme();
          return <div>Should not reach here</div>;
        } catch (error) {
          return <div data-testid="error">{(error as Error).message}</div>;
        }
      };

      render(<ErrorComponent />);
      expect(screen.getByTestId('error')).toHaveTextContent(
        'useTheme must be used within ThemeProvider'
      );
    });
  });

  describe('Theme Switching', () => {
    it('should switch to dark mode', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const darkButton = screen.getByTestId('set-dark');
      darkButton.click();

      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('dark');
        expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
      });
    });

    it('should switch to light mode', async () => {
      render(
        <ThemeProvider defaultMode="dark">
          <TestComponent />
        </ThemeProvider>
      );

      const lightButton = screen.getByTestId('set-light');
      lightButton.click();

      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('light');
        expect(screen.getByTestId('is-dark')).toHaveTextContent('false');
      });
    });

    it('should persist mode to localStorage', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const darkButton = screen.getByTestId('set-dark');
      darkButton.click();

      await waitFor(() => {
        expect(localStorage.getItem('saas_theme_mode')).toBe('dark');
      });
    });

    it('should toggle between light and dark', async () => {
      render(
        <ThemeProvider defaultMode="light">
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId('toggle');

      // First toggle: light -> dark
      toggleButton.click();
      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('dark');
      });

      // Second toggle: dark -> light
      toggleButton.click();
      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('light');
      });
    });

    it('should toggle from system to light/dark based on system preference', async () => {
      render(
        <ThemeProvider defaultMode="system">
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId('toggle');
      toggleButton.click();

      await waitFor(() => {
        const mode = screen.getByTestId('mode').textContent;
        expect(['light', 'dark']).toContain(mode);
      });
    });
  });

  describe('isDark Helper', () => {
    it('should return true in dark mode', () => {
      render(
        <ThemeProvider defaultMode="dark">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
    });

    it('should return false in light mode', () => {
      render(
        <ThemeProvider defaultMode="light">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('is-dark')).toHaveTextContent('false');
    });
  });

  describe('Custom Theme', () => {
    it('should apply custom theme colors', () => {
      const customTheme = {
        colors: {
          primary: '#ff0000',
        },
      };

      render(
        <ThemeProvider customTheme={customTheme}>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('primary-color')).toHaveTextContent('#ff0000');
    });

    it('should merge custom theme with default theme', () => {
      const customTheme = {
        colors: {
          primary: '#ff0000',
          // Other colors should still be available from default theme
        },
      };

      const TestColorComponent = () => {
        const { theme } = useTheme();
        return (
          <div>
            <div data-testid="primary">{theme.colors.primary}</div>
            <div data-testid="secondary">{theme.colors.secondary}</div>
          </div>
        );
      };

      render(
        <ThemeProvider customTheme={customTheme}>
          <TestColorComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('primary')).toHaveTextContent('#ff0000');
      expect(screen.getByTestId('secondary')).toHaveTextContent('#6366f1');
    });
  });

  describe('System Theme Detection', () => {
    it('should detect dark system preference', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(prefers-color-scheme: dark)' ? true : false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(
        <ThemeProvider defaultMode="system">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
    });

    it('should detect light system preference', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(prefers-color-scheme: dark)' ? false : true,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(
        <ThemeProvider defaultMode="system">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('is-dark')).toHaveTextContent('false');
    });
  });
});
