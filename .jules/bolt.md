## 2026-03-28 - Deferring Leaflet initialization with IntersectionObserver
**Learning:** Leaflet maps are heavy to initialize and load tile assets. When used in long lists or below the fold (e.g., LandingPage), initializing them immediately blocks the main thread and downloads unnecessary tiles.
**Action:** Use `IntersectionObserver` (via the newly created `useIntersectionObserver` hook) to defer rendering of `LazyEventMap` and `LazySingleEventMap` until they are within a `rootMargin` of the viewport. This significantly improves initial page load and Time to Interactive (TTI).
