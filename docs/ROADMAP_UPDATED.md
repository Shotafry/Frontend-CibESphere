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

- [x] **Panel de Asistente:**
  - Historial de eventos e inscripciones.
  - CRUD de perfil de usuario (Avatar, Bio, Redes Sociales).
  - Sistema de "Guardados" (Bookmarks) y Reseñas verificadas.
- [x] **Panel de Organizador:**
  - **Dashboard:** Métricas reales (Asistentes, Visitas) corregidas en backend.
  - **Gestión de Eventos:** Creación con formulario dinámico (Agenda, Ponentes ilimitados).
  - **Perfil Corporativo:** Edición de slug, logo y banner con previsualización real.
- [x] **Panel de Administrador:**
  - Verificación de organizaciones y KPIs globales.

### 2.3 UX/UI & "Cyber Aesthetic"

- [x] **Diseño Visual:**
  - Implementación de "Glow" effects y sombras cian (`#01c0fa`) en tarjetas.
  - Fondos de partículas interactivas (`ParticlesBackground`).
- [x] **Mapas:**
  - Integración de **React Leaflet 5**.
  - Popups personalizados y filtrado geoespacial.
- [x] **Responsive Mobile:**
  - Adaptación total a pantallas de 360px.
  - Menú lateral (Drawer) para navegación móvil.
  - Tablas scrolleables en dashboards.

---

## 🚀 Fase 3: Próximos Pasos (En Planificación)

### Q1 2026 - Comunidad

- [ ] **Networking:** Chat entre asistentes y sistema de "Conectar" (LinkedIn integration).
- [ ] **Feed Social:** Tablón de anuncios para organizaciones.
- [ ] **Soporte I18n:** Traducción completa (Español/Inglés).

### Q2 2026 - Monetización

- [ ] **Ticketing:** Generación de entradas PDF con QR.
- [ ] **Pagos:** Integración con Stripe para entradas de pago.

---

## 📜 Historial de Versiones

| Versión    | Estado   | Descripción                                            |
| ---------- | -------- | ------------------------------------------------------ |
| **v0.0.1** | Alpha    | Prototipo estático generado por IA.                    |
| **v0.1.0** | Alpha    | Mockup funcional con backend simulado en localStorage. |
| **v0.1.0** | **Beta** | **Versión Actual.** Conectada a backend Go. Full RBAC. |
