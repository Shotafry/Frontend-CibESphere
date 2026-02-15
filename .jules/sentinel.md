## 2025-05-23 - UI/Logic Security Discrepancy
**Vulnerability:** Weak password enforcement despite UI claims.
**Learning:** The UI displayed strict password requirements (letters, numbers, special chars) with visual feedback, but the underlying form validation only checked for length. This creates a false sense of security and allows users to set weak passwords that they believe are strong.
**Prevention:** Always ensure that visual validation cues in the UI are backed by identical or stricter validation logic in the form submission handler and backend. Validation must be redundant: UI feedback (for UX) + Form Validation (for Client-Side Security) + Backend Validation (for Real Security).
