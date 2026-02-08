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
  Fade,
  TablePagination,
  TextField,
  MenuItem,
  Stack,
  FormControl,
  InputLabel,
  Select
} from '@mui/material'
import {
  History as HistoryIcon,
  Person as PersonIcon,
  Code as CodeIcon,
  Storage as StorageIcon
} from '@mui/icons-material'
import { AuditLogEntry } from '../../../types'
import * as apiService from '../../../services/api/admin.service'
import { TableSkeleton } from '../../../components/skeletons'

export const LogsTab: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  // Filters
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(20)
  const [actionFilter, setActionFilter] = useState<string>('all')

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const resp = await apiService.getAuditLogs(
        page + 1,
        limit,
        undefined, // userId not implemented in UI yet
        actionFilter !== 'all' ? actionFilter : undefined
      )
      setLogs(resp.data)
      setTotal(resp.pagination?.total_items || 0)
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }, [page, limit, actionFilter])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const getActionColor = (action: string) => {
    if (action.includes('CREATE')) return 'success'
    if (action.includes('UPDATE')) return 'info'
    if (action.includes('DELETE')) return 'error'
    if (action.includes('LOGIN')) return 'primary'
    return 'default'
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
              Logs del Sistema
            </Typography>
            <Typography variant='body2' color='#64748b'>
              Registro de auditoría de seguridad y acciones administrativas
            </Typography>
          </Box>
          <Chip
            icon={<HistoryIcon />}
            label={`${total} Eventos`}
            variant='outlined'
          />
        </Box>

        {/* Filters */}
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
          <Stack direction='row' spacing={2}>
            <FormControl size='small' sx={{ minWidth: 200 }}>
              <InputLabel>Filtrar por Acción</InputLabel>
              <Select
                value={actionFilter}
                label='Filtrar por Acción'
                onChange={(e) => setActionFilter(e.target.value)}
              >
                <MenuItem value='all'>Todas las acciones</MenuItem>
                <MenuItem value='USER_LOGIN'>Inicio de Sesión</MenuItem>
                <MenuItem value='USER_REGISTER'>Registro de Usuario</MenuItem>
                <MenuItem value='ORGANIZATION_VERIFIED'>
                  Verificación Org.
                </MenuItem>
                <MenuItem value='USER_ROLE_UPDATE'>Cambio de Rol</MenuItem>
                <MenuItem value='USER_STATUS_UPDATE'>Cambio de Estado</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Paper>

        {/* Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          {loading ? (
            <TableSkeleton />
          ) : (
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: '700', color: '#475569' }}>
                    Fecha
                  </TableCell>
                  <TableCell sx={{ fontWeight: '700', color: '#475569' }}>
                    Actor
                  </TableCell>
                  <TableCell sx={{ fontWeight: '700', color: '#475569' }}>
                    Acción
                  </TableCell>
                  <TableCell sx={{ fontWeight: '700', color: '#475569' }}>
                    Recurso
                  </TableCell>
                  <TableCell sx={{ fontWeight: '700', color: '#475569' }}>
                    Detalle
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log) => (
                  <TableRow
                    key={log.id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Typography variant='body2' color='#1e293b'>
                        {new Date(log.timestamp).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction='row' spacing={1} alignItems='center'>
                        <PersonIcon
                          fontSize='small'
                          sx={{ color: '#94a3b8' }}
                        />
                        <Typography variant='body2' fontWeight='500'>
                          {log.user_id || 'Sistema'}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.action}
                        size='small'
                        color={getActionColor(log.action)}
                        variant='outlined'
                        sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction='row' spacing={1} alignItems='center'>
                        <StorageIcon
                          fontSize='small'
                          sx={{ color: '#94a3b8' }}
                        />
                        <Typography
                          variant='caption'
                          sx={{
                            fontFamily: 'monospace',
                            bgcolor: '#f1f5f9',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1
                          }}
                        >
                          {log.resource}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction='row' spacing={1} alignItems='center'>
                        <Typography variant='caption' color='text.secondary'>
                          ID: {log.resource_id}
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {logs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align='center' sx={{ py: 8 }}>
                      <Typography color='text.secondary'>
                        No hay registros de auditoría recientes
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
            rowsPerPageOptions={[10, 20, 50]}
            labelRowsPerPage='Filas:'
          />
        </TableContainer>
      </Box>
    </Fade>
  )
}
