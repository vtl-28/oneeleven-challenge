const winston = require('winston');


const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});


function generateRequestId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

module.exports = {
  logger,
  generateRequestId
};