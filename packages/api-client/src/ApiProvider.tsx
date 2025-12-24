import React, { createContext, useContext, ReactNode } from 'react';
import { ApiClient } from './ApiClient';
import { ApiClientConfig } from './types';

/**
 * API context
 */
const ApiContext = createContext<ApiClient | null>(null);

/**
 * API Provider props
 */
export interface ApiProviderProps {
  /**
   * API client configuration
   */
  config: ApiClientConfig;

  /**
   * Children components
   */
  children: ReactNode;
}

/**
 * API Provider component
 * Provides API client to the application
 */
export function ApiProvider({ config, children }: ApiProviderProps) {
  const apiClient = React.useMemo(() => new ApiClient(config), [config]);

  return <ApiContext.Provider value={apiClient}>{children}</ApiContext.Provider>;
}

/**
 * Hook to access API client
 * @returns ApiClient instance
 * @throws Error if used outside ApiProvider
 */
export function useApi(): ApiClient {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }

  return context;
}
