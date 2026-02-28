/**
 * Winston Logger Configuration
 * Provides structured logging for the application
 */

const winston = require('winston');

/**
 * Create and configure Winston logger
 */
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

/**
 * Generate unique request ID for tracking
 */
function generateRequestId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

module.exports = {
  logger,
  generateRequestId
};