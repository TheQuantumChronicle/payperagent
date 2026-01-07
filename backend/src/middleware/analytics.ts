import { Request, Response, NextFunction } from 'express';
import { dbAnalytics } from '../services/dbAnalytics';
import { PrettyLogger } from '../utils/prettyLogger';

export const analyticsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    const agentId = (req.headers['x-agent-id'] as string) || 'anonymous';
    const ipAddress = req.ip || req.socket.remoteAddress;

    // Pretty log the request
    if (process.env.NODE_ENV === 'development') {
      PrettyLogger.request(req.method, req.path, res.statusCode, responseTime);
    }

    // Track in database (async, non-blocking)
    dbAnalytics.track({
      endpoint: req.path,
      method: req.method,
      statusCode: res.statusCode,
      responseTime,
      agentId,
      ipAddress,
      cached: res.getHeader('x-cache-hit') === 'true',
    }).catch(err => {
      if (process.env.DEBUG === 'true') {
        console.error('Analytics tracking error:', err);
      }
    });
  });

  next();
};
