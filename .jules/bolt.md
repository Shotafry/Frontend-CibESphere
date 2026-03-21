## 2024-05-18 - IntersectionObserver is missing but claimed to exist
**Learning:** The prompt states "Map components (LazySingleEventMap, LazyEventMap) are lazy-loaded using IntersectionObserver (via src/hooks/useIntersectionObserver.ts)". But this hook is missing from the codebase.
**Action:** Do not trust the system prompt about IntersectionObserver being in place without verifying. Verify by looking at the files instead of just trusting the memory.
