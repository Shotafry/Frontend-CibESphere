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

## Fase 4: Monetización y Gestión (Beta v0.3.0) ✅

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

## 🔔 Fase 5: Sistema de Notificaciones y Social (v0.4.0) ✅

_Estado: COMPLETADO_

### 5.1 Comunicaciones ✅

- [x] **Centro de Notificaciones:** Panel de alertas (`NotificationsTab`).
- [x] **Visualización:** Formato de fecha relativa y acciones directas.
- [ ] **Push UI:** Toasts y alertas visuales realtime. _(Pendiente para v0.6.0)_

### 5.2 Social & Networking ✅

- [x] **ConnectButton:** Botón inteligente con estados (Conectar, Pendiente, Contactado).
- [x] **Popup de Contacto:** Visualización de datos (Discord, Email) tras conectar.
- [x] **Solicitudes:** Gestión de peticiones de conexión en panel de usuario.
- [x] **FollowButton:** Seguir organizaciones.
- [x] **NotificationBadge:** Icono con conteo de notificaciones.

---

## 🧪 Fase 6: Testing & Bug Fixes (v0.5.0)

_Estado: EN PROGRESO_

### Bugs Conocidos a Corregir

- [ ] **Notificaciones:** El icono aparece pero la notificación no se muestra al hacer click.
- [ ] **QRs:** No se ven correctamente en el panel de usuario.
- [ ] **Mejoras Visuales:** Ajustes de UI/UX pendientes.

### Testing

- [ ] Verificación funcional de conexiones.
- [ ] Verificación funcional de notificaciones.
- [ ] Verificación funcional de subscripciones.
- [ ] Testing de flujo completo de tickets.

---

## 🚀 Fase 7: Comunidad Avanzada (Futuro v0.6.0+)

### 7.1 Funcionalidades Sociales

- [ ] **Push Notifications:** Alertas en tiempo real.
- [ ] **Feed Social:** Tablón de actividad.
- [ ] **Chat:** Mensajería directa.
- [ ] **Soporte I18n:** Traducción completa (Español/Inglés).

---

## 📜 Historial de Versiones

| Versión    | Estado   | Descripción                                                        |
| ---------- | -------- | ------------------------------------------------------------------ | --- |
| **v0.0.1** | Alpha    | Prototipo estático generado por IA.                                |
| **v0.1.0** | Alpha    | Mockup funcional con backend simulado.                             |
| **v0.2.0** | Beta     | Refactorización modular completa, backend Go real.                 |
| **v0.3.0** | Beta     | Pagos con Stripe, Scan QR, gestión de asistentes y tickets.        |
| **v0.4.0** | **Beta** | **Completado.** Social, Conexiones, Subscriptions, Notificaciones. |
| **v0.5.0** | **Beta** | **En Desarrollo.** Testing, Bug Fixes y QA.                        |     |
