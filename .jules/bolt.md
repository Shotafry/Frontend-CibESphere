# Bolt's Journal - Critical Learnings

## 2024-05-23 - [Lazy Loading Maps]
**Learning:** Heavy components like Maps should be lazy loaded only when they intersect with the viewport.
**Action:** Use `IntersectionObserver` to trigger the `import()` call.
