import { describe, it, expect } from 'vitest';
import { sanitizeUrl } from './sanitizeUrl';

describe('sanitizeUrl', () => {
  it('returns undefined for empty input', () => {
    expect(sanitizeUrl()).toBeUndefined();
    expect(sanitizeUrl('')).toBeUndefined();
    expect(sanitizeUrl('   ')).toBeUndefined();
  });

  it('keeps valid HTTP and HTTPS URLs', () => {
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com/');
    expect(sanitizeUrl('https://example.com/path?q=1')).toBe('https://example.com/path?q=1');
  });

  it('prepends https:// to domain-only inputs', () => {
    expect(sanitizeUrl('example.com')).toBe('https://example.com/');
    expect(sanitizeUrl('www.google.com/search')).toBe('https://www.google.com/search');
  });

  it('allows safe protocols (mailto, tel, sms)', () => {
    expect(sanitizeUrl('mailto:test@example.com')).toBe('mailto:test@example.com');
    expect(sanitizeUrl('tel:+1234567890')).toBe('tel:+1234567890');
    expect(sanitizeUrl('sms:12345')).toBe('sms:12345');
  });

  it('strips dangerous protocols to prevent XSS', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBeUndefined();
    expect(sanitizeUrl('vbscript:alert(1)')).toBeUndefined();
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBeUndefined();
  });

  it('strips dangerous protocols with extra spaces or tabs', () => {
    expect(sanitizeUrl(' javascript:alert(1)')).toBeUndefined();
    expect(sanitizeUrl('\tjavascript:alert(1)')).toBeUndefined();
    expect(sanitizeUrl(' java\nscript:alert(1)')).toBeUndefined();
    expect(sanitizeUrl('javascript :alert(1)')).toBeUndefined();
  });

  it('strips case-insensitive dangerous protocols', () => {
    expect(sanitizeUrl('JaVaScRiPt:alert(1)')).toBeUndefined();
  });
});
