# CONTEXTO DEL PROYECTO: CibESphere Frontend (Post-Refactorización y Mejoras)

## Resumen del Proyecto

Este repositorio (`ciblo3`) contiene el frontend de la aplicación CibESphere. Es una aplicación React construida con Vite y TypeScript. Su propósito es servir como interfaz de usuario para una plataforma de eventos de ciberseguridad.

Actualmente, el frontend opera en un **modo de API 100% simulada**, con toda la lógica de backend mockeada en `src/services/apiService.ts`.

## Proceso de Modernización (Noviembre 2025)

El proyecto ha sido sometido a una refactorización y actualización masiva para modernizar su stack tecnológico.

### Estado Inicial (Pre-Refactorización)

- **React:** v18
- **React Router:** v6
- **Material-UI (MUI):** v5
- **React Leaflet:** v4
- **Arquitectura de datos:** Carga de datos dentro de los componentes mediante `useEffect`.
- **Estilos:** Variables CSS de Figma inyectadas mediante `@emotion/css` en un archivo `global.tsx`.

### Cambios Arquitectónicos Implementados

1.  **Migración de React Router v6 a v7:** Se adoptó la arquitectura de **Data Routers** (`createBrowserRouter`).
2.  **Migración de React v18 a v19:** Se actualizaron las dependencias principales a `react@19.2.0`.
3.  **Migración de Material-UI (MUI) v5 a v7:** Se actualizaron todos los paquetes de `@mui`.
4.  **Migración de React Leaflet v4 a v5:** Se actualizó `react-leaflet` a `^5.0.0`.

## Estado Actual (Post-Refactorización)

- **Stack:** React 19, React Router 7, MUI v7, React Leaflet v5, React Hook Form v7.
- **Arquitectura:** Enrutamiento y carga de datos centralizados en `src/App.tsx` usando `loader`.
- **Estado:** El proyecto es funcional en modo simulado y ha implementado un gran conjunto de características de front-end, incluyendo CRUD de eventos y un flujo de inscripción de usuarios.

## Contexto Crítico y Correcciones Implementadas

Cualquier IA que trabaje en este proyecto DEBE conocer las siguientes correcciones, ya que son vitales para el arranque y el estilo visual:

1.  **Restauración de Estilos Globales (global.css):**

    - **Problema:** Un refactor anterior eliminó un archivo `global.tsx` (que contenía todas las variables CSS de Figma).
    - **Efecto:** Los componentes (ej. `EventCard.tsx`, `Header.tsx`) SÍ dependen de estas variables (ej. `var(--shadow-drop)`).
    - **Solución:** Se ha creado `src/global.css`. El contenido del `global.tsx` original se ha copiado en este archivo como CSS estándar. Este archivo es importado por `src/App.tsx` y es **ESENCIAL**.

2.  **Estructura de Ficheros de Vite:**

    - **Solución:** `index.html` está en la **raíz del proyecto** (`ciblo3/index.html`), que es donde Vite espera encontrarlo. La carpeta `/public` solo contiene assets estáticos.

3.  **Importación de Estilos de Leaflet:**

    - **Solución:** Los estilos se importan directamente en `src/index.tsx` ( `import 'leaflet/dist/leaflet.css';` ).

4.  **Adaptador de Fechas de MUI:**
    - **Solución:** Se corrigió en `LandingPage.tsx` y `Page.tsx` para usar `import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'`.

## Mejoras Clave Implementadas (Fases 1-4)

- **Fase 1 (Fundamentos y Estética):**

  - **Manejo de Errores:** Se implementó un componente `ErrorPage.tsx` y se conectó con `errorElement` en `App.tsx`.
  - **Unificación de Colores:** Se crearon variables CSS (`--gradient-button-primary`, `--gradient-header-footer`) en `global.css`.
  - **Layout:** Se ajustaron los `Container` a `maxWidth='lg'` en `LandingPage.tsx`.
  - **Filtros Colapsados:** El componente `EventFilters.tsx` ahora aparece colapsado por defecto.

