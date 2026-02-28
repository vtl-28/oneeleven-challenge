/**
 * Webhook API Endpoint
 * Receives string data, sorts characters alphabetically, returns as array
 * 
 * Specification:
 * - POST endpoint only
 * - Request: { data: "string" }
 * - Response: { word: ["s","o","r","t","e","d"] }
 */

const { logger, generateRequestId } = require('../utils/logger');
const { setSecurityHeaders } = require('../utils/security');
const { checkRateLimit, setRateLimitHeaders, getClientIp } = require('../utils/rateLimit');

// Maximum allowed string length
const MAX_STRING_LENGTH = 100000;

module.exports = async (req, res) => {
  // Generate unique request ID and track start time
  const requestId = generateRequestId();
  const startTime = Date.now();

  // Apply security headers
  setSecurityHeaders(res);

  // Check rate limit
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(clientIp);
  setRateLimitHeaders(res, rateLimit);

  // Return 429 if rate limit exceeded
  if (!rateLimit.allowed) {
    logger.warn('Rate limit exceeded', { requestId, ip: clientIp });
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Maximum 100 requests per 15 minutes.',
      retryAfter: rateLimit.resetTime
    });
  }

  // Log incoming request
  logger.info('Incoming webhook request', {
    requestId,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    logger.info('CORS preflight handled', { requestId });
    return res.status(200).end();
  }

  // Set CORS headers for actual requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Only accept POST requests
  if (req.method !== 'POST') {
    logger.warn('Invalid method', { requestId, method: req.method });
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests'
    });
  }

  try {
    // Validate request body exists
    if (!req.body || typeof req.body !== 'object') {
      logger.warn('Invalid request: missing or invalid body', { 
        requestId,
        bodyType: typeof req.body 
      });
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Missing required field: "data"'
      });
    }

    // Extract data field from request body
    const { data } = req.body;

    // Validation: Check if data field exists
    if (data === undefined || data === null) {
      logger.warn('Invalid request: missing data field', { requestId });
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Missing required field: "data"'
      });
    }

    // Validation: Check if data is a string
    if (typeof data !== 'string') {
      logger.warn('Invalid request: data is not a string', { 
        requestId, 
        receivedType: typeof data 
      });
      return res.status(400).json({ 
        error: 'Bad Request',
        message: `Expected "data" to be a string, received ${typeof data}`
      });
    }

    // Validation: Check string length (prevent abuse)
    if (data.length > MAX_STRING_LENGTH) {
      logger.warn('Invalid request: data too long', { 
        requestId, 
        dataLength: data.length,
        maxLength: MAX_STRING_LENGTH
      });
      return res.status(400).json({ 
        error: 'Bad Request',
        message: `Data length cannot exceed ${MAX_STRING_LENGTH} characters`
      });
    }

    // Core business logic: Convert string to array of characters
    const charArray = data.split('');
    
    // Sort the array alphabetically
    const sortedArray = charArray.sort();

    // Calculate processing time
    const duration = Date.now() - startTime;

    // Log successful processing
    logger.info('Request processed successfully', {
      requestId,
      inputLength: data.length,
      outputLength: sortedArray.length,
      duration: `${duration}ms`
    });

    // Return in the exact format specified: { word: [...] }
    return res.status(200).json({ word: sortedArray });

  } catch (error) {
    // Log error with full details
    logger.error('Unexpected error processing webhook', {
      requestId,
      error: error.message,
      stack: error.stack
    });

    // Handle any unexpected errors
    console.error('Error processing webhook:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  }
};