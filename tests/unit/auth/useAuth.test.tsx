import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useAuth, login, logout, refreshToken } from '@vhvplatform/auth';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: (
        state = { user: null, token: null, isAuthenticated: false, loading: false },
        action
      ) => {
        switch (action.type) {
          case 'auth/login/fulfilled':
            return {
              ...state,
              user: action.payload.user,
              token: action.payload.token,
              isAuthenticated: true,
            };
          case 'auth/logout':
            return { user: null, token: null, isAuthenticated: false, loading: false };
          default:
            return state;
        }
      },
    },
    preloadedState: initialState,
  });
};

const createWrapper = (store: ReturnType<typeof createMockStore>) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  Wrapper.displayName = 'AuthWrapper';
  return Wrapper;
};

describe('Auth Package', () => {
  describe('useAuth Hook', () => {
    it('should return initial auth state', () => {
      const store = createMockStore();
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(store),
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });

    it('should return authenticated state when user is logged in', () => {
      const store = createMockStore({
        auth: {
          user: { id: 1, name: 'Test User', email: 'test@example.com' },
          token: 'test-token',
          isAuthenticated: true,
          loading: false,
        },
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(store),
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual({ id: 1, name: 'Test User', email: 'test@example.com' });
      expect(result.current.token).toBe('test-token');
    });

    it('should return loading state', () => {
      const store = createMockStore({
        auth: {
          user: null,
          token: null,
          isAuthenticated: false,
          loading: true,
        },
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(store),
      });

      expect(result.current.loading).toBe(true);
    });
  });

  describe('Auth Actions', () => {
    it('should have login action', () => {
      expect(login).toBeDefined();
      expect(typeof login).toBe('function');
    });

    it('should have logout action', () => {
      expect(logout).toBeDefined();
      expect(typeof logout).toBe('function');
    });

    it('should have refreshToken action', () => {
      expect(refreshToken).toBeDefined();
      expect(typeof refreshToken).toBe('function');
    });
  });
});
