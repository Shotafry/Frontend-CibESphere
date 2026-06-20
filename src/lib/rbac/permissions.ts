// src/lib/rbac/permissions.ts
//
// Core RBAC portable: espejo en TypeScript de la matriz de permisos del backend
// (backend/internal/permissions/permissions.go -> RolePermissions). Modulo PURO:
// sin React, sin MUI, sin dependencias del shell actual. Por eso sobrevive 1:1 a la
// migracion a Next.js (Fase 2): se copia tal cual a la nueva app.
//
// 0.13.0 introduce solo este core. El hook useRoleAccess() y el componente <RoleGate>
// que lo consumen se construyen en Fase 2 (0.16.0 layout/nav, 0.18.0 auth) cuando esas
// pantallas se reescriben en shadcn; nacer alli con este modulo evita volver a dispersar
// checks de rol inline.
//
// IMPORTANTE - mantener en sync con el backend: esta es la fuente de verdad del CLIENTE,
// pero la autorizacion REAL la aplica siempre el backend Go (este core es UX + defensa en
// profundidad, no seguridad). Cuando 0.14.5 genere el cliente tipado desde el OpenAPI, se
// valorara derivar tambien esta matriz del contrato para que no pueda desincronizarse.

/** Roles del sistema (valores identicos a models.UserRole del backend). */
export type RoleName = 'user' | 'organizer' | 'admin'

/** Permiso = par {recurso, accion}, igual que permissions.Permission en Go. */
export interface Permission {
  resource: string
  action: string
}

/** Catalogo de permisos (espejo de las variables exportadas en permissions.go). */
export const Permissions = {
  // user
  ReadProfile: { resource: 'user', action: 'read' },
  WriteProfile: { resource: 'user', action: 'write' },
  DeleteProfile: { resource: 'user', action: 'delete' },
  // organization
  ReadOrganization: { resource: 'organization', action: 'read' },
  WriteOrganization: { resource: 'organization', action: 'write' },
  DeleteOrganization: { resource: 'organization', action: 'delete' },
  ManageOrganization: { resource: 'organization', action: 'manage' },
  // event
  ReadEvent: { resource: 'event', action: 'read' },
  WriteEvent: { resource: 'event', action: 'write' },
  DeleteEvent: { resource: 'event', action: 'delete' },
  PublishEvent: { resource: 'event', action: 'publish' },
  ManageAttendees: { resource: 'event', action: 'manage_attendees' },
  // system
  ManageUsers: { resource: 'system', action: 'manage_users' },
  ManageSystem: { resource: 'system', action: 'manage_system' },
  ViewAuditLogs: { resource: 'system', action: 'view_audit_logs' },
  ManagePermissions: { resource: 'system', action: 'manage_permissions' },
} as const satisfies Record<string, Permission>

/** Clave de permiso del catalogo (p.ej. 'WriteEvent'). */
export type PermissionKey = keyof typeof Permissions

const P = Permissions

/**
 * Matriz rol -> permisos. Espejo EXACTO de RolePermissions en permissions.go.
 * Si cambia el backend, cambia aqui (el test de paridad de backend protege la fuente;
 * este espejo se valida en permissions.test.ts).
 */
export const RolePermissions: Record<RoleName, Permission[]> = {
  user: [P.ReadProfile, P.WriteProfile, P.ReadEvent, P.ReadOrganization],
  organizer: [
    P.ReadProfile, P.WriteProfile, P.ReadEvent, P.WriteEvent, P.DeleteEvent,
    P.PublishEvent, P.ManageAttendees, P.ReadOrganization, P.WriteOrganization, P.ManageOrganization,
  ],
  admin: [
    P.ReadProfile, P.WriteProfile, P.DeleteProfile, P.ReadEvent, P.WriteEvent, P.DeleteEvent,
    P.PublishEvent, P.ManageAttendees, P.ReadOrganization, P.WriteOrganization, P.DeleteOrganization,
    P.ManageOrganization, P.ManageUsers, P.ManageSystem, P.ViewAuditLogs, P.ManagePermissions,
  ],
}

function isRoleName(role: string): role is RoleName {
  return role === 'user' || role === 'organizer' || role === 'admin'
}

/** Permisos de un rol (vacio si el rol es desconocido). */
export function permissionsForRole(role: string | null | undefined): Permission[] {
  if (!role || !isRoleName(role)) return []
  return RolePermissions[role]
}

/**
 * can indica si un rol tiene un permiso. Acepta la clave del catalogo ('WriteEvent') o un
 * objeto Permission. Es la unica via de comprobacion en el cliente (no checks inline de rol).
 */
export function can(role: string | null | undefined, permission: PermissionKey | Permission): boolean {
  const target: Permission = typeof permission === 'string' ? Permissions[permission] : permission
  return permissionsForRole(role).some(
    (p) => p.resource === target.resource && p.action === target.action,
  )
}
