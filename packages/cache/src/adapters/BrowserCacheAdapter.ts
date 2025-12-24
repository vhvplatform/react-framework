import { CacheAdapter, BrowserCacheConfig, CacheEntry } from '../types';

export class BrowserCacheAdapter implements CacheAdapter {
  private storage: Storage;
  private config: BrowserCacheConfig;

  constructor(config: BrowserCacheConfig = {}) {
    this.config = {
      storage: 'localStorage',
      prefix: 'cache',
      defaultTTL: 3600000,
      ...config,
    };
    
    this.storage = config.storage === 'sessionStorage' ? sessionStorage : localStorage;
  }

  private getKey(key: string): string {
    return `${this.config.prefix}:${key}`;
  }

  async get<T = any>(key: string): Promise<T | null> {
    try {
      const item = this.storage.getItem(this.getKey(key));
      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);
      if (entry.expiresAt && Date.now() > entry.expiresAt) {
        await this.delete(key);
        return null;
      }

      return entry.value;
    } catch (error) {
      console.error('BrowserCache get error:', error);
      return null;
    }
  }

  async set<T = any>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const effectiveTTL = ttl ?? this.config.defaultTTL;
      const entry: CacheEntry<T> = {
        value,
        createdAt: Date.now(),
        expiresAt: effectiveTTL ? Date.now() + effectiveTTL : undefined,
      };

      this.storage.setItem(this.getKey(key), JSON.stringify(entry));
    } catch (error) {
      console.error('BrowserCache set error:', error);
    }
  }

  async delete(key: string): Promise<void> {
    this.storage.removeItem(this.getKey(key));
  }

  async has(key: string): Promise<boolean> {
    return this.storage.getItem(this.getKey(key)) !== null;
  }

  async clear(): Promise<void> {
    const prefix = `${this.config.prefix}:`;
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key?.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => this.storage.removeItem(key));
  }

  async keys(): Promise<string[]> {
    const prefix = `${this.config.prefix}:`;
    const keys: string[] = [];
    
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key?.startsWith(prefix)) {
        keys.push(key.replace(prefix, ''));
      }
    }
    
    return keys;
  }

  async getMany<T = any>(keys: string[]): Promise<Array<T | null>> {
    return Promise.all(keys.map(key => this.get<T>(key)));
  }

  async setMany<T = any>(entries: Array<{ key: string; value: T; ttl?: number }>): Promise<void> {
    await Promise.all(entries.map(entry => this.set(entry.key, entry.value, entry.ttl)));
  }

  async deleteMany(keys: string[]): Promise<void> {
    await Promise.all(keys.map(key => this.delete(key)));
  }
}
