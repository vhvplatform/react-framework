import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NotificationProvider } from '@vhvplatform/notifications';

describe('NotificationProvider', () => {
  it('should render without crashing', () => {
    render(
      <>
        <NotificationProvider />
        <div>Test Content</div>
      </>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should accept custom position prop', () => {
    render(
      <>
        <NotificationProvider position="bottom-center" />
        <div>Test</div>
      </>
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should accept custom toastOptions', () => {
    render(
      <>
        <NotificationProvider
          toastOptions={{
            duration: 5000,
            style: { background: '#000' },
          }}
        />
        <div>Test</div>
      </>
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
