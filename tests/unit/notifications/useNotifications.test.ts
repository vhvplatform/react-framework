import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useNotifications } from '@vhvplatform/notifications';
import toast from 'react-hot-toast';
import { renderHook } from '@testing-library/react';

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    promise: vi.fn(),
    dismiss: vi.fn(),
    remove: vi.fn(),
  },
}));

describe('useNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('success', () => {
    it('should call toast.success with message', () => {
      const { result } = renderHook(() => useNotifications());

      result.current.success('Success message');

      expect(toast.success).toHaveBeenCalledWith('Success message', undefined);
    });

    it('should call toast.success with options', () => {
      const { result } = renderHook(() => useNotifications());
      const options = { duration: 5000 };

      result.current.success('Success', options);

      expect(toast.success).toHaveBeenCalledWith('Success', options);
    });
  });

  describe('error', () => {
    it('should call toast.error with message', () => {
      const { result } = renderHook(() => useNotifications());

      result.current.error('Error message');

      expect(toast.error).toHaveBeenCalledWith('Error message', undefined);
    });

    it('should call toast.error with options', () => {
      const { result } = renderHook(() => useNotifications());
      const options = { duration: 3000 };

      result.current.error('Error', options);

      expect(toast.error).toHaveBeenCalledWith('Error', options);
    });
  });

  describe('info', () => {
    it('should call toast with info icon', () => {
      const { result } = renderHook(() => useNotifications());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockToast = vi.fn();
      (toast as any) = mockToast;

      result.current.info('Info message');

      expect(mockToast).toHaveBeenCalledWith('Info message', { icon: 'ℹ️' });
    });
  });

  describe('warning', () => {
    it('should call toast with warning icon', () => {
      const { result } = renderHook(() => useNotifications());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockToast = vi.fn();
      (toast as any) = mockToast;

      result.current.warning('Warning message');

      expect(mockToast).toHaveBeenCalledWith('Warning message', { icon: '⚠️' });
    });
  });

  describe('loading', () => {
    it('should call toast.loading with message', () => {
      const { result } = renderHook(() => useNotifications());

      result.current.loading('Loading...');

      expect(toast.loading).toHaveBeenCalledWith('Loading...', undefined);
    });
  });

  describe('promise', () => {
    it('should call toast.promise with promise and messages', () => {
      const { result } = renderHook(() => useNotifications());
      const mockPromise = Promise.resolve('data');
      const messages = {
        loading: 'Loading...',
        success: 'Success!',
        error: 'Error!',
      };

      result.current.promise(mockPromise, messages);

      expect(toast.promise).toHaveBeenCalledWith(mockPromise, messages, undefined);
    });

    it('should handle function promises', () => {
      const { result } = renderHook(() => useNotifications());
      const mockFn = vi.fn(() => Promise.resolve('data'));
      const messages = {
        loading: 'Loading...',
        success: 'Success!',
        error: 'Error!',
      };

      result.current.promise(mockFn, messages);

      expect(mockFn).toHaveBeenCalled();
    });
  });

  describe('dismiss', () => {
    it('should call toast.dismiss without id', () => {
      const { result } = renderHook(() => useNotifications());

      result.current.dismiss();

      expect(toast.dismiss).toHaveBeenCalledWith(undefined);
    });

    it('should call toast.dismiss with id', () => {
      const { result } = renderHook(() => useNotifications());

      result.current.dismiss('toast-id');

      expect(toast.dismiss).toHaveBeenCalledWith('toast-id');
    });
  });

  describe('remove', () => {
    it('should call toast.remove', () => {
      const { result } = renderHook(() => useNotifications());

      result.current.remove('toast-id');

      expect(toast.remove).toHaveBeenCalledWith('toast-id');
    });
  });

  describe('custom', () => {
    it('should call toast with custom message', () => {
      const { result } = renderHook(() => useNotifications());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockToast = vi.fn();
      (toast as any) = mockToast;

      result.current.custom('Custom message');

      expect(mockToast).toHaveBeenCalledWith('Custom message', undefined);
    });
  });
});
