# 🛡️ CibESphere (Frontend)

<div align="center">

![React](https://img.shields.io/badge/React-19.2.1-blue?logo=react)
![React Router](https://img.shields.io/badge/React%20Router-7.9.5-red?logo=reactrouter)
![MUI](https://img.shields.io/badge/MUI-v7.3.4-blue?logo=mui)
![Vite](https://img.shields.io/badge/Vite-5.3.1-purple?logo=vite)

**La plataforma centralizada para la comunidad de ciberseguridad en España.**

</div>

---

## 📝 Introducción

Este repositorio contiene el frontend del proyecto **CibESphere**, una plataforma sin ánimo de lucro diseñada para unificar y centralizar todos los eventos de ciberseguridad en España, fomentando la comunidad y la visibilidad.

Esta aplicación ha sido modernizada para utilizar las últimas tecnologías del ecosistema React y se conecta a un **Backend en Go (Gin Framework)** totalmente funcional.

---

## 🚀 Funcionalidades Clave (Feature Set Complete)

### 🎨 Experiencia de Usuario y Diseño (UI/UX)

- **Diseño Premium & Glow:** Estética moderna con efectos de iluminación (neón/cian) al interactuar con las tarjetas.
- **Landing Page Inmersiva:** Hero section con diseño curvo (`clip-path`), header híbrido (transparente a blanco) y animaciones de entrada.
- **Mapa Interactivo:** Integración de Leaflet con **popups personalizados** que actúan como mini-tarjetas de evento.
- **Filtros URL-Sync:** Sistema de filtrado (fecha, ubicación, idioma, nivel) sincronizado bidireccionalmente con la URL.

---

### 👥 Roles y Paneles de Gestión (RBAC Real)

Sistema de control de acceso basado en roles gestionado por el backend.

#### 1. Panel de Asistente (Usuario)

- **Mis Eventos:** Gestión de inscripciones activas y pasadas.
- **Bookmarks:** Guardar eventos sin inscribirse.
- **Perfil:** Avatar, datos personales y frase personal.
- **Configuración:** Preferencias de notificaciones.

#### 2. Panel de Organizador / Administrador

- **Dashboard:** Vista de métricas reales.
- **Gestión de Eventos:** CRUD completo conectado a PostgreSQL.
- **Validaciones:** Reglas de negocio estrictas para creación de eventos y organizaciones.

---

### ⚙️ Ingeniería y Arquitectura

- **Stack Moderno:** React 19 + React Router 7.
- **Conexión API Real:** Backend fully conectado.
- **Axios Singleton:** Cliente HTTP con interceptores.
- **JWT Management:** Manejo automático de Access y Refresh Tokens.
- **Error Handling:** Interceptor global para errores 401/500.
- **Response Unwrapping:** Procesamiento automático del formato estándar del backend.

---

### 🆕 Novedades Beta v0.1.0 (Enero 2026)

#### Perfil de Usuario Mejorado

- **Rediseño completo** del perfil público (layout tipo LinkedIn)
- **Badges de Certificaciones**: Subir hasta 10 imágenes circulares
- **Redes Sociales**: GitHub, LinkedIn y Website con iconos interactivos
- **URL Personalizada (Slug)**: `/u/tu-nombre-unico`
- **Frase Personal**: Cita visible en el perfil

#### Landing Page

- **Modales Rediseñados**: Organizador y Participante con animaciones suaves
- **Auth-Aware**: Mensajes diferentes para usuarios logueados
- **UX Mejorada**: Click fuera para cerrar, botón X, backdrop blur

---

## 📂 Estructura del Proyecto

```text
Frontend-CibESphere/
├── public/                 # Assets estáticos públicos
│   ├── fonts/              # Tipografías locales (Satoshi, etc.)
│   └── team/               # Imágenes estáticas del equipo
│
├── scripts/                # Scripts de utilidad y verificación
│
├── src/                    # Código fuente de la aplicación
│   ├── components/         # Componentes UI reutilizables
│   ├── constants/          # Constantes globales
│   ├── context/            # Estado global (AuthContext, Providers)
│   ├── hooks/              # Custom hooks
│   ├── mocks/              # Mock data
│   ├── pages/              # Vistas (rutas)
│   ├── services/           # Capa API (Axios)
│   │   └── api/            # Endpoints por entidad
│   └── types/              # Tipos TypeScript
│
├── .env.example
└── README.md
```

---

## 🛠️ Stack Tecnológico

| Categoría   | Tecnología        | Versión |
| ----------- | ----------------- | ------- |
| Framework   | React             | ^19.2.1 |
| Lenguaje    | TypeScript        | ^5.2.2  |
| Build Tool  | Vite              | ^5.3.1  |
| UI          | Material UI (MUI) | ^7.3.4  |
| HTTP Client | Axios             | ^1.x    |
| Routing     | React Router      | ^7.9.5  |

---

## 🏁 Cómo Empezar

### Prerrequisitos

- Node.js v20+
- Backend de CibESphere corriendo en `http://localhost:8080`

---

### Instalación y Ejecución

#### 1. Clonar el repositorio

```bash
git clone <repo>
cd Frontend
```

#### 2. Instalar dependencias

```bash
npm install
```

#### 3. Configurar entorno

Crea un archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

#### 4. Ejecutar en desarrollo

```bash
npm start
```

Abre:
👉 [http://localhost:5173](http://localhost:5173)

---

## 🔐 Credenciales de Prueba

Credenciales generadas por los seeders del backend:

| Rol         | Email                                                           | Contraseña    |
| ----------- | --------------------------------------------------------------- | ------------- |
| Asistente   | [attendee@cybesphere.local](mailto:attendee@cybesphere.local)   | Attendee123!  |
| Organizador | [organizer@cybesphere.local](mailto:organizer@cybesphere.local) | Organizer123! |
| Admin       | [admin@cybesphere.local](mailto:admin@cybesphere.local)         | Admin123!     |

---

<div align="center">
  <sub>Hecho con ❤️ para la comunidad de ciberseguridad española</sub>
</div>
