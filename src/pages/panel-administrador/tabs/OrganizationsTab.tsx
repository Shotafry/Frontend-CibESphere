import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Typography,
  Chip,
  Paper,
  Fade,
  TablePagination,
  TextField,
  MenuItem,
  InputAdornment,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Search as SearchIcon,
  Business as BusinessIcon
} from '@mui/icons-material'
import { OrganizationSummary } from '../../../types'
import * as apiService from '../../../services/api/organizations.service'
import { updateOrganizationStatus } from '../../../services/api/admin.service'
import { TableSkeleton } from '../../../components/skeletons'
import { useDebounce } from '../../../hooks/useDebounce'

// Modular Components
import { OrganizationsTable } from './organizations/OrganizationsTable'
import { OrganizationsMobileList } from './organizations/OrganizationsMobileList'
import { OrganizationActionsMenu } from './organizations/OrganizationActionsMenu'

export const OrganizationsTab: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

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
            sx={{ minWidth: 250, flexGrow: 1 }}
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

        {/* Content */}
        {loading ? (
          <TableSkeleton />
        ) : isMobile ? (
          <OrganizationsMobileList orgs={orgs} onMenuOpen={handleMenuOpen} />
        ) : (
          <OrganizationsTable orgs={orgs} onMenuOpen={handleMenuOpen} />
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

        {/* Actions Menu */}
        <OrganizationActionsMenu
          anchorEl={anchorEl}
          onClose={handleMenuClose}
          selectedOrg={selectedOrg}
          onVerify={handleVerify}
          onUnverify={handleUnverify}
          onToggleStatus={handleToggleStatus}
          loading={actionLoading}
        />
      </Box>
    </Fade>
  )
}
