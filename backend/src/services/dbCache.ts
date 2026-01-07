import { query } from '../config/database';

interface CacheEntry<T = any> {
  data: T;
  expiresAt: number;
}

export class DatabaseCache<T = any> {
  private readonly cacheType: string;
  private readonly defaultTTL: number;
  private memoryCache: Map<string, CacheEntry<T>> = new Map();
  private useDatabase: boolean = true;

  constructor(cacheType: string, defaultTTL: number = 60000) {
    this.cacheType = cacheType;
    this.defaultTTL = defaultTTL;
  }

  async set(key: string, data: T, ttl?: number): Promise<void> {
    const expiresAt = new Date(Date.now() + (ttl || this.defaultTTL));
    
    // Always set in memory cache for fast access
    this.memoryCache.set(key, { data, expiresAt: expiresAt.getTime() });

    // Try to persist to database
    if (this.useDatabase) {
      try {
        await query(
          `INSERT INTO cache (cache_key, cache_type, data, expires_at)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (cache_key) 
           DO UPDATE SET data = $3, expires_at = $4, updated_at = NOW()`,
          [key, this.cacheType, JSON.stringify(data), expiresAt]
        );
      } catch (error) {
        console.warn(`⚠️  Database cache write failed, using memory only:`, error);
        this.useDatabase = false;
      }
    }
  }

  async get(key: string): Promise<T | null> {
    // Check memory cache first
    const memCached = this.memoryCache.get(key);
    if (memCached) {
      if (Date.now() < memCached.expiresAt) {
        if (process.env.DEBUG_CACHE === 'true') {
          const { PrettyLogger } = await import('../utils/prettyLogger');
          PrettyLogger.cache('hit', this.cacheType, key);
        }
        return memCached.data;
      } else {
        this.memoryCache.delete(key);
      }
    }

    // Try database if memory miss
    if (this.useDatabase) {
      try {
        const result = await query(
          `SELECT data, expires_at FROM cache 
           WHERE cache_key = $1 AND cache_type = $2 AND expires_at > NOW()`,
          [key, this.cacheType]
        );

        if (result.rows.length > 0) {
          const data = result.rows[0].data;
          const expiresAt = new Date(result.rows[0].expires_at).getTime();
          
          // Restore to memory cache
          this.memoryCache.set(key, { data, expiresAt });
          
          return data;
        }
      } catch (error) {
        console.warn(`⚠️  Database cache read failed:`, error);
        this.useDatabase = false;
      }
    }

    return null;
  }

  async has(key: string): Promise<boolean> {
    const data = await this.get(key);
    return data !== null;
  }

  async delete(key: string): Promise<void> {
    this.memoryCache.delete(key);

    if (this.useDatabase) {
      try {
        await query(
          `DELETE FROM cache WHERE cache_key = $1 AND cache_type = $2`,
          [key, this.cacheType]
        );
      } catch (error) {
        console.warn(`⚠️  Database cache delete failed:`, error);
      }
    }
  }

  async clear(): Promise<void> {
    this.memoryCache.clear();

    if (this.useDatabase) {
      try {
        await query(`DELETE FROM cache WHERE cache_type = $1`, [this.cacheType]);
      } catch (error) {
        console.warn(`⚠️  Database cache clear failed:`, error);
      }
    }
  }

  async getStats(): Promise<{ total: number; active: number; expired: number }> {
    let dbStats = { total: 0, active: 0, expired: 0 };

    if (this.useDatabase) {
      try {
        const result = await query(
          `SELECT 
             COUNT(*) as total,
             COUNT(CASE WHEN expires_at > NOW() THEN 1 END) as active,
             COUNT(CASE WHEN expires_at <= NOW() THEN 1 END) as expired
           FROM cache WHERE cache_type = $1`,
          [this.cacheType]
        );
        
        if (result.rows.length > 0) {
          dbStats = {
            total: parseInt(result.rows[0].total),
            active: parseInt(result.rows[0].active),
            expired: parseInt(result.rows[0].expired),
          };
        }
      } catch (error) {
        // Fall back to memory stats
      }
    }

    // If no database, count memory cache
    if (!this.useDatabase || dbStats.total === 0) {
      const now = Date.now();
      let active = 0;
      let expired = 0;

      for (const entry of this.memoryCache.values()) {
        if (now < entry.expiresAt) {
          active++;
        } else {
          expired++;
        }
      }

      return {
        total: this.memoryCache.size,
        active,
        expired,
      };
    }

    return dbStats;
  }

  async cleanup(): Promise<number> {
    // Clean memory cache
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.memoryCache.entries()) {
      if (now >= entry.expiresAt) {
        this.memoryCache.delete(key);
        cleaned++;
      }
    }

    // Clean database cache
    if (this.useDatabase) {
      try {
        const result = await query(
          `DELETE FROM cache WHERE cache_type = $1 AND expires_at <= NOW()`,
          [this.cacheType]
        );
        cleaned += result.rowCount || 0;
      } catch (error) {
        console.warn(`⚠️  Database cache cleanup failed:`, error);
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} expired ${this.cacheType} cache entries`);
    }

    return cleaned;
  }
}

// Create singleton caches with database backing and type safety
export const cryptoCache = new DatabaseCache<any>('crypto', 30000); // 30 seconds
export const weatherCache = new DatabaseCache<any>('weather', 300000); // 5 minutes
export const newsCache = new DatabaseCache<any>('news', 600000); // 10 minutes
