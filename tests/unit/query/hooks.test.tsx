import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFetch, useMutate, useInvalidateQueries, usePrefetch } from '@longvhv/query';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientWrapper';

  return Wrapper;
};

describe('Query Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useFetch', () => {
    it('should fetch data successfully', async () => {
      const mockFetch = vi.fn(() => Promise.resolve({ data: 'test' }));

      const { result } = renderHook(() => useFetch('test-key', mockFetch, undefined), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({ data: 'test' });
      expect(mockFetch).toHaveBeenCalled();
    });

    it('should handle fetch errors', async () => {
      const mockFetch = vi.fn(() => Promise.reject(new Error('Fetch failed')));

      const { result } = renderHook(() => useFetch('test-key', mockFetch, undefined), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
    });

    it('should accept array key', async () => {
      const mockFetch = vi.fn(() => Promise.resolve({ data: 'test' }));

      const { result } = renderHook(() => useFetch(['test', 'key'], mockFetch, undefined), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalled();
    });

    it('should pass variables to fetch function', async () => {
      const mockFetch = vi.fn((vars) => Promise.resolve(vars));
      const variables = { id: 1 };

      const { result } = renderHook(() => useFetch('test-key', mockFetch, variables), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(variables);
    });
  });

  describe('useMutate', () => {
    it('should mutate data successfully', async () => {
      const mockMutate = vi.fn((data) => Promise.resolve(data));

      const { result } = renderHook(() => useMutate(mockMutate), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: 1, name: 'Test' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockMutate).toHaveBeenCalledWith({ id: 1, name: 'Test' });
    });

    it('should handle mutation errors', async () => {
      const mockMutate = vi.fn(() => Promise.reject(new Error('Mutation failed')));

      const { result } = renderHook(() => useMutate(mockMutate), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ data: 'test' });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
    });

    it('should call onSuccess callback', async () => {
      const mockMutate = vi.fn(() => Promise.resolve({ success: true }));
      const onSuccess = vi.fn();

      const { result } = renderHook(() => useMutate(mockMutate, { onSuccess }), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ data: 'test' });

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('useInvalidateQueries', () => {
    it('should invalidate query by key', async () => {
      const mockFetch = vi.fn(() => Promise.resolve({ data: 'test' }));

      const wrapper = createWrapper();

      const { result: fetchResult } = renderHook(() => useFetch('test-key', mockFetch, undefined), {
        wrapper,
      });

      await waitFor(() => {
        expect(fetchResult.current.isSuccess).toBe(true);
      });

      const { result: invalidateResult } = renderHook(() => useInvalidateQueries(), {
        wrapper,
      });

      invalidateResult.current('test-key');

      // Query should be invalidated
      expect(mockFetch).toHaveBeenCalled();
    });

    it('should handle array keys', () => {
      const { result } = renderHook(() => useInvalidateQueries(), {
        wrapper: createWrapper(),
      });

      expect(() => result.current(['test', 'key'])).not.toThrow();
    });
  });

  describe('usePrefetch', () => {
    it('should prefetch data', async () => {
      const mockFetch = vi.fn(() => Promise.resolve({ data: 'prefetched' }));

      const { result } = renderHook(() => usePrefetch(), {
        wrapper: createWrapper(),
      });

      await result.current('prefetch-key', mockFetch);

      expect(mockFetch).toHaveBeenCalled();
    });

    it('should handle array keys for prefetch', async () => {
      const mockFetch = vi.fn(() => Promise.resolve({ data: 'test' }));

      const { result } = renderHook(() => usePrefetch(), {
        wrapper: createWrapper(),
      });

      await result.current(['prefetch', 'key'], mockFetch);

      expect(mockFetch).toHaveBeenCalled();
    });
  });
});
