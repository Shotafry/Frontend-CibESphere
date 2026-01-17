# 🐛 Errores Conocidos y Deuda Técnica

> **Última Auditoría:** Enero 2026 (Verificado contra código real)

---

## ✅ Items Completados (Fases 1-3)

### Refactorización Modular ✅ VERIFICADO

| Componente Original    | Líneas Antes | Ahora (Orquestador) | Subdirectorio                |
| ---------------------- | ------------ | ------------------- | ---------------------------- |
| `PanelDeOrganizador`   | ~1200        | 7.3KB               | `panel-organizador/`         |
| `PanelDeUsuario`       | ~1300        | 11.2KB              | `panel-usuario/`             |
| `PanelDeAdministrador` | ~600         | 5.6KB               | `panel-administrador/tabs/`  |
| `Eventos`              | ~870         | 3.5KB               | `evento-detalle/components/` |
| `CrearEvento`          | ~850         | 6.5KB               | `crear-evento/`              |
| `UserProfile`          | ~550         | 2.1KB               | `user-profile/components/`   |
| `OrganizationProfile`  | ~420         | 1.2KB               | `organization-profile/`      |

### Optimizaciones de Rendimiento ✅ VERIFICADO

| Optimización      | Estado      | Archivos                                                                     |
| ----------------- | ----------- | ---------------------------------------------------------------------------- |
| Lazy Loading Maps | ✅ Completo | `components/LazyMap.tsx`                                                     |
| Skeleton Loaders  | ✅ Completo | `EventCardSkeleton`, `EventDetailSkeleton`, `PanelSkeleton`, `TableSkeleton` |
| Error Boundary    | ✅ Completo | `components/ErrorBoundary.tsx` (53 líneas)                                   |
| Scroll Fix        | ✅ Completo | `App.tsx` (shouldRevalidate)                                                 |

---

## 🛠️ Deuda Técnica Pendiente

### 1. Accesibilidad (a11y) ⚠️ PENDIENTE

- Falta añadir `aria-label` a IconButtons en Header, Footer, EventCard.
- Impacto: Usuarios con lectores de pantalla no pueden navegar correctamente.

### 2. Sistema de Diseño

| Aspecto              | Estado          | Observación                                |
| -------------------- | --------------- | ------------------------------------------ |
| CSS Variables        | ✅ Centralizado | `global.css` (4KB)                         |
| MUI Theme            | ⚠️ Parcial      | App.tsx tiene tema pero no usa todas vars. |
| Colores hardcodeados | ⚠️ Algunos      | Algunos `sx={{}}` tienen hex directos.     |

---

## 🧩 Funcionalidades Pendientes (Fase 4)

- [ ] **Networking:** Chat entre asistentes, sistema "Seguir".
- [ ] **Feed Social:** Tablón de anuncios.
- [ ] **Ticketing:** Entradas PDF con QR.
- [ ] **Pagos:** Integración Stripe.
- [ ] **i18n:** Configurar `react-i18next`.
- [ ] **Testing:** Configurar Vitest.

---

## 📊 Estado de Componentes

| Componente     | Tamaño | Estado        | Notas              |
| -------------- | ------ | ------------- | ------------------ |
| `EventCard`    | 8.4KB  | ✅ Bien       | Falta aria-label   |
| `Button`       | 2.8KB  | ✅ Bien       | Wrapper limpio     |
| `EventFilters` | 11.8KB | ⚠️ Grande     | Considerar dividir |
| `Header`       | 8.9KB  | ⚠️ Falta a11y | Añadir aria-labels |
| `Footer`       | 3.4KB  | ⚠️ Falta a11y | Añadir aria-labels |
| `MobileMenu`   | 9.7KB  | ⚠️ Falta a11y | Añadir aria-labels |
