/**
 * Webhook API Endpoint
 * Receives string data, sorts characters alphabetically, returns as array
 * 
 * Specification:
 * - POST endpoint only
 * - Request: { data: "string" }
 * - Response: { word: ["s","o","r","t","e","d"] }
 */

module.exports = async (req, res) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Set CORS headers for actual requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests'
    });
  }

  try {
    // Validate request body exists
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Missing required field: "data"'
      });
    }

    // Extract data field from request body
    const { data } = req.body;

    // Validation: Check if data field exists
    if (data === undefined || data === null) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Missing required field: "data"'
      });
    }

    // Validation: Check if data is a string
    if (typeof data !== 'string') {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: `Expected "data" to be a string, received ${typeof data}`
      });
    }

    // Core logic: Convert string to array of characters
    const charArray = data.split('');
    
    // Sort the array alphabetically
    const sortedArray = charArray.sort();

    // Return in the exact format specified: { word: [...] }
    return res.status(200).json({ word: sortedArray });

  } catch (error) {
    // Handle any unexpected errors
    console.error('Error processing webhook:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  }
};