/**
 * Sanitizes a URL to ensure it starts with safe protocols (http, https, mailto, tel, sms).
 * If the URL is missing protocol, it prepends https:// (if it looks like a domain).
 * If the URL is malicious (e.g. javascript:), it returns undefined to prevent rendering.
 */
export const sanitizeUrl = (url?: string): string | undefined => {
  if (!url) return undefined;

  // Trim whitespace
  const trimmed = url.trim();
  if (!trimmed) return undefined;

  // If it's just a domain (e.g. example.com), prepend https://
  // But be careful not to prepend to something that looks like a scheme
  let urlToParse = trimmed;
  if (!trimmed.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:/)) {
    urlToParse = `https://${trimmed}`;
  }

  try {
    const parsedUrl = new URL(urlToParse);

    // Allow only safe protocols
    const safeProtocols = ['http:', 'https:', 'mailto:', 'tel:', 'sms:'];
    if (safeProtocols.includes(parsedUrl.protocol)) {
      return parsedUrl.toString();
    }

    // If the protocol is not safe (e.g. javascript:, data:, vbscript:), return undefined
    return undefined;
  } catch (error) {
    // If URL parsing fails, it's malformed.
    return undefined;
  }
};
