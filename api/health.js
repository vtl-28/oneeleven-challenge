/**
 * Health Check Endpoint
 * Returns API status and basic system information
 * 
 * GET /health
 */

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Return health status
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'oneeleven-webhook-api',
    version: '1.0.0',
    uptime: process.uptime()
  });
};