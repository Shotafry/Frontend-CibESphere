## 2026-02-17 - [Missing Lazy Loading in Event Lists]
**Learning:** `EventCard` components are used in potentially long lists (Landing Page, Organization Profile) and load images immediately. This creates unnecessary network requests for off-screen content.
**Action:** Always check list components for image loading strategies. Added `loading="lazy"` and `decoding="async"` to `EventCard` images to defer loading until they are near the viewport.
