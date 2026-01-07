/**
 * System Management Routes
 * Circuit breaker status, metrics, and system controls
 */

import { Router } from 'express';
import { circuitBreakers } from '../utils/circuitBreaker';
import { performanceMonitor } from '../utils/performanceMonitor';

export const systemRouter = Router();

// Get circuit breaker status for all services
systemRouter.get('/circuit-breakers', (_req, res) => {
  const status = Object.entries(circuitBreakers).map(([_, breaker]) => breaker.getStats());
  
  return res.json({
    success: true,
    timestamp: new Date().toISOString(),
    circuitBreakers: status,
  });
});

// Reset a specific circuit breaker
systemRouter.post('/circuit-breakers/:name/reset', (req, res) => {
  const { name } = req.params;
  const breaker = (circuitBreakers as any)[name];
  
  if (!breaker) {
    return res.status(404).json({
      success: false,
      error: {
        message: `Circuit breaker '${name}' not found`,
        code: 'NOT_FOUND',
      },
    });
  }
  
  breaker.reset();
  
  return res.json({
    success: true,
    message: `Circuit breaker '${name}' has been reset`,
    status: breaker.getStats(),
  });
});

// Get system metrics
systemRouter.get('/metrics', async (_req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    metrics: {
      uptime: {
        seconds: Math.floor(uptime),
        formatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
      },
      memory: {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        rss: Math.round(memoryUsage.rss / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024),
        unit: 'MB',
      },
      cpu: {
        user: Math.round(cpuUsage.user / 1000),
        system: Math.round(cpuUsage.system / 1000),
        unit: 'microseconds',
      },
      process: {
        pid: process.pid,
        version: process.version,
        platform: process.platform,
        arch: process.arch,
      },
    },
  });
});

// Get environment info (sanitized)
systemRouter.get('/environment', (_req, res) => {
  return res.json({
    success: true,
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      features: {
        database: !!process.env.DATABASE_URL,
        openweather: !!process.env.OPENWEATHER_API_KEY,
        newsapi: !!process.env.NEWS_API_KEY,
        perplexity: !!process.env.PERPLEXITY_API_KEY,
        xai: !!process.env.XAI_API_KEY,
      },
    },
  });
});

// Get performance statistics
systemRouter.get('/performance', (_req, res) => {
  const minutes = parseInt(_req.query.minutes as string) || 5;
  const stats = performanceMonitor.getStats(minutes);
  const slowest = performanceMonitor.getSlowestEndpoints(10);
  
  return res.json({
    success: true,
    timestamp: new Date().toISOString(),
    timeWindow: `${minutes} minutes`,
    statistics: stats,
    slowestEndpoints: slowest,
  });
});
