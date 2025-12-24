import toast, { Toaster, ToasterProps } from 'react-hot-toast';

/**
 * Notification Provider Component
 * Wrapper around react-hot-toast Toaster
 */
export function NotificationProvider(props: ToasterProps) {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
      {...props}
    />
  );
}

export { toast, Toaster };
