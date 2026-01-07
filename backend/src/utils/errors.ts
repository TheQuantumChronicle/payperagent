/**
 * Custom Error Classes for Better Error Handling
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;
    
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 400, true, code || 'VALIDATION_ERROR');
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', code?: string) {
    super(message, 401, true, code || 'AUTH_ERROR');
  }
}

export class PaymentRequiredError extends AppError {
  public readonly paymentDetails?: any;

  constructor(message: string = 'Payment required', paymentDetails?: any, code?: string) {
    super(message, 402, true, code || 'PAYMENT_REQUIRED');
    this.paymentDetails = paymentDetails;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', code?: string) {
    super(message, 404, true, code || 'NOT_FOUND');
  }
}

export class RateLimitError extends AppError {
  public readonly retryAfter?: number;

  constructor(message: string = 'Rate limit exceeded', retryAfter?: number, code?: string) {
    super(message, 429, true, code || 'RATE_LIMIT');
    this.retryAfter = retryAfter;
  }
}

export class ExternalAPIError extends AppError {
  public readonly service?: string;

  constructor(message: string, service?: string, code?: string) {
    super(message, 502, true, code || 'EXTERNAL_API_ERROR');
    this.service = service;
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 500, true, code || 'DATABASE_ERROR');
  }
}

export class CircuitBreakerError extends AppError {
  constructor(message: string = 'Service temporarily unavailable', code?: string) {
    super(message, 503, true, code || 'CIRCUIT_BREAKER_OPEN');
  }
}
