# 🐛 Errores Conocidos y Deuda Técnica

> **Última Auditoría:** Enero 2026 (Validado contra código real)

Este documento recopila los problemas técnicos identificados, áreas de mejora y funcionalidades pendientes de implementación.

---

## 🛑 Críticos / Alta Prioridad

### 1. Monolitos de Componentes ("God Objects")

Componentes que superan 800 líneas y violan el principio de responsabilidad única.

| Archivo                  | Líneas | Funciones Internas                 | Problema                                 |
| ------------------------ | ------ | ---------------------------------- | ---------------------------------------- |
| `PanelDeUsuario.tsx`     | 1328   | `EditProfileForm`, badges, reviews | Mezcla perfil + eventos + notificaciones |
| `PanelDeOrganizador.tsx` | 1197   | `StatCard`, `ProfileTabContent`    | Dashboard + CRUD + formularios           |
| `Eventos.tsx`            | 873    | `renderStars`, popovers            | Detalle + reseñas + mapa + inscripción   |
| `Page.tsx`               | 844    | Agenda + Speakers                  | Formulario de creación de evento         |

**Acción recomendada:** Ver plan de refactorización en `IMPLEMENTATION_PLAN.md`.

### 2. Accesibilidad (a11y) ❌ NO IMPLEMENTADA

- **Validado:** 0 resultados de `aria-label` en `src/components/`.
- **Afectados:** IconButtons en Header, Footer (redes sociales), EventCard (bookmark).
- **Impacto:** Usuarios con lectores de pantalla no pueden navegar correctamente.

### 3. Error Boundaries ❌ NO IMPLEMENTADAS

- **Validado:** No existe ningún componente ErrorBoundary.
- **Riesgo:** Si un componente (ej. Mapa Leaflet) crashea, toda la app falla.
- **Acción:** Crear `ErrorBoundary.tsx` y envolver componentes críticos.

---

## 🛠️ Mejoras de Arquitectura y Código

### 1. Sistema de Diseño (Estado Actual)

| Aspecto              | Estado               | Observación                                                    |
| -------------------- | -------------------- | -------------------------------------------------------------- |
| CSS Variables        | ✅ Centralizado      | `global.css` con `--color-cadetblue`, gradientes, etc.         |
| MUI Theme            | ⚠️ Parcial           | `App.tsx` tiene tema, pero no usa todas las variables.         |
| Componente Button    | ✅ Bien implementado | `Button.tsx` usa CSS vars correctamente, se usa en 9+ páginas. |
| Colores hardcodeados | ⚠️ Existen           | Algunos `sx={{}}` tienen colores directos en vez de variables. |

**Recomendación:** Mantener enfoque híbrido actual. Ver sección de decisiones técnicas.

### 2. Rendimiento

| Problema                     | Estado           | Solución                                                  |
| ---------------------------- | ---------------- | --------------------------------------------------------- |
| Mapas cargados síncronamente | ❌ Sin lazy load | Implementar `React.lazy` para Leaflet (~200KB)            |
| Carga visual                 | ❌ Solo spinners | Añadir Skeleton loaders para mejor UX                     |
| Animaciones de ruta          | ❌ No usadas     | `framer-motion` instalado pero `AnimatePresence` no usado |

### 3. ~~Repetición de Código (DRY) en Botones~~ ✅ RESUELTO

El componente `Button.tsx` ya unifica estilos y se usa consistentemente:

- Variantes: `primary` y `secondary`
- Usa CSS vars (`--gradient-button-primary`)
- Soporta: `to`, `href`, `startIcon`, `disabled`, `fullWidth`

---

## 🧩 Funcionalidades Pendientes (Backlog)

### UX/UI

- [ ] **Skeleton Loaders:** Para cards de eventos y paneles.
- [ ] **Transiciones:** `AnimatePresence` de Framer Motion entre rutas.
- [ ] **Error Boundaries:** Capturar errores por componente.

### Internacionalización (i18n)

- [ ] Configurar `react-i18next`.
- [ ] Extraer textos hardcodeados a archivos JSON.

### Testing ❌ NO CONFIGURADO

- `@testing-library` está instalado, pero no hay tests ni runner (Vitest).
- **Recomendación:** Configurar Vitest para lógica de negocio.

---

## ✅ Lo que YA Funciona (No tocar)

| Sistema           | Estado      | Notas                                                        |
| ----------------- | ----------- | ------------------------------------------------------------ |
| Reviews           | ✅ Completo | Backend endpoints + Frontend service + UI en Eventos y Panel |
| Badges de usuario | ✅ Completo | Upload + visualización + persistencia                        |
| Sistema de Auth   | ✅ Completo | JWT + Refresh Token + RBAC                                   |
| Componente Button | ✅ Completo | Wrapper unificado, bien diseñado                             |

---

## 📊 Auditoría de Componentes

| Componente     | Estado        | Notas                             |
| -------------- | ------------- | --------------------------------- |
| `EventCard`    | ✅ Bien       | Solo falta aria-label en bookmark |
| `Button`       | ✅ Bien       | Wrapper limpio, usa CSS vars      |
| `EventFilters` | ⚠️ Grande     | 11KB, considerar dividir          |
| `Header`       | ⚠️ Falta a11y | Añadir aria-labels                |
| `Footer`       | ⚠️ Falta a11y | Añadir aria-labels                |
