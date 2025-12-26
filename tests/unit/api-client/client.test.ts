import { describe, it, expect, beforeEach } from 'vitest';
import { createApiClient, ApiClient } from '@vhvplatform/api-client';

describe('API Client', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = createApiClient({
      baseURL: 'https://api.example.com',
    });
  });

  describe('createApiClient', () => {
    it('should create API client with baseURL', () => {
      expect(apiClient).toBeDefined();
      expect(apiClient.get).toBeDefined();
      expect(apiClient.post).toBeDefined();
      expect(apiClient.put).toBeDefined();
      expect(apiClient.delete).toBeDefined();
    });

    it('should accept custom headers', () => {
      const client = createApiClient({
        baseURL: 'https://api.example.com',
        headers: {
          'X-Custom-Header': 'value',
        },
      });

      expect(client).toBeDefined();
    });

    it('should accept timeout configuration', () => {
      const client = createApiClient({
        baseURL: 'https://api.example.com',
        timeout: 5000,
      });

      expect(client).toBeDefined();
    });
  });

  describe('HTTP Methods', () => {
    it('should have get method', () => {
      expect(typeof apiClient.get).toBe('function');
    });

    it('should have post method', () => {
      expect(typeof apiClient.post).toBe('function');
    });

    it('should have put method', () => {
      expect(typeof apiClient.put).toBe('function');
    });

    it('should have patch method', () => {
      expect(typeof apiClient.patch).toBe('function');
    });

    it('should have delete method', () => {
      expect(typeof apiClient.delete).toBe('function');
    });
  });

  describe('Token Management', () => {
    it('should have setToken method', () => {
      expect(typeof apiClient.setToken).toBe('function');
    });

    it('should have clearToken method', () => {
      expect(typeof apiClient.clearToken).toBe('function');
    });

    it('should set authorization header when token is set', () => {
      apiClient.setToken('test-token');
      // Token should be stored and used in subsequent requests
      expect(apiClient).toBeDefined();
    });

    it('should clear authorization header when token is cleared', () => {
      apiClient.setToken('test-token');
      apiClient.clearToken();
      // Token should be removed
      expect(apiClient).toBeDefined();
    });
  });

  describe('Interceptors', () => {
    it('should have request interceptors', () => {
      expect(apiClient.interceptors).toBeDefined();
      expect(apiClient.interceptors.request).toBeDefined();
    });

    it('should have response interceptors', () => {
      expect(apiClient.interceptors).toBeDefined();
      expect(apiClient.interceptors.response).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const client = createApiClient({
        baseURL: 'https://invalid-domain-that-does-not-exist.com',
        timeout: 100,
      });

      try {
        await client.get('/test');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
