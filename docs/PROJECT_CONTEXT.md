# 🧠 Contexto del Proyecto: CybESphere Frontend

> **Documento Maestro**: Este archivo contiene toda la información necesaria para que una IA o un desarrollador entienda la arquitectura, flujos y diseño de CybESphere sin necesidad de leer todo el código.
> **Versión**: Beta v0.2.0 (Enero 2026) - Verificado contra código

---

## 1. Identidad y Misión

**CybESphere** es una plataforma centralizada (sin ánimo de lucro) para unificar la comunidad de ciberseguridad en España. Su objetivo es dar visibilidad a todos los eventos, desde grandes conferencias hasta pequeños meetups locales.

**Stack Tecnológico:**

- **Frontend:** React 19, React Router 7 (Data API), Material UI (MUI) 7, Vite.
- **Backend:** Go (Gin), PostgreSQL (Arquitectura hexagonal).
- **Mapas:** React Leaflet 5 (con Lazy Loading).
- **Animaciones:** Framer Motion (uso selectivo en páginas estáticas).

---

## 2. Arquitectura Frontend (Verificada)

### Estructura de Rutas y Datos

El proyecto utiliza la moderna **Data API** de React Router 7 (`createBrowserRouter`).

- **Loaders:** La carga de datos se realiza en los `loaders` definidos en `src/App.tsx`.
- **Axios Singleton:** Todas las peticiones HTTP pasan por `src/services/httpClient.ts`.
- **Manejo de Errores:** Interceptor global para errores 401/500 + `ErrorBoundary.tsx`.

### Inventario Real de Directorios (`src/`)

```
src/
├── App.tsx (12KB - Router + Layout)
├── global.css (4KB - Variables CSS)
├── index.tsx
│
├── components/ (17 archivos + skeletons/)
│   ├── Button.tsx, EventCard.tsx, Header.tsx, Footer.tsx
│   ├── EventFilters.tsx, EventMap.tsx, SingleEventMap.tsx
│   ├── Hero.tsx, ImageUpload.tsx, Layout.tsx, LazyMap.tsx
│   ├── MobileMenu.tsx, NotificationMenu.tsx, ProtectedRoute.tsx
│   ├── ParticlesBackground.tsx, AboutThis.tsx
│   ├── ErrorBoundary.tsx ✅ (Implementado)
│   └── skeletons/
│       ├── EventCardSkeleton.tsx
│       ├── EventDetailSkeleton.tsx
│       ├── PanelSkeleton.tsx
│       ├── TableSkeleton.tsx
│       └── index.ts
│
├── pages/ (16 archivos + 7 subdirectorios)
│   ├── LandingPage.tsx, Eventos.tsx, CrearEvento.tsx
│   ├── PanelDeOrganizador.tsx, PanelDeUsuario.tsx, PanelDeAdministrador.tsx
│   ├── UserProfile.tsx, OrganizationProfile.tsx
│   ├── SignUp.tsx, AboutUs.tsx, Contacto.tsx
│   ├── TerminosYCondiciones.tsx, PoliticaCookies.tsx, ProgramaVulnerabilidades.tsx
│   ├── ErrorPage.tsx, test-font.tsx
│   │
│   ├── evento-detalle/components/ (5 archivos)
│   │   ├── EventHero.tsx, EventDetails.tsx, EventItinerary.tsx
│   │   ├── EventReviews.tsx, EventSidebar.tsx
│   │
│   ├── crear-evento/ (hooks/, sections/, styles.ts, index.ts)
│   │   ├── hooks/useEventForm.ts
│   │   └── sections/ (5 archivos: BasicInfo, DateLocation, CapacityPrice, Agenda, Speakers)
│   │
│   ├── panel-organizador/ (components/, tabs/, index.ts)
│   │   ├── components/StatCard.tsx, OrgProfileForm.tsx
│   │   ├── components/form-sections/ (5 archivos: ProfileHeaderPreview, GeneralInfo, ContactInfo, VisualAssets, SocialMedia)
│   │   └── tabs/ (3 archivos: Dashboard, EventsList, Profile)
│   │
│   ├── panel-usuario/ (components/, tabs/, index.ts)
│   │   ├── components/BadgeUploader.tsx, ReviewModal.tsx
│   │   └── tabs/ (4 archivos: Profile, Events, Bookmarks, Notifications)
│   │
│   ├── panel-administrador/ (components/, tabs/, index.ts)
│   │   ├── components/ (1 archivo)
│   │   └── tabs/ (3 archivos: Dashboard, Organizations, Users)
│   │
│   ├── user-profile/components/ (6 archivos)
│   │   ├── UserHero.tsx, UserBio.tsx, UserStats.tsx
│   │   ├── UserSocials.tsx, UserEventsTab.tsx, UserBadges.tsx
│   │
│   └── organization-profile/components/ (3 archivos)
│       ├── OrgHero.tsx, OrgHeader.tsx, OrgEvents.tsx
│
├── services/
│   ├── httpClient.ts (5.6KB - Axios singleton)
│   ├── apiService.ts (legacy)
│   └── api/ (8 archivos)
│       ├── auth.service.ts, events.service.ts, users.service.ts
│       ├── organizations.service.ts, reviews.service.ts
│       ├── admin.service.ts, notifications.service.ts, index.ts
│
├── hooks/ (4 archivos)
│   ├── useApi.ts, useEvents.ts, useOrganizations.ts, index.ts
│
├── context/AuthContext.tsx
├── types/index.ts (12.6KB)
├── constants/filters.ts
└── mocks/
```

