/**
 * Rate limiting middleware for Next.js API routes
 */
import LRUCache from 'lru-cache';

/**
 * Create a rate limiter instance
 * @param {Object} options - Rate limiter options
 * @returns {Object} Rate limiter instance
 */
export function getRateLimiter(options = {}) {
  const {
    max = 5, // Maximum requests per window
    ttl = 60 * 1000, // Time window in milliseconds (default: 1 minute)
    message = 'Too many requests, please try again later.',
    statusCode = 429 // Too Many Requests
  } = options;

  // Create LRU cache to store requests
  const tokenCache = new LRUCache({
    max: 500, // Maximum number of IP addresses to track
    ttl: ttl, // Time to live for cache entries
  });

  /**
   * Check if the request exceeds the rate limit
   * @param {string} ip - IP address to check
   * @returns {Object} Status of the request and headers
   */
  const check = (ip) => {
    const tokenCount = (tokenCache.get(ip) || 0) + 1;
    const currentUsage = tokenCount;
    const isRateLimited = tokenCount > max;
    
    // Update token count if not rate limited
    if (!isRateLimited) {
      tokenCache.set(ip, tokenCount);
    }
    
    return {
      isRateLimited,
      currentUsage,
      limit: max,
      remaining: Math.max(0, max - currentUsage),
      resetTime: Date.now() + ttl,
      message,
      statusCode
    };
  };
  
  /**
   * Apply rate limiting to a Next.js API handler
   * @param {Function} handler - Next.js API route handler
   * @returns {Function} Rate-limited handler
   */
  const withRateLimit = (handler) => {
    return async (req, res) => {
      // Get client IP address
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      
      if (!ip) {
        return handler(req, res);
      }
      
      const rateLimitResult = check(ip);
      
      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', rateLimitResult.limit);
      res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining);
      res.setHeader('X-RateLimit-Reset', rateLimitResult.resetTime);
      
      if (rateLimitResult.isRateLimited) {
        res.status(rateLimitResult.statusCode).json({
          error: rateLimitResult.message
        });
        return;
      }
      
      return handler(req, res);
    };
  };

  return {
    check,
    withRateLimit
  };
}

// Export a default instance with standard settings
export const rateLimit = getRateLimiter({
  max: 5, // 5 requests per minute per IP
  ttl: 60 * 1000, // 1 minute window
  message: 'Rate limit exceeded. Please try again in a minute.',
}); 