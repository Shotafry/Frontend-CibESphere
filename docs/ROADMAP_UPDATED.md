# 🗺️ Roadmap del Proyecto: CybESphere Frontend

> **Resumen Ejecutivo:**
> Este documento narra la evolución de **CybESphere**, desde su concepción visual en Figma hasta su estado actual como una plataforma Beta funcional y conectada.

---

## 🏛️ Fase 0: Concepción y Prototipado (Alpha v0.1.0) ✅

_Estado: COMPLETADO_

- **Origen:** Diseño de interfaz "Cyber/Glassmorphism" en Figma.
- **Generación:** Creación de maquetas estáticas HTML/React.
- **Refactorización Inicial:** Limpieza de código generado.
- **Despliegue:** Mockup desplegado en Vercel para validación visual.

---

## 🏗️ Fase 1: Modernización del Stack (Frontend Only) ✅

_Estado: COMPLETADO_

- **Migración Core:** Actualización a **React 19** y **React Router 7**.
- **Data Routers:** Implementación de `loaders` para gestión de datos asíncrona.
- **MUI 7:** Adopción de Material UI v7 y configuración de temas.
- **Simulación:** `apiService` mockeado con persistencia en `localStorage`.

---

## 🔗 Fase 2: Integración Backend (Beta v0.1.0 → v0.2.0) ✅

_Estado: COMPLETADO_

### 2.1 Networking & Auth ✅

- [x] Cliente HTTP con interceptores Axios.
- [x] JWT (Access + Refresh Token) y Logout seguro.
- [x] Login y Registro con `react-hook-form`.

### 2.2 Gestión de Roles (RBAC Real) ✅

- [x] Panel de Asistente: Historial, badges, favoritos.
- [x] Panel de Organizador: Dashboard, gestión de eventos, perfil.
- [x] Panel de Administrador: Verificación y métricas globales.

### 2.3 Refactorización Modular (Todos Completos) ✅

| Componente                | Estado     |
| ------------------------- | ---------- |
| `PanelDeOrganizador.tsx`  | ✅ Modular |
| `PanelDeUsuario.tsx`      | ✅ Modular |
| `PanelDeAdministrador`    | ✅ Modular |
| `Eventos.tsx`             | ✅ Modular |
| `CrearEvento.tsx`         | ✅ Modular |
| `UserProfile.tsx`         | ✅ Modular |
| `OrganizationProfile.tsx` | ✅ Modular |

---

## ⚡ Fase 3: Performance y UX (Beta v0.2.0) ✅

_Estado: COMPLETADO_

- [x] **Lazy Loading Mapas:** `LazyEventMap` con Skeleton loaders.
- [x] **Skeleton Loaders:** `EventCardSkeleton`, `EventDetailSkeleton`, `PanelSkeleton`.
- [x] **Scroll Fix:** Prevención de scroll-to-top en cambios de query params.
- [x] **Animaciones Internas:** Páginas estáticas con `framer-motion` (Hero + Content).
- [⏪] **Transiciones de Ruta:** Revertidas por conflictos con navegación de tabs.

---

## 💳 Fase 4: Monetización y Gestión (Beta v0.3.0) ✅

_Estado: COMPLETADO_

### 4.1 Marketplace & Pagos ✅

- [x] **Stripe Connect:** Flujo de onboarding para organizadores (`PaymentsTab`).
- [x] **Compra de Entradas:** UI para selección de Tiers (`TicketSelector`) y redirección a Stripe.
- [x] **Gestión de Entradas:** Panel "Mis Entradas" con visualización de QR.

### 4.2 Herramientas de Organización ✅

- [x] **Scanner QR:** Modal de escaneo de entradas integrado (`QRScannerModal`).
- [x] **Lista de Asistentes:** Visor "edge-to-edge" con check-in manual (`AttendeesList`).
- [x] **Edición Avanzada:** Gestión de Tipos de Ticket y Precios.

---

## 🔔 Fase 5: Sistema Social y Notificaciones (v0.4.0 → v0.5.0) ✅

_Estado: COMPLETADO_

### 5.1 Comunicaciones (v0.4.0) ✅

- [x] **Centro de Notificaciones:** Panel de alertas (`NotificationsTab`).
- [x] **Visualización:** Formato de fecha relativa y acciones directas.
- [x] **NotificationBadge:** Icono con conteo de notificaciones no leídas.

### 5.2 Social & Networking (v0.4.0) ✅

- [x] **ConnectButton:** Botón inteligente con estados (Conectar, Pendiente, Contactado).
- [x] **Popup de Contacto:** Visualización de datos (Discord, Email) tras conectar.
- [x] **Solicitudes:** Gestión de peticiones de conexión en panel de usuario.
- [x] **FollowButton:** Seguir organizaciones con contador en tiempo real.

### 5.3 Bug Fixes y Mejoras (v0.5.0) ✅

- [x] **QRs:** Corregido BACKEND_URL para visualización correcta.
- [x] **Notificaciones:** Corregido error de pagination y formato de fechas.
- [x] **Grid MUI v7:** Migración a nueva API de Grid2.
- [x] **CSV Export:** Exportar lista de asistentes funcional.
- [x] **Conexiones:** Separado click en card vs botón aceptar.
- [x] **Estilos:** Botones unificados con variantes primary/secondary.

### 5.4 Preferencias de Notificaciones (v0.5.0) ✅