- **Fase 2 (Gestión de Formularios):**

  - **React Hook Form:** Se instaló y se implementó en `SignUp.tsx` para validación. Se corrigió un bug de validación donde los campos de registro (Nombre, Apellido) bloqueaban el login.
  - **Formularios Dependientes:** Se implementó lógica en `Page.tsx` (Crear Evento) y `EventFilters.tsx` para que la selección de "Comunidad Autónoma" filtre la lista de "Ciudades" disponibles. Esto se basa en una nueva estructura de datos centralizada, `LOCATION_DATA`, en `src/constants/filters.ts`.
  - **CRUD de Eventos:** Se implementó el flujo completo de **"Editar Evento"**. Esto incluyó:
    1.  Añadir la ruta protegida `eventos/:slug/editar` en `App.tsx`.
    2.  Añadir la función `updateEvent` en `apiService`.
    3.  Modificar `Page.tsx` para que `useLoaderData` detecte si está en modo "Crear" o "Editar" y rellene el formulario.
    4.  Activar el botón "Editar" en `PanelDeOrganizador.tsx`.

- **Fase 3 (Interactividad del Usuario):**

  - **Filtros con React Router:** Se refactorizó `EventFilters.tsx` para usar `useSubmit`. El `loader` de `LandingPage` en `App.tsx` ahora lee los _search params_ de la URL, convirtiéndolo en la fuente de verdad y solucionando el bug de que los eventos nuevos no aparecían.
  - **Flujo de Inscripción:** Se implementó `subscribeToEvent` en `AuthContext`. El botón en `Eventos.tsx` ahora inscribe al usuario, actualiza el estado global (`user.FavoriteEvents`) y el `localStorage`.
  - **Corrección de Bug (Contador):** Se modificó `subscribeToEvent` y `unsubscribeFromEvent` en `apiService` para **incrementar y decrementar** correctamente el contador `current_attendees` del evento en el mock.
  - **Popups de Mapa:** Se rediseñó el `<Popup>` en `EventMap.tsx` con un diseño personalizado (fondo blanco, info clave, botón de navegación) para mejorar la UX.

- **Fase 4 (Diseño Unificado):**

  - **Hero Section:** Se creó `Hero.tsx` con el logo `Logo-Vertical.png` y se añadió a `LandingPage.tsx`.
  - **Footer Curvo:** Se rediseñó `Footer.tsx` con el gradiente cian (`--gradient-header-footer`) y una forma curva (`clip-path`), usando el logo `Logo-Solo-Letras.png`.
  - **Unificación de `SignUp`:** Se actualizó `SignUp.tsx` para usar el gradiente cian (`--gradient-header-footer`), reemplazando el azul anterior.

- **Fase 4 (Engagement y Social):**
  - **Notificaciones:** Sistema completo mockeado con UI en Header y configuración en panel.
  - **Reseñas:** Flujo end-to-end de creación y visualización de reseñas con elementos sociales (popover de perfil).
  - **Bookmarks:** Gestión de eventos guardados separada de inscripciones.
  - **Panel de Usuario:** Arquitectura de pestañas para organizar la creciente funcionalidad del usuario.

## Decisiones de Diseño e Iteraciones (IMPORTANTE)

- **Icono del Mapa:** Se discutieron varias opciones (logo del proyecto, icono pulsante CSS). Finalmente, se decidió **revertir al icono de chincheta por defecto de Leaflet** por motivos de claridad y contraste. El `Popup` personalizado se mantuvo.
- **Header (Reversión Crítica):** Se intentó un rediseño complejo (Header curvo y con gradiente permanente). Esto introdujo un **bug de `transition` duplicada** en `Layout.tsx` y conflictos de lógica. Se decidió **REVERTIR** al diseño estable anterior:
  - **Estado Actual:** El `Header.tsx` es **transparente** en la `LandingPage` y se vuelve **blanco** (`var(--White)`) al hacer scroll o en otras páginas.
  - El logo `cyberLogo-1@2x.png` está restaurado y es funcional.
  - El bug de Vite en `Layout.tsx` fue **corregido**.

## Siguientes Pasos (Pendientes)

## Siguientes Pasos (Pendientes)

El trabajo en las Fases 1-4 está completo. El foco se desplaza ahora a la administración y contenido estático:

- **Fase 5 (Administración):** Crear Panel de Administrador y Página "Sobre Nosotros".
- **Fase 6 (Futuro):** Chat de comunidad e IA.
