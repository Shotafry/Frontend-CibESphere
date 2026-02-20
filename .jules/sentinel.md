## 2025-05-23 - UI/Logic Security Discrepancy
**Vulnerability:** Weak password enforcement despite UI claims.
**Learning:** The UI displayed strict password requirements (letters, numbers, special chars) with visual feedback, but the underlying form validation only checked for length. This creates a false sense of security and allows users to set weak passwords that they believe are strong.
**Prevention:** Always ensure that visual validation cues in the UI are backed by identical or stricter validation logic in the form submission handler and backend. Validation must be redundant: UI feedback (for UX) + Form Validation (for Client-Side Security) + Backend Validation (for Real Security).

## 2025-05-24 - Unsafe User Input in Anchor Href
**Vulnerability:** Stored XSS in user profile social links.
**Learning:** User input was passed directly to the `href` attribute of `<a>` tags (via MUI `IconButton`). While React blocks `javascript:` URLs by throwing an error, it's safer and cleaner to validate input and sanitize output explicitly to prevent malicious data from ever being rendered or stored.
**Prevention:** Always sanitize user-provided URLs before rendering them in `href` attributes. Use a helper function to ensure the protocol is `http` or `https`. Enforce URL validation on input forms.

## 2025-05-25 - Inconsistent Validation Logic
**Vulnerability:** Client-side validation bypass risk in `ImageUpload.tsx`.
**Learning:** While `EventImageUploader.tsx` had robust validation, `ImageUpload.tsx` (used for profiles) completely lacked it. This inconsistency is a common pattern where newer components get security features but older/different ones are overlooked. Always check "sibling" components when finding a security feature in one place.
**Prevention:** Centralize validation logic (e.g., a `validateImage` helper function) instead of duplicating it across components. This ensures all upload points share the same security posture.
