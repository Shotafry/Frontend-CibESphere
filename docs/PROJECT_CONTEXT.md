# 🧠 Contexto del Proyecto: CybESphere Frontend

> **Documento Maestro**: Este archivo contiene toda la información necesaria para que una IA o un desarrollador entienda la arquitectura, flujos y diseño de CybESphere sin necesidad de leer todo el código.
> **Versión**: Beta v0.3.0 (Enero 2026) - **Stripe & QR Enabled**

---

## 1. Identidad y Misión

**CybESphere** es una plataforma centralizada (sin ánimo de lucro) para unificar la comunidad de ciberseguridad en España. Su objetivo es dar visibilidad a todos los eventos y facilitar la gestión integral para organizadores y asistentes.

**Version v0.3.0:** Introduce capacidades de comercio electrónico, permitiendo a los organizadores vender entradas y validar accesos mediante QR.

**Stack Tecnológico:**

- **Frontend:** React 19, React Router 7 (Data API), Material UI (MUI) 7, Vite.
- **Backend:** Go (Gin), PostgreSQL (Arquitectura hexagonal).
- **Mapas:** React Leaflet 5 (con Lazy Loading).
- **Pagos:** Stripe Connect + Stripe Checkout.
- **Scanner:** `html5-qrcode` para lectura de QRs.
- **Animaciones:** Framer Motion (uso selectivo).

---

## 2. Arquitectura Frontend (Verificada)

### Estructura de Rutas y Datos

El proyecto utiliza la moderna **Data API** de React Router 7 (`createBrowserRouter`).

- **Loaders:** La carga de datos se realiza en los `loaders` definidos en `src/App.tsx`.
- **Axios Singleton:** Hub centralizado en `src/services/httpClient.ts`.
- **Manejo de Errores:** Interceptor global para errores 401/500 + `ErrorBoundary.tsx`.

### Inventario Real de Directorios (`src/`)

```
src/
├── App.tsx (Router + Layout)
├── global.css (Variables CSS & Overrides)
├── index.tsx
│
├── components/ (UI Compartida)
│   ├── Button.tsx, EventCard.tsx, Header.tsx, Footer.tsx
│   ├── EventFilters.tsx, EventMap.tsx, SingleEventMap.tsx
│   ├── Hero.tsx, ImageUpload.tsx, Layout.tsx, LazyMap.tsx
│   ├── MobileMenu.tsx, NotificationMenu.tsx, ProtectedRoute.tsx
│   ├── social/ (Social Features)
│   │   ├── ConnectButton.tsx (Solicitud y status de conexión), FollowButton.tsx
│   │   └── NotificationBadge.tsx (Icono con conteo real-time)
│   ├── ParticlesBackground.tsx, AboutThis.tsx
│   ├── ErrorBoundary.tsx, PageTransition.tsx
│   ├── LocationPicker.tsx, EventImageUploader.tsx
│   ├── events/TicketSelector.tsx (Selector de entradas)
│   └── skeletons/ (Loaders)
│       ├── EventCardSkeleton.tsx, EventDetailSkeleton.tsx
│       ├── PanelSkeleton.tsx, TableSkeleton.tsx, index.ts
│
├── pages/ (Vistas Principales)
│   ├── LandingPage.tsx, Eventos.tsx, CrearEvento.tsx
│   ├── PanelDeOrganizador.tsx, PanelDeUsuario.tsx, PanelDeAdministrador.tsx
│   ├── UserProfile.tsx, OrganizationProfile.tsx
│   ├── SignUp.tsx, AboutUs.tsx, Contacto.tsx
│   ├── TerminosYCondiciones.tsx, PoliticaCookies.tsx, ProgramaVulnerabilidades.tsx
│   ├── ErrorPage.tsx
│   │
│   ├── evento-detalle/components/
│   │   ├── EventHero.tsx, EventDetails.tsx, EventItinerary.tsx
│   │   ├── EventReviews.tsx, EventSidebar.tsx
│   │
│   ├── crear-evento/ (Wizard)
│   │   ├── hooks/useEventForm.ts
│   │   └── sections/ (BasicInfo, DateLocation, CapacityPrice, Agenda, Speakers)
│   │
│   ├── panel-organizador/ (Gestión)
│   │   ├── components/
│   │   │   ├── StatCard.tsx, OrgProfileForm.tsx
│   │   │   ├── AttendeesList.tsx (New v0.3.0), QRScannerModal.tsx (New v0.3.0)
│   │   │   └── form-sections/ (ProfileHeaderPreview, GeneralInfo, ContactInfo, VisualAssets, SocialMedia)
│   │   └── tabs/
│   │       ├── Dashboard.tsx, EventsList.tsx, Profile.tsx
│   │       └── PaymentsTab.tsx (New v0.3.0 - Stripe Connect)
│   │
│   ├── panel-usuario/ (Dashboard)
│   │   ├── components/BadgeUploader.tsx, ReviewModal.tsx
│   │   └── tabs/
│   │       ├── Profile.tsx, Events.tsx, Bookmarks.tsx, Notifications.tsx
│   │       └── TicketsTab.tsx (New v0.3.0 - QR Wallet)
│   │
│   ├── panel-administrador/
│   │   └── tabs/ (Dashboard, Organizations, Users)
│   │
│   └── (user/organization)-profile/components/ (Vistas públicas)
│
├── services/ (Capa API)
│   ├── httpClient.ts, apiService.ts
│    └── api/
        ├── auth.service.ts, events.service.ts, organizations.service.ts
        ├── users.service.ts, reviews.service.ts, notifications.service.ts
        ├── connections.service.ts (Networking), admin.service.ts, attendee.service.ts, index.ts
        (Nota: Stripe está integrado en organizations.service.ts)
│
├── hooks/ (Lógica React)
│   ├── useApi.ts, useEvents.ts, useOrganizations.ts, index.ts
│
├── context/AuthContext.tsx
└── types/index.ts (Definiciones TS)
```

