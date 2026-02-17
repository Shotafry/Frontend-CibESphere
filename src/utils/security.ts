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

  // If it starts with http:// or https://, it's safe(r)
  if (trimmed.match(/^https?:\/\//i)) {
    return trimmed
  }

  // If it's just a domain (e.g. example.com), prepend https://
  // But be careful not to prepend to something that looks like a scheme
  if (!trimmed.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:/)) {
    return `https://${trimmed}`
  }

  // If it has another scheme (e.g. mailto:, tel:), we might want to allow or block.
  // For social links, we only expect web links.
  return undefined
}
