/**
 * Rate Limiting Utility
 * Simple in-memory rate limiter
 * In production, this would use Redis or a distributed solution
 */

/**
 * In-memory store for rate limit tracking
 * Key: IP address
 * Value: Array of request timestamps
 */
const rateLimitStore = new Map();

/**
 * Rate limit configuration
 */
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000,  // 15 minutes
  maxRequests: 100,           // Maximum requests per window
  maxStoreSize: 1000          // Maximum IPs to track before cleanup
};

/**
 * Check if IP address is within rate limit
 * 
 * @param {string} ip - Client IP address
 * @returns {Object} Rate limit status
 */
function checkRateLimit(ip) {
  const now = Date.now();
  const { windowMs, maxRequests, maxStoreSize } = RATE_LIMIT_CONFIG;

  // Initialize array for new IPs
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, []);
  }

  // Get timestamps within the current window
  const requests = rateLimitStore.get(ip).filter(
    timestamp => now - timestamp < windowMs
  );
  
  // Add current request timestamp
  requests.push(now);
  rateLimitStore.set(ip, requests);

  // Periodic cleanup to prevent memory leak
  if (rateLimitStore.size > maxStoreSize) {
    cleanupRateLimitStore(now, windowMs);
  }

  return {
    allowed: requests.length <= maxRequests,
    remaining: Math.max(0, maxRequests - requests.length),
    resetTime: new Date(now + windowMs).toISOString()
  };
}

/**
 * Clean up old entries from rate limit store
 * Removes IPs with no recent requests
 * 
 * @param {number} now - Current timestamp
 * @param {number} windowMs - Time window in milliseconds
 */
function cleanupRateLimitStore(now, windowMs) {
  for (const [ip, timestamps] of rateLimitStore.entries()) {
    const validTimestamps = timestamps.filter(t => now - t < windowMs);
    
    if (validTimestamps.length === 0) {
      rateLimitStore.delete(ip);
    } else {
      rateLimitStore.set(ip, validTimestamps);
    }
  }
}

/**
 * Set rate limit headers on response
 * 
 * @param {Object} res - HTTP response object
 * @param {Object} rateLimit - Rate limit status
 */
function setRateLimitHeaders(res, rateLimit) {
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT_CONFIG.maxRequests.toString());
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining.toString());
  res.setHeader('X-RateLimit-Reset', rateLimit.resetTime);
}

/**
 * Get client IP address from request headers
 * 
 * @param {Object} req - HTTP request object
 * @returns {string} Client IP address
 */
function getClientIp(req) {
  return req.headers['x-forwarded-for'] || 
         req.headers['x-real-ip'] || 
         'unknown';
}

module.exports = {
  checkRateLimit,
  setRateLimitHeaders,
  getClientIp,
  RATE_LIMIT_CONFIG
};