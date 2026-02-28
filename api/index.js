/**
 * API Documentation Endpoint
 * Returns information about available endpoints and usage
 * 
 * GET /
 */

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Return API documentation
  res.status(200).json({
    message: 'One Eleven Developer Challenge - Webhook API',
    version: '1.0.0',
    author: 'Vuyisile Lehola',
    email: 'vtlehola23@gmail.com',
    github: 'https://github.com/vtl-28',
    challenge: 'February 2026',
    
    endpoints: {
      webhook: {
        method: 'POST',
        path: '/webhook',
        description: 'Receives string data and returns alphabetically sorted characters',
        request: {
          contentType: 'application/json',
          body: {
            data: 'string (required)'
          },
          example: {
            data: 'example'
          }
        },
        response: {
          success: {
            statusCode: 200,
            body: {
              word: ['array', 'of', 'sorted', 'characters']
            },
            example: {
              word: ['a', 'e', 'e', 'l', 'm', 'p', 'x']
            }
          },
          errors: {
            400: 'Bad Request - Missing or invalid data field',
            405: 'Method Not Allowed - Only POST is accepted',
            500: 'Internal Server Error'
          }
        }
      },
      
      health: {
        method: 'GET',
        path: '/health',
        description: 'Health check endpoint - returns API status'
      },
      
      docs: {
        method: 'GET',
        path: '/',
        description: 'This endpoint - API documentation'
      }
    },
    
    documentation: 'https://github.com/vtl-28/oneeleven-challenge',
    deployed: new Date().toISOString()
  });
};