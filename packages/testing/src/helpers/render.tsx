import { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';

/**
 * Custom render function with common providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  return render(ui, { ...options });
}

/**
 * Re-export everything from testing library
 */
export * from '@testing-library/react';
export { renderWithProviders as render };