---

## 3. Sistema de Autenticación y Despliegue

1. **Attend (Usuario Normal):** `/panel-de-usuario` - Inscribirse, gestionar entradas (QR Wallet), reseñas, badges.
2. **Organizer (Organizador):** `/panel-de-organizador` - CRUD eventos, perfil org, dashboard financiero (Stripe).
3. **Admin (Administrador):** `/admin` - Verificar organizaciones, gestión global.

---

## 4. Flujos Clave

### A. Gestión de Eventos & Ventas (Actualizado v0.3.0)

- **Creación:** `CrearEvento.tsx` permite definir tipos de entrada (Tiers) y aforo.
- **Venta:** Integración nativa con Stripe. El usuario es redirigido a Stripe Checkout y retornado a la app.
- **Validación:**
  - **QR Scanner:** `QRScannerModal` permite usar la cámara del dispositivo para validar entradas.
  - **Lista Manual:** `AttendeesList` permite check-in manual desde el panel.

### B. Perfiles Públicos

- **Organización:** `OrganizationProfile.tsx` → Muestra eventos activos y pasados.
- **Usuario:** `UserProfile.tsx` → Muestra biografía, badges y eventos asistidos.

### C. Optimizaciones Implementadas

- **Lazy Loading:** `LazyMap.tsx` para mapas Leaflet.
- **Skeletons:** Carga progresiva en tarjetas, tablas y detalles.
- **Error Handling:** `ErrorBoundary.tsx` protege contra caídas de renderizado.

---

## 5. Sistema de Diseño ("Cyber Aesthetic")

- **Paleta:** Cian/Turquesa (`var(--color-cadetblue)`), Fondos claros (`#F8FAFC`).
- **Efectos:** Glow en hover, Glassmorphism en headers.
- **Animaciones:** Micro-interacciones en botones y transiciones de página suaves.

---

## 6. Integración API (Servicios)

Toda la comunicación reside en `src/services/api/`:

- `payment.service.ts`: Gestión de onboarding Stripe y creación de sesiones de pago.
- `attendee.service.ts`: Listado de asistentes y acciones de check-in.
- `tickets.service.ts`: Obtención de mis entradas y generación de QR.
- `events.service.ts`: CRUD completo de eventos.
- `auth.service.ts`: Gestión de sesiones JWT.
