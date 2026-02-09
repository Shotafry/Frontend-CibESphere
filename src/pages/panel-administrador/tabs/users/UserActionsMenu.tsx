import React from 'react'
import { Menu, MenuItem, ListItemIcon, Typography } from '@mui/material'
import {
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as ActiveIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import { User } from '../../../../types'

interface UserActionsMenuProps {
  anchorEl: null | HTMLElement
  onClose: () => void
  selectedUser: User | null
  onEditRole: () => void
  onToggleStatus: () => void
  onDelete: () => void
}

export const UserActionsMenu: React.FC<UserActionsMenuProps> = ({
  anchorEl,
  onClose,
  selectedUser,
  onEditRole,
  onToggleStatus,
  onDelete
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
      <MenuItem onClick={onEditRole}>
        <ListItemIcon>
          <EditIcon fontSize='small' />
        </ListItemIcon>
        Cambiar Rol
      </MenuItem>
      <MenuItem onClick={onToggleStatus}>
        <ListItemIcon>
          {selectedUser?.is_active ? (
            <BlockIcon fontSize='small' color='error' />
          ) : (
            <ActiveIcon fontSize='small' color='success' />
          )}
        </ListItemIcon>
        <Typography color={selectedUser?.is_active ? 'error' : 'success.main'}>
          {selectedUser?.is_active ? 'Suspender' : 'Activar'}
        </Typography>
      </MenuItem>
      <MenuItem onClick={onDelete}>
        <ListItemIcon>
          <DeleteIcon fontSize='small' color='error' />
        </ListItemIcon>
        <Typography color='error'>Eliminar</Typography>
      </MenuItem>
    </Menu>
  )
}
