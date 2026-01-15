# 🐛 Errores Conocidos y Deuda Técnica

Este documento recopila los problemas técnicos identificados, áreas de mejora y funcionalidades pendientes de implementación. Sirve como backlog técnico para futuras iteraciones.

---

## 🛑 Críticos / Alta Prioridad

### 1. Monolitos de Componentes ("God Objects")

Algunos componentes han crecido desmesuradamente y violan el principio de responsabilidad única.

- **`src/pages/PanelDeOrganizador.tsx`**: >1000 líneas. Mezcla lógica de dashboard, CRUD de eventos, gestión de formularios, estilos y renderizado de tabs.
  - _Acción:_ Dividir en `DashboardTab.tsx`, `EventsList.tsx`, `ProfileEditor.tsx`.
- **`src/pages/Eventos.tsx`**: >800 líneas. Maneja renderizado de detalle, lógica de inscripción, mapas y reseñas.
  - _Acción:_ Extraer `SubscribeButton.tsx`, `EventHeader.tsx`, `EventItinerary.tsx`.

### 2. Repetición de Código (DRY)

- **Modales:** La lógica de modales (ej. en `AboutThis.tsx`) contiene estilos inline repetidos.
- **Botones:** Existen múltiples definiciones de estilos de botones que deberían unificarse en `src/components/Button.tsx`.

---

## 🛠️ Mejoras de Arquitectura y Código

### 1. Sistema de Diseño

Aunque se usa MUI 7, faltan tokens centralizados.

- **Estado Actual:** Variables CSS en `global.css` (`--color-cadetblue`) mezcladas con `sx` props hardcodeados.
- **Mejora:** Centralizar todo en `src/theme.ts` de MUI. Definir una paleta personalizada para eliminar "magic strings" de colores en los componentes.

### 2. Rendimiento

- **Mapas:** `React Leaflet` se carga en el bundle principal.
  - _Mejora:_ Implementar `React.lazy` para cargar los mapas solo cuando se necesitan.
- **Re-renders:** Formularios grandes (como en `Page.tsx`) pueden causar re-renderizados excesivos. Optimizar `react-hook-form` con `memo` si es necesario.

### 3. Accesibilidad (a11y)

- Faltan atributos `aria-label` en botones de iconos (ej. redes sociales).
- Contraste de texto en algunos gradientes (especialmente en modo oscuro o banners) debe ser verificado.

---

## 🧩 Funcionalidades Pendientes (Backlog)

### UX/UI

- [ ] **Feedback de Carga:** Mejorar los skeletons o spinners al cargar datos en los paneles.
- [ ] **Transiciones:** Implementar animaciones de entrada (`Framer Motion`) en el cambio de rutas para una sensación más "app-like".
- [ ] **Error Boundaries:** Crear pantallas de error específicas por componente para evitar que toda la app falle si un widget (ej. Mapa) crashea.

### Internacionalización (i18n)

- Actualmente todos los textos están hardcodeados en español.
- _Futuro:_ Implementar `react-i18next` para preparar la la plataforma a multi-idioma.

### Testing

- No existen tests E2E ni unitarios robustos.
- _Recomendación:_ Configurar Vitest para lógica de negocio y Cypress/Playwright para flujos críticos (Login -> Crear Evento).

---

## 🔍 Notas de Auditoría (Resumen)

_Basado en auditoría de Enero 2026_

| Componente     | Estado   | Problema Principal                 |
| -------------- | -------- | ---------------------------------- |
| `EventCard`    | ✅ Bien  | Grid size props a corregir         |
| `EventFilters` | ⚠️ Medio | Muy extenso, difícil de mantener   |
| `SignUp`       | ⚠️ Medio | Validaciones visuales mejorables   |
| `Services`     | ✅ Bien  | Modularizados, listos para escalar |
