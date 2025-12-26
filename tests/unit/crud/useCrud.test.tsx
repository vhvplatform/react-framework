import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCrud } from '@vhvplatform/crud';
import { ApiProvider } from '@vhvplatform/api-client';

const createWrapper = () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ApiProvider baseURL="https://api.example.com">{children}</ApiProvider>
  );
  Wrapper.displayName = 'CrudWrapper';
  return Wrapper;
};

describe('CRUD Package', () => {
  describe('useCrud', () => {
    it('should provide CRUD operations', () => {
      const { result } = renderHook(() => useCrud('/users'), {
        wrapper: createWrapper(),
      });

      expect(result.current.items).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should have create method', () => {
      const { result } = renderHook(() => useCrud('/users'), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.create).toBe('function');
    });

    it('should have update method', () => {
      const { result } = renderHook(() => useCrud('/users'), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.update).toBe('function');
    });

    it('should have deleteItem method', () => {
      const { result } = renderHook(() => useCrud('/users'), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.deleteItem).toBe('function');
    });

    it('should have fetch method', () => {
      const { result } = renderHook(() => useCrud('/users'), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.fetch).toBe('function');
    });

    it('should have fetchOne method', () => {
      const { result } = renderHook(() => useCrud('/users'), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.fetchOne).toBe('function');
    });

    it('should initialize with empty items', () => {
      const { result } = renderHook(() => useCrud('/users'), {
        wrapper: createWrapper(),
      });

      expect(result.current.items).toEqual([]);
      expect(result.current.total).toBe(0);
    });

    it('should handle pagination', () => {
      const { result } = renderHook(() => useCrud('/users'), {
        wrapper: createWrapper(),
      });

      expect(result.current.page).toBe(1);
      expect(result.current.perPage).toBe(10);
      expect(typeof result.current.setPage).toBe('function');
    });
  });
});
