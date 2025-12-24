import { useState, useCallback } from 'react';

/**
 * Hook for managing table selection
 */
export function useSelection<T extends { id?: any }>(idField: keyof T = 'id' as keyof T) {
  const [selected, setSelected] = useState<Set<any>>(new Set());

  // Select single item
  const select = useCallback(
    (item: T) => {
      setSelected((prev) => {
        const newSet = new Set(prev);
        newSet.add(item[idField]);
        return newSet;
      });
    },
    [idField]
  );

  // Deselect single item
  const deselect = useCallback(
    (item: T) => {
      setSelected((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item[idField]);
        return newSet;
      });
    },
    [idField]
  );

  // Toggle single item
  const toggle = useCallback(
    (item: T) => {
      const id = item[idField];
      setSelected((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    },
    [idField]
  );

  // Select all items
  const selectAll = useCallback(
    (items: T[]) => {
      setSelected(new Set(items.map((item) => item[idField])));
    },
    [idField]
  );

  // Deselect all items
  const deselectAll = useCallback(() => {
    setSelected(new Set());
  }, []);

  // Toggle all items
  const toggleAll = useCallback(
    (items: T[]) => {
      if (selected.size === items.length) {
        deselectAll();
      } else {
        selectAll(items);
      }
    },
    [selected.size, selectAll, deselectAll]
  );

  // Check if item is selected
  const isSelected = useCallback(
    (item: T) => {
      return selected.has(item[idField]);
    },
    [selected, idField]
  );

  // Check if all items are selected
  const isAllSelected = useCallback(
    (items: T[]) => {
      return items.length > 0 && selected.size === items.length;
    },
    [selected.size]
  );

  // Check if some items are selected
  const isSomeSelected = useCallback(
    (items: T[]) => {
      return selected.size > 0 && selected.size < items.length;
    },
    [selected.size]
  );

  // Get selected items
  const getSelected = useCallback(
    (items: T[]) => {
      return items.filter((item) => selected.has(item[idField]));
    },
    [selected, idField]
  );

  return {
    selected,
    selectedCount: selected.size,
    select,
    deselect,
    toggle,
    selectAll,
    deselectAll,
    toggleAll,
    isSelected,
    isAllSelected,
    isSomeSelected,
    getSelected,
  };
}

/**
 * Hook for managing table sorting
 */
export function useSorting<T>(initialSort?: { field: keyof T; order: 'asc' | 'desc' }) {
  const [sort, setSort] = useState<{ field: keyof T; order: 'asc' | 'desc' } | null>(
    initialSort || null
  );

  // Toggle sort
  const toggleSort = useCallback((field: keyof T) => {
    setSort((prev) => {
      if (!prev || prev.field !== field) {
        return { field, order: 'asc' };
      }
      if (prev.order === 'asc') {
        return { field, order: 'desc' };
      }
      return null;
    });
  }, []);

  // Set sort
  const setSortField = useCallback((field: keyof T, order: 'asc' | 'desc' = 'asc') => {
    setSort({ field, order });
  }, []);

  // Clear sort
  const clearSort = useCallback(() => {
    setSort(null);
  }, []);

  // Sort items locally
  const sortItems = useCallback(
    (items: T[]): T[] => {
      if (!sort) return items;

      return [...items].sort((a, b) => {
        const aVal = a[sort.field];
        const bVal = b[sort.field];

        if (aVal === bVal) return 0;

        const comparison = aVal > bVal ? 1 : -1;
        return sort.order === 'asc' ? comparison : -comparison;
      });
    },
    [sort]
  );

  return {
    sort,
    toggleSort,
    setSortField,
    clearSort,
    sortItems,
  };
}

/**
 * Hook for managing table filters
 */
export function useFilters(initialFilters: Record<string, any> = {}) {
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);

  // Set single filter
  const setFilter = useCallback((field: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Remove filter
  const removeFilter = useCallback((field: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[field];
      return newFilters;
    });
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Set multiple filters
  const setMultipleFilters = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
  }, []);

  // Filter items locally
  const filterItems = useCallback(
    <T,>(items: T[]): T[] => {
      if (Object.keys(filters).length === 0) return items;

      return items.filter((item: any) => {
        return Object.entries(filters).every(([field, value]) => {
          if (value === '' || value === null || value === undefined) return true;

          const itemValue = item[field];

          // String contains
          if (typeof value === 'string' && typeof itemValue === 'string') {
            return itemValue.toLowerCase().includes(value.toLowerCase());
          }

          // Exact match for other types
          return itemValue === value;
        });
      });
    },
    [filters]
  );

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== '' && value !== null && value !== undefined
  );

  return {
    filters,
    setFilter,
    removeFilter,
    clearFilters,
    setMultipleFilters,
    filterItems,
    hasActiveFilters,
  };
}
