/**
 * Pagination helper
 */
export interface PaginationParams {
  page: number;
  perPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

/**
 * Build pagination query key
 */
export function paginationKey(baseKey: string, params: PaginationParams): string[] {
  return [baseKey, 'page', String(params.page), 'perPage', String(params.perPage)];
}

/**
 * Build filter query key
 */
export function filterKey(baseKey: string, filters: Record<string, any>): string[] {
  const filterKeys = Object.keys(filters)
    .sort()
    .flatMap(key => [key, String(filters[key])]);
  
  return [baseKey, 'filters', ...filterKeys];
}

/**
 * Build search query key
 */
export function searchKey(baseKey: string, searchTerm: string): string[] {
  return [baseKey, 'search', searchTerm];
}

/**
 * Combine multiple query keys
 */
export function combineKeys(...keys: (string | string[])[]): string[] {
  return keys.flat();
}
