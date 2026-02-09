import React, { useState } from 'react'
import {
  Box,
  Typography,
  Chip,
  Paper,
  Stack,
  Fade,
  TablePagination,
  TextField,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Alert,
  useTheme,
  useMediaQuery,
  Button as MuiButton
} from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { User, Role } from '../../../types'
import { TableSkeleton } from '../../../components/skeletons'
import { useUsers } from '../../../hooks/useUsers'
import { Button } from '../../../components/Button'

// Modular Components
import { UsersTable } from './users/UsersTable'
import { UsersMobileList } from './users/UsersMobileList'
import { UserActionsMenu } from './users/UserActionsMenu'

export const UsersTab: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const {
    users,
    loading,
    total,
    page,
    limit,
    search,
    roleFilter,
    statusFilter,
    setPage,
    setLimit,
    setSearch,
    setRoleFilter,
    setStatusFilter,
    changeUserRole,
    toggleUserStatus,
    deleteUser
  } = useUsers()

  // Actions UI State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editRoleOpen, setEditRoleOpen] = useState(false)
  const [newRole, setNewRole] = useState<Role | ''>('')
  const [actionLoading, setActionLoading] = useState(false)

  // Handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget)
    setSelectedUser(user)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedUser(null)
  }

  const handleEditRole = () => {
    if (selectedUser) {
      setNewRole(selectedUser.role)
      setEditRoleOpen(true)
      setAnchorEl(null) // Keep selectedUser
    }
  }

  const handleSaveRole = async () => {
    if (!selectedUser || !newRole) return

    setActionLoading(true)
    try {
      await changeUserRole(selectedUser.id, newRole as Role)
      setEditRoleOpen(false)
      handleMenuClose()
    } catch (error) {
      console.error(error)
      alert('Error al actualizar el rol')
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleStatus = async () => {
    if (!selectedUser) return
    const isActive = selectedUser.is_active
    const action = isActive ? 'suspender' : 'activar'

    if (
      !window.confirm(
        `¿Estás seguro de ${action} al usuario ${selectedUser.full_name}?`
      )
    )
      return

    setActionLoading(true)
    try {
      await toggleUserStatus(selectedUser)
      handleMenuClose()
    } catch (error) {
      console.error(error)
      alert('Error al cambiar el estado')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) return

    if (
      window.confirm(
        '¿Estás seguro de eliminar este usuario? Esta acción es irreversible.'
      )
    ) {
      setActionLoading(true)
      try {
        await deleteUser(selectedUser.id)
        handleMenuClose()
      } catch (error) {
        console.error(error)
        alert('Error al eliminar usuario')
      } finally {
        setActionLoading(false)
      }
    }
  }

  return (
    <Fade in timeout={500}>
      <Box>
        {/* Header & Metrics */}
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          mb={4}
          flexWrap='wrap'
          gap={2}
        >
          <Box>
            <Typography
              variant='h5'
              fontWeight='800'
              color='#1e293b'
              gutterBottom
            >
              Directorio de Usuarios
            </Typography>
            <Typography variant='body2' color='#64748b'>
              Gestiona los accesos y roles de la plataforma
            </Typography>
          </Box>
          <Chip
            label={`${total} Usuarios Totales`}
            color='primary'
            variant='outlined'
            sx={{ fontWeight: 'bold' }}
          />
        </Box>

        {/* Filters Toolbar */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ width: '100%' }}
          >
            <TextField
              placeholder='Buscar por nombre o email...'
              size='small'
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon color='action' />
                  </InputAdornment>
                )
              }}
              sx={{ flexGrow: 1 }}
            />

            <TextField
              select
              label='Rol'
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              size='small'
              sx={{ minWidth: { xs: '100%', md: 150 } }}
            >
              <MenuItem value='all'>Todos los roles</MenuItem>
              <MenuItem value={Role.Admin}>Admin</MenuItem>
              <MenuItem value={Role.Organizer}>Organizador</MenuItem>
              <MenuItem value={Role.User}>Usuario</MenuItem>
            </TextField>

            <TextField
              select
              label='Estado'
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size='small'
              sx={{ minWidth: { xs: '100%', md: 150 } }}
            >
              <MenuItem value='all'>Todos</MenuItem>
              <MenuItem value='active'>Activo</MenuItem>
              <MenuItem value='suspended'>Suspendido</MenuItem>
            </TextField>
          </Stack>
        </Paper>

        {/* Users Content */}
        {loading ? (
          <TableSkeleton />
        ) : isMobile ? (
          <UsersMobileList users={users} onMenuOpen={handleMenuOpen} />
        ) : (
          <UsersTable users={users} onMenuOpen={handleMenuOpen} />
        )}

        <TablePagination
          component='div'
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={limit}
          onRowsPerPageChange={(e) => {
            setLimit(parseInt(e.target.value, 10))
            setPage(0)
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage='Filas:'
        />

        {/* Actions Menu */}
        <UserActionsMenu
          anchorEl={anchorEl}
          onClose={handleMenuClose}
          selectedUser={selectedUser}
          onEditRole={handleEditRole}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />

        {/* Edit Role Modal */}
        <Dialog
          open={editRoleOpen}
          onClose={() => setEditRoleOpen(false)}
          maxWidth='xs'
          fullWidth
        >
          <DialogTitle fontWeight='bold'>Editar Rol de Usuario</DialogTitle>
          <DialogContent>
            <Box pt={1}>
              <FormControl fullWidth size='small'>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={newRole}
                  label='Rol'
                  onChange={(e) => setNewRole(e.target.value as Role)}
                >
                  <MenuItem value={Role.User}>Usuario (Asistente)</MenuItem>
                  <MenuItem value={Role.Organizer}>Organizador</MenuItem>
                  <MenuItem value={Role.Admin}>Administrador</MenuItem>
                </Select>
              </FormControl>
              <Alert severity='warning' sx={{ mt: 2, borderRadius: 2 }}>
                Cambiar el rol modificará los permisos y accesos de este usuario
                inmediatamente.
              </Alert>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditRoleOpen(false)} variant='secondary'>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveRole}
              variant='primary'
              disabled={actionLoading}
            >
              {actionLoading ? (
                <CircularProgress size={24} />
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  )
}
