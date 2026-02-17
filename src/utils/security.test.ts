import { describe, it, expect } from 'vitest'
import { sanitizeUrl } from './security'

describe('sanitizeUrl', () => {
  it('returns undefined for undefined input', () => {
    expect(sanitizeUrl(undefined)).toBeUndefined()
  })

  it('returns undefined for empty input', () => {
    expect(sanitizeUrl('')).toBeUndefined()
  })

  it('returns undefined for javascript: protocol', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBeUndefined()
    expect(sanitizeUrl('JAVASCRIPT:alert(1)')).toBeUndefined()
  })

  it('returns undefined for vbscript: protocol', () => {
    expect(sanitizeUrl('vbscript:msgbox "hello"')).toBeUndefined()
  })

  it('returns undefined for data: protocol', () => {
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBeUndefined()
  })

  it('prepends https:// to domain-only input', () => {
    expect(sanitizeUrl('example.com')).toBe('https://example.com')
    expect(sanitizeUrl('www.google.com')).toBe('https://www.google.com')
  })

  it('preserves http:// protocol', () => {
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com')
  })

  it('preserves https:// protocol', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com')
  })

  it('trims whitespace', () => {
    expect(sanitizeUrl('  https://example.com  ')).toBe('https://example.com')
  })
})
