# 🛡️ CybESphere (Frontend)

<div align="center">

![React](https://img.shields.io/badge/React-19.2.1-blue?logo=react)
![React Router](https://img.shields.io/badge/React%20Router-7.9.5-red?logo=reactrouter)
![MUI](https://img.shields.io/badge/MUI-v7.3.4-blue?logo=mui)
![Vite](https://img.shields.io/badge/Vite-5.3.1-purple?logo=vite)

**La plataforma centralizada para la comunidad de ciberseguridad en España.**

</div>

---

## 📝 Introducción

Este repositorio contiene el frontend del proyecto **CybESphere**, una plataforma sin ánimo de lucro diseñada para unificar y centralizar todos los eventos de ciberseguridad en España, fomentando la comunidad y la visibilidad.

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

#### 📱 Diseño Responsive Mobile (Enero 2026)

- **Header con Menú Hamburguesa**: Drawer lateral con navegación completa
- **Breakpoint mínimo**: 360px con soporte completo
- **Paneles Optimizados**: Usuario, Organizador y Admin con layouts adaptados
- **Mapas Touch-friendly**: Zoom con dos dedos, altura responsive
- **Partículas Interactivas**: Touch events para repulsión en móvil (25 partículas vs 80 desktop)
- **Componentes Globales**: EventCard, EventFilters, Eventos con estilos adaptativos

#### ⚡ Mejoras UX/UI Organizador

- **Dashboard Responsive**: Tarjetas de estadísticas adaptables y tablas optimizadas
- **Gestión de Perfil**: Layout unificado (Info + Contacto) para mejor usabilidad móvil
- **Visualización de Eventos**:
  - Enlace destacado en color Cian al perfil público del organizador
  - Ocultación inteligente de controles (Suscribirse/Favoritos) para el propio organizador
  - Feedback visual de estado (Borrador/Publicado)

---

### 🆕 Novedades Beta v0.6.0 (Febrero 2026)

#### 🔐 Verificación de Email

- **Flujo completo de verificación**: Los nuevos usuarios deben verificar su email antes del primer login
- **Páginas dedicadas**: `/check-email` (post-registro) y `/verify-email` (verificación)
- **Integración con Backend**: Soporte para el nuevo endpoint `GET /auth/verify`

#### 🍪 Compliance GDPR - Cookie Banner

- **Banner de Cookies con Glassmorphism**: Diseño moderno y consistente con la UI
- **Consentimiento Granular**: Esenciales vs Opcionales (Analytics, Marketing)
- **Contexto Global**: `CookieContext` para gestión de preferencias en toda la app
- **Persistencia**: Las preferencias se guardan en localStorage

#### 🌍 Internacionalización (i18n)

- **react-i18next configurado**: Soporte para múltiples idiomas
- **Landing Page traducida**: PoC con textos en Español e Inglés (traducida solo una parte de muestra)
- **Selector de Idioma**: Nuevo componente `LanguageSelector` en Header y menú móvil
- **Nueva variante Button `text`**: Para elementos interactivos ligeros (dropdown, etc.)

#### 🐛 Bug Fixes

- **Reviews**: Fallback para reseñas de usuarios eliminados (evita crash)
- **Eventos Pasados**: Corregido filtro en perfil público de organizaciones

#### 🚀 Journey del Organizador (Onboarding Mejorado)

- **Registro Simplificado**: Checkbox "Quiero organizar eventos" en SignUp (elimina tabs)
- **Página de Onboarding**: Nueva página `/crear-organizacion` con formulario por pasos (Stepper)
- **Campos Obligatorios**: Nombre, CIF/NIF, Email Público (con validación en tiempo real)
- **Backend Transaccional**: Creación atómica de organización con estado `pending`
- **Success Modal con Portal**: Popup de éxito con glassmorphism y auto-cierre (5s)
- **Page Transitions**: Animaciones suaves de entrada/salida con `framer-motion`
- **Self-Follow Prevention**: Botón "Seguir" oculto para miembros de la propia organización
- **Estado Pendiente UX**: Banner de advertencia y botón "Crear Evento" deshabilitado hasta aprobación

---

### 🆕 Novedades Beta v0.7.0 (Febrero 2026)

#### 🛡️- **Panel de Administración**:

- Dashboard de métricas (KPIs) en tiempo real.
- Gestión avanzada de usuarios y organizaciones (Ban/Verify).
- **Audit Visualizer**: Visualización de logs de seguridad y acciones críticas.
- **Herramientas de Organización**:
  tivos (Recharts).
- **Gestión Avanzada de Usuarios**:
  - Filtro por rol y estado.
  - Acciones rápidas: Editar rol, Suspender/Activar usuario.
  - **Banner de Suspensión**: Feedback visual inmediato para usuarios suspendidos.
- **Gestión de Organizaciones**:
  - Visualización del "Dueño" (Owner) de la organización.
  - Flujo de verificación y suspensión con auditoría.
- **Audit Logs (Infraestructura)**: Registro automático de acciones administrativas críticas.

#### 💅 Mejoras de UI/UX

- **Data Grids Modernos**: Tablas con paginación real, filtros y estados visuales (badges).
- **Feedback de Errores Mejorado**: Modales específicos para errores de cuenta suspendida o bloqueada.
- **Optimizaciones de Rendimiento**: Solución de race conditions en cargas masivas de datos.

---

### 🆕 Novedades Beta v0.8.0 (Febrero 2026)

#### 🏗️ Arquitectura y Refactorización

- **Modularización de Componentes:** Desacoplamiento de componentes monolíticos (`EventFilters`, `NotificationsTab`, `UsersTab`).
- **Custom Hooks:** Implementación de lógica de negocio en hooks especializados (`useEventFilters`, `useNotifications`, `useUsers`) para mejor mantenibilidad.
- **Sub-componentes Atómicos:** Extracción de componentes más pequeños para filtros (Date, Location, Category, Type).

#### 🛡️ Mejoras en Paneles y Seguridad

- **Persistencia de Pestañas:** El estado de las pestañas en el Panel de Administrador ahora persiste tras recargar la página mediante parámetros URL (`?tab=...`).
- **Organizer Onboarding Guard:** Redirección automática forzada a `/crear-organizacion` para organizadores sin perfil completo, impidiendo el acceso a paneles incompletos.
- **UI Dinámica de Onboarding:** El Header y Menú Móvil ahora muestran dinámicamente el botón "Crear Organización" si el usuario lo requiere.

#### 🐛 Estabilidad y Bug Fixes

- **Filtros de Eventos:** Corregida la sincronización de fechas entre Frontend y Backend.
- **Backend Sync:** Adaptación a nuevas estructuras de DTOs para mayor seguridad de tipos.

---

### 🆕 Novedades Beta v0.9.0 (Febrero 2026)

#### 🛡️ Calidad, Auditoría y Rediseño de Errores

- **Rediseño de Página de Error (404)**: Nueva estética "cyber" con efectos glitch y animaciones.
- **Audit Visualizer & Admin Mobile**: Nueva pestaña "Logs" y adaptación responsive (vista de tarjetas) para tablas de administración.
- **Sistema de Heros & UI Polish**: Unificación visual de cabeceras (`HeroSection`), refactorización de "Sobre Nosotros" y mejoras en el sistema de diseño.
- **Estabilidad**: Corrección de regresiones visuales, unificación de botones y mejoras en la responsividad.

---

## 📂 Estructura del Proyecto

```text
Frontend-CybESphere/
├── public/                 # Assets estáticos públicos
│   ├── fonts/              # Tipografías locales (Satoshi, etc.)
│   └── team/               # Imágenes estáticas del equipo
│
├── scripts/                # Scripts de utilidad y verificación
│
├── src/                    # Código fuente de la aplicación
│   ├── components/         # Componentes UI reutilizables
│   │   ├── Button.tsx      # Botón estándar (primary/secondary/text)
│   │   ├── CookieBanner.tsx # Banner GDPR con consentimiento
│   │   └── LanguageSelector.tsx # Selector de idioma
│   ├── constants/          # Constantes globales
│   ├── context/            # Estado global (AuthContext, CookieContext)
│   ├── hooks/              # Custom hooks
│   ├── i18n/               # Internacionalización
│   │   ├── index.ts        # Configuración react-i18next
│   │   └── locales/        # Archivos de traducción (es.json, en.json)
│   ├── mocks/              # Mock data
│   ├── pages/              # Vistas (rutas)
│   │   ├── CheckEmail.tsx  # Post-registro: "Revisa tu correo"
│   │   └── VerifyEmail.tsx # Verificación de email con token
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
- Backend de CybESphere corriendo en `http://localhost:8080`

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
