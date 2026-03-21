export const sanitizeUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (/^(javascript|vbscript|data):/i.test(trimmed)) return undefined;
  if (trimmed.startsWith('/') || trimmed.startsWith('?') || trimmed.startsWith('#')) return trimmed;
  if (/^(https?|mailto|tel):/i.test(trimmed)) return trimmed;
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return `https://${trimmed}`;
  return undefined;
};
