import { Request, Response, NextFunction } from 'express';
import { AppError, PaymentRequiredError, RateLimitError } from '../utils/errors';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log error details with correlation ID
  const correlationId = req.headers['x-correlation-id'];
  const logPrefix = correlationId ? `[${correlationId}]` : '';
  
  if (err instanceof AppError && !err.isOperational) {
    console.error(`🔴 CRITICAL ERROR ${logPrefix}:`, err.message);
    console.error('Stack:', err.stack);
  } else {
    console.error(`⚠️  Error ${logPrefix}:`, err.message);
    if (process.env.NODE_ENV === 'development') {
      console.error('Stack:', err.stack);
    }
  }

  // Handle custom AppError instances
  if (err instanceof AppError) {
    const response: any = {
      success: false,
      error: {
        message: err.message,
        code: err.code,
        timestamp: new Date().toISOString(),
      },
    };

    // Add payment details for 402 errors
    if (err instanceof PaymentRequiredError && err.paymentDetails) {
      response.payment = err.paymentDetails;
    }

    // Add retry-after header for rate limit errors
    if (err instanceof RateLimitError && err.retryAfter) {
      res.setHeader('Retry-After', err.retryAfter);
      response.error.retryAfter = err.retryAfter;
    }

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
      response.error.stack = err.stack;
    }

    // Add correlation ID to response
    if (correlationId) {
      response.correlationId = correlationId;
    }

    return res.status(err.statusCode).json(response);
  }

  // Handle unknown errors
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  return res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      code: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
    ...(correlationId && { correlationId }),
  });
};
