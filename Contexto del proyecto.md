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

## Arquitectura y Decisiones Técnicas (Detalle Profundo)

### 1. Stack Tecnológico de Vanguardia

El proyecto ha sido migrado a las últimas versiones estables del ecosistema React (Diciembre 2025):

- **React 19 & React Router 7:** Uso extensivo de las nuevas APIs. El enrutamiento se maneja con `createBrowserRouter` (Data Routers). La carga de datos NO se hace con `useEffect`, sino a través de `loader` functions en `App.tsx` que inyectan los datos antes de renderizar la ruta. Las mutaciones usan `useSubmit` o llamadas directas a la API simulada.
- **MUI v7:** Sistema de diseño basado en Material UI 7. Se complementa con un archivo `global.css` que contiene variables CSS críticas (`--shadow-drop`, `--gradient-header-footer`) exportadas del diseño original de Figma.

### 2. Backend Simulado y Persistencia

Dada la naturaleza "Frontend-Only" de esta fase, se ha construido un **Backend Virtual** completo en `src/services/apiService.ts`.

- **Persistencia Híbrida:** Los datos iniciales provienen de `src/mocks/db.ts`, pero cualquier mutación (crear evento, registrar usuario) se guarda en `localStorage`. Al recargar, el servicio fusiona los datos del mock con los del storage local para mantener la persistencia entre sesiones.
- **Latencia Artificial:** Las funciones del servicio incluyen un `delay` artificial para simular tiempos de red y probar los estados de carga (`isLoading`) de la UI.

### 3. Autenticación y Roles (RBAC)

El sistema gestiona tres roles distintos con lógica de redirección específica en `AuthContext.tsx`:

- **Role.User (Asistente):** Accede al `/panel-de-usuario`. Puede inscribirse (`subscribeToEvent`), guardar favoritos y dejar reseñas.
- **Role.Organizer (Organizador):** Accede al `/panel-de-organizador`. Puede crear/editar/borrar sus propios eventos. Tiene un perfil público de organización.
- **Role.Admin (Administrador):** Accede al `/admin`. Tiene permisos globales.
  - **Lógica de Verificación:** Puede cambiar el estado `is_verified` de cualquier organización. Esto añade un "Check Azul" en la UI pública de la organización.

### 4. Implementaciones Específicas Complejas

#### A. Sistema de Eventos Dinámico

- **Formulario (`Page.tsx`):** Utiliza `react-hook-form` con estructuras de array dinámicas (`useFieldArray`) para gestionar **Agenda** y **Ponentes**. Esto permite añadir "n" filas de ítems de agenda o ponentes sin límite.
- **Filtros URL-First:** El estado de los filtros (`EventFilters.tsx`) se sincroniza con la URL. Al filtrar, se actualizan los _search params_. El `loader` de `LandingPage` lee estos parámetros y filtra el dataset crudo antes de pasarlo al componente.

#### B. Sistema de Reseñas y Validaciones

- **Restricción 1:1:** La lógica en `apiService` impide que un usuario envíe más de una reseña para el mismo evento.
- **Validación de Fecha:** Solo se permite reseñar eventos cuya `end_date` sea anterior a `new Date()`.
- **UI Social:** Al pasar el ratón por el autor de una reseña, un `Popover` recupera dinámicamente los datos del usuario (foto, cargo, frase personal) para mostrar una tarjeta de perfil flotante.

#### C. Diseño "Premium Glow" & Glassmorphism

Para diferenciar visualmente los paneles (especialmente Admin y Organizador), se implementó un sistema de estilos avanzado:

- **Efecto Hover:** Las tarjetas (`EventCard`, `StatCard`) utilizan una combinación de `transform: translateY(-8px)` y una sombra `boxShadow` coloreada dinámica (cian o variable) para crear un efecto de "iluminación" o neón.
- **Immersive Headers:** Los perfiles de organización y el panel de admin usan cabeceras con gradientes complejos y superposición de elementos (Z-Index manejado cuidadosamente) para evitar cortes visuales ("clipping bugs" resueltos con `position: relative` y `zIndex` explícito).

## Notas para Desarrollo Futuro (Roadmap Técnico)

1.  **Sustitución de API:** `apiService.ts` está diseñado con firmas asíncronas (`Promise<T>`). Para conectar un backend real (Node/Python), solo se debería reemplazar el contenido de estas funciones por llamadas `fetch` o `axios` sin cambiar los componentes de UI.
2.  **Gestión de Imágenes:** Actualmente las imágenes son URLs externas o assets locales. Se necesitará un servicio de almacenamiento (S3/Cloudinary) para la subida real de avatares y logos.
3.  **Leaflet SSR:** Si se migra a Next.js o similar, tener cuidado con `React Leaflet` ya que requiere `window` y debe cargarse dinámicamente (no-SSR).

## Estado Final Fase 5 (Diciembre 2025)

El frontend es **Feature Complete** según el alcance inicial. Todas las vistas (Landing, Auth, Paneles User/Org/Admin, Eventos, Mapa) están implementadas, estilizadas y conectadas a la lógica simulada.
