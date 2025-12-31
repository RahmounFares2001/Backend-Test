import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // 100 requests per window
  standardHeaders: 'draft-7', // Return rate limit info
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests, please slow down.',
    });
  },
});