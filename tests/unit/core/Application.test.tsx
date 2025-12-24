import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Application } from '@longvhv/core';

const createMockStore = () => {
  return configureStore({
    reducer: {
      app: (state = {}) => state,
    },
  });
};

describe('Core Package - Application', () => {
  it('should render without crashing', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <Application />
      </Provider>
    );

    expect(container).toBeInTheDocument();
  });

  it('should render children', () => {
    const store = createMockStore();
    const { getByText } = render(
      <Provider store={store}>
        <Application>
          <div>Test Content</div>
        </Application>
      </Provider>
    );

    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('should provide store context', () => {
    const store = createMockStore();
    const TestComponent = () => {
      return <div>App Running</div>;
    };

    const { getByText } = render(
      <Provider store={store}>
        <Application>
          <TestComponent />
        </Application>
      </Provider>
    );

    expect(getByText('App Running')).toBeInTheDocument();
  });
});
