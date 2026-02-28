/**
 * Security Headers Utility
 * Applies security headers to protect against common web vulnerabilities
 */

/**
 * Set security headers on HTTP response
 * Protects against XSS, clickjacking, MIME sniffing, etc.
 * 
 * @param {Object} res - HTTP response object
 */
function setSecurityHeaders(res) {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking attacks
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Enable XSS protection in older browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Enforce HTTPS connections
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
}

module.exports = {
  setSecurityHeaders
};