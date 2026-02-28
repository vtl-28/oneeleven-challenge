/**
 * Webhook API Unit Tests
 * Comprehensive test coverage for the webhook endpoint
 */

const webhookHandler = require('../api/webhook');
const { MockRequest, MockResponse } = require('./testHelper');

describe('POST /webhook - Core Functionality', () => {
  
  test('should correctly sort "example" as per specification', async () => {
    const req = new MockRequest('POST', { data: 'example' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      word: ['a', 'e', 'e', 'l', 'm', 'p', 'x']
    });
  });

  test('should handle single character string', async () => {
    const req = new MockRequest('POST', { data: 'a' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ word: ['a'] });
  });

  test('should handle empty string', async () => {
    const req = new MockRequest('POST', { data: '' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ word: [] });
  });

  test('should handle two character string', async () => {
    const req = new MockRequest('POST', { data: 'ba' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ word: ['a', 'b'] });
  });

  test('should preserve duplicate characters', async () => {
    const req = new MockRequest('POST', { data: 'aabbcc' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.word).toEqual(['a', 'a', 'b', 'b', 'c', 'c']);
  });

  test('should sort case-sensitively (capitals before lowercase in ASCII)', async () => {
    const req = new MockRequest('POST', { data: 'AaBbCc' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(200);
    // ASCII: A=65, B=66, C=67, a=97, b=98, c=99
    expect(res.body.word).toEqual(['A', 'B', 'C', 'a', 'b', 'c']);
  });

  test('should handle special characters', async () => {
    const req = new MockRequest('POST', { data: 'a!b@c#' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.word).toHaveLength(6);
    expect(res.body.word).toContain('a');
    expect(res.body.word).toContain('!');
  });

  test('should handle numbers in string', async () => {
    const req = new MockRequest('POST', { data: '3a1b2c' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.word).toHaveLength(6);
    expect(res.body.word).toContain('1');
    expect(res.body.word).toContain('a');
  });

  test('should handle already sorted string', async () => {
    const req = new MockRequest('POST', { data: 'abc' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.word).toEqual(['a', 'b', 'c']);
  });

  test('should handle reverse sorted string', async () => {
    const req = new MockRequest('POST', { data: 'cba' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.word).toEqual(['a', 'b', 'c']);
  });

  test('should handle long strings efficiently', async () => {
    const longString = 'z'.repeat(500) + 'a'.repeat(500);
    const req = new MockRequest('POST', { data: longString });
    const res = new MockResponse();

    const startTime = Date.now();
    await webhookHandler(req, res);
    const duration = Date.now() - startTime;

    expect(res.statusCode).toBe(200);
    expect(res.body.word).toHaveLength(1000);
    expect(res.body.word[0]).toBe('a'); // First char should be 'a'
    expect(res.body.word[999]).toBe('z'); // Last char should be 'z'
    expect(duration).toBeLessThan(1000); // Should complete in <1 second
  });

  test('should handle all same characters', async () => {
    const req = new MockRequest('POST', { data: 'aaaaaaa' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.word).toEqual(['a', 'a', 'a', 'a', 'a', 'a', 'a']);
  });
});

describe('POST /webhook - Input Validation', () => {
  
  test('should return 400 when data field is missing', async () => {
    const req = new MockRequest('POST', {});
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Bad Request');
    expect(res.body.message).toContain('Missing required field');
  });

  test('should return 400 when data is null', async () => {
    const req = new MockRequest('POST', { data: null });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Bad Request');
  });

  test('should return 400 when data is undefined', async () => {
    const req = new MockRequest('POST', { data: undefined });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(400);
  });

  test('should return 400 when data is a number', async () => {
    const req = new MockRequest('POST', { data: 12345 });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('Expected "data" to be a string');
    expect(res.body.message).toContain('number');
  });

  test('should return 400 when data is an array', async () => {
    const req = new MockRequest('POST', { data: ['a', 'b', 'c'] });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('string');
    expect(res.body.message).toContain('object'); // Arrays are typeof 'object'
  });

  test('should return 400 when data is an object', async () => {
    const req = new MockRequest('POST', { data: { test: 'value' } });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('object');
  });

  test('should return 400 when data is a boolean', async () => {
    const req = new MockRequest('POST', { data: true });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('boolean');
  });

  test('should return 400 when request body is completely empty', async () => {
    const req = new MockRequest('POST', undefined);
    req.body = undefined;
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(400);
  });
});

describe('POST /webhook - HTTP Method Validation', () => {
  
  test('should return 405 for GET requests', async () => {
    const req = new MockRequest('GET', { data: 'test' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(405);
    expect(res.body.error).toBe('Method not allowed');
  });

  test('should return 405 for PUT requests', async () => {
    const req = new MockRequest('PUT', { data: 'test' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(405);
  });

  test('should return 405 for DELETE requests', async () => {
    const req = new MockRequest('DELETE', { data: 'test' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(405);
  });

  test('should return 405 for PATCH requests', async () => {
    const req = new MockRequest('PATCH', { data: 'test' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(405);
  });

  test('should handle OPTIONS request for CORS preflight', async () => {
    const req = new MockRequest('OPTIONS', {});
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.headers['Access-Control-Allow-Origin']).toBe('*');
    expect(res.headers['Access-Control-Allow-Methods']).toContain('POST');
    expect(res.ended).toBe(true);
  });
});

describe('POST /webhook - Response Format', () => {
  
  test('should return response with exact "word" field name', async () => {
    const req = new MockRequest('POST', { data: 'test' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.body).toHaveProperty('word');
    expect(res.body).not.toHaveProperty('result');
    expect(res.body).not.toHaveProperty('sorted');
    expect(res.body).not.toHaveProperty('data');
  });

  test('should return word as an array', async () => {
    const req = new MockRequest('POST', { data: 'test' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(Array.isArray(res.body.word)).toBe(true);
  });

  test('should return array of individual characters as strings', async () => {
    const req = new MockRequest('POST', { data: 'abc' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.body.word).toEqual(['a', 'b', 'c']);
    expect(typeof res.body.word[0]).toBe('string');
    expect(res.body.word[0]).toHaveLength(1);
  });

  test('should set CORS headers in response', async () => {
    const req = new MockRequest('POST', { data: 'test' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.headers['Access-Control-Allow-Origin']).toBeDefined();
    expect(res.headers['Access-Control-Allow-Methods']).toBeDefined();
  });
});

describe('POST /webhook - Edge Cases', () => {
  
  test('should handle string with only spaces', async () => {
    const req = new MockRequest('POST', { data: '   ' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.word).toEqual([' ', ' ', ' ']);
  });

  test('should handle string with newlines and tabs', async () => {
    const req = new MockRequest('POST', { data: 'a\nb\tc' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.word).toHaveLength(5); // a, \n, b, \t, c
  });

  test('should handle mixed case letters', async () => {
    const req = new MockRequest('POST', { data: 'HeLLo' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.word[0]).toBe('H'); // Uppercase H comes first in ASCII
  });

  test('should handle palindrome strings', async () => {
    const req = new MockRequest('POST', { data: 'racecar' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.word).toEqual(['a', 'a', 'c', 'c', 'e', 'r', 'r']);
  });

  test('should handle string with unicode characters', async () => {
    const req = new MockRequest('POST', { data: 'café' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.word).toHaveLength(4);
  });
});

describe('POST /webhook - Enhanced Features', () => {
  
  test('should reject strings longer than 100,000 characters', async () => {
    const veryLongString = 'a'.repeat(100001);
    const req = new MockRequest('POST', { data: veryLongString });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('exceed');
    expect(res.body.message).toContain('100000');
  });

  test('should accept strings exactly at 100,000 characters', async () => {
    const longString = 'a'.repeat(100000);
    const req = new MockRequest('POST', { data: longString });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.word).toHaveLength(100000);
  });

  test('should include security headers in response', async () => {
    const req = new MockRequest('POST', { data: 'test' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.headers['X-Content-Type-Options']).toBe('nosniff');
    expect(res.headers['X-Frame-Options']).toBe('DENY');
    expect(res.headers['X-XSS-Protection']).toBe('1; mode=block');
    expect(res.headers['Strict-Transport-Security']).toContain('max-age');
  });

  test('should include rate limit headers in response', async () => {
    const req = new MockRequest('POST', { data: 'test' });
    req.headers = { 'x-forwarded-for': '192.168.1.1' };
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.headers['X-RateLimit-Limit']).toBe('100');
    expect(res.headers['X-RateLimit-Remaining']).toBeDefined();
    expect(res.headers['X-RateLimit-Reset']).toBeDefined();
  });

  test('should return 429 after exceeding rate limit', async () => {
    const ip = '192.168.100.100';
    
    // Send 101 requests from same IP
    let lastResponse;
    for (let i = 0; i < 101; i++) {
      const req = new MockRequest('POST', { data: 'test' });
      req.headers = { 'x-forwarded-for': ip };
      const res = new MockResponse();
      
      await webhookHandler(req, res);
      lastResponse = res;
    }

    // The 101st request should be rate limited
    expect(lastResponse.statusCode).toBe(429);
    expect(lastResponse.body.error).toBe('Too Many Requests');
    expect(lastResponse.body.retryAfter).toBeDefined();
  });

  test('should track performance metrics', async () => {
    const req = new MockRequest('POST', { data: 'test' });
    const res = new MockResponse();

    const startTime = Date.now();
    await webhookHandler(req, res);
    const endTime = Date.now();

    expect(res.statusCode).toBe(200);
    expect(endTime - startTime).toBeLessThan(100); // Should be very fast
  });
});