## 2025-05-23 - UI/Logic Security Discrepancy
**Vulnerability:** Weak password enforcement despite UI claims.
**Learning:** The UI displayed strict password requirements (letters, numbers, special chars) with visual feedback, but the underlying form validation only checked for length. This creates a false sense of security and allows users to set weak passwords that they believe are strong.
**Prevention:** Always ensure that visual validation cues in the UI are backed by identical or stricter validation logic in the form submission handler and backend. Validation must be redundant: UI feedback (for UX) + Form Validation (for Client-Side Security) + Backend Validation (for Real Security).

## 2025-05-24 - Unsafe User Input in Anchor Href
**Vulnerability:** Stored XSS in user profile social links.
**Learning:** User input was passed directly to the `href` attribute of `<a>` tags (via MUI `IconButton`). While React blocks `javascript:` URLs by throwing an error, it's safer and cleaner to validate input and sanitize output explicitly to prevent malicious data from ever being rendered or stored.
**Prevention:** Always sanitize user-provided URLs before rendering them in `href` attributes. Use a helper function to ensure the protocol is `http` or `https`. Enforce URL validation on input forms.

## 2025-02-17 - [Centralized URL Sanitization for React Href Attributes to Prevent XSS]
**Vulnerability:** Found multiple instances where user-provided links (e.g. `github`, `linkedin`, `website`) were rendered directly into `href` attributes in React components (`CollaboratorCard`, `OrgHeader`, `AboutUs`, etc.). While `UserSocials` component had a local `sanitizeUrl` utility, it was not shared or used in other places where these values were rendered. React does not automatically escape `javascript:` URIs in `href` props, allowing for Cross-Site Scripting (XSS).
**Learning:** Due to the duplicated logic across the app, user input wasn't consistently sanitized across all surfaces rendering social links. Using a decentralized sanitization logic allows vulnerabilities to slip through when new components are added or refactored.
**Prevention:** Centralize URL sanitization (`src/utils/sanitizeUrl.ts`) and ensure it's imported globally for any component rendering user-provided `href` attributes.
