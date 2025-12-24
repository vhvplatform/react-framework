import toast from 'react-hot-toast';

/**
 * Notification options
 */
export interface NotificationOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  icon?: string;
}

/**
 * Hook for showing notifications
 */
export function useNotifications() {
  /**
   * Show success notification
   */
  const success = (message: string, options?: NotificationOptions) => {
    return toast.success(message, options);
  };

  /**
   * Show error notification
   */
  const error = (message: string, options?: NotificationOptions) => {
    return toast.error(message, options);
  };

  /**
   * Show info notification
   */
  const info = (message: string, options?: NotificationOptions) => {
    return toast(message, {
      icon: 'ℹ️',
      ...options,
    });
  };

  /**
   * Show warning notification
   */
  const warning = (message: string, options?: NotificationOptions) => {
    return toast(message, {
      icon: '⚠️',
      ...options,
    });
  };

  /**
   * Show loading notification
   */
  const loading = (message: string, options?: NotificationOptions) => {
    return toast.loading(message, options);
  };

  /**
   * Show promise notification
   * Automatically shows loading, success, and error states
   */
  const promise = <T,>(
    promiseOrFunction: Promise<T> | (() => Promise<T>),
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: NotificationOptions
  ) => {
    const promise = typeof promiseOrFunction === 'function' 
      ? promiseOrFunction() 
      : promiseOrFunction;

    return toast.promise(promise, messages, options);
  };

  /**
   * Dismiss a notification
   */
  const dismiss = (toastId?: string) => {
    return toast.dismiss(toastId);
  };

  /**
   * Remove a notification
   */
  const remove = (toastId?: string) => {
    return toast.remove(toastId);
  };

  /**
   * Custom notification
   */
  const custom = (message: string | ((t: any) => JSX.Element), options?: NotificationOptions) => {
    return toast(message as any, options);
  };

  return {
    success,
    error,
    info,
    warning,
    loading,
    promise,
    dismiss,
    remove,
    custom,
  };
}
