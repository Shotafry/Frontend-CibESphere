# Auditoría y Estrategia para Refactorización & Responsive

## 1. Diagnóstico del Proyecto

- **Stack:** React 19, MUI 7, React Router 7, Vite, TypeScript, CSS-in-JS (Emotion), global.css, arquitectura moderna.
- **Fortalezas:** Uso avanzado de Data Routers, separación lógica/presentación, autenticación robusta, componentes reutilizables, diseño moderno.
- **Debilidades detectadas:**
  - Repetición de estilos y lógica en componentes clave (ej. botones, modales).
  - Estilos inline y keyframes dentro de JSX.
  - Falta de centralización de estilos y tokens de diseño.
  - Algunos componentes no siguen el principio DRY.
  - Responsive implementado pero mejorable en algunos layouts (según roadmap y mejoras.md).

## 2. Estrategia de Refactorización

### Componentización y DRY

- Extrae componentes reutilizables para botones, modales, tarjetas, etc.
- Crea un sistema de diseño mínimo propio: define tokens (colores, tipografías, espaciados) en el theme de MUI y/o variables CSS.
- Centraliza animaciones en archivos de estilos o en el theme.

### Estilos

- Elimina estilos inline y `<style>` en JSX.
- Usa el theme de MUI y variables globales para gradientes, colores y tipografías.
- Refactoriza `global.css` para que solo contenga resets, fuentes y variables globales.

### Responsive

- Usa el sistema de breakpoints de MUI (`theme.breakpoints`) y props `sx` responsivos.
- Revisa todos los layouts con Grid/Flex y asegúrate de que tengan buen comportamiento en xs/sm/md/lg.
- Testea en mobile-first y ajusta paddings/margins/typografías.

### Arquitectura

- Renombra archivos/componentes para que coincidan (ej. `ComunidadBox.tsx`).
- Mantén la lógica de negocio fuera de los componentes de presentación.
- Refuerza tipado con TypeScript en todos los props.

## 3. Proceso sugerido (como Project Manager)

- **Auditoría rápida:** Haz un inventario de todos los componentes y páginas principales.
- **Crea un checklist de refactorización:** (puedes ponerlo en mejoras.md)
  - Extraer botones/inputs/elementos repetidos.
  - Centralizar estilos y animaciones.
  - Revisar layouts y breakpoints.
  - Documentar el sistema de diseño.
  - Pruebas en dispositivos reales/emuladores.
- **Itera por módulos:** Refactoriza por secciones (Landing, Paneles, Eventos, etc.) y revisa responsive en cada una.
- **QA y revisión de accesibilidad:** Usa Lighthouse y herramientas de accesibilidad.