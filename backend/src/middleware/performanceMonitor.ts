import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';

interface PerformanceMetrics {
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  timestamp: Date;
  userAgent?: string;
  walletAddress?: string;
}

const metricsBuffer: PerformanceMetrics[] = [];
const BUFFER_SIZE = 100;
const FLUSH_INTERVAL = 30000; // 30 seconds

// Flush metrics to database periodically
setInterval(async () => {
  if (metricsBuffer.length > 0) {
    await flushMetrics();
  }
}, FLUSH_INTERVAL);

async function flushMetrics(): Promise<void> {
  if (metricsBuffer.length === 0) return;

  const metrics = [...metricsBuffer];
  metricsBuffer.length = 0;

  try {
    const values = metrics.map((_m, i) => 
      `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`
    ).join(',');

    const params = metrics.flatMap(m => [
      m.endpoint,
      m.method,
      m.responseTime,
      m.statusCode,
      m.walletAddress || 'anonymous',
      m.timestamp
    ]);

    await pool.query(
      `INSERT INTO performance_metrics 
       (endpoint, method, response_time, status_code, wallet_address, created_at)
       VALUES ${values}
       ON CONFLICT DO NOTHING`,
      params
    );
  } catch (error) {
    console.error('Error flushing performance metrics:', error);
  }
}

export function performanceMonitor(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  // Capture original end function
  const originalEnd = res.end;

  // Override end function
  res.end = function(this: Response, ...args: any[]): Response {
    const responseTime = Date.now() - startTime;

    // Collect metrics
    const metrics: PerformanceMetrics = {
      endpoint: req.path,
      method: req.method,
      responseTime,
      statusCode: res.statusCode,
      timestamp: new Date(),
      userAgent: req.headers['user-agent'],
      walletAddress: (req as any).walletAddress
    };

    // Add to buffer
    metricsBuffer.push(metrics);

    // Flush if buffer is full
    if (metricsBuffer.length >= BUFFER_SIZE) {
      flushMetrics().catch(console.error);
    }

    // Add performance headers
    res.setHeader('X-Response-Time', `${responseTime}ms`);
    res.setHeader('X-Request-ID', req.headers['x-request-id'] || generateRequestId());

    // Call original end
    return originalEnd.apply(this, args as any);
  };

  next();
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function getPerformanceStats(timeRange: '1h' | '24h' | '7d' = '24h'): Promise<any> {
  const intervals = {
    '1h': '1 hour',
    '24h': '24 hours',
    '7d': '7 days'
  };

  try {
    const result = await pool.query(
      `SELECT 
        endpoint,
        method,
        COUNT(*) as total_requests,
        AVG(response_time) as avg_response_time,
        MIN(response_time) as min_response_time,
        MAX(response_time) as max_response_time,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY response_time) as median_response_time,
        PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time) as p95_response_time,
        PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY response_time) as p99_response_time,
        SUM(CASE WHEN status_code < 400 THEN 1 ELSE 0 END) as successful_requests,
        SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as failed_requests
      FROM performance_metrics
      WHERE created_at > NOW() - INTERVAL '${intervals[timeRange]}'
      GROUP BY endpoint, method
      ORDER BY total_requests DESC`,
      []
    );

    return {
      timeRange,
      endpoints: result.rows.map((row: any) => ({
        endpoint: row.endpoint,
        method: row.method,
        totalRequests: parseInt(row.total_requests),
        avgResponseTime: parseFloat(row.avg_response_time).toFixed(2),
        minResponseTime: parseFloat(row.min_response_time).toFixed(2),
        maxResponseTime: parseFloat(row.max_response_time).toFixed(2),
        medianResponseTime: parseFloat(row.median_response_time).toFixed(2),
        p95ResponseTime: parseFloat(row.p95_response_time).toFixed(2),
        p99ResponseTime: parseFloat(row.p99_response_time).toFixed(2),
        successfulRequests: parseInt(row.successful_requests),
        failedRequests: parseInt(row.failed_requests),
        successRate: (parseInt(row.successful_requests) / parseInt(row.total_requests) * 100).toFixed(2) + '%'
      }))
    };
  } catch (error) {
    console.error('Error getting performance stats:', error);
    return { timeRange, endpoints: [] };
  }
}
