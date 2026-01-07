/**
 * Enhanced Request Logging Middleware
 */

import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';
import { performanceMonitor } from '../utils/performanceMonitor';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const { method, url } = req;
  
  // Capture original end function
  const originalEnd = res.end;
  
  // Override end function to log after response
  res.end = function(this: Response, chunk?: any, encoding?: any, callback?: any): any {
    const responseTime = Date.now() - startTime;
    const statusCode = res.statusCode;
    
    // Color-coded logging based on status
    let statusColor = chalk.green;
    if (statusCode >= 500) statusColor = chalk.red;
    else if (statusCode >= 400) statusColor = chalk.yellow;
    else if (statusCode >= 300) statusColor = chalk.cyan;
    
    const methodColor = 
      method === 'GET' ? chalk.blue :
      method === 'POST' ? chalk.green :
      method === 'PUT' ? chalk.yellow :
      method === 'DELETE' ? chalk.red :
      chalk.white;
    
    console.log(
      `${methodColor(method.padEnd(6))} ${statusColor(statusCode.toString())} ${url.padEnd(40)} ${chalk.gray(`${responseTime}ms`)}`
    );
    
    // Log slow requests
    if (responseTime > 1000) {
      console.warn(chalk.yellow(`⚠️  Slow request: ${method} ${url} took ${responseTime}ms`));
    }
    
    // Record performance metric
    performanceMonitor.addMetric({
      endpoint: url,
      method,
      responseTime,
      statusCode,
      timestamp: Date.now(),
    });
    
    // Call original end function
    return originalEnd.call(this, chunk, encoding, callback);
  };
  
  next();
};
