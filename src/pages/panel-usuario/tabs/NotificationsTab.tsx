// src/pages/panel-usuario/tabs/NotificationsTab.tsx
// v0.5.0 - Refactorizado con useNotifications hook

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Container,
  Paper,
  Divider,
  FormGroup,
  FormControlLabel,
  Switch,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  Skeleton,
  Tabs,
  Tab,
  Badge,
  TextField,
  Autocomplete,
  Button as MuiButton
} from '@mui/material'
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  CheckCircle as ReadIcon,
  Circle as UnreadIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Business as OrgIcon,
  Refresh as RefreshIcon,
  MarkEmailRead as MarkAllReadIcon
} from '@mui/icons-material'
import { Button } from '../../../components/Button'
import { useNotifications } from '../../../hooks/useNotifications'
import {
  formatRelativeTime,
  Notification,
  NotificationPreferences
} from '../../../services/api/notifications.service'
import {
  getPendingRequests,
  acceptConnection,
  rejectConnection,
  ConnectionRequest
} from '../../../services/api/connections.service'
import { Check as AcceptIcon, Close as RejectIcon } from '@mui/icons-material'

// Lista de comunidades autónomas españolas
const SPANISH_REGIONS = [
  'Andalucía',
  'Aragón',
  'Asturias',
  'Baleares',
  'Canarias',
  'Cantabria',
  'Castilla-La Mancha',
  'Castilla y León',
  'Cataluña',
  'Comunidad Valenciana',
  'Extremadura',
  'Galicia',
  'La Rioja',
  'Madrid',
  'Murcia',
  'Navarra',
  'País Vasco'
]

