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

## 🔔 Fase 5: Sistema de Notificaciones (Próx. v0.4.0)

### 5.1 Comunicaciones

- [ ] **Centro de Notificaciones:** Panel de alertas para usuarios y organizadores.
- [ ] **Push UI:** Toasts y alertas visuales para eventos en tiempo real.
- [ ] **Preferencias:** Configuración de alertas (Email/Push/SMS).

---

## 🚀 Fase 6: Comunidad y Social (Futuro v0.5.0)

### 6.1 Funcionalidades Sociales

- [ ] **Networking:** Chat entre asistentes y sistema de "Conectar".
- [ ] **Feed Social:** Tablón de anuncios para organizaciones y usuarios.
- [ ] **Soporte I18n:** Traducción completa (Español/Inglés).

---

## 📜 Historial de Versiones

| Versión    | Estado   | Descripción                                                             |
| ---------- | -------- | ----------------------------------------------------------------------- |
| **v0.0.1** | Alpha    | Prototipo estático generado por IA.                                     |
| **v0.1.0** | Alpha    | Mockup funcional con backend simulado.                                  |
| **v0.2.0** | Beta     | Refactorización modular completa, backend Go real.                      |
| **v0.3.0** | **Beta** | **Actual.** Pagos con Stripe, Scan QR, gestión de asistentes y tickets. |
