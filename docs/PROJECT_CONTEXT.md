# 🧠 Contexto del Proyecto: CybESphere Frontend

> **Documento Maestro**: Este archivo contiene toda la información necesaria para que una IA o desarrollador entienda la arquitectura, flujos y diseño de CybESphere.
> **Versión**: Beta v0.6.0 (Febrero 2026) - **Seguridad y Compliance**
> **Próxima**: Beta v0.7.0 - Panel de Administración y Organizador

---

## 1. Identidad y Misión

**CybESphere** es una plataforma centralizada (sin ánimo de lucro) para unificar la comunidad de ciberseguridad en España. Su objetivo es dar visibilidad a todos los eventos y facilitar la gestión integral para organizadores y asistentes.

**Versión v0.6.0:** Incluye sistema completo de Social & Networking, verificación de email obligatoria, Cookie Banner GDPR, internacionalización (PoC), **Journey del Organizador** (onboarding con formulario de 3 pasos, Success Modal con Portal, transiciones de página, y estado "pendiente" UX).

**Stack Tecnológico:**

- **Frontend:** React 19, React Router 7 (Data API), Material UI (MUI) 7, Vite.
- **Backend:** Go (Gin), PostgreSQL (Arquitectura hexagonal con GORM).
- **Mapas:** React Leaflet 5 (con Lazy Loading).
- **Pagos:** Stripe Connect + Stripe Checkout.
- **Scanner:** `html5-qrcode` para lectura de QRs.
- **Animaciones:** Framer Motion (uso selectivo).

---

## 2. Arquitectura Frontend

### Estructura de Rutas y Datos

El proyecto utiliza la moderna **Data API** de React Router 7 (`createBrowserRouter`).

- **Loaders:** La carga de datos se realiza en los `loaders` definidos en `src/App.tsx`.
- **Axios Singleton:** Hub centralizado en `src/services/httpClient.ts`.
- **Manejo de Errores:** Interceptor global para errores 401/500 + `ErrorBoundary.tsx`.

### Inventario de Directorios (`src/`)

```
src/
├── App.tsx (Router + Layout)
├── global.css (Variables CSS & Overrides)
├── index.tsx
│
├── components/ (UI Compartida)
│   ├── Button.tsx (Variantes: primary, secondary)
│   ├── EventCard.tsx, Header.tsx, Footer.tsx
│   ├── EventFilters.tsx, EventMap.tsx, SingleEventMap.tsx
│   ├── Hero.tsx, ImageUpload.tsx, Layout.tsx, LazyMap.tsx
│   ├── MobileMenu.tsx, NotificationMenu.tsx, ProtectedRoute.tsx
│   ├── social/ (v0.4.0+)
│   │   ├── ConnectButton.tsx (Estados: Conectar, Pendiente, Contactado)
│   │   ├── FollowButton.tsx (Seguir organizaciones)
│   │   └── NotificationBadge.tsx (Contador real-time)
│   ├── CookieBanner.tsx (GDPR - v0.6.0)
│   ├── LanguageSelector.tsx (i18n - v0.6.0)
│   ├── SuccessModal.tsx (Portal-based modal - v0.6.0)
│   ├── PageTransition.tsx (framer-motion wrapper)
│   ├── events/TicketSelector.tsx
│   └── skeletons/ (Loaders)
│
├── pages/ (Vistas Principales)
│   ├── LandingPage.tsx, Eventos.tsx, CrearEvento.tsx
│   ├── PanelDeOrganizador.tsx, PanelDeUsuario.tsx, PanelDeAdministrador.tsx
│   ├── UserProfile.tsx, OrganizationProfile.tsx
│   ├── CheckEmail.tsx, VerifyEmail.tsx (v0.6.0)
│   ├── CreateOrganization.tsx (Onboarding Organizador - v0.6.0)
│   │
│   ├── panel-organizador/
│   │   ├── components/
│   │   │   ├── StatCard.tsx, AttendeesList.tsx (CSV Export)
│   │   │   └── QRScannerModal.tsx
│   │   └── tabs/
│   │       ├── Dashboard.tsx, EventsList.tsx, Profile.tsx
│   │       ├── PaymentsTab.tsx (Stripe Connect)
│   │       └── NotificationsTab.tsx (Preferencias Email/Web)
│   │
│   ├── panel-usuario/
│   │   └── tabs/
│   │       ├── Profile.tsx, Events.tsx, Bookmarks.tsx
│   │       ├── TicketsTab.tsx (QR Wallet)
│   │       └── NotificationsTab.tsx (Preferencias + Regiones)
│   │
│   └── panel-administrador/tabs/
│
├── services/ (Capa API)
│   ├── httpClient.ts (Axios + Interceptores)
│   └── api/
│       ├── auth.service.ts
│       ├── events.service.ts
│       ├── organizations.service.ts
│       ├── users.service.ts
│       ├── notifications.service.ts (GET/Save Preferences)
│       ├── connections.service.ts
│       ├── subscriptions.service.ts
│       ├── attendee.service.ts
│       └── index.ts
│
├── hooks/
│   ├── useApi.ts, useEvents.ts, useOrganizations.ts
│
├── i18n/ (v0.6.0)
│   ├── index.ts (Configuración react-i18next)
│   └── locales/ (es.json, en.json)
│
├── context/
│   ├── AuthContext.tsx
│   └── CookieContext.tsx (GDPR - v0.6.0)
└── types/index.ts
```

