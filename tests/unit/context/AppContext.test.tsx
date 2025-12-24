import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { AppContextProvider, useAppContext } from '@longvhv/context';
import { ApiProvider } from '@longvhv/api-client';

const createWrapper = () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ApiProvider baseURL="https://api.example.com">
      <AppContextProvider
        application={{
          id: 'test-app',
          name: 'Test App',
          version: '1.0.0',
          environment: 'development',
          apiUrl: 'https://api.example.com',
          features: {},
          config: {},
        }}
      >
        {children}
      </AppContextProvider>
    </ApiProvider>
  );
  Wrapper.displayName = 'ContextWrapper';
  return Wrapper;
};

describe('Context Package', () => {
  describe('useAppContext', () => {
    it('should provide context values', () => {
      const { result } = renderHook(() => useAppContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.application).toBeDefined();
      expect(result.current.application.id).toBe('test-app');
    });

    it('should have user state', () => {
      const { result } = renderHook(() => useAppContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current.user).toBeNull();
    });

    it('should have tenant state', () => {
      const { result } = renderHook(() => useAppContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current.tenant).toBeNull();
    });

    it('should have site state', () => {
      const { result } = renderHook(() => useAppContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current.site).toBeNull();
    });

    it('should have setUser method', () => {
      const { result } = renderHook(() => useAppContext(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.setUser).toBe('function');
    });

    it('should have setTenant method', () => {
      const { result } = renderHook(() => useAppContext(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.setTenant).toBe('function');
    });

    it('should have setSite method', () => {
      const { result } = renderHook(() => useAppContext(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.setSite).toBe('function');
    });

    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useAppContext());
      }).toThrow();
    });
  });
});
