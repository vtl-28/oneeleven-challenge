module.exports = (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'oneeleven-webhook-api',
    version: '1.0.0',
    uptime: process.uptime()
  });
};