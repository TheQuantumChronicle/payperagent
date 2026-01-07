/**
 * Performance Monitoring and Metrics Collection
 */

interface PerformanceMetric {
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics = 1000;

  addMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
  }

  getStats(minutes: number = 5) {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    const recentMetrics = this.metrics.filter(m => m.timestamp > cutoff);
    
    if (recentMetrics.length === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        p50: 0,
        p95: 0,
        p99: 0,
        errorRate: 0,
        requestsPerMinute: 0,
      };
    }

    const responseTimes = recentMetrics.map(m => m.responseTime).sort((a, b) => a - b);
    const errors = recentMetrics.filter(m => m.statusCode >= 400).length;
    
    return {
      totalRequests: recentMetrics.length,
      averageResponseTime: Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length),
      p50: responseTimes[Math.floor(responseTimes.length * 0.5)],
      p95: responseTimes[Math.floor(responseTimes.length * 0.95)],
      p99: responseTimes[Math.floor(responseTimes.length * 0.99)],
      errorRate: ((errors / recentMetrics.length) * 100).toFixed(2) + '%',
      requestsPerMinute: Math.round(recentMetrics.length / minutes),
    };
  }

  getEndpointStats(endpoint: string) {
    const endpointMetrics = this.metrics.filter(m => m.endpoint === endpoint);
    
    if (endpointMetrics.length === 0) {
      return null;
    }

    const responseTimes = endpointMetrics.map(m => m.responseTime);
    const errors = endpointMetrics.filter(m => m.statusCode >= 400).length;
    
    return {
      totalRequests: endpointMetrics.length,
      averageResponseTime: Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length),
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes),
      errorRate: ((errors / endpointMetrics.length) * 100).toFixed(2) + '%',
    };
  }

  getSlowestEndpoints(limit: number = 10) {
    const endpointAvgs = new Map<string, { total: number; count: number }>();
    
    this.metrics.forEach(m => {
      const key = `${m.method} ${m.endpoint}`;
      const existing = endpointAvgs.get(key) || { total: 0, count: 0 };
      endpointAvgs.set(key, {
        total: existing.total + m.responseTime,
        count: existing.count + 1,
      });
    });
    
    return Array.from(endpointAvgs.entries())
      .map(([endpoint, data]) => ({
        endpoint,
        averageResponseTime: Math.round(data.total / data.count),
        requestCount: data.count,
      }))
      .sort((a, b) => b.averageResponseTime - a.averageResponseTime)
      .slice(0, limit);
  }

  clear() {
    this.metrics = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();
