/**
 * Cache adapter interface
 */
export interface CacheAdapter {
  /**
   * Get value from cache
   */
  get<T = any>(key: string): Promise<T | null>;

  /**
   * Set value in cache with optional TTL
   */
  set<T = any>(key: string, value: T, ttl?: number): Promise<void>;

  /**
   * Delete value from cache
   */
  delete(key: string): Promise<void>;

  /**
   * Check if key exists
   */
  has(key: string): Promise<boolean>;

  /**
   * Clear all cache
   */
  clear(): Promise<void>;

  /**
   * Get all keys
   */
  keys(): Promise<string[]>;

  /**
   * Get multiple values
   */
  getMany<T = any>(keys: string[]): Promise<Array<T | null>>;

  /**
   * Set multiple values
   */
  setMany<T = any>(entries: Array<{ key: string; value: T; ttl?: number }>): Promise<void>;

  /**
   * Delete multiple keys
   */
  deleteMany(keys: string[]): Promise<void>;
}

/**
 * Cache entry with metadata
 */
export interface CacheEntry<T = any> {
  value: T;
  expiresAt?: number;
  createdAt: number;
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  /**
   * Default TTL in milliseconds
   */
  defaultTTL?: number;

  /**
   * Key prefix
   */
  prefix?: string;

  /**
   * Enable debug mode
   */
  debug?: boolean;

  /**
   * Serialize function
   */
  serialize?: (value: any) => string;

  /**
   * Deserialize function
   */
  deserialize?: (value: string) => any;
}

/**
 * Redis cache configuration
 */
export interface RedisCacheConfig extends CacheConfig {
  /**
   * Redis URL
   */
  url: string;

  /**
   * Redis host
   */
  host?: string;

  /**
   * Redis port
   */
  port?: number;

  /**
   * Redis password
   */
  password?: string;

  /**
   * Redis database number
   */
  db?: number;
}

/**
 * Browser cache configuration
 */
export interface BrowserCacheConfig extends CacheConfig {
  /**
   * Storage type
   */
  storage?: 'localStorage' | 'sessionStorage' | 'indexedDB';

  /**
   * IndexedDB database name
   */
  dbName?: string;

  /**
   * IndexedDB store name
   */
  storeName?: string;
}

/**
 * Multi-layer cache configuration
 */
export interface MultiLayerCacheConfig {
  /**
   * Layer configurations in priority order
   */
  layers: Array<{
    name: string;
    adapter: CacheAdapter;
    priority: number;
  }>;

  /**
   * Enable write-through (write to all layers)
   */
  writeThrough?: boolean;

  /**
   * Enable write-back (write to primary only)
   */
  writeBack?: boolean;
}

/**
 * Cache statistics
 */
export interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  hitRate: number;
}

/**
 * Cache invalidation strategy
 */
export type InvalidationStrategy = 'ttl' | 'lru' | 'lfu' | 'manual';

/**
 * Cache event types
 */
export type CacheEventType = 'hit' | 'miss' | 'set' | 'delete' | 'clear' | 'expired';

/**
 * Cache event listener
 */
export type CacheEventListener = (event: {
  type: CacheEventType;
  key?: string;
  timestamp: number;
}) => void;
