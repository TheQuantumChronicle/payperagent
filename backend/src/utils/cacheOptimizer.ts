/**
 * Intelligent Cache TTL Optimizer
 * Dynamically adjusts cache TTL based on data volatility and access patterns
 */

interface CacheConfig {
  minTTL: number;
  maxTTL: number;
  defaultTTL: number;
}

const cacheConfigs: Record<string, CacheConfig> = {
  // High volatility - short TTL
  crypto: {
    minTTL: 5000,      // 5 seconds
    maxTTL: 30000,     // 30 seconds
    defaultTTL: 10000, // 10 seconds
  },
  weather: {
    minTTL: 60000,     // 1 minute
    maxTTL: 600000,    // 10 minutes
    defaultTTL: 300000, // 5 minutes
  },
  news: {
    minTTL: 300000,    // 5 minutes
    maxTTL: 1800000,   // 30 minutes
    defaultTTL: 600000, // 10 minutes
  },
  // Low volatility - long TTL
  coingecko: {
    minTTL: 30000,     // 30 seconds
    maxTTL: 300000,    // 5 minutes
    defaultTTL: 60000,  // 1 minute
  },
  wikipedia: {
    minTTL: 3600000,   // 1 hour
    maxTTL: 86400000,  // 24 hours
    defaultTTL: 7200000, // 2 hours
  },
  github: {
    minTTL: 300000,    // 5 minutes
    maxTTL: 3600000,   // 1 hour
    defaultTTL: 600000, // 10 minutes
  },
  reddit: {
    minTTL: 60000,     // 1 minute
    maxTTL: 600000,    // 10 minutes
    defaultTTL: 180000, // 3 minutes
  },
  // AI APIs - moderate TTL
  perplexity: {
    minTTL: 300000,    // 5 minutes
    maxTTL: 3600000,   // 1 hour
    defaultTTL: 600000, // 10 minutes
  },
  xai: {
    minTTL: 300000,    // 5 minutes
    maxTTL: 3600000,   // 1 hour
    defaultTTL: 600000, // 10 minutes
  },
};

export function getOptimalTTL(service: string): number {
  const config = cacheConfigs[service];
  
  if (!config) {
    return 300000; // Default 5 minutes
  }
  
  // Could be extended with ML-based optimization based on:
  // - Historical access patterns
  // - Data change frequency
  // - Time of day
  // - User behavior
  
  return config.defaultTTL;
}

export function getCacheConfig(service: string): CacheConfig {
  return cacheConfigs[service] || {
    minTTL: 60000,
    maxTTL: 3600000,
    defaultTTL: 300000,
  };
}

// Cache warming for frequently accessed data
export class CacheWarmer {
  private warmingIntervals: Map<string, NodeJS.Timeout> = new Map();

  startWarming(service: string, fetchFn: () => Promise<any>, interval: number) {
    if (this.warmingIntervals.has(service)) {
      return; // Already warming
    }

    const warmInterval = setInterval(async () => {
      try {
        await fetchFn();
        console.log(`🔥 Cache warmed for ${service}`);
      } catch (error: any) {
        console.error(`Failed to warm cache for ${service}:`, error.message);
      }
    }, interval);

    this.warmingIntervals.set(service, warmInterval);
  }

  stopWarming(service: string) {
    const interval = this.warmingIntervals.get(service);
    if (interval) {
      clearInterval(interval);
      this.warmingIntervals.delete(service);
    }
  }

  stopAll() {
    this.warmingIntervals.forEach((interval) => clearInterval(interval));
    this.warmingIntervals.clear();
  }
}

export const cacheWarmer = new CacheWarmer();
