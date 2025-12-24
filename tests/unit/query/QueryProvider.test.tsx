import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { QueryProvider, defaultQueryClient } from '@longvhv/query';

describe('QueryProvider', () => {
  it('should render children', () => {
    render(
      <QueryProvider>
        <div>Test Content</div>
      </QueryProvider>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should use default query client', () => {
    render(
      <QueryProvider>
        <div>Test</div>
      </QueryProvider>
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should accept custom query client', () => {
    const customClient = new QueryClient();

    render(
      <QueryProvider client={customClient}>
        <div>Test</div>
      </QueryProvider>
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should export defaultQueryClient', () => {
    expect(defaultQueryClient).toBeDefined();
    expect(defaultQueryClient).toBeInstanceOf(QueryClient);
  });
});
