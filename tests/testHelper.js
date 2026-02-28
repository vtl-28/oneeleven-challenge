/**
 * Test Helper - Mock Request/Response for Vercel Serverless Functions
 * 
 * Simulates Vercel's request/response objects for unit testing
 */

/**
 * MockRequest - Simulates incoming HTTP request
 */
class MockRequest {
  constructor(method = 'POST', body = {}, headers = {}) {
    this.method = method;
    this.body = body;
    this.headers = headers;
    this.url = '';
    this.query = {};
  }
}

/**
 * MockResponse - Simulates HTTP response
 * Tracks status codes, headers, and response body
 */
class MockResponse {
  constructor() {
    this.statusCode = 200;
    this.headers = {};
    this.body = null;
    this.ended = false;
  }

  /**
   * Set HTTP status code
   */
  status(code) {
    this.statusCode = code;
    return this;
  }

  /**
   * Send JSON response
   */
  json(data) {
    this.body = data;
    return this;
  }

  /**
   * Set response header
   */
  setHeader(key, value) {
    this.headers[key] = value;
    return this;
  }

  /**
   * End the response (for non-JSON responses)
   */
  end() {
    this.ended = true;
    return this;
  }

  /**
   * Send plain text response
   */
  send(data) {
    this.body = data;
    return this;
  }
}

module.exports = { MockRequest, MockResponse };