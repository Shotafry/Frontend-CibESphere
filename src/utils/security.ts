/**
 * Security utility functions for CybESphere.
 */

/**
 * Sanitizes a URL to ensure it is safe for use in href attributes.
 * Strictly allows only http: and https: protocols.
 * Returns undefined if the URL is invalid or uses an unsafe protocol.
 *
 * @param url - The URL to sanitize
 * @returns The sanitized URL (always starting with http/https) or undefined
 */
export const sanitizeUrl = (url?: string): string | undefined => {
  if (!url) return undefined

  const trimmed = url.trim()
  if (!trimmed) return undefined

  // Handle protocol-relative URLs (e.g. //example.com)
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`
  }

  try {
    // Attempt to parse the URL
    // If it lacks a protocol, URL() constructor usually throws (in non-browser envs without base)
    const parsed = new URL(trimmed)

    // Whitelist allowed protocols
    if (['http:', 'https:'].includes(parsed.protocol)) {
      return trimmed
    }

    // Reject everything else (javascript:, data:, vbscript:, etc.)
    return undefined
  } catch (error) {
    // If parsing failed, it might be a domain without protocol (e.g. "google.com")
    // We try prepending https://
    try {
      const withHttps = `https://${trimmed}`
      const parsedHttps = new URL(withHttps)

      if (['http:', 'https:'].includes(parsedHttps.protocol)) {
        return withHttps
      }
    } catch (e) {
      // Still invalid
      return undefined
    }

    return undefined
  }
}
