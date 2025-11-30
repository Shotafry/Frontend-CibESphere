# Roadmap del Proyecto: CibESphere Frontend

Este documento resume el plan de desarrollo, las fases completadas y las tareas pendientes para el frontend de CibESphere.

El proyecto ha sido modernizado a un stack de React 19 / React Router 7 / MUI 7 y opera sobre una API 100% simulada (`apiService.ts`). Esta base de código limpia y funcional es el punto de partida para las siguientes fases de desarrollo.

**Marcadores:**

✅ Ya implementado
❌ Errores o problemas conocidos
⏳ Pendientes de añadir
🚀 Futuras implementaciones

---

## ✅ Fase 1: Fundamentos y Stack Moderno (Completada)

El objetivo de esta fase fue migrar el proyecto a tecnologías modernas y asegurar la funcionalidad central.

- **✅ Migración de Stack:** Actualización a React 19, React Router 7 (con Data Routers y `loader`), MUI 7 y React Leaflet 5.
- **✅ Formularios Robustos:** Integración de `react-hook-form` en `SignUp.tsx` y `Page.tsx`.
- **✅ Flujo de Organizador:** Funcionalidad completa de **CRUD** (Crear, Editar, Borrar) para eventos.
- **✅ Flujo de Asistente:** Funcionalidad completa de **Inscripción** (`subscribeToEvent`) y **Cancelación** de eventos, actualizando el `AuthContext` y `localStorage`.
- **✅ Interactividad:** Filtros de `LandingPage` conectados a la URL (`useSubmit`) y Popups de mapa personalizados en `EventMap.tsx`.
- **✅ Diseño Unificado (Parcial):** Implementación de `Hero.tsx`, `Footer.tsx` y `SignUp.tsx`.
- **✅ Depuración de Código:**
  - Arreglada la incoherencia de `Comunidad de Madrid` en `src/mocks/db.ts`.
  - Eliminado el campo `country` (país) de todos los tipos, mocks y componentes.
  - Depurado `global.css` para eliminar variables de espaciado no utilizadas.
- **❌ Fondo Dinámico (Abandonado parcialmente):**
  - Se intentó implementar `react-tsparticles`. Tras múltiples intentos fallidos, la tarea se **abandona** y el proyecto revierte a la base estable con fondo estático.

---

## ✅ Fase 2: Unificación Visual y Estilo (Completada)

El objetivo fue corregir las incoherencias visuales, definir una identidad de marca unificada y modernizar componentes clave.

- **❌ Tarea 2.1 (Header):** Se decidió **MANTENER** el diseño original (Blanco/Transparente) tras probar el diseño curvo/cian.
  - **Estado:** Revertido a petición del usuario.
  - **En `LandingPage`:** Transparente -> Blanco al hacer scroll.
  - **En otras páginas:** Siempre Blanco.
- **✅ Tarea 2.2 (Error Fuente):** Investigar e implementar la fuente **Satoshi** globalmente.
  - **Acción:** Se añadió la fuente y se estableció como la `font-family` principal en `global.css`.
- **✅ Tarea 2.3 (Filtros y Mapa):** Rediseño completo de la experiencia de búsqueda.
  - **Filtros (`EventFilters.tsx`):** Modernización total con inputs estilo "filled" (fondo gris claro, bordes redondeados), layout optimizado (fechas en fila propia, nivel/idioma compartiendo fila) y funcionalidad robusta.
  - **Nuevo Filtro:** Implementación del filtro por **Idioma**.
  - **Mapa (`EventMap.tsx`):** Rediseño de los popups con estilo de tarjeta moderna, tags filtrados (sin ciudad) y descripciones cortas.
- **✅ Tarea 2.4 (Fondo Dinámico):** Implementar un fondo dinámico con partículas conectadas.
  - **Estado:** Completado. Se implementó un componente personalizado `ParticlesBackground` con Canvas (puntos cian sobre fondo blanco) con interacción sutil al click.
- **✅ Tarea 2.5 (Creación de Eventos):** Modernización de la página de gestión.
  - **Rediseño (`Page.tsx`):** Se aplicó la misma estética moderna de los filtros (tarjeta con sombra, inputs redondeados) al formulario de Crear/Editar evento.
  - **Funcionalidad:** Se añadió el campo de **Idioma** al formulario.

---

## ⏳ Fase 3: Expansión de Eventos y Organizadores (En Progreso)

El objetivo es enriquecer la información que se muestra, dando más valor tanto a los asistentes como a los organizadores.

- **✅ Tarea 3.1 (Subida de Logo):** Añadir un campo para subir una imagen/logo en el formulario de Crear/Editar Evento (`src/pages/Page.tsx`).
  - **Estado:** Completado. Se añadió el campo `image_url` al formulario.
- **✅ Tarea 3.2 (Límite de Asistentes):** Implementar el control de aforo.
  - **Acción:** Añadido campo `max_attendees` en `Page.tsx`.
  - **Acción:** En `Eventos.tsx`, el botón "Inscribirse" se desactiva si el aforo está completo.
- **✅ Tarea 3.3 (Rediseño y Expansión Info. Evento):** Mejorar el diseño y la información de la página de detalle del evento (`src/pages/Eventos.tsx`).
  - **Estado:** Completado.
  - **✅ Diseño:** Se rediseñó completamente la página `Eventos.tsx` con contenedores estilizados y estética mejorada.
  - **✅ Funcionalidad:** Se añadieron campos para **Agenda** (Itinerario con horas), **Ponentes** (con roles y temas) y **Requisitos**. Se muestran en una nueva sección "Itinerario" en el detalle del evento.
