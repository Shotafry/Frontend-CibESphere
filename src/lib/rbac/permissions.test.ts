// Tests del core RBAC portable (espejo de la matriz del backend).
//
// Listos para el arnes Vitest que monta la release 0.14.0. Hoy el frontend aun no tiene
// vitest instalado (es trabajo de 0.14.0); el modulo se verifico por type-check aislado en
// 0.13.0. Cuando 0.14.0 cablee Vitest, este test corre sin cambios.
import { describe, it, expect } from 'vitest'
import { can, permissionsForRole, RolePermissions, Permissions } from './permissions'

describe('RBAC core (espejo del backend)', () => {
  it('user solo puede leer eventos/organizaciones y gestionar su perfil', () => {
    expect(can('user', 'ReadEvent')).toBe(true)
    expect(can('user', 'ReadOrganization')).toBe(true)
    expect(can('user', 'WriteProfile')).toBe(true)
    expect(can('user', 'WriteEvent')).toBe(false)
    expect(can('user', 'ManageUsers')).toBe(false)
  })

  it('organizer puede gestionar eventos y su organizacion, pero no el sistema', () => {
    expect(can('organizer', 'WriteEvent')).toBe(true)
    expect(can('organizer', 'PublishEvent')).toBe(true)
    expect(can('organizer', 'ManageAttendees')).toBe(true)
    expect(can('organizer', 'ManageOrganization')).toBe(true)
    expect(can('organizer', 'ManageUsers')).toBe(false)
    expect(can('organizer', 'DeleteOrganization')).toBe(false)
    expect(can('organizer', 'ManageSystem')).toBe(false)
  })

  it('admin puede todo lo de los demas mas los permisos de sistema', () => {
    expect(can('admin', 'ManageUsers')).toBe(true)
    expect(can('admin', 'ManageSystem')).toBe(true)
    expect(can('admin', 'ViewAuditLogs')).toBe(true)
    expect(can('admin', 'DeleteOrganization')).toBe(true)
    expect(can('admin', 'WriteEvent')).toBe(true)
    // admin es superconjunto de organizer y user
    for (const p of [...RolePermissions.organizer, ...RolePermissions.user]) {
      expect(can('admin', p)).toBe(true)
    }
  })

  it('rol desconocido o nulo no tiene permisos', () => {
    expect(permissionsForRole(undefined)).toEqual([])
    expect(permissionsForRole(null)).toEqual([])
    expect(permissionsForRole('superuser')).toEqual([])
    expect(can(null, 'ReadEvent')).toBe(false)
  })

  it('can acepta tanto la clave del catalogo como un objeto Permission', () => {
    expect(can('organizer', Permissions.WriteEvent)).toBe(true)
    expect(can('organizer', 'WriteEvent')).toBe(true)
    expect(can('user', { resource: 'event', action: 'write' })).toBe(false)
  })
})
