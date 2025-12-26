import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiClientConfig, ApiError, ApiResponse, RequestOptions } from './types';

/**
 * API Client for communication with @vhvplatform/go-framework backend
 */
export class ApiClient {
  private client: AxiosInstance;
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = {
      timeout: 30000,
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - add JWT token
    this.client.interceptors.request.use(
      (config) => {
        const skipAuth = (config as RequestOptions).skipAuth;

        if (!skipAuth && this.config.getToken) {
          const token = this.config.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status || 500;
          const data = error.response?.data as ApiResponse;

          // Handle 401 Unauthorized
          if (status === 401) {
            if (this.config.setToken) {
              this.config.setToken(null);
            }
            if (this.config.onUnauthorized) {
              this.config.onUnauthorized();
            }
          }

          // Create ApiError instance
          const apiError = new ApiError(
            data?.message || error.message || 'An error occurred',
            status,
            (data?.data as { code?: string })?.code,
            data?.data as Record<string, unknown>
          );

          // Call error handler if provided
          if (this.config.onError) {
            this.config.onError(apiError);
          }

          return Promise.reject(apiError);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * GET request
   */
  async get<T = unknown>(url: string, options?: RequestOptions): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, options);
    return this.extractData(response);
  }

  /**
   * POST request
   */
  async post<T = unknown>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, options);
    return this.extractData(response);
  }

  /**
   * PUT request
   */
  async put<T = unknown>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, options);
    return this.extractData(response);
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, options);
    return this.extractData(response);
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(url: string, options?: RequestOptions): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, options);
    return this.extractData(response);
  }

  /**
   * Extract data from API response
   */
  private extractData<T>(response: AxiosResponse<ApiResponse<T>>): T {
    const { data } = response;

    // Handle @vhvplatform/go-framework response format
    if (data.success === false) {
      throw new ApiError(
        data.message || 'Request failed',
        response.status,
        (data.data as { code?: string })?.code,
        data.data as Record<string, unknown>
      );
    }

    return data.data as T;
  }

  /**
   * Get the underlying axios instance
   */
  getAxiosInstance(): AxiosInstance {
    return this.client;
  }

  /**
   * Update base URL
   */
  setBaseURL(baseURL: string): void {
    this.client.defaults.baseURL = baseURL;
    this.config.baseURL = baseURL;
  }

  /**
   * Update timeout
   */
  setTimeout(timeout: number): void {
    this.client.defaults.timeout = timeout;
    this.config.timeout = timeout;
  }

  /**
   * Set default header
   */
  setHeader(key: string, value: string): void {
    this.client.defaults.headers.common[key] = value;
  }

  /**
   * Remove default header
   */
  removeHeader(key: string): void {
    delete this.client.defaults.headers.common[key];
  }
}
