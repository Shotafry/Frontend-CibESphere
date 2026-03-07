## 2025-03-07 - [Lazy Loading Maps with Intersection Observer]
**Learning:** Initial React.lazy for map components is good, but without tying it to an intersection observer, the heavy leaflet libraries are loaded as soon as the component is mounted in the DOM, even if they are far off-screen.
**Action:** Used `IntersectionObserver` via a custom hook to defer rendering the map until it approaches the viewport (using a 200px rootMargin buffer), significantly reducing the critical rendering path load for pages containing off-screen maps.
