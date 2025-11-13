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

## Fase 2: Unificación Visual y Estilo (Pendiente)

El objetivo es corregir las incoherencias visuales restantes y definir una identidad de marca unificada.

- **❌ Tarea 2.1 (Error Header):** Rediseñar el `Header.tsx` para que coincida estéticamente con el `Footer.tsx`. Debe usar el mismo gradiente cian y forma curva.
  - **En `LandingPage`:** Mantener la lógica de ser transparente sobre el `Hero` y transformarse en el nuevo diseño curvo/cian al hacer scroll.
  - **En otras páginas:** El nuevo diseño curvo/cian debe ser visible permanentemente, reemplazando el actual `Header` blanco y plano.
- **❌ Tarea 2.2 (Error Fuente):** Investigar e implementar la fuente **Satoshi** globalmente.
  - **Acción:** Se debe añadir la fuente (vía importación en `index.html` o `global.css`) y establecerla como la `font-family` principal en `global.css` para toda la aplicación.
- **❌ Tarea 2.3 (Error Tarjeta de Evento):** Rediseñar el componente `EventCard.tsx`. La imagen del evento (logo) necesita estar posicionada fuera del contenedor principal de la tarjeta para un mayor impacto visual.
- **⏳Tarea 2.4 Fondo Dinámico**
  - Retomar la implementación del fondo dinámico probando con React particles y si no funciona usaremos otras librerías.

---

## ⏳ Fase 3: Expansión de Eventos y Organizadores (Pendiente)

El objetivo es enriquecer la información que se muestra, dando más valor tanto a los asistentes como a los organizadores.

- ** Tarea 3.1 (Subida de Logo):** Añadir un campo para subir una imagen/logo en el formulario de Crear/Editar Evento (`src/pages/Page.tsx`). Esto dará soporte a la Tarea 2.3. (En modo simulado, esto será un campo para una URL de imagen).
- **⏳ Tarea 3.2 (Límite de Asistentes):** Implementar el control de aforo.
  - **Acción:** Añadir un campo numérico en `Page.tsx` para "Límite de Asistentes". Un valor de 0 o vacío significará "infinito".
  - **Acción:** En la página `Eventos.tsx`, el botón "Inscribirse" debe comprobar si `current_attendees >= max_attendees` (y si `max_attendees` no es 0). Si el cupo está lleno, el botón debe desactivarse con un mensaje claro (ej. "Aforo completo").
- ** Tarea 3.3 (Expandir Info. Evento):** Añadir más información a la página de detalle del evento (`src/pages/Eventos.tsx`).
  - **Acción:** Añadir nuevos campos al formulario `Page.tsx` (ej. un editor de texto para "Agenda", campos para "Ponentes", "Requisitos previos") y mostrarlos de forma atractiva en `Eventos.tsx`.
- **✅ Tarea 3.4 (Mapa de Eventos):** Verificar que los eventos nuevos aparezcan en el mapa.
  - **Estado:** **VERIFICADO.** La arquitectura de `loader` asegura que `EventMap.tsx` siempre reciba los datos actualizados del `apiService`. No se necesita trabajo adicional aquí.
- **⏳ Tarea 3.5 (Interesante Añadir):** Crear **Perfiles Públicos de Organización**.
  - **Acción:** Dar más peso a las organizaciones. Crear una nueva ruta y página (ej. `/organizacion/:slug`). Esta página mostrará el logo, nombre, web y una descripción de la organización, además de un listado de todos los eventos (pasados y futuros) que haya publicado. Esto da un gran valor a los organizadores y fomenta el descubrimiento por parte de los usuarios.

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
- **⏳ Tarea 5.3 (Mejora Paneles):** Mejorar el `PanelDeOrganizador.tsx`.
  - **Acción:** Mostrar estadísticas más detalladas (ej. ratio de `current_attendees` vs `max_attendees` por evento) y mejorar la interfaz de gestión de sus propios eventos.

---

## Fase 6: Futuro y Comunidad (Largo Plazo)

Estas son funcionalidades complejas que se planifican a largo plazo y que requerirán una infraestructura de backend más allá de la API simulada.

- **🚀 Tarea 6.1 (Comunidad):** Chat / Foro / Meetups.
  - **Concepto:** Diseñar un sistema (ej. un chat simple por evento o un foro general) para que los asistentes puedan coordinarse, organizar quedadas, compartir coche, etc.
- **🚀 Tarea 6.2 (IA):** Añadir un Agente de IA.
  - **Concepto:** Implementar un chatbot de ayuda que permita a los usuarios encontrar eventos usando lenguaje natural (ej. "¿Qué eventos de hacking hay en Madrid el mes que viene?").