export const NotificationsTab: React.FC = () => {
  const [subTab, setSubTab] = useState(0) // 0: Historial, 1: Configuración
  const [requests, setRequests] = useState<ConnectionRequest[]>([])

  // Usar el hook personalizado
  const {
    notifications,
    unreadCount,
    loading,
    preferences,
    loadingPreferences,
    refreshNotifications,
    markOneAsRead,
    markAllAsReadUser,
    updatePreferences
  } = useNotifications()

  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const [selectedRegions, setSelectedRegions] = useState<string[]>([])

  // Cargar solicitudes de conexión (específico de usuario)
  useEffect(() => {
    const loadRequests = async () => {
      try {
        const result = await getPendingRequests(1, 100)
        setRequests(result.data)
      } catch (error) {
        console.error('Error loading connection requests:', error)
      }
    }
    loadRequests()
  }, [])

  // Sincronizar regiones seleccionadas cuando carguen las preferencias
  useEffect(() => {
    if (preferences?.preferred_regions) {
      try {
        const regions = JSON.parse(preferences.preferred_regions)
        setSelectedRegions(regions)
      } catch {
        setSelectedRegions([])
      }
    }
  }, [preferences])

  const handleAcceptConnection = async (notification: Notification) => {
    const request = requests.find(
      (r) => r.requester?.id === notification.related_user_id
    )
    if (!request) return

    try {
      await acceptConnection(request.id)
      refreshNotifications() // Recargar notificaciones
      if (!notification.is_read) {
        markOneAsRead(notification.id)
      }
    } catch (error) {
      console.error('Error accepting connection:', error)
    }
  }

  const handleRejectConnection = async (notification: Notification) => {
    const request = requests.find(
      (r) => r.requester?.id === notification.related_user_id
    )
    if (!request) return

    try {
      await rejectConnection(request.id)
      refreshNotifications()
      if (!notification.is_read) {
        markOneAsRead(notification.id)
      }
    } catch (error) {
      console.error('Error rejecting connection:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'EVENT_CREATED':
      case 'EVENT_REMINDER':
        return <EventIcon />
      case 'CONNECTION_REQUEST':
      case 'CONNECTION_ACCEPTED':
        return <PersonIcon />
      case 'ORG_VERIFIED':
        return <OrgIcon />
      default:
        return <NotificationsIcon />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'EVENT_CREATED':
        return '#4fbac8'
      case 'CONNECTION_REQUEST':
        return '#f59e0b'
      case 'CONNECTION_ACCEPTED':
        return '#22c55e'
      default:
        return '#64748b'
    }
  }

  // Wrapper para actualizar preferencias booleanas
  const handleTogglePreference = async (key: keyof NotificationPreferences) => {
    if (!preferences) return
    // Force cast since we know these keys are boolean in the UI usage context
    const currentVal = preferences[key] as unknown as boolean
    try {
      await updatePreferences({ [key]: !currentVal })
    } catch (e) {
      // Error manejado en el hook
    }
  }

  const handleSaveRegions = async () => {
    try {
      await updatePreferences({
        preferred_regions: JSON.stringify(selectedRegions)
      })
      setSaveMessage({
        type: 'success',
        text: 'Regiones guardadas correctamente'
      })
    } catch (e) {
      setSaveMessage({
        type: 'error',
        text: 'Error al guardar regiones'
      })
    }
    setTimeout(() => setSaveMessage(null), 3000)
  }

  return (
    <Container maxWidth='md' sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <NotificationsIcon
            sx={{ fontSize: 28, color: 'var(--color-cadetblue)' }}
          />
          <Typography variant='h5' fontWeight={700}>
            Notificaciones
          </Typography>
          {unreadCount > 0 && (
            <Chip
              label={`${unreadCount} sin leer`}
              color='error'
              size='small'
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={refreshNotifications} title='Actualizar'>
            <RefreshIcon />
          </IconButton>
          {unreadCount > 0 && (
            <Button
              variant='secondary'
              startIcon={<MarkAllReadIcon />}
              onClick={markAllAsReadUser}
              size='small'
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Marcar todo
            </Button>
          )}
        </Box>
      </Box>

      {/* Sub-tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
        <Tabs
          value={subTab}
          onChange={(_, v) => setSubTab(v)}
          variant='fullWidth'
          sx={{
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 }
          }}
        >
          <Tab
            label={
              <Badge badgeContent={unreadCount} color='error' max={99}>
                <Box sx={{ pr: 2 }}>Historial</Box>
              </Badge>
            }
          />
          <Tab
            icon={<SettingsIcon />}
            iconPosition='start'
            label='Preferencias'
          />
        </Tabs>
      </Paper>

      {subTab === 0 ? (
        /* Historial de Notificaciones */
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ p: 2 }}>
              {[1, 2, 3, 4].map((i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Skeleton variant='circular' width={48} height={48} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant='text' width='60%' />
                    <Skeleton variant='text' width='40%' />
                  </Box>
                </Box>
              ))}
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
              <NotificationsIcon sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
              <Typography>No tienes notificaciones</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    disablePadding={false}
                    sx={{
                      py: 2,
                      px: { xs: 2, sm: 3 },
                      bgcolor: notification.is_read
                        ? 'transparent'
                        : 'action.hover',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.selected' },
                      transition: 'background-color 0.2s'
                    }}
                    onClick={() => {
                      if (
                        notification.type !== 'CONNECTION_REQUEST' &&
                        !notification.is_read
                      ) {
                        markOneAsRead(notification.id)
                      }
                    }}
                    secondaryAction={
                      <IconButton
                        size='small'
                        disabled={notification.is_read}
                        onClick={(e) => {
                          e.stopPropagation()
                          markOneAsRead(notification.id)
                        }}
                        edge='end'
                      >
                        {notification.is_read ? (
                          <ReadIcon color='success' />
                        ) : (
                          <UnreadIcon
                            sx={{ color: 'error.main', fontSize: 12 }}
                          />
                        )}
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: `${getNotificationColor(
                            notification.type
                          )}20`,
                          color: getNotificationColor(notification.type)
                        }}
                      >
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant='body1'
                          fontWeight={notification.is_read ? 400 : 700}
                          sx={{ pr: 4 }}
                        >
                          {notification.title}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: { xs: 'column', sm: 'row' },
                              justifyContent: 'space-between',
                              alignItems: { xs: 'flex-start', sm: 'center' },
                              gap: 0.5
                            }}
                          >
                            <Typography variant='body2' color='text.secondary'>
                              {notification.message}
                            </Typography>
                            <Typography
                              variant='caption'
                              color='text.disabled'
                              sx={{ whiteSpace: 'nowrap' }}
                            >
                              {formatRelativeTime(
                                notification.created_at || ''
                              )}
                            </Typography>
                          </Box>

                          {notification.type === 'CONNECTION_REQUEST' &&
                            !notification.is_read && (
                              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <MuiButton
                                  size='small'
                                  variant='contained'
                                  color='success'
                                  startIcon={<AcceptIcon />}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleAcceptConnection(notification)
                                  }}
                                  sx={{
                                    borderRadius: 4,
                                    textTransform: 'none',
                                    fontWeight: 700
                                  }}
                                >
                                  Aceptar
                                </MuiButton>
                                <MuiButton
                                  size='small'
                                  variant='outlined'
                                  color='error'
                                  startIcon={<RejectIcon />}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRejectConnection(notification)
                                  }}
                                  sx={{
                                    borderRadius: 4,
                                    textTransform: 'none',
                                    fontWeight: 700
                                  }}
                                >
                                  Rechazar
                                </MuiButton>
                              </Box>
                            )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      ) : (
        /* Configuración de Preferencias */
        <Paper sx={{ borderRadius: 2, p: { xs: 2, md: 4 } }}>
          {saveMessage && (
            <Alert severity={saveMessage.type} sx={{ mb: 3 }}>
              {saveMessage.text}
            </Alert>
          )}

          <Typography variant='h6' fontWeight={600} sx={{ mb: 3 }}>
            Preferencias de Notificaciones
          </Typography>

          {loadingPreferences ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Skeleton height={40} />
              <Skeleton height={40} />
              <Skeleton height={40} />
            </Box>
          ) : (
            preferences && (
              <FormGroup>
                {/* Canales */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant='subtitle2'
                    color='text.secondary'
                    sx={{ mb: 2 }}
                  >
                    Canales de Notificación
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.email_notifications}
                        onChange={() =>
                          handleTogglePreference('email_notifications')
                        }
                        color='primary'
                      />
                    }
                    label={
                      <Box>
                        <Typography variant='body1'>
                          Notificaciones por Email
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          Recibe correos sobre eventos y novedades
                        </Typography>
                      </Box>
                    }
                    sx={{
                      mb: 2.5,
                      alignItems: 'flex-start',
                      minHeight: 56,
                      display: 'flex',
                      width: '100%'
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.web_notifications}
                        onChange={() =>
                          handleTogglePreference('web_notifications')
                        }
                        color='primary'
                      />
                    }
                    label={
                      <Box>
                        <Typography variant='body1'>
                          Notificaciones Web
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          Recibe notificaciones en tu centro de notificaciones
                        </Typography>
                      </Box>
                    }
                    sx={{ alignItems: 'flex-start' }}
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Tipos */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant='subtitle2'
                    color='text.secondary'
                    sx={{ mb: 2 }}
                  >
                    Tipos de Notificaciones
                  </Typography>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.connection_requests}
                        onChange={() =>
                          handleTogglePreference('connection_requests')
                        }
                        color='primary'
                      />
                    }
                    label={
                      <Box>
                        <Typography variant='body1'>
                          Solicitudes de conexión
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          Cuando alguien quiera conectar contigo
                        </Typography>
                      </Box>
                    }
                    sx={{ mb: 2.5, alignItems: 'flex-start' }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.ticket_notifications}
                        onChange={() =>
                          handleTogglePreference('ticket_notifications')
                        }
                        color='primary'
                      />
                    }
                    label={
                      <Box>
                        <Typography variant='body1'>
                          Entradas compradas o gratuitas
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          Confirmaciones de inscripción a eventos
                        </Typography>
                      </Box>
                    }
                    sx={{ mb: 2.5, alignItems: 'flex-start' }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.followed_orgs_events}
                        onChange={() =>
                          handleTogglePreference('followed_orgs_events')
                        }
                        color='primary'
                      />
                    }
                    label={
                      <Box>
                        <Typography variant='body1'>
                          Nuevos eventos de organizaciones que sigo
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          Cuando una organización que sigues publique un evento
                        </Typography>
                      </Box>
                    }
                    sx={{ mb: 2.5, alignItems: 'flex-start' }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.event_reminders}
                        onChange={() =>
                          handleTogglePreference('event_reminders')
                        }
                        color='primary'
                      />
                    }
                    label={
                      <Box>
                        <Typography variant='body1'>
                          Recordatorios de eventos
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          3 días antes y el día del evento
                        </Typography>
                      </Box>
                    }
                    sx={{ alignItems: 'flex-start' }}
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Regiones */}
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2
                    }}
                  >
                    <Typography variant='subtitle2' color='text.secondary'>
                      Regiones de Interés
                    </Typography>
                    <Switch
                      checked={preferences.new_events_in_regions}
                      onChange={() =>
                        handleTogglePreference('new_events_in_regions')
                      }
                      size='small'
                    />
                  </Box>

                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mb: 2 }}
                  >
                    Selecciona las comunidades autónomas de las que quieres
                    recibir notificaciones de eventos nuevos.
                  </Typography>

                  <Autocomplete
                    multiple
                    options={SPANISH_REGIONS}
                    value={selectedRegions}
                    onChange={(_, newValue) => setSelectedRegions(newValue)}
                    disabled={!preferences.new_events_in_regions}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={
                          preferences.new_events_in_regions
                            ? 'Selecciona regiones...'
                            : 'Activa la opción para seleccionar'
                        }
                        variant='outlined'
                      />
                    )}
                    ChipProps={{ size: 'small' }}
                    sx={{ width: '100%' }}
                  />
                </Box>
              </FormGroup>
            )
          )}

          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Button variant='primary' onClick={handleSaveRegions}>
              Guardar Regiones
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  )
}
