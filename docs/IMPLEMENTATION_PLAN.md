# 📋 Plan de Implementación: CybESphere Frontend

> **Versión Actual:** v0.4.0 ✅ COMPLETADO
> **Próxima Versión:** v0.5.0 🚧 EN DESARROLLO (Testing & Bug Fixes)
> **Última Actualización:** Enero 2026

---

## ✅ v0.3.0 - Marketplace & Tickets (COMPLETADO)

### Estado de Componentes

| Componente       | Tamaño | Función                 |
| ---------------- | ------ | ----------------------- |
| `Button.tsx`     | 2.8KB  | Wrapper MUI + CSS vars  |
| `EventCard`      | 8.4KB  | Tarjeta de evento       |
| `EventFilters`   | 13.5KB | Filtros de búsqueda     |
| `Header`         | 8.9KB  | Navegación principal    |
| `LazyMap`        | 1.1KB  | Lazy loading para mapas |
| `TicketSelector` | -      | Selector de entradas    |

### Páginas Modularizadas

- `evento-detalle/`: 5 componentes
- `crear-evento/`: 1 hook + 5 secciones
- `panel-organizador/`: 4 tabs + 4 components
- `panel-usuario/`: 5 tabs + 2 components
- `panel-administrador/`: 3 tabs

---

## ✅ v0.4.0 - Notificaciones & Social (COMPLETADO)

### 🎯 Objetivos Alcanzados

**Fase 5: Sistema de Notificaciones ✅**

- [x] Centro de notificaciones funcional
- [x] Seguir organizaciones (suscripciones)
- [x] Emails de ticket y confirmación
- [x] Tickets bonitos para eventos gratuitos

**Fase 6: Social & Networking ✅**

- [x] Sistema de conexiones (handshake usuarios)
- [x] Campos de contacto social (Discord, Telegram)

---

### 📂 Servicios Implementados

```
[✅] src/services/api/subscriptions.service.ts
  - followOrganization(orgId)
  - unfollowOrganization(orgId)
  - getFollowing()

[✅] src/services/api/connections.service.ts
  - requestConnection(userId, data)
  - acceptConnection(requestId)
  - rejectConnection(requestId)
  - getPendingConnections()
  - getConnections()
  - getContactInfo(connectionId)

[✅] src/services/api/notifications.service.ts
  - getNotifications()
  - markAsRead(id)
  - markAllAsRead()
  - getUnreadCount()
```

### Componentes Implementados

```
[✅] src/components/social/ConnectButton.tsx
[✅] src/components/social/FollowButton.tsx
[✅] src/components/social/NotificationBadge.tsx
[✅] src/components/social/ConnectionRequestsManager.tsx
```

---

## 🚧 v0.5.0 - Testing & Bug Fixes (EN DESARROLLO)

### Bugs Conocidos a Corregir

- [ ] **Notificaciones:** El icono aparece pero la notificación no se muestra al hacer click
- [ ] **QRs:** No se ven correctamente en el panel de usuario
- [ ] **Mejoras Visuales:** Ajustes pendientes de UI/UX

### Testing Pendiente

- [ ] Verificación funcional de conexiones
- [ ] Verificación funcional de notificaciones
- [ ] Verificación funcional de subscripciones
- [ ] Testing de flujo completo de tickets

---

### 📂 Nuevos Archivos

#### Servicios API

```
[NEW] src/services/api/subscriptions.service.ts
  - followOrganization(orgId)
  - unfollowOrganization(orgId)
  - getFollowing()

[NEW] src/services/api/connections.service.ts
  - requestConnection(userId, data)
  - acceptConnection(requestId)
  - rejectConnection(requestId)
  - getPendingConnections()
  - getConnections()
  - getContactInfo(connectionId)

[MODIFY] src/services/api/notifications.service.ts
  - markAsRead(id)
  - markAllAsRead()
```

#### Nuevos Componentes

```
[NEW] src/components/ConnectionRequestModal.tsx
[NEW] src/components/ContactInfoModal.tsx
[NEW] src/pages/panel-usuario/tabs/ConnectionsTab.tsx
```

---

### 🔧 Modificaciones a Componentes Existentes

#### OrganizationProfile.tsx

- [ ] Botón "Seguir" funcional
- [ ] Contador de seguidores dinámico
- [ ] Estado siguiendo/no-siguiendo

#### AttendeesList.tsx

- [ ] Botón "🤝 Conectar" por asistente
- [ ] Modal de solicitud de conexión
- [ ] Botón "Descargar lista de emergencia"

#### NotificationsTab.tsx (panel-usuario)

- [ ] Centro de notificaciones real
- [ ] Filtros por tipo
- [ ] Marcar como leído

#### TicketsTab.tsx (panel-usuario)

- [ ] Tickets bonitos para eventos gratuitos
- [ ] Botón "Reenviar a mi correo"

#### ProfileTab.tsx (panel-usuario)

- [ ] Campos: Discord, Telegram
- [ ] Toggle: "Compartir email al conectar"
- [ ] Toggle: "Recibir notificaciones por email"

---

### 📋 Orden de Ejecución Frontend

1. [ ] Crear `subscriptions.service.ts`
2. [ ] Crear `connections.service.ts`
3. [ ] Expandir `notifications.service.ts`
4. [ ] OrganizationProfile: botón seguir
5. [ ] AttendeesList: botón conectar
6. [ ] NotificationsTab: centro completo
7. [ ] TicketsTab: tickets bonitos + reenvío
8. [ ] ProfileTab: campos sociales
9. [ ] ConnectionRequestModal
10. [ ] ContactInfoModal
11. [ ] ConnectionsTab (nueva pestaña)

---

## 🛑 Deuda Técnica Pendiente

| Item              | Prioridad | Estado    |
| ----------------- | --------- | --------- |
| aria-labels       | Alta      | Pendiente |
| Colores hardcoded | Media     | Pendiente |
| i18n              | Baja      | Pendiente |
| Testing (Vitest)  | Baja      | Pendiente |
