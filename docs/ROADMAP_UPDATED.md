# 🗺️ Roadmap del Proyecto: CybESphere Frontend

> **Resumen Ejecutivo:**
> Este documento narra la evolución de **CybESphere**, desde su concepción visual en Figma hasta su estado actual como una plataforma Beta funcional y conectada. Se detalla el arduo trabajo de refactorización, modernización y conexión con el backend.

---

## 🏛️ Fase 0: Concepción y Prototipado (Alpha v0.1.0)

_Estado: COMPLETADO | Enfoque: Mockup Visual & UX_

El proyecto nació de un diseño en Figma y pasó por una fase inicial de generación de código asistida por IA para crear un prototipo visual.

- **Origen:** Diseño de interfaz "Cyber/Glassmorphism" en Figma.
- **Generación:** Creación de maquetas estáticas HTML/React.
- **Refactorización Inicial:** Limpieza de código generado, organización de carpetas y corrección de estilos inline.
- **Despliegue:** Mockup desplegado en Vercel para validación visual.

---

## 🏗️ Fase 1: Modernización del Stack (Frontend Only)

_Estado: COMPLETADO | Enfoque: Arquitectura React Moderna_

Se decidió reescribir la base para usar las tecnologías más recientes, abandonando librerías obsoletas.

- **Migración Core:** Actualización a **React 19** y **React Router 7**.
- **Data Routers:** Implementación de `loaders` para gestión de datos asíncrona (eliminando `useEffect` waterfalls).
- **MUI 7:** Adopción de Material UI v7 y corrección del sistema de temas (`global.css` vs CSS-in-JS).
- **Simulación:** Creación de un `apiService` mockeado que simulaba latencia y persistencia en `localStorage`.

---

## 🔗 Fase 2: Integración Backend (Beta v0.1.0)

_Estado: COMPLETADO | Enfoque: Conexión Real y Lógica de Negocio_

La fase más crítica. Se conectó el frontend con el Backend en Go (Gin Framework), transformando el mockup en una aplicación real.

### 2.1 Networking & Auth

- [x] **Cliente HTTP:** Implementación de Axios Singleton con interceptores.
- [x] **Seguridad:** Gestión de JWT (Access + Refresh Token) y Logout seguro.
- [x] **Autenticación:** Login y Registro unificados, validación de formularios con `react-hook-form`.

### 2.2 Gestión de Roles (RBAC Real)

- [x] **Panel de Asistente:** Layout premium, historial, badges system.
- [x] **Panel de Organizador (Refactorizado):**
  - Modularizado en `src/pages/panel-organizador/`.
  - Persistencia de tabs URL (`?tab=events`).
  - Dashboard y gestión de perfil optimizados.
- [x] **Panel de Administrador:** Verificación y métricas globales.

### 2.3 UX/UI & "Cyber Aesthetic"

- [x] **Refactorización de Eventos:**
  - `Eventos.tsx` modularizado en `src/pages/evento-detalle/`.
  - Componentes independientes para Hero, Sidebar, Reviews y Mapa.
- [x] **Refactorización de Creación:**
  - `CrearEvento.tsx` (antes Page.tsx) modularizado con hooks personalizados (`useEventForm`).
- [x] **Diseño Visual:** Implementación de Glow, Glassmorphism y Responsive Mobile.

### 2.4 Refactorización "Monolitos" (COMPLETADO)

- [x] **UserProfile.tsx:** Desglose de componentes (Hero, Bio, Stats, Tabs).
- [x] **OrganizationProfile.tsx:** Modularización completa (Hero, Header, Events).
- [x] **PanelDeAdministrador.tsx:** Separación de lógica de Dashboard, Usuarios y Organizaciones.

---

## 🚀 Fase 3: Comunidad y Monetización (EN PROGRESO)

Esta fase se centra en transformar la plataforma en una red social activa y sostenible.

### 3.1 Funcionalidades Sociales (Q1 2026)

- [ ] **Networking:** Chat entre asistentes y sistema de "Conectar" (LinkedIn integration).
- [ ] **Feed Social:** Tablón de anuncios para organizaciones y usuarios.
- [ ] **Soporte I18n:** Traducción completa (Español/Inglés).

### 3.2 Monetización y Pagos (Q2 2026)

- [ ] **Ticketing:** Generación de entradas PDF con QR.
- [ ] **Pagos:** Integración con Stripe para entradas de pago.

---

## 📜 Historial de Versiones

| Versión    | Estado   | Descripción                                                                  |
| ---------- | -------- | ---------------------------------------------------------------------------- |
| **v0.0.1** | Alpha    | Prototipo estático generado por IA.                                          |
| **v0.1.0** | Alpha    | Mockup funcional con backend simulado en localStorage.                       |
| **v0.2.0** | **Beta** | **Versión Actual.** Refactorización modular completa, backend Go real, RBAC. |