---

## 3. Sistema de Autenticación y Roles

1. **Attend (Usuario Normal):** `/panel-de-usuario`
   - Inscribirse, gestionar entradas (QR Wallet), reseñas, badges.
   - Preferencias de notificaciones personalizables.
   - Conexiones con otros usuarios.

2. **Organizer (Organizador):** `/panel-de-organizador`
   - CRUD eventos, perfil org, dashboard financiero (Stripe).
   - Scanner QR y lista de asistentes con export CSV.
   - Notificaciones de ventas y nuevos seguidores.

3. **Admin (Administrador):** `/admin`
   - Verificar organizaciones, gestión global de usuarios y eventos.

---

## 4. Flujos Clave

### A. Gestión de Eventos & Ventas

- **Creación:** `CrearEvento.tsx` permite definir tipos de entrada (Tiers) y aforo.
- **Venta:** Integración nativa con Stripe Checkout.
- **Validación:**
  - **QR Scanner:** `QRScannerModal` usa cámara para validar entradas.
  - **Lista Manual:** `AttendeesList` permite check-in manual + export CSV.

### B. Sistema de Notificaciones (v0.5.0)

- **Canales:** Solo Email y Web (Push eliminado).
- **Usuario:** Toggles para conexiones, tickets, eventos nuevos, recordatorios.
- **Organizador:** Toggles para ventas, seguidores, resumen diario.
- **API Backend:** `GET/PUT /user/notification-preferences`.

### C. Social & Networking

- **Conexiones:** Solicitar, aceptar, rechazar conexiones entre usuarios.
- **Suscripciones:** Seguir organizaciones para recibir notificaciones.
- **Contador:** Actualización en tiempo real de seguidores.

---

## 5. Sistema de Diseño ("Cyber Aesthetic")

- **Paleta:** Cian/Turquesa (`var(--color-cadetblue)`), Fondos claros (`#F8FAFC`).
- **Efectos:** Glow en hover, Glassmorphism en headers.
- **Botones:** Dos variantes principales (`primary`, `secondary`).
- **Animaciones:** Micro-interacciones en botones y transiciones de página suaves.

---

## 6. APIs Backend

### Endpoints Principales

| Recurso          | Métodos                    | Descripción                    |
| ---------------- | -------------------------- | ------------------------------ |
| `/auth`          | POST login/register/logout | Autenticación JWT              |
| `/events`        | CRUD + /purchase           | Gestión de eventos             |
| `/organizations` | CRUD + /stripe-\*          | Gestión de organizaciones      |
| `/users`         | CRUD + /profile            | Gestión de usuarios            |
| `/user`          | GET/PUT /notification-pref | Preferencias de notificaciones |
| `/notifications` | GET, PATCH, mark-all-read  | Centro de notificaciones       |
| `/connections`   | POST/PATCH request/accept  | Conexiones entre usuarios      |
| `/subscriptions` | POST/DELETE follow         | Seguir organizaciones          |
| `/tickets`       | GET /validate              | Validación de entradas         |
| `/registrations` | GET /attendees, /checkin   | Gestión de asistentes          |

---

## 7. Próximos Pasos (Beta v0.7.0)

1. **Panel Admin:** Mejoras en gestión de usuarios (banning, verificación manual).
2. **Panel Organizador:** Dashboard mejorado con métricas ampliadas.
3. **i18n Completa:** Extender traducciones a todas las páginas (actual: PoC Landing).
4. **Refactorización:** Dividir componentes grandes (NotificationsTab, EventFilters).
