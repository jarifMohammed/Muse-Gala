import rateLimit from 'express-rate-limit';

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000000,
});

const emailVerificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.body.email,
});

const swaggerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Limit each IP to 50 requests per window
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

export { globalLimiter, emailVerificationLimiter, swaggerLimiter };

