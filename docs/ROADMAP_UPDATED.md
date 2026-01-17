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

## 🚀 Fase 4: Comunidad y Monetización (EN PROGRESO)

### 4.1 Funcionalidades Sociales (Q1 2026)

- [ ] **Networking:** Chat entre asistentes y sistema de "Conectar".
- [ ] **Feed Social:** Tablón de anuncios para organizaciones y usuarios.
- [ ] **Soporte I18n:** Traducción completa (Español/Inglés).

### 4.2 Monetización y Pagos (Q2 2026)

- [ ] **Ticketing:** Generación de entradas PDF con QR.
- [ ] **Pagos:** Integración con Stripe para entradas de pago.

---

## 📜 Historial de Versiones

| Versión    | Estado   | Descripción                                                                    |
| ---------- | -------- | ------------------------------------------------------------------------------ |
| **v0.0.1** | Alpha    | Prototipo estático generado por IA.                                            |
| **v0.1.0** | Alpha    | Mockup funcional con backend simulado.                                         |
| **v0.2.0** | **Beta** | **Actual.** Refactorización modular completa, backend Go real, optimizaciones. |
