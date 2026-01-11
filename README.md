# CibESphere (Frontend)

![React](https://img.shields.io/badge/React-19.2.1-blue?logo=react)
![React Router](https://img.shields.io/badge/React%20Router-7.9.5-red?logo=reactrouter)
![MUI](https://img.shields.io/badge/MUI-v7.3.4-blue?logo=mui)
![Vite](https://img.shields.io/badge/Vite-5.3.1-purple?logo=vite)

8.  ## Introducción
9.
10. Este repositorio contiene el frontend del proyecto **CibESphere**, una plataforma sin ánimo de lucro diseñada para unificar y centralizar todos los eventos de ciberseguridad en España, fomentando la comunidad y la visibilidad.
11.
12. Esta aplicación ha sido modernizada para utilizar las últimas tecnologías del ecosistema React y se conecta a un **Backend en Go (Gin Framework)** totalmente funcional.
13.
14. ## 🚀 Funcionalidades Clave (Feature Set Complete)
15.
16. ### 🎨 Experiencia de Usuario y Diseño (UI/UX)
17.
18. - **Diseño Premium & Glow:** Implementación de una estética moderna con efectos de iluminación (neón/cian) al interactuar con las tarjetas.
19. - **Landing Page Inmersiva:** Hero section con diseño curvo (`clip-path`), header híbrido (transparente a blanco) y animaciones de entrada.
20. - **Mapa Interactivo:** Integración de Leaflet con **Popups personalizados** que actúan como mini-tarjetas de evento.
21. - **Filtros URL-Sync:** Sistema de filtrado (fecha, ubicación, idioma, nivel) sincronizado bidireccionalmente con la URL para compartir búsquedas fácilmente.
22.
23. ### 👥 Roles y Paneles de Gestión (RBAC Real)
24.
25. El sistema implementa un control de acceso basado en roles (RBAC) gestionado por el Backend:
26.
27. #### 1. Panel de Asistente (Usuario)
28.
29. - **Mis Eventos:** Gestión de inscripciones activas y pasadas.
30. - **Bookmarks:** Sistema de "Guardar para más tarde" sin inscripción.
31. - **Perfil:** Edición de avatar, datos personales y "Frase Personal".
32. - **Configuración:** Gestión de preferencias de notificaciones.
33.
34. #### 2. Panel de Organizador / Administrador
35.
36. - **Dashboard:** Vista panorámica de métricas reales.
37. - **Gestión de Eventos:** CRUD completo conectado a base de datos PostgreSQL.
38. - **Validaciones:** Reglas de negocio estrictas para creación de eventos y organizaciones.
39.
40. ### ⚙️ Ingeniería y Arquitectura
41.
42. - **Stack Moderno:** Construido sobre **React 19** y **React Router 7**.
43. - **Conexión API Real:**
44. - **Axios Singleton:** Cliente HTTP robusto con interceptores.
45. - **JWT Management:** Manejo automático de Access Token y Refresh Token.
46. - **Error Handling:** Interceptor global para gestión de errores 401/500.
47. - **Response Unwrapping:** Procesamiento automático de respuestas estándar del backend.
48.
49. ## 🛠️ Stack Tecnológico
50.
51. | Categoría | Tecnología | Versión |
52. | :------------------- | :---------------------------------------------- | :---------- |
53. | **Framework** | [React](https://react.dev/) | `^19.2.1` |
54. | **Lenguaje** | [TypeScript](https://www.typescriptlang.org/) | `^5.2.2` |
55. | **Build Tool** | [Vite](https://vitejs.dev/) | `^5.3.1` |
56. | **Componentes UI** | [Material-UI (MUI)](https://mui.com/) | `^7.3.4` |
57. | **HTTP Client** | [Axios](https://axios-http.com/) | `^1.x` |
58. | **Routing** | [React Router](https://reactrouter.com/) | `^7.9.5` |
59.
60. ## 🏁 Cómo Empezar
61.
62. ### Prerrequisitos
63.
64. - [Node.js](https://nodejs.org/en) (v20+).
65. - Backend de CibESphere corriendo (ver README del backend) en puerto 8080.
66.
67. ### Instalación y Ejecución
68.
69. 1. **Clonar:**
70.     ```bash
71.     git clone <repo>
72.     cd Frontend
73.     ```
74.
75. 2. **Instalar dependencias:**
76.     ```bash
77.     npm install
78.     ```
79.
80. 3. **Configurar Entorno (.env):**
81.     Crea un archivo `.env` en la raíz del Frontend:
82.     ```env
83.     VITE_API_URL=http://localhost:8080/api/v1
84.     ```
85.
86. 4. **Ejecutar:**
87.     ```bash
88.     npm start
89.     ```
90.     Visita [http://localhost:5173](http://localhost:5173).
91.
92. ### Credenciales (Seeders Backend)
93.
94. - **Asistente:** `attendee@cybesphere.local` / `Attendee123!`
95. - **Organizador:** `organizer@cybesphere.local` / `Organizer123!`
96. - **Admin:** `admin@cybesphere.local` / `Admin123!`
97.
98. Hecho con ❤️ para la comunidad de ciberseguridad española
