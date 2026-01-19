// src/components/social/ConnectButton.tsx
// v0.4.0 - Botón para solicitar conexión con otro usuario

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
  ButtonProps
} from '@mui/material'
import {
  Handshake as ConnectIcon,
  Check as ConnectedIcon,
  HourglassEmpty as PendingIcon
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import {
  isConnectedWith,
  requestConnection
} from '../../services/api/connections.service'

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
  eventId,
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
        const connected = await isConnectedWith(targetUserId)
        setIsConnected(connected)
      } catch (error) {
        console.error('Error checking connection status:', error)
      } finally {
        setLoading(false)
      }
    }

    checkConnectionStatus()
  }, [targetUserId, isAuthenticated, user])

  const handleClick = () => {
    if (!isAuthenticated) {
      console.info('Inicia sesión para conectar con usuarios')
      return
    }

    if (isConnected || isPending) return

    setDialogOpen(true)
  }

  const handleSendRequest = async () => {
    setActionLoading(true)
    try {
      await requestConnection(targetUserId, eventId, message)
      setIsPending(true)
      onConnectionChange?.('pending')
      setDialogOpen(false)
      setMessage('')
    } catch (error: any) {
      console.error('Error al enviar solicitud:', error)
    } finally {
      setActionLoading(false)
    }
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
        label: 'Conectados',
        icon: <ConnectedIcon />,
        color: 'success' as const,
        variant: 'outlined' as const,
        disabled: true
      }
    }
    if (isPending) {
      return {
        label: 'Pendiente',
        icon: <PendingIcon />,
        color: 'warning' as const,
        variant: 'outlined' as const,
        disabled: true
      }
    }
    return {
      label: 'Conectar',
      icon: <ConnectIcon />,
      color: 'primary' as const,
      variant: 'contained' as const,
      disabled: false
    }
  }

  const state = getButtonState()

  return (
    <>
      <Tooltip
        title={
          isConnected
            ? 'Ya estás conectado'
            : isPending
            ? 'Solicitud pendiente'
            : 'Enviar solicitud de conexión'
        }
      >
        <span>
          <Button
            variant={state.variant}
            color={state.color}
            onClick={handleClick}
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

      {/* Dialog para enviar mensaje */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Conectar con {targetUserName}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder='Añade un mensaje personalizado (opcional)'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
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
    </>
  )
}

export default ConnectButton