- [x] **Push eliminado:** Solo canales Email y Web.
- [x] **API Backend:** GET/PUT `/user/notification-preferences`.
- [x] **Usuario:** Toggles para conexiones, tickets, eventos, recordatorios.
- [x] **Organizador:** Toggles para ventas, seguidores, resumen diario.
- [x] **Regiones:** Selector de comunidades autónomas.

### 5.5 Seguridad, Estabilidad y Compliance (v0.6.0) ✅

- [x] **Verificación de Email:**
  - Páginas `/check-email` y `/verify-email` con diseño consistente.
  - Integración con endpoint `GET /auth/verify`.
  - Bloqueo de login hasta verificar email.
- [x] **Compliance GDPR - Cookie Banner:**
  - Banner con glassmorphism y consentimiento granular.
  - `CookieContext` para gestión global de preferencias.
  - Persistencia en localStorage.
- [x] **Internacionalización (i18n):**
  - `react-i18next` configurado con ES/EN.
  - Landing Page traducida (PoC).
  - `LanguageSelector` en Header y MobileMenu.
  - Nueva variante `Button text` para elementos ligeros.
- [x] **Bug Fixes:**
  - Reviews: Fallback para usuarios eliminados.
  - Eventos Pasados: Filtro corregido en perfil público.

---

## 🛠️ Fase 6: Panel de Administración y Organizador (Beta v0.7.0)

_Estado: PLANIFICADA_

### 6.1 Panel de Administrador

- [ ] **Gestión de Usuarios:** Banning, verificación manual.
- [ ] **TBD:** Por definir.

### 6.2 Panel de Organizador

- [ ] **Dashboard Mejorado:** Métricas ampliadas.
- [ ] **TBD:** Por definir.

---

## 🚀 Fase 7: Release Candidate (RC v1.0.0)

_Estado: PLANIFICADA_

> **Nombre de versión: "Sentinel"** - La primera versión estable y lista para producción.

### 7.0 Internacionalización Completa

- [ ] **i18n Global:** Extender traducciones a todas las páginas.
- [ ] **Localización:** Formatos de fecha/hora según región.

### 7.1 Refactorización de Componentes

- [ ] **NotificationsTab (Usuario):** ~700 líneas, dividir en subcomponentes.
- [ ] **NotificationsTab (Organizador):** ~500 líneas, dividir en subcomponentes.
- [ ] **EventFilters:** ~12KB, considerar extracción de filtros individuales.
- [ ] **Header/MobileMenu:** Unificar estructura y añadir aria-labels.

### 7.2 Testing & QA

- [ ] **E2E Tests:** Flujo completo de registro → compra → check-in.
- [ ] **Verificación Social:** Conexiones, solicitudes, notificaciones.
- [ ] **Verificación Pagos:** Stripe Connect, compras, reembolsos.
- [ ] **Cross-Browser:** Chrome, Firefox, Safari, Edge.
- [ ] **Mobile:** Responsive en iOS Safari y Android Chrome.

### 7.3 Mejoras de UX/UI

- [ ] **Accesibilidad (a11y):** Aria-labels en todos los IconButtons.
- [ ] **Loading States:** Feedback visual consistente en todas las acciones.
- [ ] **Error Messages:** Mensajes de error amigables y contextuales.
- [ ] **Empty States:** Diseños para listas vacías.

### 7.4 Optimización

- [ ] **Bundle Size:** Análisis y reducción de dependencias.
- [ ] **Image Optimization:** Lazy loading y formatos modernos (WebP/AVIF).
- [ ] **API Caching:** Estrategias de cache para datos frecuentes.

---

## 🌐 Fase por definir: Comunidad Avanzada (vX.X.0+)

_Estado: FUTURO_ solo implementar si la web crece y se hace popular.

### X.X Funcionalidades Sociales Avanzadas

- [ ] **Push Notifications:** Alertas en tiempo real (Service Worker).
- [ ] **Feed Social:** Tablón de actividad de la comunidad.
- [ ] **Chat:** Mensajería directa entre usuarios conectados.

---

## 📜 Historial de Versiones

| Versión     | Tipo    | Estado        | Descripción                                                     |
| ----------- | ------- | ------------- | --------------------------------------------------------------- |
| **v0.0.1**  | Alpha   | ✅ Completado | Prototipo estático generado por IA.                             |
| **v0.1.0**  | Alpha   | ✅ Completado | Mockup funcional con backend simulado.                          |
| **v0.2.0**  | Beta    | ✅ Completado | Refactorización modular completa, backend Go real.              |
| **v0.3.0**  | Beta    | ✅ Completado | Pagos con Stripe, Scan QR, gestión de asistentes y tickets.     |
| **v0.4.0**  | Beta    | ✅ Completado | Social, Conexiones, Subscriptions, Notificaciones.              |
| **v0.5.0**  | Beta    | ✅ Completado | Testing, Bug Fixes, Preferencias de Notificaciones, CSV Export. |
| **v0.6.0**  | Beta    | ✅ Completado | Verificación Email, i18n (PoC), Cookie Banner GDPR, Bug Fixes.  |
| **v0.7.0**  | Beta    | 🔜 Próxima    | Panel de Administración y Organizador.                          |
| **v1.0.0**  | RC      | 📋 Futuro     | "Sentinel" - Primera versión estable para producción.           |
| **v1.1.0+** | Release | 📋 Futuro     | Por definir.                                                    |
