/**
 * Request Validation Schemas and Utilities
 */

import { ValidationError } from './errors';

export interface ValidationSchema {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    enum?: any[];
    custom?: (value: any) => boolean | string;
  };
}

export function validateRequest(data: any, schema: ValidationSchema): void {
  const errors: string[] = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    // Check required
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`Field '${field}' is required`);
      continue;
    }

    // Skip validation if field is optional and not provided
    if (!rules.required && (value === undefined || value === null)) {
      continue;
    }

    // Type validation
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    if (actualType !== rules.type) {
      errors.push(`Field '${field}' must be of type ${rules.type}, got ${actualType}`);
      continue;
    }

    // String validations
    if (rules.type === 'string') {
      if (rules.min && value.length < rules.min) {
        errors.push(`Field '${field}' must be at least ${rules.min} characters`);
      }
      if (rules.max && value.length > rules.max) {
        errors.push(`Field '${field}' must be at most ${rules.max} characters`);
      }
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`Field '${field}' format is invalid`);
      }
    }

    // Number validations
    if (rules.type === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        errors.push(`Field '${field}' must be at least ${rules.min}`);
      }
      if (rules.max !== undefined && value > rules.max) {
        errors.push(`Field '${field}' must be at most ${rules.max}`);
      }
    }

    // Enum validation
    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(`Field '${field}' must be one of: ${rules.enum.join(', ')}`);
    }

    // Custom validation
    if (rules.custom) {
      const result = rules.custom(value);
      if (result !== true) {
        errors.push(typeof result === 'string' ? result : `Field '${field}' is invalid`);
      }
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join('; '));
  }
}

// Common validation schemas
export const commonSchemas = {
  weather: {
    city: {
      type: 'string' as const,
      required: false,
      min: 1,
      max: 100,
    },
    lat: {
      type: 'number' as const,
      required: false,
      min: -90,
      max: 90,
    },
    lon: {
      type: 'number' as const,
      required: false,
      min: -180,
      max: 180,
    },
  },
  crypto: {
    symbol: {
      type: 'string' as const,
      required: false,
      pattern: /^[A-Z]{3,10}$/,
    },
    symbols: {
      type: 'string' as const,
      required: false,
      pattern: /^[A-Z,]{3,}$/,
    },
  },
  news: {
    query: {
      type: 'string' as const,
      required: false,
      min: 1,
      max: 500,
    },
    category: {
      type: 'string' as const,
      required: false,
      enum: ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'],
    },
    country: {
      type: 'string' as const,
      required: false,
      pattern: /^[a-z]{2}$/,
    },
    pageSize: {
      type: 'number' as const,
      required: false,
      min: 1,
      max: 100,
    },
  },
  perplexity: {
    query: {
      type: 'string' as const,
      required: true,
      min: 1,
      max: 2000,
    },
    model: {
      type: 'string' as const,
      required: false,
      enum: ['sonar', 'sonar-pro', 'sonar-reasoning'],
    },
    max_tokens: {
      type: 'number' as const,
      required: false,
      min: 1,
      max: 4000,
    },
  },
  xai: {
    prompt: {
      type: 'string' as const,
      required: true,
      min: 1,
      max: 2000,
    },
    model: {
      type: 'string' as const,
      required: false,
      enum: ['grok-beta', 'grok-2'],
    },
    max_tokens: {
      type: 'number' as const,
      required: false,
      min: 1,
      max: 4000,
    },
    temperature: {
      type: 'number' as const,
      required: false,
      min: 0,
      max: 2,
    },
  },
};
