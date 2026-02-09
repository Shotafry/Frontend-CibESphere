import React, { useState, useEffect, useCallback } from 'react'
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
  TablePagination,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Tooltip,
  Menu,
  ListItemIcon,
  CircularProgress
} from '@mui/material'
import {
  Search as SearchIcon,
  Verified as VerifiedIcon,
  GppBad as GppBadIcon,
  CheckCircle as CheckCircleIcon,
  MoreVert as MoreVertIcon,
  Block as BlockIcon,
  Public as PublicIcon,
  Business as BusinessIcon,
  Person as PersonIcon
} from '@mui/icons-material'
import { OrganizationSummary } from '../../../types'
import * as apiService from '../../../services/api/organizations.service'
import { updateOrganizationStatus } from '../../../services/api/admin.service'
import { TableSkeleton } from '../../../components/skeletons'
import { useDebounce } from '../../../hooks/useDebounce'

export const OrganizationsTab: React.FC = () => {
  // Data State
  const [orgs, setOrgs] = useState<OrganizationSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  // Filter State
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all')
  const [debouncedSearch] = useDebounce(search, 500)

  // Actions State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedOrg, setSelectedOrg] = useState<OrganizationSummary | null>(
    null
  )
  const [actionLoading, setActionLoading] = useState(false)

  const fetchOrgs = useCallback(async () => {
    setLoading(true)
    try {
      const resp = await apiService.getAllOrganizations(
        {
          page: page + 1,
          limit,
          search: debouncedSearch,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          is_verified:
            verifiedFilter === 'all' ? undefined : verifiedFilter === 'verified'
        },
        // Backend helper now parses this include param
        'include=users' as any
      )
      setOrgs(resp.organizations)
      setTotal(resp.pagination?.total_items || 0)
    } catch (error) {
      console.error('Error fetching organizations:', error)
    } finally {
      setLoading(false)
    }
  }, [page, limit, debouncedSearch, statusFilter, verifiedFilter])

  useEffect(() => {
    fetchOrgs()
  }, [fetchOrgs])

  // Handlers
  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    org: OrganizationSummary
  ) => {
    setAnchorEl(event.currentTarget)
    setSelectedOrg(org)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedOrg(null)
  }

  const handleVerify = async () => {
    if (!selectedOrg) return
    if (!window.confirm(`¿Verificar la organización "${selectedOrg.name}"?`))
      return

    setActionLoading(true)
    try {
      await apiService.verifyOrganization(selectedOrg.id)
      await fetchOrgs()
      handleMenuClose()
    } catch (error) {
      console.error(error)
      alert('Error al verificar organización')
    } finally {
      setActionLoading(false)
    }
  }

  const handleUnverify = async () => {
    if (!selectedOrg) return
    if (
      !window.confirm(
        `¿Estás seguro de quitar la verificación a la organización "${selectedOrg.name}"?`
      )
    )
      return

    setActionLoading(true)
    try {
      await apiService.unverifyOrganization(selectedOrg.id)
      await fetchOrgs()
      handleMenuClose()
    } catch (error) {
      console.error(error)
      alert('Error al desverificar organización')
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleStatus = async () => {
    if (!selectedOrg) return

    // Determine target status and action name
    let newStatus: 'active' | 'suspended' = 'active'
    let actionName = 'activar'

    if (selectedOrg.status === 'active') {
      newStatus = 'suspended'
      actionName = 'suspender'
    } else {
      // If pending or suspended, we want to activate
      newStatus = 'active'
      actionName = 'activar'
    }

    if (
      !window.confirm(
        `¿Estás seguro de ${actionName} la organización "${selectedOrg.name}"?`
      )
    )
      return

    setActionLoading(true)
    try {
      await updateOrganizationStatus(selectedOrg.id, newStatus)
      await fetchOrgs()
      handleMenuClose()
    } catch (error) {
      console.error(error)
      alert(`Error al ${actionName} organización`)
    } finally {
      setActionLoading(false)
    }
  }

  // Render Helpers
  const getStatusChip = (status: string | undefined) => {
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
  const getOwner = (org: OrganizationSummary) => {
    if (!org.users || org.users.length === 0) return null
    // Prioritize 'organizer' role, otherwise first user
    return org.users.find((u) => u.role === 'organizer') || org.users[0]
  }

  return (
    <Fade in timeout={500}>
      <Box>
        {/* Header */}
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          mb={3}
        >
          <Box>
            <Typography variant='h5' fontWeight='700' gutterBottom>
              Gestión de Organizaciones
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Administra y verifica las organizaciones de la plataforma
            </Typography>
          </Box>
          <Chip
            icon={<BusinessIcon />}
            label={`${total} Organizaciones`}
            color='primary'
            variant='outlined'
            sx={{ fontWeight: 'bold' }}
          />
        </Box>

        {/* Toolbar */}
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
          <TextField
            size='small'
            placeholder='Buscar organización...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ minWidth: 250 }}
          />
          <TextField
            select
            size='small'
            label='Estado'
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value='all'>Todos</MenuItem>
            <MenuItem value='active'>Activas</MenuItem>
            <MenuItem value='pending'>Pendientes</MenuItem>
            <MenuItem value='suspended'>Suspendidas</MenuItem>
          </TextField>
          <TextField
            select
            size='small'
            label='Verificación'
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value='all'>Todas</MenuItem>
            <MenuItem value='verified'>Verificadas</MenuItem>
            <MenuItem value='unverified'>No Verificadas</MenuItem>
          </TextField>
        </Paper>

        {/* Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          {loading ? (
            <TableSkeleton />
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Organización</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Contacto</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Verificada</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align='right'>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orgs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align='center' sx={{ py: 4 }}>
                      <Typography color='text.secondary'>
                        No se encontraron organizaciones
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  orgs.map((org) => {
                    const owner = getOwner(org)
                    return (
                      <TableRow key={org.id} hover>
                        <TableCell>
                          <Stack
                            direction='row'
                            alignItems='center'
                            spacing={2}
                          >
                            <Avatar
                              src={org.logo_url}
                              sx={{
                                bgcolor: 'primary.main',
                                width: 48,
                                height: 48
                              }}
                            >
                              <BusinessIcon />
                            </Avatar>
                            <Box>
                              <Typography fontWeight='600' variant='subtitle1'>
                                {org.name}
                              </Typography>
                              <Typography
                                variant='caption'
                                color='text.secondary'
                                display='block'
                              >
                                @{org.slug}
                              </Typography>

                              {/* Owner Info */}
                              {owner && (
                                <Tooltip
                                  title={`Dueño: ${owner.full_name} (${owner.email})`}
                                >
                                  <Stack
                                    direction='row'
                                    alignItems='center'
                                    spacing={0.5}
                                    sx={{ mt: 0.5, cursor: 'pointer' }}
                                  >
                                    <Avatar
                                      src={owner.avatar_url}
                                      sx={{ width: 16, height: 16 }}
                                    >
                                      <PersonIcon sx={{ fontSize: 12 }} />
                                    </Avatar>
                                    <Typography
                                      variant='caption'
                                      color='text.secondary'
                                    >
                                      Managed by{' '}
                                      <strong>{owner.first_name}</strong>
                                    </Typography>
                                  </Stack>
                                </Tooltip>
                              )}
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack
                            direction='row'
                            alignItems='center'
                            spacing={1}
                          >
                            <PersonIcon fontSize='small' color='action' />
                            <Box>
                              <Typography variant='body2' fontWeight='500'>
                                {org.email || 'Sin contacto'}
                              </Typography>
                              <Typography
                                variant='caption'
                                color='text.secondary'
                              >
                                Email Organización
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>{getStatusChip(org.status)}</TableCell>
                        <TableCell>
                          {org.is_verified ? (
                            <Tooltip title='Organización Verificada'>
                              <VerifiedIcon color='primary' />
                            </Tooltip>
                          ) : (
                            <Tooltip title='No Verificada'>
                              <GppBadIcon color='disabled' />
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell align='right'>
                          <IconButton
                            size='small'
                            onClick={(e) => handleMenuOpen(e, org)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
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
            labelRowsPerPage='Por página:'
          />
        </TableContainer>

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
          {/* Verify Check - Only if not verified */}
          {!selectedOrg?.is_verified && (
            <MenuItem onClick={handleVerify} disabled={actionLoading}>
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
            <MenuItem onClick={handleUnverify} disabled={actionLoading}>
              <ListItemIcon>
                <GppBadIcon fontSize='small' color='warning' />
              </ListItemIcon>
              <Typography color='warning.main' fontWeight='600'>
                Quitar Verificado
              </Typography>
            </MenuItem>
          )}

          {/* Activate/Suspend Toggle */}
          <MenuItem onClick={handleToggleStatus} disabled={actionLoading}>
            <ListItemIcon>
              {selectedOrg?.status === 'active' ? (
                <BlockIcon fontSize='small' color='error' />
              ) : (
                <CheckCircleIcon fontSize='small' color='success' />
              )}
            </ListItemIcon>
            <Typography
              color={
                selectedOrg?.status === 'active' ? 'error' : 'success.main'
              }
            >
              {selectedOrg?.status === 'active' ? 'Suspender' : 'Activar'}
            </Typography>
          </MenuItem>

          <MenuItem
            onClick={() => {
              window.open(`/organizations/${selectedOrg?.slug}`, '_blank')
              handleMenuClose()
            }}
          >
            <ListItemIcon>
              <PublicIcon fontSize='small' />
            </ListItemIcon>
            Ver Perfil Público
          </MenuItem>
        </Menu>
      </Box>
    </Fade>
  )
}
