const rateLimitStore = new Map();


const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, 
  maxRequests: 100, 
  maxStoreSize: 1000 
};


function checkRateLimit(ip) {
  const now = Date.now();
  const { windowMs, maxRequests, maxStoreSize } = RATE_LIMIT_CONFIG;


  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, []);
  }

  const requests = rateLimitStore.get(ip).filter(
    timestamp => now - timestamp < windowMs
  );
  
  requests.push(now);
  rateLimitStore.set(ip, requests);

  if (rateLimitStore.size > maxStoreSize) {
    cleanupRateLimitStore(now, windowMs);
  }

  return {
    allowed: requests.length <= maxRequests,
    remaining: Math.max(0, maxRequests - requests.length),
    resetTime: new Date(now + windowMs).toISOString()
  };
}

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


function setRateLimitHeaders(res, rateLimit) {
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT_CONFIG.maxRequests.toString());
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining.toString());
  res.setHeader('X-RateLimit-Reset', rateLimit.resetTime);
}


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