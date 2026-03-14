/**
 * Sanitizes a URL to ensure it starts with http:// or https://
 * If the URL is missing protocol, it prepends https://
 * If the URL is malicious (e.g. javascript:), it returns undefined to prevent rendering
 */
export const sanitizeUrl = (url?: string): string | undefined => {
  if (!url) return undefined

  // Trim whitespace
  const trimmed = url.trim()

  // Check for malicious schemes (case insensitive)
  if (trimmed.match(/^(javascript|vbscript|data):/i)) {
    return undefined
  }

  // Allow safe protocols explicitly
  if (trimmed.match(/^(https?|mailto|tel|sms):/i)) {
    return trimmed
  }

  // Allow relative URLs (starting with /, #, or ?)
  if (trimmed.match(/^[\/#?]/)) {
    return trimmed
  }

  // If it's just a domain (e.g. example.com), prepend https://
  // But be careful not to prepend to something that looks like a scheme
  if (!trimmed.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:/)) {
    return `https://${trimmed}`
  }

  // If it has an unrecognized scheme, reject it.
  return undefined
}
