# CibESphere (Frontend)

![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)
![React Router](https://img.shields.io/badge/React%20Router-7.9.5-red?logo=reactrouter)
![MUI](https://img.shields.io/badge/MUI-v7.3.4-blue?logo=mui)
![Vite](https://img.shields.io/badge/Vite-5.3.1-purple?logo=vite)

## Introducción

Este repositorio contiene el frontend del proyecto **CibESphere**, una plataforma sin ánimo de lucro diseñada para unificar y centralizar todos los eventos de ciberseguridad en España, fomentando la comunidad y la visibilidad.

Esta aplicación ha sido modernizada para utilizar las últimas tecnologías del ecosistema React y se encuentra en un estado funcional avanzado, operando sobre una API 100% simulada.

## 🚀 Funcionalidades Implementadas

- **Diseño Unificado:**

  - **Hero Section:** Una "Hero section" personalizada en la `LandingPage` con un diseño curvo (`clip-path`).
  - **Header Híbrido:** El `Header` es transparente sobre el Hero y se vuelve blanco con sombra al hacer scroll.
  - **Footer Curvo:** Un `Footer` con diseño curvo y gradiente cian que unifica la estética de la aplicación.
  - **Paleta de Colores:** Estilos unificados en `global.css` para gradientes de botones y elementos principales.

- **Autenticación y Formularios:**

  - **Autenticación Completa:** Sistema de **Login** y **Registro** con `react-hook-form` para validación de datos (ej. email, contraseña).
  - **Roles de Usuario:** Diferenciación entre `Asistente` y `Organizador`, con formularios y campos condicionales.
  - **Rutas Protegidas:** Los paneles de usuario y organizador son privados y solo accesibles tras iniciar sesión.

- **Gestión de Eventos (Organizador):**

  - **CRUD de Eventos:** Funcionalidad completa para **Crear** y **Editar** eventos.
  - **Panel de Organizador:** Vista de estadísticas (eventos, asistentes) y un listado para gestionar (editar/borrar) eventos creados.
  - **Formularios Dependientes:** Al crear/editar un evento, la lista de "Ciudades" se filtra según la "Comunidad Autónoma" seleccionada.

- **Interactividad (Asistente):**
  - **Carga de Datos (React Router):** Uso de la arquitectura "Data Routers" de React Router v7. Los datos se cargan a nivel de ruta usando `loader` en `App.tsx`.
  - **Filtros Avanzados:** Sistema de filtros (fecha, tags, nivel) que utiliza `useSubmit` para actualizar los parámetros de la URL. El `loader` principal lee la URL, haciendo de esta la "fuente de la verdad".
  - **Flujo de Inscripción:** Funcionalidad real de "Inscribirse a Evento". La acción actualiza el `AuthContext`, guarda el evento en el perfil del usuario y actualiza el contador de asistentes en la API simulada.
  - **Panel de Usuario:** El usuario puede ver sus eventos inscritos (Favoritos) y cancelar su inscripción.
  - **Mapa Interactivo:** Implementación de `React Leaflet`.
    - Los marcadores usan la chincheta por defecto de Leaflet para mayor claridad.
    - Incluye **Popups personalizados** con un diseño "tech", información clave del evento (título, fecha, asistentes, tags) y un botón para navegar a la página de detalles.
  - **Manejo de Errores:** La aplicación presenta una página de error personalizada (`ErrorPage.tsx`) si una ruta o un `loader` falla.

## 🛠️ Stack Tecnológico (Modernizado)

| Categoría            | Tecnología                                      | Versión   |
| :------------------- | :---------------------------------------------- | :-------- |
| **Framework**        | [React](https://react.dev/)                     | `~19.2.0` |
| **Lenguaje**         | [TypeScript](https://www.typescriptlang.org/)   | `~5.2.2`  |
| **Build Tool**       | [Vite](https://vitejs.dev/)                     | `~5.3.1`  |
| **Componentes UI**   | [Material-UI (MUI)](https://mui.com/)           | `~7.3.4`  |
| **Routing**          | [React Router](https://reactrouter.com/)        | `~7.9.5`  |
| **Formularios**      | [React Hook Form](https://react-hook-form.com/) | `~7.51.5` |
| **Mapas**            | [React Leaflet](https://react-leaflet.js.org/)  | `~5.0.0`  |
| **Manejo de Estado** | React Context (API nativa)                      | N/A       |

## 🏁 Cómo Empezar

### Prerrequisitos

- [Node.js](https://nodejs.org/en) (versión 20.x o superior recomendada).
- `npm` (v7 o superior).

### Instalación y Ejecución

1.  **Clonar el repositorio:**

    ```bash
    git clone <tu-repo-url>
    cd ciblo3
    ```

2.  **Instalar dependencias:**
    (Nota: Ya no se requiere el flag `--legacy-peer-deps`).

    ```bash
    npm install
    ```

3.  **Ejecutar el proyecto:**
    Esto iniciará el servidor de desarrollo de Vite.

    ```bash
    npm start
    ```

4.  Abre [http://localhost:5173](http://localhost:5173) (o el puerto que indique la terminal) en tu navegador para ver la aplicación.

## ⚙️ Modo de API Simulada (Mock)

Actualmente, este proyecto **no necesita un backend** para funcionar. Toda la lógica del servidor (autenticación, obtención de datos, creación/edición de eventos) está simulada localmente.

- **API Simulada:** La lógica se encuentra en `src/services/apiService.ts`.
- **Base de Datos Falsa:** Los datos de prueba (usuarios y eventos) están en `src/mocks/db.ts`.

#### Cuentas de Demostración

- **Rol Asistente:** `attendee@cybesphere.local` / `Attendee123!`
- **Rol Organizador:** `organizer@cybesphere.local` / `Organizer123!`
- **Rol Administrador:** `admin@cybesphere.local` / `Admin123!`

Hecho con ❤️ para la comunidad de ciberseguridad española

🛡️ Seguridad • 🤝 Comunidad • 🚀 Innovación
