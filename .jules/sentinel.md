## 2025-05-23 - UI/Logic Security Discrepancy
**Vulnerability:** Weak password enforcement despite UI claims.
**Learning:** The UI displayed strict password requirements (letters, numbers, special chars) with visual feedback, but the underlying form validation only checked for length. This creates a false sense of security and allows users to set weak passwords that they believe are strong.
**Prevention:** Always ensure that visual validation cues in the UI are backed by identical or stricter validation logic in the form submission handler and backend. Validation must be redundant: UI feedback (for UX) + Form Validation (for Client-Side Security) + Backend Validation (for Real Security).

## 2025-05-24 - Unsafe User Input in Anchor Href
**Vulnerability:** Stored XSS in user profile social links.
**Learning:** User input was passed directly to the `href` attribute of `<a>` tags (via MUI `IconButton`). While React blocks `javascript:` URLs by throwing an error, it's safer and cleaner to validate input and sanitize output explicitly to prevent malicious data from ever being rendered or stored.
**Prevention:** Always sanitize user-provided URLs before rendering them in `href` attributes. Use a helper function to ensure the protocol is `http` or `https`. Enforce URL validation on input forms.
## 2024-05-18 - [Centralized URL Sanitization]
**Vulnerability:** XSS vulnerability through `href` attributes. The codebase had an incomplete `sanitizeUrl` utility relying on regexes, which could be bypassed by whitespaces or encoded characters. In other places, external URLs supplied by users (like LinkedIn profiles or websites) were used in `href` without any sanitization.
**Learning:** Using regex for URL sanitization is inherently flawed and error-prone. React's JSX prevents XSS in text nodes but NOT in `href` attributes if `javascript:` protocols are supplied. Furthermore, inline sanitization needs to be explicitly typed `as string` or guarded otherwise TypeScript's control flow analysis might not infer truthiness correctly for inline prop assignments like `href={sanitizeUrl(user.url)}`.
**Prevention:** We created a robust `sanitizeUrl` at `src/utils/sanitizeUrl.ts` that relies on the native `URL` API and an explicitly defined allowlist of safe protocols (`http:`, `https:`, `mailto:`, `tel:`, `sms:`). This approach prevents any sort of bypass. We also ensured that components like `ConnectButton`, `OrgHeader`, `CollaboratorCard`, and `AboutUs` make use of this centralized helper when rendering external links.
