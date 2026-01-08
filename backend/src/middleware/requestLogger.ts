/**
 * Enhanced Request Logging Middleware
 */

import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';
import { performanceMonitor } from '../utils/performanceMonitor';
import { randomUUID } from 'crypto';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Add correlation ID for request tracking
  const correlationId = req.headers['x-correlation-id'] as string || randomUUID();
  req.headers['x-correlation-id'] = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);
  
  const start = Date.now();
  const method = req.method;
  const url = req.url;
  const ip = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const statusEmoji = statusCode >= 500 ? '🔴' : statusCode >= 400 ? '⚠️' : statusCode >= 300 ? '↪️' : '✓';

    // Structured logging for production
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        correlationId,
        method,
        url,
        statusCode,
        duration,
        ip,
        userAgent
      }));
    } else {
      console.log(`${statusEmoji} ${method.padEnd(6)} ${statusCode} ${url.padEnd(40)} ${duration}ms`);
    }

    // Log slow requests
    if (duration > 1000) {
      console.warn(chalk.yellow(`⚠️  Slow request: ${method} ${url} took ${duration}ms`));
    }

    // Record performance metric
    performanceMonitor.addMetric({
      endpoint: url,
      method,
      responseTime: duration,
      statusCode,
      timestamp: Date.now(),
    });
  });
  
  next();
};
