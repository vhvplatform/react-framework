import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

/**
 * Generic API fetch function type
 */
export type FetchFunction<TData, TVariables = void> = (variables: TVariables) => Promise<TData>;

/**
 * Hook for fetching data with React Query
 */
export function useFetch<TData = unknown, TError = Error, TVariables = void>(
  key: string | string[],
  fetchFn: FetchFunction<TData, TVariables>,
  variables?: TVariables,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, TError>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: () => fetchFn(variables as TVariables),
    ...options,
  });
}

/**
 * Hook for mutations (create, update, delete)
 */
export function useMutate<TData = unknown, TError = Error, TVariables = void, TContext = unknown>(
  mutationFn: FetchFunction<TData, TVariables>,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
) {
  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn,
    ...options,
  });
}

/**
 * Hook for optimistic updates
 */
export function useOptimisticMutation<TData = unknown, TError = Error, TVariables = void>(
  mutationFn: FetchFunction<TData, TVariables>,
  queryKey: string | string[],
  options?: Omit<UseMutationOptions<TData, TError, TVariables, { previousData?: any }>, 'mutationFn' | 'onMutate' | 'onError' | 'onSettled'>
) {
  const queryClient = useQueryClient();
  const key = Array.isArray(queryKey) ? queryKey : [queryKey];

  return useMutation<TData, TError, TVariables, { previousData?: any }>({
    mutationFn,
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: key });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(key);

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(key, context.previousData);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: key });
    },
    ...options,
  });
}

/**
 * Hook for infinite queries (pagination)
 */
export { useInfiniteQuery } from '@tanstack/react-query';

/**
 * Hook to invalidate queries
 */
export function useInvalidateQueries() {
  const queryClient = useQueryClient();

  return (key: string | string[]) => {
    const queryKey = Array.isArray(key) ? key : [key];
    return queryClient.invalidateQueries({ queryKey });
  };
}

/**
 * Hook to prefetch queries
 */
export function usePrefetch() {
  const queryClient = useQueryClient();

  return async <TData = unknown>(
    key: string | string[],
    fetchFn: () => Promise<TData>
  ) => {
    const queryKey = Array.isArray(key) ? key : [key];
    await queryClient.prefetchQuery({
      queryKey,
      queryFn: fetchFn,
    });
  };
}
