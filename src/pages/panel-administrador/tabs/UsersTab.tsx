import React, { useState } from 'react'
import {
  Box,
  Typography,
  Chip,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Avatar,
  Fade,
  IconButton,
  TablePagination,
  TextField,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Menu,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  Alert,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Divider
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as ActiveIcon,
  MoreVert as MoreVertIcon,
  Verified as VerifiedIcon,
  AdminPanelSettings as AdminIcon,
  Event as OrganizerIcon,
  Person as UserIcon
} from '@mui/icons-material'
import { User, Role } from '../../../types'
import { TableSkeleton } from '../../../components/skeletons'
import { useUsers } from '../../../hooks/useUsers'

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

  // Render Helpers
  const getRoleBadge = (role: Role) => {
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

  const getStatusBadge = (isActive: boolean) => {
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
          /* Mobile Card View */
          <Stack spacing={2}>
            {users.map((user) => (
              <Card key={user.id} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='flex-start'
                    mb={2}
                  >
                    <Stack direction='row' spacing={2} alignItems='center'>
                      <Avatar
                        src={user.avatar_url}
                        sx={{
                          bgcolor: '#3b82f6',
                          width: 40,
                          height: 40
                        }}
                      >
                        {user.first_name?.[0].toUpperCase()}
                      </Avatar>
                      <Box>
                        <Stack
                          direction='row'
                          spacing={0.5}
                          alignItems='center'
                        >
                          <Typography fontWeight='600' variant='subtitle1'>
                            {user.full_name}
                          </Typography>
                          {user.is_verified && (
                            <VerifiedIcon
                              sx={{ fontSize: 16, color: '#3b82f6' }}
                            />
                          )}
                        </Stack>
                        <Typography variant='body2' color='text.secondary'>
                          {user.email}
                        </Typography>
                      </Box>
                    </Stack>
                    <IconButton
                      size='small'
                      onClick={(e) => handleMenuOpen(e, user)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                  >
                    <Box display='flex' gap={1}>
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.is_active)}
                    </Box>
                    <Typography variant='caption' color='text.secondary'>
                      {new Date(user.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
            {users.length === 0 && (
              <Typography textAlign='center' color='text.secondary' py={4}>
                No se encontraron usuarios
              </Typography>
            )}
          </Stack>
        ) : (
          /* Desktop Table View */
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: '700', color: '#475569' }}>
                    Usuario
                  </TableCell>
                  <TableCell sx={{ fontWeight: '700', color: '#475569' }}>
                    Rol
                  </TableCell>
                  <TableCell sx={{ fontWeight: '700', color: '#475569' }}>
                    Estado
                  </TableCell>
                  <TableCell sx={{ fontWeight: '700', color: '#475569' }}>
                    Registro
                  </TableCell>
                  <TableCell
                    align='right'
                    sx={{ fontWeight: '700', color: '#475569' }}
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Stack direction='row' spacing={2} alignItems='center'>
                        <Avatar
                          src={user.avatar_url}
                          sx={{
                            bgcolor: '#3b82f6',
                            width: 40,
                            height: 40,
                            border: '1px solid #e2e8f0'
                          }}
                        >
                          {user.first_name?.[0].toUpperCase()}
                        </Avatar>
                        <Box>
                          <Stack
                            direction='row'
                            alignItems='center'
                            spacing={0.5}
                          >
                            <Typography
                              fontWeight='600'
                              variant='body2'
                              color='#1e293b'
                            >
                              {user.full_name}
                            </Typography>
                            {user.is_verified && (
                              <VerifiedIcon
                                sx={{ fontSize: 14, color: '#3b82f6' }}
                              />
                            )}
                          </Stack>
                          <Typography variant='caption' color='#64748b'>
                            {user.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.is_active)}</TableCell>
                    <TableCell>
                      <Typography variant='body2' color='#475569'>
                        {new Date(user.created_at).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align='right'>
                      <IconButton
                        size='small'
                        onClick={(e) => handleMenuOpen(e, user)}
                      >
                        <MoreVertIcon fontSize='small' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align='center' sx={{ py: 8 }}>
                      <Typography color='text.secondary'>
                        No se encontraron usuarios
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
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
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <MenuItem onClick={handleEditRole}>
            <ListItemIcon>
              <EditIcon fontSize='small' />
            </ListItemIcon>
            Cambiar Rol
          </MenuItem>
          <MenuItem onClick={handleToggleStatus}>
            <ListItemIcon>
              {selectedUser?.is_active ? (
                <BlockIcon fontSize='small' color='error' />
              ) : (
                <ActiveIcon fontSize='small' color='success' />
              )}
            </ListItemIcon>
            <Typography
              color={selectedUser?.is_active ? 'error' : 'success.main'}
            >
              {selectedUser?.is_active ? 'Suspender' : 'Activar'}
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <DeleteIcon fontSize='small' color='error' />
            </ListItemIcon>
            <Typography color='error'>Eliminar</Typography>
          </MenuItem>
        </Menu>

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
            <Button onClick={() => setEditRoleOpen(false)} color='inherit'>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveRole}
              variant='contained'
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
