# 🐛 Errores Conocidos y Deuda Técnica

> **Última Auditoría:** Enero 2026 (Beta v0.5.0 - Verificado contra código real)

---

## ✅ Items Completados (Fases 1-4)

### Marketplace & Pagos ✅ v0.3.0

- **Stripe:** Flujos de conexión y compra integrados (via `organizations.service.ts`).
- **Scanning:** Lector QR funcional (`html5-qrcode`).
- **Listados:** `AttendeesList` optimizado para móvil.

### Optimizaciones de Rendimiento ✅

- Lazy Loading Maps, Skeleton Loaders, Error Boundaries y Scroll Fix completados.

### Fixes Recientes (v0.4.0) ✅

- **Notificaciones:** Corregido error de visualización vacía y formato de fechas.
- **Conexiones:** Corregido error 500 por solicitudes duplicadas (Botón ahora maneja estado "Pendiente").
- **Hooks:** Solucionado error "Rendered more hooks" en `ConnectButton`.

### Social & Networking (v0.4.0) ✅

- **ConnectButton:** Implementado con estados (Conectar, Pendiente, Conectado).
- **FollowButton:** Seguir organizaciones funcional.
- **NotificationBadge:** Icono con conteo implementado.
- **ConnectionRequestsManager:** Gestión de solicitudes pendientes.

---

## 🛠️ Deuda Técnica & Bugs Conocidos

### 1. Layout & Responsividad (Desktop-First)

- **Estado:** Se revirtieron parches responsive inestables.
- **Efecto:** Algunos componentes complejos (`EventsListTab`, paneles de admin) funcionan mejor en Desktop/Tablet que en móviles muy pequeños.
- **Mitigación:** Se han aplicado mejoras puntuales ("edge-to-edge") en `AttendeesList`, pero falta una revisión mobile-first integral.

### 2. Permisos de Cámara (QR Scanner)

- **Problema:** En navegadores no seguros (HTTP), la API de cámara puede bloquearse.
- **Requisito:** `QRScannerModal` requiere HTTPS en producción o `localhost` en desarrollo.

### 3. Accesibilidad (a11y)

- Falta añadir `aria-label` a IconButtons en Header, Footer, EventCard.

---

## 🔴 Bugs Conocidos (v0.5.0)

### 1. Notificaciones no se muestran

- **Problema:** El icono de notificaciones (NotificationBadge) aparece correctamente pero al hacer click no muestra las notificaciones.
- **Ubicación:** `NotificationMenu.tsx` o `NotificationsTab.tsx`
- **Prioridad:** Media

### 2. QRs no visibles en panel de usuario

- **Problema:** Los códigos QR de las entradas no se ven correctamente en el panel de usuario (TicketsTab).
- **Ubicación:** `panel-usuario/tabs/TicketsTab.tsx`
- **Prioridad:** Alta

### 3. Mejoras Visuales Pendientes

- **Problema:** Varios componentes necesitan ajustes de UI/UX identificados durante testing.
- **Prioridad:** Media

---

## 🧩 Funcionalidades Pendientes (Fase 6+)

- [ ] **Push Notifications:** Toasts y alertas visuales realtime.
- [ ] **Chat:** Mensajería directa.
- [ ] **Feed Social:** Tablón de actividad.
- [ ] **i18n:** Traducción (actualmente solo ES).

---

## 📊 Estado de Componentes

| Componente     | Tamaño | Estado        | Notas              |
| -------------- | ------ | ------------- | ------------------ |
| `EventCard`    | 8.4KB  | ✅ Bien       | Falta aria-label   |
| `Button`       | 2.8KB  | ✅ Bien       | Wrapper limpio     |
| `EventFilters` | 11.8KB | ⚠️ Grande     | Considerar dividir |
| `Header`       | 8.9KB  | ⚠️ Falta a11y | Añadir aria-labels |
| `Footer`       | 3.4KB  | ⚠️ Falta a11y | Añadir aria-labels |
| `MobileMenu`   | 9.7KB  | ⚠️ Falta a11y | Añadir aria-labels |
