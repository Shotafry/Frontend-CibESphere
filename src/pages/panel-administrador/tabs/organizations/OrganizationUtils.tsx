import { Chip } from '@mui/material'
import {
  GppBad as GppBadIcon,
  CheckCircle as CheckCircleIcon,
  Business as BusinessIcon
} from '@mui/icons-material'
import { OrganizationSummary } from '../../../../types'

// Render Helpers
export const getStatusChip = (status: string | undefined) => {
  if (!status) return <Chip label='Desconocido' size='small' />

  if (status === 'suspended') {
    return (
      <Chip
        label='Suspendida'
        size='small'
        sx={{ bgcolor: '#fee2e2', color: '#b91c1c', fontWeight: 700 }}
      />
    )
  }
  if (status === 'pending') {
    return (
      <Chip
        icon={<GppBadIcon sx={{ fontSize: 16 }} />}
        label='Pendiente'
        size='small'
        sx={{ bgcolor: '#fef3c7', color: '#92400e', fontWeight: 700 }}
      />
    )
  }
  if (status === 'active') {
    return (
      <Chip
        icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
        label='Activa'
        size='small'
        sx={{ bgcolor: '#dcfce7', color: '#15803d', fontWeight: 700 }}
      />
    )
  }
  return <Chip label={status} size='small' />
}

// Helper to find owner
export const getOwner = (org: OrganizationSummary) => {
  if (!org.users || org.users.length === 0) return null
  // Prioritize 'organizer' role, otherwise first user
  return org.users.find((u) => u.role === 'organizer') || org.users[0]
}
