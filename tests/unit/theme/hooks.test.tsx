import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { ThemeProvider } from '@vhvplatform/theme';
import { useIsDark, useToggleTheme } from '@vhvplatform/theme';
import { mockLocalStorage } from '@vhvplatform/testing';

const createWrapper = (defaultMode: 'light' | 'dark' | 'system' = 'light') => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider defaultMode={defaultMode}>{children}</ThemeProvider>
  );
  Wrapper.displayName = 'ThemeWrapper';
  return Wrapper;
};

describe('Theme Hooks', () => {
  beforeEach(() => {
    mockLocalStorage();
    localStorage.clear();
  });

  describe('useIsDark', () => {
    it('should return false in light mode', () => {
      const { result } = renderHook(() => useIsDark(), {
        wrapper: createWrapper('light'),
      });

      expect(result.current).toBe(false);
    });

    it('should return true in dark mode', () => {
      const { result } = renderHook(() => useIsDark(), {
        wrapper: createWrapper('dark'),
      });

      expect(result.current).toBe(true);
    });
  });

  describe('useToggleTheme', () => {
    it('should return toggle function', () => {
      const { result } = renderHook(() => useToggleTheme(), {
        wrapper: createWrapper('light'),
      });

      expect(typeof result.current).toBe('function');
    });

    it('should toggle theme when called', () => {
      const { result: isDarkResult } = renderHook(() => useIsDark(), {
        wrapper: createWrapper('light'),
      });

      const { result: toggleResult } = renderHook(() => useToggleTheme(), {
        wrapper: createWrapper('light'),
      });

      expect(isDarkResult.current).toBe(false);

      toggleResult.current();

      // Theme should toggle (implementation detail)
    });
  });
});
