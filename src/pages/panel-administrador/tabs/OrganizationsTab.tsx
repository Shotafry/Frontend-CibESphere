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
  Business as BusinessIcon
} from '@mui/icons-material'
import { OrganizationSummary } from '../../../types'
import * as apiService from '../../../services/api/organizations.service'
import {
  updateOrganizationStatus,
  verifyOrganization as verifyOrgAdmin
} from '../../../services/api/admin.service'
import { TableSkeleton } from '../../../components/skeletons'
import { useDebounce } from 'use-debounce'

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
      const resp = await apiService.getAllOrganizations({
        page: page + 1,
        limit,
        search: debouncedSearch,
        status: statusFilter !== 'all' ? statusFilter : undefined
      })
      setOrgs(resp.organizations)
      setTotal(resp.pagination?.total_items || 0)
    } catch (error) {
      console.error('Error fetching organizations:', error)
    } finally {
      setLoading(false)
    }
  }, [page, limit, debouncedSearch, statusFilter])

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
      // Use admin service specific for verification or the one in organizations service if wrapper exists
      // Check imports: we imported verifyOrgAdmin from admin.service
      // But looking at previous code, verifyOrganization was in organizations.service (but pointing to admin endpoint)
      // I'll use the one from admin.service to be safe or explicit
      await verifyOrgAdmin(selectedOrg.id)
      await fetchOrgs()
      handleMenuClose()
    } catch (error) {
      console.error(error)
      alert('Error al verificar organización')
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleStatus = async () => {
    if (!selectedOrg) return
    const isSuspended = selectedOrg.status === 'suspended'
    const newStatus = isSuspended ? 'active' : 'suspended'
    const actionName = isSuspended ? 'activar' : 'suspender'

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
  const getStatusChip = (status: string, isVerified: boolean) => {
    if (status === 'suspended') {
      return (
        <Chip
          label='Suspendida'
          size='small'
          sx={{ bgcolor: '#fee2e2', color: '#b91c1c', fontWeight: 700 }}
        />
      )
    }
    if (status === 'pending' || !isVerified) {
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

  return (
    <Fade in timeout={500}>
      <Box>
        {/* Header */}
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          mb={4}
        >
          <Box>
            <Typography
              variant='h5'
              fontWeight='800'
              color='#1e293b'
              gutterBottom
            >
              Gestión de Organizaciones
            </Typography>
            <Typography variant='body2' color='#64748b'>
              Administra las empresas y organizadores registrados
            </Typography>
          </Box>
          <Chip
            label={`${total} Total`}
            color='primary'
            variant='outlined'
            sx={{ fontWeight: 'bold' }}
          />
        </Box>

        {/* Toolbar */}
        <Paper
          elevation={0}
          sx={{ p: 2, mb: 3, border: '1px solid #e2e8f0', borderRadius: 3 }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              placeholder='Buscar por nombre...'
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
              label='Estado'
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size='small'
              sx={{ minWidth: 150 }}
            >
              <MenuItem value='all'>Todos</MenuItem>
              <MenuItem value='active'>Activas</MenuItem>
              <MenuItem value='pending'>Pendientes</MenuItem>
              <MenuItem value='suspended'>Suspendidas</MenuItem>
            </TextField>
          </Stack>
        </Paper>

        {/* Table */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}
        >
          {loading ? (
            <TableSkeleton />
          ) : (
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: '700', color: '#475569' }}>
                    Organización
                  </TableCell>
                  <TableCell sx={{ fontWeight: '700', color: '#475569' }}>
                    Ubicación
                  </TableCell>
                  <TableCell sx={{ fontWeight: '700', color: '#475569' }}>
                    Estado
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
                {orgs.map((org) => (
                  <TableRow
                    key={org.id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Stack direction='row' spacing={2} alignItems='center'>
                        <Avatar
                          src={org.logo_url}
                          variant='rounded'
                          sx={{
                            bgcolor: 'white',
                            border: '1px solid #e2e8f0',
                            color: 'var(--color-cadetblue)'
                          }}
                        >
                          {org.name[0]}
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
                              {org.name}
                            </Typography>
                            {org.is_verified && (
                              <VerifiedIcon
                                sx={{ fontSize: 14, color: '#3b82f6' }}
                              />
                            )}
                          </Stack>
                          <Typography variant='caption' color='#64748b'>
                            {org.email || 'Sin contacto'}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {org.city ? (
                        <Typography variant='body2' color='#475569'>
                          {org.city}, {org.country}
                        </Typography>
                      ) : (
                        <Typography variant='caption' color='text.secondary'>
                          No especificada
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusChip(org.status, org.is_verified)}
                    </TableCell>
                    <TableCell align='right'>
                      <IconButton
                        size='small'
                        onClick={(e) => handleMenuOpen(e, org)}
                      >
                        <MoreVertIcon fontSize='small' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {orgs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align='center' sx={{ py: 8 }}>
                      <Typography color='text.secondary'>
                        No se encontraron organizaciones
                      </Typography>
                    </TableCell>
                  </TableRow>
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
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage='Filas:'
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

          <MenuItem onClick={handleToggleStatus} disabled={actionLoading}>
            <ListItemIcon>
              {selectedOrg?.status === 'suspended' ? (
                <CheckCircleIcon fontSize='small' color='success' />
              ) : (
                <BlockIcon fontSize='small' color='error' />
              )}
            </ListItemIcon>
            <Typography
              color={
                selectedOrg?.status === 'suspended' ? 'success.main' : 'error'
              }
            >
              {selectedOrg?.status === 'suspended' ? 'Reactivar' : 'Suspender'}
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
