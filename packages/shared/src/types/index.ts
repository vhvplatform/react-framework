/**
 * Common types used across modules
 */

/**
 * API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T = unknown> extends ApiResponse<T> {
  meta: PaginationMeta;
}

/**
 * Sort order
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Sort configuration
 */
export interface SortConfig {
  field: string;
  order: SortOrder;
}

/**
 * Filter operator
 */
export type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'between';

/**
 * Filter configuration
 */
export interface FilterConfig {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

/**
 * Query parameters for list endpoints
 */
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: SortConfig;
  filters?: FilterConfig[];
  search?: string;
}

/**
 * Form field validation error
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Generic ID type
 */
export type ID = string | number;

/**
 * Timestamp fields
 */
export interface Timestamps {
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

/**
 * Base entity interface
 */
export interface BaseEntity extends Timestamps {
  id: ID;
}

/**
 * User role enum
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
  VIEWER = 'viewer',
}

/**
 * Permission type
 */
export interface Permission {
  resource: string;
  actions: string[];
}

/**
 * Generic callback type
 */
export type Callback<T = void> = (data: T) => void;

/**
 * Async callback type
 */
export type AsyncCallback<T = void> = (data: T) => Promise<void>;

/**
 * Generic error handler
 */
export type ErrorHandler = (error: Error) => void;

/**
 * Loading state
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Resource state
 */
export interface ResourceState<T> extends LoadingState {
  data: T | null;
}

/**
 * List state
 */
export interface ListState<T> extends LoadingState {
  items: T[];
  meta: PaginationMeta | null;
}
