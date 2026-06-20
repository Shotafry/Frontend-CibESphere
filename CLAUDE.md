# Cybesphere Frontend

> **La ley y el método están en la raíz: [`../CLAUDE.md`](../CLAUDE.md).** Léelo primero, junto con [`../docs/HANDOFF.md`](../docs/HANDOFF.md) y la referencia [`../docs/referencia/frontend.md`](../docs/referencia/frontend.md). Este fichero solo recoge gotchas de stack del frontend.

## Stack
React 19.2 · Vite 5 · TypeScript **strict** · MUI 7 (en migración a **shadcn/ui + Tailwind**, ver `../CLAUDE.md` §6.1) · axios · react-router 7 · react-hook-form · i18next · leaflet · framer-motion · recharts · html5-qrcode.

## Gotchas
- **No hardcodees hex ni estilos sueltos**: usa el sistema de diseño (tokens). Eliminar los ~390 hex hardcodeados es objetivo de la reconstrucción, no añadas más.
- **API solo vía `src/services/api/`** (no axios directo en componentes). El `httpClient` ya inyecta token, refresca en 401 y desenvuelve `{ success, data }`.
- **Auth vía `useAuth()`** (`src/context/AuthContext.tsx`); envuelve cualquier `JSON.parse(localStorage...)` en try/catch.
- **RBAC**: hoy disperso (checks `user.role` inline). Se centraliza en una release; no añadas más checks inline.
- **TS strict, nada de `any` nuevo.** Texto de UI en español.
- **Tests** con Vitest + Testing Library (instaladas, sin usar): añade el primero de lo que toques.

## Verde
`npm run build` (`tsc && vite build`) + `npm run lint` sin errores; tests verdes. (`node_modules` no instalado: escanear el lockfile con OSV antes de `npm install`.)
