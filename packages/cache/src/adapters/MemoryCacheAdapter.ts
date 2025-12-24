import { CacheAdapter, CacheConfig, CacheEntry } from '../types';

/**
 * In-Memory (RAM) Cache Adapter
 * Fast cache stored in JavaScript memory
 */
export class MemoryCacheAdapter implements CacheAdapter {
  private cache: Map<string, CacheEntry>;
  private config: CacheConfig;
  private cleanupInterval?: NodeJS.Timeout;

  constructor(config: CacheConfig = {}) {
    this.cache = new Map();
    this.config = {
      defaultTTL: 300000, // 5 minutes default
      prefix: '',
      debug: false,
      ...config,
    };

    // Start cleanup interval for expired entries
    this.startCleanup();
  }

  /**
   * Get prefixed key
   */
  private getKey(key: string): string {
    return this.config.prefix ? `${this.config.prefix}:${key}` : key;
  }

  /**
   * Check if entry is expired
   */
  private isExpired(entry: CacheEntry): boolean {
    if (!entry.expiresAt) return false;
    return Date.now() > entry.expiresAt;
  }

  /**
   * Start cleanup interval
   */
  private startCleanup(): void {
    // Run cleanup every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpired();
    }, 60000);
  }

  /**
   * Stop cleanup interval
   */
  private stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }

  /**
   * Clean up expired entries
   */
  private cleanupExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt && now > entry.expiresAt) {
        this.cache.delete(key);
        if (this.config.debug) {
          console.log(`[MemoryCache] Cleaned up expired key: ${key}`);
        }
      }
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    const fullKey = this.getKey(key);
    const entry = this.cache.get(fullKey);

    if (!entry) {
      if (this.config.debug) {
        console.log(`[MemoryCache] Miss: ${key}`);
      }
      return null;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(fullKey);
      if (this.config.debug) {
        console.log(`[MemoryCache] Expired: ${key}`);
      }
      return null;
    }

    if (this.config.debug) {
      console.log(`[MemoryCache] Hit: ${key}`);
    }
    return entry.value as T;
  }

  async set<T = any>(key: string, value: T, ttl?: number): Promise<void> {
    const fullKey = this.getKey(key);
    const effectiveTTL = ttl ?? this.config.defaultTTL;

    const entry: CacheEntry<T> = {
      value,
      createdAt: Date.now(),
      expiresAt: effectiveTTL ? Date.now() + effectiveTTL : undefined,
    };

    this.cache.set(fullKey, entry);

    if (this.config.debug) {
      console.log(`[MemoryCache] Set: ${key}, TTL: ${effectiveTTL}ms`);
    }
  }

  async delete(key: string): Promise<void> {
    const fullKey = this.getKey(key);
    this.cache.delete(fullKey);

    if (this.config.debug) {
      console.log(`[MemoryCache] Delete: ${key}`);
    }
  }

  async has(key: string): Promise<boolean> {
    const fullKey = this.getKey(key);
    const entry = this.cache.get(fullKey);

    if (!entry) return false;
    if (this.isExpired(entry)) {
      this.cache.delete(fullKey);
      return false;
    }

    return true;
  }

  async clear(): Promise<void> {
    this.cache.clear();

    if (this.config.debug) {
      console.log('[MemoryCache] Cleared all entries');
    }
  }

  async keys(): Promise<string[]> {
    const keys: string[] = [];
    const prefix = this.config.prefix ? `${this.config.prefix}:` : '';

    for (const [key, entry] of this.cache.entries()) {
      if (!this.isExpired(entry)) {
        keys.push(prefix ? key.replace(prefix, '') : key);
      }
    }

    return keys;
  }

  async getMany<T = any>(keys: string[]): Promise<Array<T | null>> {
    const promises = keys.map((key) => this.get<T>(key));
    return Promise.all(promises);
  }

  async setMany<T = any>(entries: Array<{ key: string; value: T; ttl?: number }>): Promise<void> {
    const promises = entries.map((entry) => this.set(entry.key, entry.value, entry.ttl));
    await Promise.all(promises);
  }

  async deleteMany(keys: string[]): Promise<void> {
    const promises = keys.map((key) => this.delete(key));
    await Promise.all(promises);
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Destroy cache and cleanup
   */
  destroy(): void {
    this.stopCleanup();
    this.cache.clear();
  }
}
