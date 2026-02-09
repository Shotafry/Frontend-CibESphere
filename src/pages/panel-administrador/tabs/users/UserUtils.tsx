import React from 'react'
import { Chip } from '@mui/material'
import {
  AdminPanelSettings as AdminIcon,
  Event as OrganizerIcon,
  Person as UserIcon
} from '@mui/icons-material'
import { Role } from '../../../../types'

export const getRoleBadge = (role: Role) => {
  switch (role) {
    case Role.Admin:
      return (
        <Chip
          icon={<AdminIcon />}
          label='Admin'
          size='small'
          sx={{ bgcolor: '#fce7f3', color: '#be185d', fontWeight: 700 }}
        />
      )
    case Role.Organizer:
      return (
        <Chip
          icon={<OrganizerIcon />}
          label='Organizador'
          size='small'
          sx={{ bgcolor: '#dbeafe', color: '#1d4ed8', fontWeight: 700 }}
        />
      )
    default:
      return (
        <Chip
          icon={<UserIcon />}
          label='Usuario'
          size='small'
          sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 600 }}
        />
      )
  }
}

export const getStatusBadge = (isActive: boolean) => {
  return isActive ? (
    <Chip
      label='Activo'
      size='small'
      sx={{ bgcolor: '#dcfce7', color: '#15803d', fontWeight: 700 }}
    />
  ) : (
    <Chip
      label='Suspendido'
      size='small'
      sx={{ bgcolor: '#fee2e2', color: '#b91c1c', fontWeight: 700 }}
    />
  )
}
