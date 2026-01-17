# 🧠 Contexto del Proyecto: CybESphere Frontend

> **Documento Maestro**: Este archivo contiene toda la información necesaria para que una IA o un desarrollador entienda la arquitectura, flujos y diseño de CybESphere sin necesidad de leer todo el código.
> **Versión**: Beta v0.2.0 (Enero 2026)

---

## 1. Identidad y Misión

**CybESphere** es una plataforma centralizada (sin ánimo de lucro) para unificar la comunidad de ciberseguridad en España. Su objetivo es dar visibilidad a todos los eventos, desde grandes conferencias hasta pequeños meetups locales.

**Stack Tecnológico:**

- **Frontend:** React 19, React Router 7 (Data API), Material UI (MUI) 7, Vite.
- **Backend:** Go (Gin), PostgreSQL (Arquitectura hexagonal).
- **Mapas:** React Leaflet 5.

---

## 2. Arquitectura Frontend

### Estructura de Rutas y Datos

El proyecto utiliza la moderna **Data API** de React Router 7 (`createBrowserRouter`).

- **Loaders:** La carga de datos NO se hace en `useEffect` dentro de los componentes. Se realiza en los `loaders` definidos en `src/App.tsx`. Esto asegura que cuando el componente se renderiza, los datos ya están disponibles.
- **Axios Singleton:** Todas las peticiones HTTP pasan por `src/services/httpClient.ts`, que maneja automáticamente la inyección de JWT y la lógica de refresh token.
- **Manejo de Errores:** Un interceptor global captura errores 401 (redirección a login) y 500.

### Jerarquía de Directorios (`src/`)

- **`/components`**: UI pura y reutilizable (15 componentes).
  - `Button.tsx`: Wrapper unificado sobre MUI, usa CSS vars.
  - `EventCard.tsx`, `Header.tsx`, `Footer.tsx`, `EventFilters.tsx`, etc.
- **`/pages`**: Vistas principales conectadas a rutas.
  - **Refactorizadas y Modularizadas:**
    - `Eventos.tsx` (Detalle) → `src/pages/evento-detalle/`
    - `PanelDeOrganizador.tsx` → `src/pages/panel-organizador/`
    - `CrearEvento.tsx` (antes Page.tsx) → `src/pages/crear-evento/`
  - **Pendientes de Refactorizar:** `UserProfile.tsx`, `OrganizationProfile.tsx`, `PanelDeAdministrador.tsx`.
- **`/services`**: Lógica de negocio y conexión API. 8 módulos separados.
- **`/context`**: Estado global crítico (`AuthContext` para sesión).
- **`/types`**: Definiciones TypeScript compartidas.
- **`/hooks`**: 4 hooks reutilizables.

### Sistema de Diseño (Enfoque Híbrido)

El proyecto usa un **enfoque híbrido** (CSS vars + MUI):

1. **`global.css`**: Variables CSS para colores, gradientes, fuentes.
2. **MUI Theme** (`App.tsx`): Configuración de paleta y componentes.
3. **Wrappers personalizados** (`Button.tsx`): Combinan MUI + CSS vars.

---

## 3. Sistema de Autenticación y Roles (RBAC)

El sistema soporta tres roles distintos, gestionados por el backend y aplicados en el frontend:

1.  **Attend (Usuario Normal):**
    - Acceso: `/panel-de-usuario`
    - Capacidades: Inscribirse a eventos, guardar favoritos, dejar reseñas, gestionar su perfil personal (badges, redes sociales).
2.  **Organizer (Organizador):**
    - Acceso: `/panel-de-organizador`
    - Capacidades: Crear/Editar eventos, gestionar perfil de organización, ver dashboard de métricas.
    - _Nota:_ Un organizador NO ve botones de suscripción en sus propios eventos.
3.  **Admin (Administrador):**
    - Acceso: `/admin`
    - Capacidades: Verificar organizaciones, gestión de usuarios global.

---

## 4. Flujos Clave

### A. Gestión de Eventos (Refactorizado)

