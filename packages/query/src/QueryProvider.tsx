import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Default query client configuration
 */
const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

/**
 * Query Provider Props
 */
export interface QueryProviderProps {
  children: ReactNode;
  client?: QueryClient;
}

/**
 * Query Provider Component
 * Wrapper around React Query's QueryClientProvider
 */
export function QueryProvider({ children, client = defaultQueryClient }: QueryProviderProps) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export { defaultQueryClient };