- **✅ Tarea 3.4 (Mapa de Eventos):** Verificar que los eventos nuevos aparezcan en el mapa.
  - **Estado:** **VERIFICADO.**
    **⏳ Tarea 3.5 (Interesante Añadir):** Crear **Perfiles Públicos de Organización**.
  - **Acción:** Dar más peso a las organizaciones. Crear una nueva ruta y página (ej. `/organizacion/:slug`). Esta página mostrará el logo, nombre, web y una descripción de la organización, además de un listado de todos los eventos (pasados y futuros) que haya publicado. Esto da un gran valor a los organizadores y fomenta el descubrimiento por parte de los usuarios.
- **✅ Tarea 3.6 (Mejora Paneles - Antes 5.3):** Mejorar el `PanelDeOrganizador.tsx`.
  - **Estado:** Completado.
  - **Acción:** Se ha rediseñado completamente el panel con una estética premium, layout "Full Width" para maximizar el espacio, tarjetas de estadísticas mejoradas (con tendencias y colores), y una lista de eventos con barras de progreso de aforo. La pestaña de perfil ahora cuenta con un diseño **"Immersive Header"** con previsualización en tiempo real y efectos glassmorphism.

---

## Fase 4: Experiencia de Usuario y Notificaciones (Pendiente)

El objetivo es mejorar la retención de usuarios y la interfaz de los paneles personales, implementando el sistema clave de notificaciones.

- **⏳ Tarea 4.1 (Notificaciones):** Implementar el **Sistema de Notificaciones**. Esta es una funcionalidad clave.
  - **Acción (UI):** Añadir un icono de "campana" en el `Header.tsx` que muestre un panel desplegable con "Notificaciones Recientes" (ej. "Te has inscrito a...", "El evento X empieza mañana").
  - **Acción (Panel):** Añadir una nueva sección en `PanelDeUsuario.tsx` para "Configuración de Notificaciones", permitiendo al usuario activar/desactivar alertas por email o push (simulado).
  - **Lógica (Simulada):** Simular la lógica de recordatorios de eventos (para `FavoriteEvents`) y alertas de nuevos eventos que coincidan con filtros guardados.
- **⏳ Tarea 4.2 (Interesante Añadir):** Implementar "Guardar para después" (Bookmarks).
  - **Acción:** Separar el flujo de "Inscribirse" (compromiso firme) de "Guardar" (interés). Añadir un icono de "marcador" en `EventCard.tsx` que añada el evento a una nueva lista (`user.BookmarkedEvents`).
- **⏳ Tarea 4.3 (Interesante Añadir):** Implementar **Sistema de Reseñas y Valoraciones**.
  - **Acción:** En `PanelDeUsuario.tsx`, permitir a los usuarios dejar una valoración (1-5 estrellas) y un comentario a los eventos _pasados_ a los que estuvieron inscritos.
  - **Acción:** Mostrar la valoración media de estrellas en `EventCard.tsx` y `Eventos.tsx`.
- **⏳ Tarea 4.4 (Mejora Paneles):** Mejorar el `PanelDeUsuario.tsx`.
  - **Acción:** Rediseñar el panel para incluir diferentes pestañas: "Mis Inscripciones" (lo actual), "Eventos Guardados" (de Tarea 4.2) y "Mis Reseñas" (de Tarea 4.3).

---

## Fase 5: Administración y Secciones Estáticas (Pendiente)

El objetivo es construir las secciones de contenido estático y las herramientas de administración del sitio.

- **⏳ Tarea 5.1 (Página "Sobre Nosotros"):** Crear una página estática en `/sobre-nosotros`.
  - **Acción:** Diseñar la página con 3 tarjetas circulares para los miembros del equipo. Al hacer clic en una foto, se debe abrir un modal o popup con la biografía y redes sociales del miembro.
- **⏳ Tarea 5.2 (Panel de Administrador):** Crear un **Panel de Administrador** global (para `Role.Admin`).
  - **Acción:** Crear una nueva ruta protegida (ej. `/admin`) que use un `loader` diferente y muestre un panel distinto al de Organizador.
  - **Funcionalidad:** Este panel debe permitir al Admin ver todos los usuarios, gestionar todos los eventos (no solo los suyos) y, lo más importante, **Verificar Organizaciones** (cambiar `is_verified` de `false` a `true`).

---

## Fase 6: Futuro y Comunidad (Largo Plazo)

Estas son funcionalidades complejas que se planifican a largo plazo y que requerirán una infraestructura de backend más allá de la API simulada.

- **🚀 Tarea 6.1 (Comunidad):** Chat / Foro / Meetups.
  - **Concepto:** Diseñar un sistema (ej. un chat simple por evento o un foro general) para que los asistentes puedan coordinarse, organizar quedadas, compartir coche, etc.
- **🚀 Tarea 6.2 (IA):** Añadir un Agente de IA.
  - **Concepto:** Implementar un chatbot de ayuda que permita a los usuarios encontrar eventos usando lenguaje natural (ej. "¿Qué eventos de hacking hay en Madrid el mes que viene?").