---

## 3. Sistema de Autenticación y Roles (RBAC)

1. **Attend (Usuario Normal):** `/panel-de-usuario` - Inscribirse, favoritos, reseñas, badges.
2. **Organizer (Organizador):** `/panel-de-organizador` - CRUD eventos, perfil org, dashboard.
3. **Admin (Administrador):** `/admin` - Verificar organizaciones, gestión global.

---

## 4. Flujos Clave

### A. Gestión de Eventos

- **Creación:** `CrearEvento.tsx` → `useEventForm` hook + 5 secciones modulares.
- **Visualización:** `Eventos.tsx` → 5 sub-componentes (Hero, Details, Itinerary, Reviews, Sidebar).

### B. Perfiles Públicos

- **Organización:** `OrganizationProfile.tsx` → 3 componentes (OrgHero, OrgHeader, OrgEvents).
- **Usuario:** `UserProfile.tsx` → 6 componentes (Hero, Bio, Stats, Socials, EventsTab, Badges).

### C. Optimizaciones Implementadas

- **Lazy Loading:** `LazyMap.tsx` para mapas Leaflet.
- **Skeletons:** 4 skeletons (EventCard, EventDetail, Panel, Table).
- **Error Handling:** `ErrorBoundary.tsx` implementado.
- **Scroll Fix:** `shouldRevalidate` en App.tsx para evitar scroll en cambios de query.

---

## 5. Sistema de Diseño ("Cyber Aesthetic")

- **Paleta:** Cian/Turquesa (`var(--color-cadetblue)`), Fondos claros (`#F8FAFC`).
- **Efectos:** Glow en hover, Glassmorphism en headers.
- **Animaciones:** `framer-motion` en páginas estáticas (Contacto, Legal, VDP).

---

## 6. Integración API

Servicios en `src/services/api/`:

- `auth.service.ts` - Login, Registro, Refresh Token, Upload.
- `events.service.ts` - CRUD eventos, búsqueda.
- `organizations.service.ts` - Perfil org, dashboard stats.
- `users.service.ts` - Perfil usuario, historial.
- `reviews.service.ts` - Sistema de reseñas.
- `notifications.service.ts` - Notificaciones.
- `admin.service.ts` - Endpoints admin.

---

## 7. Instrucciones para Colaboradores (IAs)

1. **Modularización:** Todo está modularizado. Mantén el patrón orquestador + sub-componentes.
2. **Estilos:** Usa `sx={{}}` de MUI con CSS vars de `global.css`.
3. **Estado:** Prefiere loaders de React Router para datos, `react-hook-form` para formularios.
4. **Errores:** `ErrorBoundary` ya existe, úsalo para envolver componentes riesgosos.
5. **Animaciones:** Evita transiciones globales de ruta (conflictos con tabs).
