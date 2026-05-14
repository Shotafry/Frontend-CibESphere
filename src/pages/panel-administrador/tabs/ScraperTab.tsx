// src/pages/panel-administrador/tabs/ScraperTab.tsx
import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Switch,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Grid,
  Card,
  CardContent,
  Fade,
  Tooltip,
  IconButton,
  useMediaQuery,
  Skeleton
} from '@mui/material'
import {
  PlayArrow as PlayArrowIcon,
  Schedule as ScheduleIcon,
  Code as CodeIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  HourglassEmpty as HourglassIcon,
  History as HistoryIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { useScraper } from '../../../hooks/useScraper'
import type { ScraperRun } from '../../../types'

export const ScraperTab: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const {
    sources,
    runs,
    loadingSources,
    loadingRuns,
    runningMode,
    error,
    run,
    toggleSource,
    refreshSources,
    refreshHistory
  } = useScraper()

  const [logDialogOpen, setLogDialogOpen] = React.useState(false)
  const [selectedLog, setSelectedLog] = React.useState<ScraperRun | null>(null)

  const handleRun = async (mode: 'fast' | 'slow') => {
    await run(mode)
  }

  const handleToggle = async (id: string, current: boolean) => {
    await toggleSource(id, !current)
  }

  const openLog = (run: ScraperRun) => {
    setSelectedLog(run)
    setLogDialogOpen(true)
  }

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString('es-ES', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'primary'
      case 'completed': return 'success'
      case 'failed': return 'error'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <HourglassIcon fontSize='small' />
      case 'completed': return <CheckCircleIcon fontSize='small' />
      case 'failed': return <ErrorIcon fontSize='small' />
      default: return null
    }
  }

  const runningRun = runs.find(r => r.status === 'running')

  return (
    <Fade in timeout={500}>
      <Box>
        {/* Header */}
        <Box mb={4}>
          <Typography
            variant='h4'
            fontWeight='bold'
            mb={1}
            sx={{
              background: 'linear-gradient(45deg, #1e293b 30%, #6366f1 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-1px'
            }}
          >
            Scraper de Eventos
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Gestiona fuentes de eventos y ejecuta el scraper manualmente
          </Typography>
        </Box>

        {/* Control Panel */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 4,
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
            bgcolor: 'white'
          }}
        >
          <CardContent>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems='center'
              justifyContent='space-between'
            >
              <Box display='flex' alignItems='center' gap={2}>
                <CodeIcon sx={{ fontSize: 40, color: 'var(--color-cadetblue)' }} />
                <Box>
                  <Typography variant='h5' fontWeight={700}>
                    Ejecución manual
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {runningMode
                      ? `Scraper corriendo en modo ${runningMode}…`
                      : 'Inicia una nueva ejecución del scraper'}
                  </Typography>
                </Box>
              </Box>

              <Stack direction='row' spacing={2} pt={{ xs: 2, sm: 0 }}>
                <Tooltip title='Ejecución rápida (alta concurrencia)'>
                  <span>
                    <Button
                      variant='contained'
                      size='large'
                      startIcon={<PlayArrowIcon />}
                      onClick={() => handleRun('fast')}
                      disabled={!!runningMode}
                      sx={{
                        background: 'linear-gradient(225deg, #00d9ff, #01c0fa)',
                        boxShadow: '0 4px 14px rgba(0, 217, 255, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(225deg, #00d1e0, #00a7d1)',
                          boxShadow: '0 6px 20px rgba(0, 217, 255, 0.5)'
                        }
                      }}
                    >
                      {runningMode === 'fast' ? 'Ejecutando…' : 'Run Fast'}
                    </Button>
                  </span>
                </Tooltip>

                <Tooltip title='Ejecución lenta (respetando delays mayores)'>
                  <span>
                    <Button
                      variant='outlined'
                      size='large'
                      startIcon={<ScheduleIcon />}
                      onClick={() => handleRun('slow')}
                      disabled={!!runningMode}
                      sx={{
                        borderColor: 'var(--color-cadetblue)',
                        color: 'var(--color-cadetblue)',
                        '&:hover': {
                          borderColor: 'var(--color-cadetblue)',
                          bgcolor: 'var(--color-cadetblue)',
                          color: 'white'
                        }
                      }}
                    >
                      Run Slow
                    </Button>
                  </span>
                </Tooltip>

                <IconButton onClick={refreshHistory} disabled={loadingRuns}>
                  <RefreshIcon />
                </IconButton>
              </Stack>
            </Stack>

            {/* Progress bar when running */}
            {runningMode && (
              <Box mt={3}>
                <LinearProgress
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: '#e0f7fa',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #01c0fa, #4fbac8)'
                    }
                  }}
                />
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Error alert */}
        {error && (
          <Paper
            sx={{
              p: 2,
              mb: 3,
              bgcolor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 3
            }}
          >
            <Typography color='#dc2626'>{error}</Typography>
          </Paper>
        )}

        {/* Fuentes y History en grid */}
        <Grid container spacing={3}>
          {/* Sources Table */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper
              sx={{
                borderRadius: 4,
                p: 3,
                border: '1px solid #e2e8f0',
                height: '100%'
              }}
            >
              <Stack direction='row' alignItems='center' justifyContent='space-between' mb={2}>
                <Typography variant='h6' fontWeight={700}>
                  Fuentes ({sources.length})
                </Typography>
                <IconButton size='small' onClick={refreshSources} disabled={loadingSources}>
                  <RefreshIcon fontSize='small' />
                </IconButton>
              </Stack>

              {loadingSources ? (
                <Skeleton variant='rectangular' height={300} sx={{ borderRadius: 2 }} />
              ) : sources.length === 0 ? (
                <Box py={4} textAlign='center'>
                  <Typography color='text.secondary'>No hay fuentes configuradas</Typography>
                </Box>
              ) : (
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  <Table size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Tipo</TableCell>
                        {!isMobile && <TableCell>Rate</TableCell>}
                        <TableCell align='right'>Activo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sources.map((source) => (
                        <TableRow key={source.id} hover>
                          <TableCell>
                            <Typography fontWeight={600}>{source.name}</Typography>
                            {!isMobile && (
                              <Typography variant='caption' color='text.secondary'>
                                {source.url}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={source.type}
                              size='small'
                              sx={{
                                bgcolor: '#e0f7fa',
                                color: '#006064',
                                fontWeight: 600,
                                fontSize: '0.75rem'
                              }}
                            />
                          </TableCell>
                          {!isMobile && (
                            <TableCell>{source.rate_limit ? `${source.rate_limit}/s` : '-'}</TableCell>
                          )}
                          <TableCell align='right'>
                            <Switch
                              checked={source.enabled}
                              onChange={() => handleToggle(source.id, source.enabled)}
                              size='small'
                              disabled={runningMode === 'fast' || runningMode === 'slow'}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: '#01c0fa',
                                  '&:hover': { backgroundColor: 'rgba(1,192,250,0.2)' },
                                  '&.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#01c0fa'
                                  }
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* History Table */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper
              sx={{
                borderRadius: 4,
                p: 3,
                border: '1px solid #e2e8f0',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Stack direction='row' alignItems='center' justifyContent='space-between' mb={2}>
                <Typography variant='h6' fontWeight={700}>
                  Historial
                </Typography>
                <IconButton size='small' onClick={refreshHistory} disabled={loadingRuns}>
                  <RefreshIcon fontSize='small' />
                </IconButton>
              </Stack>

              {loadingRuns ? (
                <Skeleton variant='rectangular' height={300} sx={{ borderRadius: 2, flex: 1 }} />
              ) : runs.length === 0 ? (
                <Box py={4} textAlign='center' flex={1}>
                  <Typography color='text.secondary'>Sin ejecuciones</Typography>
                </Box>
              ) : (
                <Box sx={{ maxHeight: 400, overflow: 'auto', flex: 1 }}>
                  <Table size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Modo</TableCell>
                        <TableCell>Estado</TableCell>
                        {!isMobile && <TableCell>Inicio</TableCell>}
                        <TableCell align='right'>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {runs.slice(0, 10).map((run) => (
                        <TableRow key={run.id} hover>
                          <TableCell>
                            <Typography variant='caption' fontFamily='monospace'>
                              {run.id.slice(0, 12)}…
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={run.mode}
                              size='small'
                              sx={{
                                bgcolor: run.mode === 'fast' ? '#fef3c7' : '#d1fae5',
                                color: run.mode === 'fast' ? '#92400e' : '#065f46',
                                fontWeight: 600,
                                fontSize: '0.7rem'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(run.status)}
                              label={run.status}
                              size='small'
                              color={getStatusColor(run.status) as any}
                              sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                            />
                          </TableCell>
                          {!isMobile && (
                            <TableCell>{formatDate(run.started_at)}</TableCell>
                          )}
                          <TableCell align='right'>
                            <Tooltip title='Ver log'>
                              <IconButton
                                size='small'
                                onClick={() => openLog(run)}
                                disabled={!run.output}
                              >
                                <VisibilityIcon fontSize='small' />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Log Dialog */}
        <Dialog
          open={logDialogOpen}
          onClose={() => setLogDialogOpen(false)}
          maxWidth='md'
          fullWidth
        >
          <DialogTitle>
            <Stack direction='row' alignItems='center' spacing={1}>
              <CodeIcon />
              <Typography variant='h6'>
                Log: {selectedLog?.id.slice(0, 12)}…
              </Typography>
              <Chip
                label={selectedLog?.status}
                size='small'
                color={selectedLog ? (getStatusColor(selectedLog.status) as any) : 'default'}
                sx={{ ml: 2 }}
              />
            </Stack>
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              multiline
              fullWidth
              rows={20}
              value={selectedLog?.output || 'No output available'}
              InputProps={{
                readOnly: true,
                sx: {
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  bgcolor: '#f8fafc',
                  borderRadius: 2
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLogDialogOpen(false)}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  )
}
