export * from './QueryProvider';
export * from './hooks';
export * from './utils/query-keys';

// Re-export commonly used React Query exports
export {
  QueryClient,
  useQuery,
  useMutation,
  useQueryClient,
  useIsFetching,
  useIsMutating,
} from '@tanstack/react-query';

export type {
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
} from '@tanstack/react-query';
