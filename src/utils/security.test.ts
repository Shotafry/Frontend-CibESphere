import { describe, it, expect } from 'vitest'
import { sanitizeUrl } from './security'

describe('sanitizeUrl', () => {
  it('should return undefined for undefined or empty string', () => {
    expect(sanitizeUrl(undefined)).toBeUndefined()
    expect(sanitizeUrl('')).toBeUndefined()
    expect(sanitizeUrl('   ')).toBeUndefined()
  })

  it('should allow valid http and https URLs', () => {
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com')
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com')
    expect(sanitizeUrl('https://sub.domain.com/path?query=1')).toBe('https://sub.domain.com/path?query=1')
  })

  it('should prepend https:// to domains without protocol', () => {
    expect(sanitizeUrl('example.com')).toBe('https://example.com')
    expect(sanitizeUrl('www.google.com')).toBe('https://www.google.com')
  })

  it('should reject javascript: URLs', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBeUndefined()
    expect(sanitizeUrl('JAVASCRIPT:alert(1)')).toBeUndefined()
    // Even if encoded or tricky, if it parses as javascript protocol, it should be rejected
    expect(sanitizeUrl(' javascript:alert(1)')).toBeUndefined()
  })

  it('should reject other dangerous protocols', () => {
    expect(sanitizeUrl('data:text/html,bad')).toBeUndefined()
    expect(sanitizeUrl('vbscript:msgbox')).toBeUndefined()
    expect(sanitizeUrl('file:///etc/passwd')).toBeUndefined()
  })

  it('should handle protocol-relative URLs by upgrading to https', () => {
    // //example.com -> https://example.com
    expect(sanitizeUrl('//example.com')).toBe('https://example.com')
  })
})