- **Creación (`/crear-evento`):** Utiliza un orquestador `CrearEvento.tsx` que carga el hook `useEventForm` y renderiza secciones modulares (`BasicInfo`, `DateLocation`, `Agenda`, `Speakers`). Soporta edición y creación.
- **Visualización (`/eventos/:slug`):** Orquestador `Eventos.tsx` que compone la vista usando sub-componentes: `EventHero`, `EventDetails`, `EventItinerary`, `EventReviews` y `EventSidebar`.
- **Inscripción:** Lógica de negocio encapsulada en `EventSidebar`, que maneja estados (Inscribirse, Ya inscrito, Aforo completo).

### B. Perfiles Públicos

- **Organización (`/organizacion/:slug`):** Landing page para cada organizador. Muestra su banner, logo, info de contacto y portfolio de eventos (pasados y futuros).
- **Usuario (`/u/:slug`):** Perfil tipo LinkedIn para asistentes.
  - **Badges:** Sistema de certificaciones visuales (iconos circulares de 60px).
  - **Stats:** Historial de eventos asistidos y próximos eventos.
  - **Persistencia:** Soporte para frase personal y redes sociales (GitHub/LinkedIn).

### C. Navegación y Filtros

- **Sincronización URL:** Los filtros de la Landing Page (fecha, ubicación, tipo) se sincronizan bidireccionalmente con los parámetros URL (`?city=Madrid&type=workshop`). Esto permite compartir búsquedas.
- **Persistencia en Tabs:** Los paneles (como `PanelDeOrganizador`) utilizan `useSearchParams` para mantener la pestaña activa tras un refresco (ej. `?tab=events`).

---

## 5. Sistema de Diseño ("Cyber Aesthetic")

El proyecto sigue una línea visual estricta para evocar tecnología y modernidad sin ser "oscuro/hacker" cliché.

- **Paleta de Colores:**
  - **Primario (Brand):** Cian/Turquesa (`#01c0fa` o `var(--color-cadetblue)`).
  - **Fondo:** Blancos y Grises muy claros (`#F8FAFC`) para limpieza.
  - **Acentos:** Sombras de colores ("Glow") al interactuar.
- **Componentes Clave:**
  - **Tarjetas con Glow:** `EventCard` y `StatCard` se elevan y proyectan una sombra de color al hacer hover (`transform: translateY(-8px)`).
  - **Glassmorphism:** Headers de perfiles con fondos semitransparentes y desenfoque (`backdrop-filter: blur`).
  - **Botones:** Gradientes lineales definidos en `global.css`.
  - **Responsive Mobile (Mobile First):**
    - **Header:** Menú hamburguesa (`MobileMenu.tsx`) con navegación condicional (Drawer lateral).
    - **Mapas:** Altura dinámica (`350px - 836px`) y optimización táctil (`touchZoom`).
    - **Paneles:** Layouts flexibles (`flex-direction: column` en móvil) y overlays de texto para legibilidad sobre imágenes.
    - **Breakpoints:** xs (0px), sm (600px), md (900px), lg (1200px).

---

## 6. Integración API (Backend)

La comunicación es RESTful. Los servicios principales son:

- `auth.service.ts`: Login, Registro, Refresh Token, Upload de imágenes.
- `events.service.ts`: CRUD de eventos, búsqueda pública.
- `organizations.service.ts`: Gestión de perfiles y dashboard stats.
- `users.service.ts`: Gestión de perfil de usuario e historial.

_Nota:_ Las respuestas del backend suelen venir envueltas en un objeto `{ data: ... }`, que los servicios del frontend desempaquetan antes de entregar a los componentes.

---

## 7. Instrucciones para Colaboradores (IAs)

1.  **Nueva Funcionalidad:** Revisa `ROADMAP_UPDATED.md` primero.
2.  **Estilos:** NO uses estilos inline si es posible. Usa `sx={{...}}` de MUI o clases definidas. Mantén los colores corporativos.
3.  **Modularización:**
    - Si editas componentes complejos como `UserProfile` o `OrganizationProfile`, busca oportunidades para extraer sub-componentes a carpetas dedicadas (ej. `src/pages/user-profile/`).
    - Mantén la lógica de negocio separada en Custom Hooks (ej. `useEventForm`).
4.  **Estado:** Prefiere `react-router` loaders para datos de página y `react-hook-form` para formularios complejos. Evita `useEffect` para cargas de datos simples.
