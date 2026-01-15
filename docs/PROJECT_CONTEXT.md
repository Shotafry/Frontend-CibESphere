# 🧠 Contexto del Proyecto: CybESphere Frontend

> **Documento Maestro**: Este archivo contiene toda la información necesaria para que una IA o un desarrollador entienda la arquitectura, flujos y diseño de CybESphere sin necesidad de leer todo el código.
> **Versión**: Beta v0.1.0 (Enero 2026)

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

- **`/components`**: UI pura y reutilizable (`EventCard`, `Header`, `EventFilters`).
- **`/pages`**: Vistas principales conectadas a rutas (`LandingPage`, `PanelDeOrganizador`).
- **`/services`**: Lógica de negocio y conexión API. Módulos separados (`auth`, `events`, `users`).
- **`/context`**: Estado global crítico (`AuthContext` para sesión).
- **`/types`**: Definiciones TypeScript compartidas (DTOs, Interfaces).
- **`/hooks`**: Lógica reactiva reutilizable.

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

### A. Gestión de Eventos

- **Creación (`/crear-evento`):** Formulario dinámico (`react-hook-form`) que permite añadir agenda y ponentes infinitos.
- **Visualización (`/eventos/:slug`):** Página de detalle con estilos ricos. Muestra agenda, ponentes, mapa y reseñas.
- **Inscripción:** Botón inteligente que cambia de estado (Inscribirse -> Ya inscrito -> Aforo completo).

### B. Perfiles Públicos

- **Organización (`/organizacion/:slug`):** Landing page para cada organizador. Muestra su banner, logo, info de contacto y portfolio de eventos (pasados y futuros).
- **Usuario (`/u/:slug`):** Perfil tipo LinkedIn para asistentes. Muestra insignias (badges), eventos asistidos y frase personal.

### C. Navegación y Filtros

- **Sincronización URL:** Los filtros de la Landing Page (fecha, ubicación, tipo) se sincronizan bidireccionalmente con los parámetros URL (`?city=Madrid&type=workshop`). Esto permite compartir búsquedas.

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
3.  **Componentes Grandes:** Si vas a editar `PanelDeOrganizador.tsx` o `Eventos.tsx`, considera primero si tu cambio puede extraerse a un subcomponente.
4.  **Estado:** Prefiere `react-router` loaders para datos de página y `react-hook-form` para formularios complejos. Evita `useEffect` para cargas de datos simples.
