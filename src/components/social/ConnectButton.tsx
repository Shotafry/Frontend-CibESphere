// src/components/social/ConnectButton.tsx
// v0.4.0 - Botón para solicitar conexión con otro usuario con selector de eventos

import { useState, useEffect } from 'react'
import {
  Button,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  ButtonProps,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert
} from '@mui/material'
import {
  Handshake as ConnectIcon,
  Check as ConnectedIcon,
  HourglassEmpty as PendingIcon,
  Event as EventIcon
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import {
  isConnectedWith,
  requestConnection,
  getContactInfo
} from '../../services/api/connections.service'
import { httpClient } from '../../services/httpClient'

interface EventSummary {
  id: string
  title: string
  start_date: string
  image_url?: string
}

interface ConnectButtonProps extends Omit<ButtonProps, 'onClick'> {
  targetUserId: string
  targetUserName?: string
  eventId?: string
  showLabel?: boolean
  onConnectionChange?: (status: 'connected' | 'pending' | 'none') => void
}

export const ConnectButton = ({
  targetUserId,
  targetUserName = 'este usuario',
  eventId: initialEventId,
  showLabel = true,
  onConnectionChange,
  ...buttonProps
}: ConnectButtonProps) => {
  const { user, isAuthenticated } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedEventId, setSelectedEventId] = useState(initialEventId || '')
  const [targetEvents, setTargetEvents] = useState<EventSummary[]>([])
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Estado para popup de contacto
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [contactInfo, setContactInfo] = useState<{
    name: string
    email?: string
    discord?: string
    telegram?: string
  } | null>(null)

  const handleShowContact = async () => {
    setLoading(true)
    try {
      const info = await getContactInfo(targetUserId)
      setContactInfo(info)
      setContactDialogOpen(true)
    } catch (error) {
      console.error('Error getting contact info:', error)
      // Fallback si falla
      setError('No se pudo obtener la información de contacto.')
    } finally {
      setLoading(false)
    }
  }
  // Verificar estado inicial
  useEffect(() => {
    const checkConnectionStatus = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false)
        return
      }

      // No mostrar botón si es el mismo usuario
      if (user.id === targetUserId) {
        setLoading(false)
        return
      }

      try {
        const { is_connected, status } = await isConnectedWith(targetUserId)
        setIsConnected(is_connected)

        // Manejar estados pendientes y rechazados
        if (status === 'pending_sent' || status === 'pending_received') {
          setIsPending(true)
          if (onConnectionChange) onConnectionChange('pending')
        } else if (is_connected) {
          if (onConnectionChange) onConnectionChange('connected')
        } else {
          if (onConnectionChange) onConnectionChange('none')
        }
      } catch (error) {
        console.error('Error checking connection status:', error)
      } finally {
        setLoading(false)
      }
    }

    checkConnectionStatus()
  }, [targetUserId, isAuthenticated, user])

  // Cargar eventos del target cuando se abre el dialog
  const loadTargetEvents = async () => {
    setLoadingEvents(true)
    try {
      // Obtener eventos a los que asiste el target
      const response = await httpClient.get<{ events: EventSummary[] }>(
        `/users/${targetUserId}/registered-events`
      )
      setTargetEvents(response.data.events || [])
    } catch (error) {
      console.error('Error loading target events:', error)
      // Si falla, no pasa nada, el selector simplemente no mostrará eventos
      setTargetEvents([])
    } finally {
      setLoadingEvents(false)
    }
  }

  const handleClick = () => {
    if (!isAuthenticated) {
      setError('Inicia sesión para conectar con usuarios')
      return
    }

    if (isConnected || isPending) return

    setDialogOpen(true)
    loadTargetEvents()
  }

  const handleSendRequest = async () => {
    setActionLoading(true)
    setError(null)
    try {
      await requestConnection(
        targetUserId,
        selectedEventId || undefined,
        message
      )
      setIsPending(true)
      onConnectionChange?.('pending')
      setDialogOpen(false)
      setMessage('')
      setSelectedEventId('')
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Error al enviar solicitud'
      setError(msg)
    } finally {
      setActionLoading(false)
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setMessage('')
    setSelectedEventId(initialEventId || '')
    setError(null)
  }

  // No mostrar si es el mismo usuario
  if (user?.id === targetUserId) {
    return null
  }

  if (loading) {
    return (
      <Button disabled {...buttonProps}>
        <CircularProgress size={20} />
      </Button>
    )
  }

  const getButtonState = () => {
    if (isConnected) {
      return {
        label: 'Contactado',
        icon: <ConnectedIcon />,
        color: 'success' as const,
        variant: 'outlined' as const,
        disabled: false,
        onClick: handleShowContact,
        tooltip: 'Ver información de contacto'
      }
    }
    if (isPending) {
      return {
        label: 'Pendiente',
        icon: <PendingIcon />,
        color: 'warning' as const,
        variant: 'outlined' as const,
        disabled: true,
        tooltip: 'Solicitud pendiente'
      }
    }
    return {
      label: 'Conectar',
      icon: <ConnectIcon />,
      color: 'primary' as const,
      variant: 'contained' as const,
      disabled: false,
      onClick: handleClick,
      tooltip: 'Enviar solicitud de conexión'
    }
  }

  const state = getButtonState()

  const formatEventDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <>
      <Tooltip title={state.tooltip || ''}>
        <span>
          <Button
            variant={state.variant}
            color={state.color}
            onClick={state.onClick}
            disabled={state.disabled || actionLoading}
            startIcon={state.icon}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              '&:hover:not(:disabled)': {
                transform: 'scale(1.02)'
              }
            }}
            {...buttonProps}
          >
            {showLabel && state.label}
          </Button>
        </span>
      </Tooltip>

      {/* Dialog para enviar solicitud de conexión */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth='sm'
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ConnectIcon color='primary' />
            <Typography variant='h6' fontWeight={600}>
              Conectar con {targetUserName}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
            Envía una solicitud de conexión. Si {targetUserName} la acepta,
            podrás ver sus datos de contacto.
          </Typography>

          {/* Selector de evento */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id='event-select-label'>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventIcon fontSize='small' />
                ¿Para qué evento?
              </Box>
            </InputLabel>
            <Select
              labelId='event-select-label'
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              label='¿Para qué evento?'
              disabled={loadingEvents}
            >
              <MenuItem value=''>
                <em>Sin especificar evento</em>
              </MenuItem>
              {loadingEvents ? (
                <MenuItem disabled>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  Cargando eventos...
                </MenuItem>
              ) : targetEvents.length === 0 ? (
                <MenuItem disabled>
                  <em>No hay eventos registrados</em>
                </MenuItem>
              ) : (
                targetEvents.map((event) => (
                  <MenuItem key={event.id} value={event.id}>
                    <Box>
                      <Typography variant='body2' fontWeight={500}>
                        {event.title}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {formatEventDate(event.start_date)}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {/* Mensaje personalizado */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label='Mensaje personalizado'
            placeholder='Hola, veo que vas al mismo evento. ¿Te gustaría quedar?'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            helperText='Opcional - Añade contexto a tu solicitud'
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleCloseDialog} color='inherit'>
            Cancelar
          </Button>
          <Button
            variant='contained'
            onClick={handleSendRequest}
            disabled={actionLoading}
            startIcon={
              actionLoading ? <CircularProgress size={16} /> : <ConnectIcon />
            }
          >
            Enviar solicitud
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Información de Contacto */}
      <Dialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        maxWidth='xs'
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ConnectedIcon color='success' />
            <Typography variant='h6'>¡Estáis conectados!</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant='body2' color='text.secondary' paragraph>
            Información de contacto compartida por {targetUserName}:
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {contactInfo?.email && (
              <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography variant='caption' color='text.secondary'>
                  Email
                </Typography>
                <Typography
                  variant='body1'
                  fontWeight={500}
                  sx={{ wordBreak: 'break-all' }}
                >
                  {contactInfo.email}
                </Typography>
              </Box>
            )}

            {contactInfo?.discord && (
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: '#5865F220',
                  borderRadius: 1,
                  border: '1px solid #5865F240'
                }}
              >
                <Typography variant='caption' sx={{ color: '#5865F2' }}>
                  Discord
                </Typography>
                <Typography variant='body1' fontWeight={500}>
                  {contactInfo.discord}
                </Typography>
              </Box>
            )}

            {contactInfo?.telegram && (
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: '#0088cc20',
                  borderRadius: 1,
                  border: '1px solid #0088cc40'
                }}
              >
                <Typography variant='caption' sx={{ color: '#0088cc' }}>
                  Telegram
                </Typography>
                <Typography variant='body1' fontWeight={500}>
                  {contactInfo.telegram}
                </Typography>
              </Box>
            )}

            {!contactInfo?.email &&
              !contactInfo?.discord &&
              !contactInfo?.telegram && (
                <Alert severity='info'>
                  Este usuario no comparte información pública detallada.
                </Alert>
              )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialogOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ConnectButton
