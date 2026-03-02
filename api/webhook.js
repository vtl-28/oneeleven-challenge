const { logger, generateRequestId } = require('../utils/logger');
const { setSecurityHeaders } = require('../utils/security');
const { checkRateLimit, setRateLimitHeaders, getClientIp } = require('../utils/rateLimit');


const MAX_STRING_LENGTH = 100000;

module.exports = async (req, res) => {
  
  const requestId = generateRequestId();
  const startTime = Date.now();

  
  setSecurityHeaders(res);

  
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(clientIp);
  setRateLimitHeaders(res, rateLimit);

  
  if (!rateLimit.allowed) {
    logger.warn('Rate limit exceeded', { requestId, ip: clientIp });
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Maximum 100 requests per 15 minutes.',
      retryAfter: rateLimit.resetTime
    });
  }

 
  logger.info('Incoming webhook request', {
    requestId,
    method: req.method,
    timestamp: new Date().toISOString()
  });

 
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    logger.info('CORS preflight handled', { requestId });
    return res.status(200).end();
  }

  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

 
  if (req.method !== 'POST') {
    logger.warn('Invalid method', { requestId, method: req.method });
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests'
    });
  }

  try {
    
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

    const { data } = req.body;

    if (data === undefined || data === null) {
      logger.warn('Invalid request: missing data field', { requestId });
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Missing required field: "data"'
      });
    }

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

    const charArray = data.split('');
    
    const sortedArray = charArray.sort();

    const duration = Date.now() - startTime;

    logger.info('Request processed successfully', {
      requestId,
      inputLength: data.length,
      outputLength: sortedArray.length,
      duration: `${duration}ms`
    });

    return res.status(200).json({ word: sortedArray });

  } catch (error) {
    logger.error('Unexpected error processing webhook', {
      requestId,
      error: error.message,
      stack: error.stack
    });

    console.error('Error processing webhook:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  }
};