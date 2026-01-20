// src/components/social/ConnectionRequestsManager.tsx
// v0.4.0 - Componente para gestionar solicitudes de conexión entrantes

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Chip,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Alert
} from '@mui/material'
import {
  Check as AcceptIcon,
  Close as RejectIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import {
  getPendingRequests,
  acceptConnection,
  rejectConnection,
  getContactInfo,
  ConnectionRequest,
  ContactInfo
} from '../../services/api/connections.service'

interface ConnectionRequestsManagerProps {
  onUpdate?: () => void
}

export const ConnectionRequestsManager: React.FC<
  ConnectionRequestsManagerProps
> = ({ onUpdate }) => {
  const navigate = useNavigate()
  const [requests, setRequests] = useState<ConnectionRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [contactInfoModal, setContactInfoModal] = useState<{
    open: boolean
    userId: string
    userName: string
  }>({ open: false, userId: '', userName: '' })
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)
  const [loadingContact, setLoadingContact] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadRequests = async () => {
    setLoading(true)
    try {
      const result = await getPendingRequests()
      setRequests(result.data || [])
    } catch (error) {
      console.error('Error loading requests:', error)
      setError('Error al cargar solicitudes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const handleAccept = async (requestId: string) => {
    setActionLoading(requestId)
    try {
      await acceptConnection(requestId)
      setRequests((prev) => prev.filter((r) => r.id !== requestId))
      onUpdate?.()
    } catch (error) {
      console.error('Error accepting:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (requestId: string) => {
    setActionLoading(requestId)
    try {
      await rejectConnection(requestId)
      setRequests((prev) => prev.filter((r) => r.id !== requestId))
      onUpdate?.()
    } catch (error) {
      console.error('Error rejecting:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleViewContact = async (userId: string, userName: string) => {
    setContactInfoModal({ open: true, userId, userName })
    setLoadingContact(true)
    try {
      const info = await getContactInfo(userId)
      setContactInfo(info)
    } catch (error) {
      console.error('Error getting contact info:', error)
    } finally {
      setLoadingContact(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Skeleton variant='circular' width={48} height={48} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant='text' width='60%' />
              <Skeleton variant='text' width='40%' />
            </Box>
          </Box>
        ))}
      </Paper>
    )
  }

  return (
    <>
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            bgcolor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0'
          }}
        >
          <Typography variant='h6' fontWeight={600}>
            Solicitudes de Conexión
            {requests.length > 0 && (
              <Chip
                label={requests.length}
                size='small'
                color='primary'
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
          <IconButton onClick={loadRequests} size='small'>
            <RefreshIcon />
          </IconButton>
        </Box>

        {error && (
          <Alert severity='error' sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        {requests.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
            <PersonIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
            <Typography>No tienes solicitudes pendientes</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {requests.map((request, index) => (
              <React.Fragment key={request.id}>
                <ListItem
                  sx={{
                    py: 2,
                    px: 3,
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        color='success'
                        onClick={() => handleAccept(request.id)}
                        disabled={actionLoading === request.id}
                        title='Aceptar conexión'
                      >
                        <AcceptIcon />
                      </IconButton>
                      <IconButton
                        color='error'
                        onClick={() => handleReject(request.id)}
                        disabled={actionLoading === request.id}
                        title='Rechazar'
                      >
                        <RejectIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      src={request.requester?.avatar_url}
                      sx={{
                        bgcolor: 'var(--color-cadetblue)',
                        cursor: 'pointer'
                      }}
                      onClick={() =>
                        navigate(
                          `/u/${
                            request.requester?.slug || request.requester?.id
                          }`
                        )
                      }
                    >
                      {request.requester?.first_name?.charAt(0) || 'U'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant='body1' fontWeight={500}>
                        {request.requester
                          ? `${request.requester.first_name} ${request.requester.last_name}`
                          : 'Usuario'}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        {request.event?.title && (
                          <Chip
                            icon={<EventIcon sx={{ fontSize: 14 }} />}
                            label={request.event.title}
                            size='small'
                            sx={{ mt: 0.5, mr: 1, fontSize: '0.7rem' }}
                          />
                        )}
                        {request.message && (
                          <Typography
                            variant='body2'
                            color='text.secondary'
                            sx={{ mt: 0.5, fontStyle: 'italic' }}
                          >
                            "{request.message}"
                          </Typography>
                        )}
                        <Typography variant='caption' color='text.disabled'>
                          {formatDate(request.created_at)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < requests.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Modal de información de contacto */}
      <Dialog
        open={contactInfoModal.open}
        onClose={() =>
          setContactInfoModal({ open: false, userId: '', userName: '' })
        }
        maxWidth='xs'
        fullWidth
      >
        <DialogTitle>Contactar con {contactInfoModal.userName}</DialogTitle>
        <DialogContent>
          {loadingContact ? (
            <Box sx={{ py: 2 }}>
              <Skeleton variant='text' width='80%' />
              <Skeleton variant='text' width='60%' />
            </Box>
          ) : contactInfo ? (
            <Box sx={{ py: 1 }}>
              {contactInfo.email && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant='caption' color='text.secondary'>
                    Email
                  </Typography>
                  <Typography variant='body1'>{contactInfo.email}</Typography>
                </Box>
              )}
              {contactInfo.discord && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant='caption' color='text.secondary'>
                    Discord
                  </Typography>
                  <Typography variant='body1'>
                    🎮 {contactInfo.discord}
                  </Typography>
                </Box>
              )}
              {contactInfo.telegram && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant='caption' color='text.secondary'>
                    Telegram
                  </Typography>
                  <Typography variant='body1'>
                    ✈️ {contactInfo.telegram}
                  </Typography>
                </Box>
              )}
              {!contactInfo.email &&
                !contactInfo.discord &&
                !contactInfo.telegram && (
                  <Alert severity='info'>
                    Este usuario no ha configurado datos de contacto
                  </Alert>
                )}
            </Box>
          ) : (
            <Alert severity='error'>
              Error al cargar información de contacto
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setContactInfoModal({ open: false, userId: '', userName: '' })
            }
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ConnectionRequestsManager
