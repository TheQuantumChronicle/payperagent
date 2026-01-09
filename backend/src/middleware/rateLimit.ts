import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: 'Too many requests, please try again later',
    retryAfter: '1 minute',
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    trustProxy: false, // Disable trust proxy validation
  },
});

export const createAgentLimiter = (maxRequests: number = 1000) => {
  return rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: maxRequests,
    keyGenerator: (req) => {
      return req.headers['x-agent-id'] as string || req.ip || 'anonymous';
    },
    message: {
      success: false,
      error: 'Daily request limit exceeded',
      retryAfter: '24 hours',
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: {
      trustProxy: false, // Disable trust proxy validation
    },
  });
};
