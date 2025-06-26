import { rateLimit, type RateLimitRequestHandler } from 'express-rate-limit';

export const limiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
