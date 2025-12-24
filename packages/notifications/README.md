# @longvhv/notifications

Toast notification system with react-hot-toast integration for the SaaS Framework.

## Features

- 🔔 **Toast Notifications** - Beautiful toast notifications
- ✅ **Success/Error/Warning** - Pre-styled notification types
- 🔄 **Promise Notifications** - Automatic loading/success/error states
- 🎨 **Customizable** - Full customization support
- ⚛️ **React Hook** - Simple hook-based API
- 📍 **Positioning** - Multiple position options

## Installation

```bash
pnpm add @longvhv/notifications react-hot-toast
```

## Usage

### Setup Notification Provider

```tsx
import { NotificationProvider } from '@longvhv/notifications';

function App() {
  return (
    <>
      <NotificationProvider />
      <YourApp />
    </>
  );
}
```

### Use Notifications Hook

```tsx
import { useNotifications } from '@longvhv/notifications';

function MyComponent() {
  const notifications = useNotifications();
  
  const handleSuccess = () => {
    notifications.success('Operation completed successfully!');
  };
  
  const handleError = () => {
    notifications.error('Something went wrong!');
  };
  
  const handleInfo = () => {
    notifications.info('Here is some information');
  };
  
  const handleWarning = () => {
    notifications.warning('Please be careful!');
  };
  
  return (
    <div>
      <button onClick={handleSuccess}>Success</button>
      <button onClick={handleError}>Error</button>
      <button onClick={handleInfo}>Info</button>
      <button onClick={handleWarning}>Warning</button>
    </div>
  );
}
```

### Promise Notifications

```tsx
import { useNotifications } from '@longvhv/notifications';

function MyComponent() {
  const notifications = useNotifications();
  
  const handleSave = async () => {
    await notifications.promise(
      saveData(),
      {
        loading: 'Saving...',
        success: 'Data saved successfully!',
        error: 'Failed to save data',
      }
    );
  };
  
  return <button onClick={handleSave}>Save</button>;
}
```

### Custom Options

```tsx
notifications.success('Success!', {
  duration: 5000,
  position: 'bottom-center',
  icon: '🎉',
});
```

### Loading State

```tsx
const toastId = notifications.loading('Processing...');

// Later...
notifications.dismiss(toastId);
notifications.success('Done!');
```

## API Reference

### useNotifications Hook

Returns an object with the following methods:

- `success(message, options?)` - Show success notification
- `error(message, options?)` - Show error notification
- `info(message, options?)` - Show info notification
- `warning(message, options?)` - Show warning notification
- `loading(message, options?)` - Show loading notification
- `promise(promise, messages, options?)` - Show promise-based notification
- `dismiss(toastId?)` - Dismiss notification
- `remove(toastId?)` - Remove notification
- `custom(message, options?)` - Show custom notification

### NotificationOptions

- `duration?` - Duration in milliseconds (default: 4000)
- `position?` - Position on screen
  - 'top-left' | 'top-center' | 'top-right'
  - 'bottom-left' | 'bottom-center' | 'bottom-right'
- `icon?` - Custom icon (emoji or string)

### NotificationProvider Props

Accepts all props from react-hot-toast's `Toaster` component:

- `position?` - Default position for toasts
- `reverseOrder?` - Reverse order of toasts
- `gutter?` - Gap between toasts
- `toastOptions?` - Default options for all toasts

## Examples

### API Error Handling

```tsx
const handleSubmit = async (data: FormData) => {
  try {
    await api.post('/data', data);
    notifications.success('Data submitted successfully!');
  } catch (error) {
    notifications.error(error.message || 'Failed to submit data');
  }
};
```

### Async Operation with Promise

```tsx
const deleteItem = async (id: string) => {
  await notifications.promise(
    api.delete(`/items/${id}`),
    {
      loading: 'Deleting item...',
      success: 'Item deleted successfully!',
      error: (err) => `Failed to delete: ${err.message}`,
    }
  );
};
```

### Custom Notification

```tsx
notifications.custom((t) => (
  <div className="bg-blue-500 text-white p-4 rounded">
    <h3>Custom Notification</h3>
    <p>This is a custom notification!</p>
    <button onClick={() => notifications.dismiss(t.id)}>
      Dismiss
    </button>
  </div>
));
```
