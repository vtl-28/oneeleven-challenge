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
    expect(res.body.word[0]).toBe('a');
    expect(res.body.word[999]).toBe('z');
    expect(duration).toBeLessThan(1000);
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
    expect(res.body.message).toContain('object');
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
    expect(res.body.word).toHaveLength(5);
  });

  test('should handle mixed case letters', async () => {
    const req = new MockRequest('POST', { data: 'HeLLo' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.word[0]).toBe('H');
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

describe('POST /webhook - Security Headers', () => {
  
  test('should include X-Content-Type-Options header', async () => {
    const req = new MockRequest('POST', { data: 'test' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.headers['X-Content-Type-Options']).toBe('nosniff');
  });

  test('should include X-Frame-Options header', async () => {
    const req = new MockRequest('POST', { data: 'test' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.headers['X-Frame-Options']).toBe('DENY');
  });

  test('should include X-XSS-Protection header', async () => {
    const req = new MockRequest('POST', { data: 'test' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.headers['X-XSS-Protection']).toBe('1; mode=block');
  });

  test('should include Strict-Transport-Security header', async () => {
    const req = new MockRequest('POST', { data: 'test' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.headers['Strict-Transport-Security']).toBeDefined();
    expect(res.headers['Strict-Transport-Security']).toContain('max-age');
    expect(res.headers['Strict-Transport-Security']).toContain('includeSubDomains');
  });

  test('should include all security headers together', async () => {
    const req = new MockRequest('POST', { data: 'test' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.headers['X-Content-Type-Options']).toBe('nosniff');
    expect(res.headers['X-Frame-Options']).toBe('DENY');
    expect(res.headers['X-XSS-Protection']).toBe('1; mode=block');
    expect(res.headers['Strict-Transport-Security']).toContain('max-age');
  });

  test('should include security headers even on error responses', async () => {
    const req = new MockRequest('POST', {});
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.headers['X-Content-Type-Options']).toBe('nosniff');
    expect(res.headers['X-Frame-Options']).toBe('DENY');
  });
});

describe('POST /webhook - Rate Limit Headers', () => {
  
  test('should include X-RateLimit-Limit header', async () => {
    const req = new MockRequest('POST', { data: 'test' });
    req.headers = { 'x-forwarded-for': '10.0.0.1' };
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.headers['X-RateLimit-Limit']).toBe('100');
  });

  test('should include X-RateLimit-Remaining header', async () => {
    const req = new MockRequest('POST', { data: 'test' });
    req.headers = { 'x-forwarded-for': '10.0.0.2' };
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.headers['X-RateLimit-Remaining']).toBeDefined();
    expect(parseInt(res.headers['X-RateLimit-Remaining'])).toBeGreaterThanOrEqual(0);
    expect(parseInt(res.headers['X-RateLimit-Remaining'])).toBeLessThanOrEqual(100);
  });

  test('should include X-RateLimit-Reset header with ISO timestamp', async () => {
    const req = new MockRequest('POST', { data: 'test' });
    req.headers = { 'x-forwarded-for': '10.0.0.3' };
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.headers['X-RateLimit-Reset']).toBeDefined();
    
    const resetTime = new Date(res.headers['X-RateLimit-Reset']);
    expect(resetTime.toString()).not.toBe('Invalid Date');
    
    expect(resetTime.getTime()).toBeGreaterThan(Date.now());
  });

  test('should decrement remaining count with each request', async () => {
    const ip = '10.0.1.100';
    
    const req1 = new MockRequest('POST', { data: 'test' });
    req1.headers = { 'x-forwarded-for': ip };
    const res1 = new MockResponse();
    await webhookHandler(req1, res1);
    const remaining1 = parseInt(res1.headers['X-RateLimit-Remaining']);

    const req2 = new MockRequest('POST', { data: 'test' });
    req2.headers = { 'x-forwarded-for': ip };
    const res2 = new MockResponse();
    await webhookHandler(req2, res2);
    const remaining2 = parseInt(res2.headers['X-RateLimit-Remaining']);

    const req3 = new MockRequest('POST', { data: 'test' });
    req3.headers = { 'x-forwarded-for': ip };
    const res3 = new MockResponse();
    await webhookHandler(req3, res3);
    const remaining3 = parseInt(res3.headers['X-RateLimit-Remaining']);

    expect(remaining2).toBe(remaining1 - 1);
    expect(remaining3).toBe(remaining2 - 1);
  });
});

describe('POST /webhook - Rate Limiting Enforcement', () => {
  
  test('should allow first 100 requests from same IP', async () => {
    const ip = '10.1.1.1';
    
    for (let i = 0; i < 100; i++) {
      const req = new MockRequest('POST', { data: 'test' });
      req.headers = { 'x-forwarded-for': ip };
      const res = new MockResponse();
      
      await webhookHandler(req, res);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.word).toBeDefined();
    }
  });

  test('should return 429 on 101st request from same IP', async () => {
    const ip = '10.1.1.2';
    
    let lastResponse;
    for (let i = 0; i < 101; i++) {
      const req = new MockRequest('POST', { data: 'test' });
      req.headers = { 'x-forwarded-for': ip };
      const res = new MockResponse();
      
      await webhookHandler(req, res);
      lastResponse = res;
    }

    expect(lastResponse.statusCode).toBe(429);
    expect(lastResponse.body.error).toBe('Too Many Requests');
  });

  test('should include retryAfter in 429 response', async () => {
    const ip = '10.1.1.3';
    
    for (let i = 0; i < 101; i++) {
      const req = new MockRequest('POST', { data: 'test' });
      req.headers = { 'x-forwarded-for': ip };
      const res = new MockResponse();
      
      await webhookHandler(req, res);
      
      if (res.statusCode === 429) {
        expect(res.body.retryAfter).toBeDefined();
        
        const retryTime = new Date(res.body.retryAfter);
        expect(retryTime.getTime()).toBeGreaterThan(Date.now());
      }
    }
  });

  test('should track different IPs separately', async () => {
    const ip1 = '10.2.1.1';
    const ip2 = '10.2.1.2';
    
    for (let i = 0; i < 100; i++) {
      const req = new MockRequest('POST', { data: 'test' });
      req.headers = { 'x-forwarded-for': ip1 };
      const res = new MockResponse();
      await webhookHandler(req, res);
      expect(res.statusCode).toBe(200);
    }

    const req = new MockRequest('POST', { data: 'test' });
    req.headers = { 'x-forwarded-for': ip2 };
    const res = new MockResponse();
    await webhookHandler(req, res);
    
    expect(res.statusCode).toBe(200);
    expect(parseInt(res.headers['X-RateLimit-Remaining'])).toBeGreaterThan(90);
  });

  test('should handle requests without IP address', async () => {
    const req = new MockRequest('POST', { data: 'test' });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.headers['X-RateLimit-Limit']).toBeDefined();
  });
});

describe('POST /webhook - Input Length Validation', () => {
  
  test('should reject strings longer than 100,000 characters', async () => {
    const veryLongString = 'a'.repeat(100001);
    const req = new MockRequest('POST', { data: veryLongString });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Bad Request');
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

  test('should accept strings at 99,999 characters', async () => {
    const longString = 'z'.repeat(99999);
    const req = new MockRequest('POST', { data: longString });
    const res = new MockResponse();

    await webhookHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.word).toHaveLength(99999);
  });
});

describe('POST /webhook - Performance Tracking', () => {
  
  test('should process requests quickly', async () => {
    const req = new MockRequest('POST', { data: 'test' });
    const res = new MockResponse();

    const startTime = Date.now();
    await webhookHandler(req, res);
    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(res.statusCode).toBe(200);
    expect(duration).toBeLessThan(100)
  });

  test('should handle 1000 character string efficiently', async () => {
    const req = new MockRequest('POST', { data: 'a'.repeat(1000) });
    const res = new MockResponse();

    const startTime = Date.now();
    await webhookHandler(req, res);
    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(res.statusCode).toBe(200);
    expect(duration).toBeLessThan(200);
  });
});