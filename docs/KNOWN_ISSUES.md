# 🐛 Errores Conocidos y Deuda Técnica

> **Última Auditoría:** Enero 2026 (Verificado contra código real)

---

## ✅ Items Completados (Fases 1-4)

### Marketplace & Pagos ✅ v0.3.0

- **Stripe:** Flujos de conexión y compra integrados (`useStripeConnect`).
- **Scanning:** Lector QR funcional (`html5-qrcode`).
- **Listados:** `AttendeesList` optimizado para móvil.

### Optimizaciones de Rendimiento ✅

- Lazy Loading Maps, Skeleton Loaders, Error Boundaries y Scroll Fix completados.

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

## 🧩 Funcionalidades Pendientes (Fase 5+)

- [ ] **Notificaciones:** Centro de notificaciones y push.
- [ ] **Social:** Chat y Feed.
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
