// src/components/social/ConnectButton.tsx
// v0.7.0 - Botón con estilos unificados (Cyan/White) y gestión de solicitudes

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
  Event as EventIcon,
  Close as RejectIcon
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import {
  isConnectedWith,
  requestConnection,
  getContactInfo
} from '../../services/api/connections.service'
import { httpClient } from '../../services/httpClient'
import { sanitizeUrl } from '../../utils/sanitizeUrl'

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

  // Estado para tipo de pendiente
  const [pendingType, setPendingType] = useState<'sent' | 'received' | null>(
    null
  )
  const [requestId, setRequestId] = useState<string | null>(null)

  // --- ESTILOS UNIFICADOS (Primary/Secondary) ---
  const primarySx = {
    borderRadius: '12px',
    fontWeight: 600,
    textTransform: 'none',
    transition: 'all 0.3s ease',
    background: 'var(--gradient-button-primary)', // Cyan Gradient
    color: 'var(--White)',
    border: 'none',
    '&:hover': {
      background: 'white',
      color: 'var(--color-cadetblue)',
      border: '1px solid var(--color-cadetblue)'
    },
    '&:disabled': {
      background: '#e0e0e0',
      color: '#9e9e9e'
    },
    ...buttonProps.sx
  }

  const secondarySx = {
    borderRadius: '12px',
    fontWeight: 600,
    textTransform: 'none',
    transition: 'all 0.3s ease',
    background: 'white',
    color: 'var(--color-cadetblue)',
    border: '1px solid var(--color-cadetblue)',
    '&:hover': {
      background: 'var(--gradient-button-primary)',
      color: 'var(--White)',
      border: '1px solid transparent'
    },
    ...buttonProps.sx
  }
  // ---------------------------------------------

  const handleShowContact = async () => {
    setLoading(true)
    try {
      const info = await getContactInfo(targetUserId)
      setContactInfo(info)
      setContactDialogOpen(true)
    } catch (error) {
      console.error('Error getting contact info:', error)
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
        const result = await isConnectedWith(targetUserId)
        setIsConnected(result.is_connected)

        if (result.request_id) {
          setRequestId(result.request_id)
        }

        if (result.status === 'pending_sent') {
          setIsPending(true)
          setPendingType('sent')
          onConnectionChange?.('pending')
        } else if (result.status === 'pending_received') {
          setIsPending(true)
          setPendingType('received')
          onConnectionChange?.('pending')
        } else if (result.is_connected) {
          onConnectionChange?.('connected')
        } else {
          onConnectionChange?.('none')
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
      const response = await httpClient.get<{ events: EventSummary[] }>(
        `/users/${targetUserId}/registered-events`
      )
      setTargetEvents(response.data.events || [])
    } catch (error) {
      console.error('Error loading target events:', error)
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
      setPendingType('sent')
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

  const handleAcceptRequest = async () => {
    if (!requestId) return
    setActionLoading(true)
    try {
      const { acceptConnection } =
        await import('../../services/api/connections.service')
      await acceptConnection(requestId)
      setIsConnected(true)
      setIsPending(false)
      setPendingType(null)
      onConnectionChange?.('connected')
    } catch (error) {
      console.error('Error accepting request:', error)
      setError('Error al aceptar la solicitud')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRejectRequest = async () => {
    if (!requestId) return
    setActionLoading(true)
    try {
      const { rejectConnection } =
        await import('../../services/api/connections.service')
      await rejectConnection(requestId)
      setIsPending(false)
      setPendingType(null)
      onConnectionChange?.('none')
    } catch (error) {
      console.error('Error rejecting request:', error)
      setError('Error al rechazar la solicitud')
    } finally {
      setActionLoading(false)
    }
  }

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
        sx: secondarySx, // Ya conectados → Estilo secundario (menos intrusivo)
        disabled: false,
        onClick: handleShowContact,
        tooltip: 'Ver información de contacto'
      }
    }

    if (isPending) {
      if (pendingType === 'received') {
        return {
          type: 'actions',
          accept: {
            label: 'Aceptar',
            icon: <ConnectedIcon />,
            onClick: handleAcceptRequest,
            sx: primarySx // Aceptar → Acción principal
          },
          reject: {
            label: 'Rechazar',
            icon: <RejectIcon />,
            onClick: handleRejectRequest,
            sx: secondarySx // Rechazar → Acción secundaria
          }
        }
      }

      // Pending sent
      return {
        label: 'Pendiente',
        icon: <PendingIcon />,
        sx: {
          ...secondarySx,
          cursor: 'default',
          color: 'var(--color-cadetblue)', // Mantener cian para consistencia
          borderColor: 'rgba(0,0,0,0.1)', // Borde sutil
          '&:hover': {
            background: 'white',
            borderColor: 'rgba(0,0,0,0.1)'
          }
        },
        disabled: true,
        tooltip: 'Solicitud enviada, esperando respuesta'
      }
    }

    return {
      label: 'Conectar',
      icon: <ConnectIcon />,
      sx: primarySx, // Conectar → Acción principal
      disabled: false,
      onClick: handleClick,
      tooltip: 'Enviar solicitud de conexión'
    }
  }

  const state = getButtonState()

  // Renderizado especial para acciones (Aceptar/Rechazar)
  if (state.type === 'actions') {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          onClick={state.accept?.onClick}
          disabled={actionLoading}
          startIcon={
            actionLoading ? (
              <CircularProgress size={16} color='inherit' />
            ) : (
              state.accept?.icon
            )
          }
          sx={state.accept?.sx}
          size={buttonProps.size}
        >
          {showLabel && state.accept?.label}
        </Button>
        <Tooltip title={state.reject?.label || ''}>
          <Button
            onClick={state.reject?.onClick}
            disabled={actionLoading}
            sx={{
              ...state.reject?.sx,
              minWidth: 'auto',
              px: { xs: 1, sm: 2 }
            }}
            size={buttonProps.size}
          >
            {showLabel ? state.reject?.label : state.reject?.icon}
          </Button>
        </Tooltip>
      </Box>
    )
  }

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
            onClick={state.onClick}
            disabled={state.disabled || actionLoading}
            startIcon={state.icon}
            sx={state.sx}
            {...buttonProps}
          >
            {showLabel && state.label}
          </Button>
        </span>
      </Tooltip>

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
          <Button
            onClick={handleCloseDialog}
            sx={{
              borderRadius: '12px',
              fontWeight: 600,
              textTransform: 'none',
              transition: 'all 0.3s ease',
              background: 'white',
              color: 'var(--color-cadetblue)',
              border: '1px solid var(--color-cadetblue)',
              '&:hover': {
                background: 'var(--gradient-button-primary)',
                color: 'var(--White)',
                borderColor: 'transparent'
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            variant='contained'
            onClick={handleSendRequest}
            disabled={actionLoading}
            startIcon={
              actionLoading ? <CircularProgress size={16} /> : <ConnectIcon />
            }
            sx={{
              borderRadius: '12px',
              fontWeight: 600,
              textTransform: 'none',
              transition: 'all 0.3s ease',
              background: 'var(--gradient-button-primary)', // Cyan Gradient
              color: 'var(--White)',
              border: 'none',
              '&:hover': {
                background: 'white',
                color: 'var(--color-cadetblue)',
                border: '1px solid var(--color-cadetblue)'
              }
            }}
          >
            Enviar solicitud
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        maxWidth='sm'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 200, 200, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ConnectedIcon sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant='h6' fontWeight={700}>
                ¡Estáis conectados!
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                Información compartida por {targetUserName}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {contactInfo?.email && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'rgba(59, 130, 246, 0.08)',
                  borderRadius: 3,
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(59, 130, 246, 0.12)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ fontSize: '1.5rem' }}>📧</Box>
                  <Box>
                    <Typography
                      variant='caption'
                      sx={{ color: '#3B82F6', fontWeight: 600 }}
                    >
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
                </Box>
                <Tooltip title='Copiar'>
                  <Button
                    size='small'
                    onClick={() => {
                      navigator.clipboard.writeText(contactInfo.email || '')
                    }}
                    sx={{
                      minWidth: 'auto',
                      p: 1,
                      borderRadius: '8px',
                      color: 'var(--color-cadetblue)',
                      border: '1px solid var(--color-cadetblue)',
                      '&:hover': {
                        bgcolor: 'var(--color-cadetblue)',
                        color: 'white'
                      }
                    }}
                  >
                    📋
                  </Button>
                </Tooltip>
              </Box>
            )}

            {contactInfo?.discord && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'rgba(88, 101, 242, 0.08)',
                  borderRadius: 3,
                  border: '1px solid rgba(88, 101, 242, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(88, 101, 242, 0.15)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ fontSize: '1.5rem' }}>🎮</Box>
                  <Box>
                    <Typography
                      variant='caption'
                      sx={{ color: '#5865F2', fontWeight: 600 }}
                    >
                      Discord
                    </Typography>
                    <Typography variant='body1' fontWeight={500}>
                      {contactInfo.discord}
                    </Typography>
                  </Box>
                </Box>
                <Tooltip title='Copiar'>
                  <Button
                    size='small'
                    onClick={() => {
                      navigator.clipboard.writeText(contactInfo.discord || '')
                    }}
                    sx={{
                      minWidth: 'auto',
                      p: 1,
                      borderRadius: '8px',
                      color: 'var(--color-cadetblue)',
                      border: '1px solid var(--color-cadetblue)',
                      '&:hover': {
                        bgcolor: 'var(--color-cadetblue)',
                        color: 'white'
                      }
                    }}
                  >
                    📋
                  </Button>
                </Tooltip>
              </Box>
            )}

            {contactInfo?.telegram && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'rgba(0, 136, 204, 0.08)',
                  borderRadius: 3,
                  border: '1px solid rgba(0, 136, 204, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(0, 136, 204, 0.15)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ fontSize: '1.5rem' }}>✈️</Box>
                  <Box>
                    <Typography
                      variant='caption'
                      sx={{ color: '#0088cc', fontWeight: 600 }}
                    >
                      Telegram
                    </Typography>
                    <Typography variant='body1' fontWeight={500}>
                      {contactInfo.telegram}
                    </Typography>
                  </Box>
                </Box>
                <Tooltip title='Abrir en Telegram'>
                  <Button
                    size='small'
                    href={sanitizeUrl(`https://t.me/${contactInfo.telegram.replace('@', '')}`)}
                    target='_blank'
                    sx={{
                      minWidth: 'auto',
                      p: 1,
                      borderRadius: '8px',
                      color: 'var(--color-cadetblue)',
                      border: '1px solid var(--color-cadetblue)',
                      '&:hover': {
                        bgcolor: 'var(--color-cadetblue)',
                        color: 'white'
                      }
                    }}
                  >
                    🔗
                  </Button>
                </Tooltip>
              </Box>
            )}

            {!contactInfo?.email &&
              !contactInfo?.discord &&
              !contactInfo?.telegram && (
                <Alert
                  severity='info'
                  sx={{
                    borderRadius: 3,
                    '& .MuiAlert-icon': { alignItems: 'center' }
                  }}
                >
                  Este usuario no ha compartido información de contacto todavía.
                </Alert>
              )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setContactDialogOpen(false)}
            variant='contained'
            sx={{
              borderRadius: '12px',
              fontWeight: 600,
              textTransform: 'none',
              transition: 'all 0.3s ease',
              background: 'var(--gradient-button-primary)', // Cyan Gradient
              color: 'var(--White)',
              border: 'none',
              '&:hover': {
                background: 'white',
                color: 'var(--color-cadetblue)',
                border: '1px solid var(--color-cadetblue)'
              }
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ConnectButton
