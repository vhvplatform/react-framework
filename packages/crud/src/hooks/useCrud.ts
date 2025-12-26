import { useState, useCallback, useEffect } from 'react';
import { useApi } from '@vhvplatform/api-client';
import {
  CrudState,
  CrudActions,
  CrudConfig,
  QueryParams,
  PaginatedResponse,
} from '../types';

/**
 * Main CRUD hook for managing resource operations
 */
export function useCrud<T extends { id?: any }, CreateDto = Partial<T>, UpdateDto = Partial<T>>(
  config: CrudConfig<T>
): CrudState<T> & CrudActions<T, CreateDto, UpdateDto> {
  const {
    resource,
    endpoint,
    idField = 'id' as keyof T,
    initialLimit = 20,
    autoFetch = false,
    onSuccess,
    onError,
  } = config;

  const apiClient = useApi();
  const baseEndpoint = endpoint || `/api/${resource}`;

  // State
  const [state, setState] = useState<CrudState<T>>({
    item: null,
    items: [],
    loading: false,
    error: null,
    operation: null,
    total: 0,
    page: 1,
    limit: initialLimit,
  });

  // Fetch all items
  const fetchAll = useCallback(
    async (params: QueryParams = {}) => {
      setState((prev) => ({ ...prev, loading: true, error: null, operation: 'list' }));

      try {
        const queryParams = {
          page: params.page || state.page,
          limit: params.limit || state.limit,
          ...params,
        };

        const response = await apiClient.get<PaginatedResponse<T> | T[]>(baseEndpoint, {
          params: queryParams,
        });

        // Handle both paginated and non-paginated responses
        if (Array.isArray(response)) {
          setState((prev) => ({
            ...prev,
            items: response,
            total: response.length,
            loading: false,
            operation: null,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            items: response.data,
            total: response.total,
            page: response.page,
            limit: response.limit,
            loading: false,
            operation: null,
          }));
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch items';
        setState((prev) => ({ ...prev, error: errorMessage, loading: false, operation: null }));
        onError?.fetch?.(error instanceof Error ? error : new Error(errorMessage));
      }
    },
    [apiClient, baseEndpoint, state.page, state.limit, onError]
  );

  // Fetch single item
  const fetchOne = useCallback(
    async (id: string | number) => {
      setState((prev) => ({ ...prev, loading: true, error: null, operation: 'read' }));

      try {
        const item = await apiClient.get<T>(`${baseEndpoint}/${id}`);
        setState((prev) => ({
          ...prev,
          item,
          loading: false,
          operation: null,
        }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch item';
        setState((prev) => ({ ...prev, error: errorMessage, loading: false, operation: null }));
        onError?.fetch?.(error instanceof Error ? error : new Error(errorMessage));
      }
    },
    [apiClient, baseEndpoint, onError]
  );

  // Create item
  const create = useCallback(
    async (data: CreateDto): Promise<T> => {
      setState((prev) => ({ ...prev, loading: true, error: null, operation: 'create' }));

      try {
        const newItem = await apiClient.post<T>(baseEndpoint, data);

        setState((prev) => ({
          ...prev,
          items: [newItem, ...prev.items],
          total: prev.total + 1,
          item: newItem,
          loading: false,
          operation: null,
        }));

        onSuccess?.create?.(newItem);
        return newItem;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create item';
        setState((prev) => ({ ...prev, error: errorMessage, loading: false, operation: null }));
        onError?.create?.(error instanceof Error ? error : new Error(errorMessage));
        throw error;
      }
    },
    [apiClient, baseEndpoint, onSuccess, onError]
  );

  // Update item
  const update = useCallback(
    async (id: string | number, data: UpdateDto): Promise<T> => {
      setState((prev) => ({ ...prev, loading: true, error: null, operation: 'update' }));

      try {
        const updatedItem = await apiClient.put<T>(`${baseEndpoint}/${id}`, data);

        setState((prev) => ({
          ...prev,
          items: prev.items.map((item) =>
            item[idField] === id ? updatedItem : item
          ),
          item: updatedItem,
          loading: false,
          operation: null,
        }));

        onSuccess?.update?.(updatedItem);
        return updatedItem;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update item';
        setState((prev) => ({ ...prev, error: errorMessage, loading: false, operation: null }));
        onError?.update?.(error instanceof Error ? error : new Error(errorMessage));
        throw error;
      }
    },
    [apiClient, baseEndpoint, idField, onSuccess, onError]
  );

  // Delete item
  const remove = useCallback(
    async (id: string | number): Promise<void> => {
      setState((prev) => ({ ...prev, loading: true, error: null, operation: 'delete' }));

      try {
        await apiClient.delete(`${baseEndpoint}/${id}`);

        setState((prev) => ({
          ...prev,
          items: prev.items.filter((item) => item[idField] !== id),
          total: prev.total - 1,
          item: null,
          loading: false,
          operation: null,
        }));

        onSuccess?.delete?.(id);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete item';
        setState((prev) => ({ ...prev, error: errorMessage, loading: false, operation: null }));
        onError?.delete?.(error instanceof Error ? error : new Error(errorMessage));
        throw error;
      }
    },
    [apiClient, baseEndpoint, idField, onSuccess, onError]
  );

  // Reset state
  const reset = useCallback(() => {
    setState({
      item: null,
      items: [],
      loading: false,
      error: null,
      operation: null,
      total: 0,
      page: 1,
      limit: initialLimit,
    });
  }, [initialLimit]);

  // Set current item
  const setItem = useCallback((item: T | null) => {
    setState((prev) => ({ ...prev, item }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchAll();
    }
  }, [autoFetch]); // Only run on mount

  return {
    ...state,
    fetchAll,
    fetchOne,
    create,
    update,
    remove,
    reset,
    setItem,
    clearError,
  };
}
