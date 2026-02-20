## 2025-05-23 - ParticlesBackground Optimization
**Learning:** `Math.sqrt` is expensive inside high-frequency animation loops (60fps).
**Action:** Always compare squared distances (`dx*dx + dy*dy < r*r`) instead of square roots (`Math.sqrt(...) < r`) for collision/proximity checks. Only compute `Math.sqrt` if the exact distance is needed for rendering (e.g., opacity).
