import React from 'react'
import { Menu, MenuItem, ListItemIcon, Typography } from '@mui/material'
import {
  Verified as VerifiedIcon,
  GppBad as GppBadIcon,
  CheckCircle as CheckCircleIcon,
  Block as BlockIcon,
  Public as PublicIcon
} from '@mui/icons-material'
import { OrganizationSummary } from '../../../../types'

interface OrganizationActionsMenuProps {
  anchorEl: null | HTMLElement
  onClose: () => void
  selectedOrg: OrganizationSummary | null
  onVerify: () => void
  onUnverify: () => void
  onToggleStatus: () => void
  loading: boolean
}

export const OrganizationActionsMenu: React.FC<
  OrganizationActionsMenuProps
> = ({
  anchorEl,
  onClose,
  selectedOrg,
  onVerify,
  onUnverify,
  onToggleStatus,
  loading
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      {/* Verify Check - Only if not verified */}
      {!selectedOrg?.is_verified && (
        <MenuItem onClick={onVerify} disabled={loading}>
          <ListItemIcon>
            <VerifiedIcon fontSize='small' color='primary' />
          </ListItemIcon>
          <Typography color='primary.main' fontWeight='600'>
            Verificar
          </Typography>
        </MenuItem>
      )}

      {/* Unverify Check - Only if verified */}
      {selectedOrg?.is_verified && (
        <MenuItem onClick={onUnverify} disabled={loading}>
          <ListItemIcon>
            <GppBadIcon fontSize='small' color='warning' />
          </ListItemIcon>
          <Typography color='warning.main' fontWeight='600'>
            Quitar Verificado
          </Typography>
        </MenuItem>
      )}

      {/* Activate/Suspend Toggle */}
      <MenuItem onClick={onToggleStatus} disabled={loading}>
        <ListItemIcon>
          {selectedOrg?.status === 'active' ? (
            <BlockIcon fontSize='small' color='error' />
          ) : (
            <CheckCircleIcon fontSize='small' color='success' />
          )}
        </ListItemIcon>
        <Typography
          color={selectedOrg?.status === 'active' ? 'error' : 'success.main'}
        >
          {selectedOrg?.status === 'active' ? 'Suspender' : 'Activar'}
        </Typography>
      </MenuItem>

      <MenuItem
        onClick={() => {
          window.open(`/organizations/${selectedOrg?.slug}`, '_blank')
          onClose()
        }}
      >
        <ListItemIcon>
          <PublicIcon fontSize='small' />
        </ListItemIcon>
        Ver Perfil Público
      </MenuItem>
    </Menu>
  )
}
