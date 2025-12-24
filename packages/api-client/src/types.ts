import { AxiosRequestConfig } from 'axios';

/**
 * API client configuration
 */
export interface ApiClientConfig {
  /**
   * Base URL for API requests
   */
  baseURL: string;

  /**
   * Request timeout in milliseconds
   */
  timeout?: number;

  /**
   * Custom headers
   */
  headers?: Record<string, string>;

  /**
   * Token getter function
   */
  getToken?: () => string | null;

  /**
   * Token setter function
   */
  setToken?: (token: string | null) => void;

  /**
   * Unauthorized handler (401 response)
   */
  onUnauthorized?: () => void;

  /**
   * Error handler
   */
  onError?: (error: ApiError) => void;
}

/**
 * API error response from @longvhv/saas-framework-go
 */
export interface ApiErrorResponse {
  /**
   * Error message
   */
  message: string;

  /**
   * Error code
   */
  code?: string;

  /**
   * Error details
   */
  details?: Record<string, unknown>;

  /**
   * HTTP status code
   */
  status?: number;
}

/**
 * API error class
 */
export class ApiError extends Error {
  public status: number;
  public code?: string;
  public details?: Record<string, unknown>;

  constructor(message: string, status: number, code?: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * API success response wrapper from @longvhv/saas-framework-go
 */
export interface ApiResponse<T = unknown> {
  /**
   * Success flag
   */
  success: boolean;

  /**
   * Response data
   */
  data?: T;

  /**
   * Error message (if success is false)
   */
  message?: string;

  /**
   * Metadata
   */
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: unknown;
  };
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Request options
 */
export interface RequestOptions extends AxiosRequestConfig {
  /**
   * Skip authorization header
   */
  skipAuth?: boolean;
}
