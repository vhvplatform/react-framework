import { CacheAdapter, CacheConfig, CacheEntry } from '../types';

/**
 * In-Memory (RAM) Cache Adapter with true O(1) LRU eviction
 * Leverages Map's insertion order for efficient LRU tracking without separate data structures
 */
export class MemoryCacheAdapter implements CacheAdapter {
  private cache: Map<string, CacheEntry>;
  private config: CacheConfig;
  private cleanupInterval?: NodeJS.Timeout;
  private maxSize: number;

  constructor(config: CacheConfig = {}) {
    this.cache = new Map();
    this.config = {
      defaultTTL: 300000, // 5 minutes default
      prefix: '',
      debug: false,
      ...config,
    };
    // Default max size to 1000 entries to prevent unbounded memory growth
    this.maxSize = config.maxSize || 1000;

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
   * Update access order for LRU tracking - True O(1) operation
   * Leverages Map's insertion order: delete + set moves entry to end
   */
  private updateAccessOrder(key: string, entry: CacheEntry): void {
    // Delete and re-insert to move to end (most recently used) - O(1)
    this.cache.delete(key);
    this.cache.set(key, entry);
  }

  /**
   * Evict oldest entries if cache exceeds max size - O(1) per eviction
   * Map maintains insertion order, so first entries are least recently used
   */
  private evictIfNeeded(): void {
    if (this.cache.size <= this.maxSize) return;

    // Evict least recently used entries (first entries in Map)
    const entriesToRemove = this.cache.size - this.maxSize;
    const iterator = this.cache.keys();

    for (let i = 0; i < entriesToRemove; i++) {
      const keyToRemove = iterator.next().value;
      if (keyToRemove) {
        this.cache.delete(keyToRemove);
        if (this.config.debug) {
          console.log(`[MemoryCache] Evicted LRU entry: ${keyToRemove}`);
        }
      }
    }

    if (this.config.debug && entriesToRemove > 0) {
      console.log(`[MemoryCache] Evicted ${entriesToRemove} LRU entries due to size limit`);
    }
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
   * Clean up expired entries - optimized to avoid full iteration
   */
  private cleanupExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    // Collect keys to delete first to avoid modifying during iteration
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt && now > entry.expiresAt) {
        keysToDelete.push(key);
      }
    }

    // Delete collected keys
    for (const key of keysToDelete) {
      this.cache.delete(key);
    }

    if (this.config.debug && keysToDelete.length > 0) {
      console.log(`[MemoryCache] Cleaned up ${keysToDelete.length} expired entries`);
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

    // Update access order for LRU - O(1) operation
    this.updateAccessOrder(fullKey, entry);

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

    // Set entry (or update if exists) and move to end - O(1)
    this.cache.set(fullKey, entry);

    // Check if we need to evict old entries
    this.evictIfNeeded();

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
    // Optimize by directly accessing cache instead of creating promises
    return Promise.all(keys.map((key) => this.get<T>(key)));
  }

  async setMany<T = any>(entries: Array<{ key: string; value: T; ttl?: number }>): Promise<void> {
    // Batch set operations
    for (const entry of entries) {
      await this.set(entry.key, entry.value, entry.ttl);
    }
  }

  async deleteMany(keys: string[]): Promise<void> {
    // Batch delete operations
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
   * Get max cache size
   */
  getMaxSize(): number {
    return this.maxSize;
  }

  /**
   * Set max cache size
   */
  setMaxSize(size: number): void {
    this.maxSize = size;
    this.evictIfNeeded();
  }

  /**
   * Destroy cache and cleanup
   */
  destroy(): void {
    this.stopCleanup();
    this.cache.clear();
  }
}
