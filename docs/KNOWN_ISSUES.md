# 🐛 Errores Conocidos y Deuda Técnica

> **Última Auditoría:** Febrero 2026 (Beta v0.6.0 - COMPLETADA)

---

## ✅ Items Completados (Fases 1-5)

### Marketplace & Pagos ✅ v0.3.0

- **Stripe:** Flujos de conexión y compra integrados (via `organizations.service.ts`).
- **Scanning:** Lector QR funcional (`html5-qrcode`).
- **Listados:** `AttendeesList` optimizado para móvil.

### Optimizaciones de Rendimiento ✅

- Lazy Loading Maps, Skeleton Loaders, Error Boundaries y Scroll Fix completados.

### Social & Networking (v0.4.0) ✅

- **ConnectButton:** Implementado con estados (Conectar, Pendiente, Conectado).
- **FollowButton:** Seguir organizaciones con contador en tiempo real.
- **NotificationBadge:** Icono con conteo implementado.
- **ConnectionRequestsManager:** Gestión de solicitudes pendientes.

### Bug Fixes (v0.5.0) ✅

- **QRs:** Corregido BACKEND_URL - ahora los códigos QR se muestran correctamente.
- **Notificaciones:** Corregido error de pagination y formato de fechas inválidas.
- **Grid MUI v7:** Migración completada a nueva API Grid2.
- **Conexiones:** Separado click en card (ver perfil) vs botón (aceptar solicitud).
- **CSV Export:** Exportar lista de asistentes funcional en AttendeesList.
- **Botones:** Unificados con variantes primary/secondary consistentes.

### Preferencias de Notificaciones (v0.5.0) ✅

- **API Backend:** GET/PUT `/user/notification-preferences`.
- **Push eliminado:** Solo canales Email y Web.
- **Toggles uniformes:** Espaciado consistente con minHeight y width: 100%.

### Seguridad, Compliance y Journey Organizador (v0.6.0) ✅

- **Verificación de Email:** Flujo completo con páginas `/check-email` y `/verify-email`.
- **Cookie Banner GDPR:** Banner glassmorphism con consentimiento granular.
- **i18n (PoC):** `react-i18next` configurado, Landing Page traducida.
- **Journey del Organizador:** Onboarding con formulario de 3 pasos (`CreateOrganization.tsx`).
- **Success Modal:** Componente `SuccessModal` con React Portal y auto-cierre.
- **Page Transitions:** `PageTransition` wrapper con `framer-motion`.
- **Self-Follow Prevention:** `FollowButton` oculto para miembros de la organización.

---

## 🛠️ Deuda Técnica Conocida

### 1. Componentes Grandes (Refactorizar en v1.0.0)

| Componente                       | Tamaño  | Estado    | Acción                                |
| -------------------------------- | ------- | --------- | ------------------------------------- |
| `NotificationsTab (Usuario)`     | ~750 ln | ⚠️ Grande | Dividir en History, Settings, Regions |
| `NotificationsTab (Organizador)` | ~500 ln | ⚠️ Grande | Dividir en History y Settings         |
| `EventFilters.tsx`               | 11.8KB  | ⚠️ Grande | Extraer filtros individuales          |
| `PanelDeOrganizador.tsx`         | >500 ln | ⚠️ Grande | Revisar estructura de tabs            |

### 2. Layout & Responsividad (Desktop-First)

- **Estado:** Funcional en Desktop/Tablet, mejorable en móviles pequeños.
- **Efecto:** Algunos componentes complejos funcionan mejor en pantallas grandes.
- **Mitigación:** Se han aplicado mejoras puntuales pero falta revisión mobile-first integral.

### 3. Permisos de Cámara (QR Scanner)

- **Problema:** En navegadores no seguros (HTTP), la API de cámara puede bloquearse.
- **Requisito:** `QRScannerModal` requiere HTTPS en producción o `localhost` en desarrollo.

### 4. Accesibilidad (a11y)

- Falta añadir `aria-label` a IconButtons en Header, Footer, EventCard, MobileMenu.
- No hay skip-links para navegación por teclado.

---

## 🔴 Bugs Conocidos Actuales

> _Actualmente no hay bugs críticos conocidos. Los bugs de v0.5.0 han sido corregidos._

### Menores/Cosméticos

- **Autocomplete Regiones:** El input puede mostrar "[object Object]" si se edita texto manualmente.
- **Responsive Paneles:** Algunos tabs pueden requerir scroll horizontal en móviles muy pequeños (<360px).

---

## 🧩 Funcionalidades Pendientes (v1.0.0+)

- [ ] **Refactorización:** Dividir componentes grandes en subcomponentes reutilizables.
- [ ] **Testing E2E:** Flujos completos automatizados.
- [ ] **i18n:** Traducción completa (Español/Inglés).

---

## 📊 Estado de Componentes Clave

| Componente           | Tamaño | Estado        | Notas                        |
| -------------------- | ------ | ------------- | ---------------------------- |
| `EventCard`          | 8.4KB  | ✅ Bien       | Falta aria-label             |
| `Button`             | 2.8KB  | ✅ Bien       | Wrapper limpio con variantes |
| `Header`             | 8.9KB  | ⚠️ Falta a11y | Añadir aria-labels           |
| `Footer`             | 3.4KB  | ⚠️ Falta a11y | Añadir aria-labels           |
| `MobileMenu`         | 9.7KB  | ⚠️ Falta a11y | Añadir aria-labels           |
| `FollowButton`       | 3.2KB  | ✅ Bien       | Estados correctos            |
| `ConnectButton`      | 4.1KB  | ✅ Bien       | Maneja todos los estados     |
| `AttendeesList`      | 6.5KB  | ✅ Bien       | CSV Export funcional         |
| `SuccessModal`       | 2.5KB  | ✅ Bien       | Portal-based, auto-cierre    |
| `CreateOrganization` | 12KB   | ✅ Bien       | Stepper de 3 pasos           |
