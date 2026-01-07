import { Request, Response, NextFunction } from 'express';

/**
 * Enhance API responses with metadata and headers
 */
export const responseEnhancer = (req: Request, res: Response, next: NextFunction): void => {
  // Store original json method
  const originalJson = res.json.bind(res);

  // Override json method to add metadata
  res.json = function (data: any): Response {
    const enhanced = {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] || `req_${Date.now()}`,
        cached: res.getHeader('x-cache-hit') === 'true',
        responseTime: res.getHeader('x-response-time'),
      },
    };

    // Add helpful headers
    res.setHeader('X-Powered-By', 'PayPerAgent/0.1.0');
    res.setHeader('X-SKALE-Network', 'Nebula-Testnet');
    
    return originalJson(enhanced);
  };

  next();
};

/**
 * Add rate limit headers to responses
 */
export const rateLimitHeaders = (_req: Request, res: Response, next: NextFunction): void => {
  // Add rate limit info headers
  res.setHeader('X-RateLimit-Limit', '100');
  res.setHeader('X-RateLimit-Window', '1m');
  res.setHeader('X-RateLimit-Policy', '100 per minute, 1000 per day');
  
  next();
};
