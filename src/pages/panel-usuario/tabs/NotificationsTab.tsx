// src/pages/panel-usuario/tabs/NotificationsTab.tsx
// v0.4.0 - Tab de notificaciones para usuario con historial, configuración y preferencias de región

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
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  formatRelativeTime,
  getNotificationIcon,
  getNotificationColor,
  Notification,
  getNotificationPreferences,
  saveNotificationPreferences
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
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [requests, setRequests] = useState<ConnectionRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  // Preferencias - Solo Email y Web (sin Push)
  const [preferences, setPreferences] = useState({
    // Canales
    emailEnabled: true,
    webEnabled: true,
    // Tipos de notificaciones
    connectionRequests: true,
    ticketNotifications: true,
    newEventsInRegions: true,
    followedOrgsEvents: true,
    eventReminders: true
  })
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])

  // Cargar notificaciones
  const loadNotifications = async () => {
    setLoading(true)
    try {
      const [result, count, requestsResult] = await Promise.all([
        getNotifications(1, 50),
        getUnreadCount(),
        getPendingRequests(1, 100)
      ])
      setNotifications(result.data)
      setUnreadCount(count)
      setRequests(requestsResult.data)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
    // Cargar preferencias desde API
    getNotificationPreferences().then((prefs) => {
      setPreferences({
        emailEnabled: prefs.email_notifications,
        webEnabled: prefs.web_notifications,
        connectionRequests: prefs.connection_requests,
        ticketNotifications: prefs.ticket_notifications,
        newEventsInRegions: prefs.new_events_in_regions,
        followedOrgsEvents: prefs.followed_orgs_events,
        eventReminders: prefs.event_reminders
      })
      try {
        const regions = JSON.parse(prefs.preferred_regions || '[]')
        setSelectedRegions(regions)
      } catch {
        setSelectedRegions([])
      }
    })
  }, [])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId)
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const handleAcceptConnection = async (notification: Notification) => {
    const request = requests.find(
      (r) => r.requester?.id === notification.related_user_id
    )
    if (!request) return

    try {
      await acceptConnection(request.id)
      loadNotifications() // Recargar
      if (!notification.is_read) {
        markAsRead(notification.id)
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
      loadNotifications()
      if (!notification.is_read) {
        markAsRead(notification.id)
      }
    } catch (error) {
      console.error('Error rejecting connection:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all as read:', error)
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

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSavePreferences = async () => {
    try {
      await saveNotificationPreferences({
        email_notifications: preferences.emailEnabled,
        web_notifications: preferences.webEnabled,
        connection_requests: preferences.connectionRequests,
        ticket_notifications: preferences.ticketNotifications,
        new_events_in_regions: preferences.newEventsInRegions,
        followed_orgs_events: preferences.followedOrgsEvents,
        event_reminders: preferences.eventReminders,
        preferred_regions: JSON.stringify(selectedRegions)
      })
      setSaveMessage({
        type: 'success',
        text: 'Preferencias guardadas correctamente'
      })
    } catch (e) {
      console.error('Error saving preferences:', e)
      setSaveMessage({
        type: 'error',
        text: 'Error al guardar preferencias'
      })
    }
    setTimeout(() => setSaveMessage(null), 3000)
  }

  return (
    <Container maxWidth='md'>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
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
          <IconButton onClick={loadNotifications} title='Actualizar'>
            <RefreshIcon />
          </IconButton>
          {unreadCount > 0 && (
            <Button
              variant='secondary'
              startIcon={<MarkAllReadIcon />}
              onClick={handleMarkAllAsRead}
              size='small'
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
                    sx={{
                      py: 2,
                      px: 3,
                      bgcolor: notification.is_read
                        ? 'transparent'
                        : 'action.hover',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.selected' }
                    }}
                    onClick={() => {
                      // Para solicitudes de conexión, no marcar como leída automáticamente
                      // El usuario debe usar los botones Aceptar/Rechazar
                      if (
                        notification.type !== 'CONNECTION_REQUEST' &&
                        !notification.is_read
                      ) {
                        handleMarkAsRead(notification.id)
                      }
                    }}
                    secondaryAction={
                      <IconButton
                        size='small'
                        disabled={notification.is_read}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMarkAsRead(notification.id)
                        }}
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
                          fontWeight={notification.is_read ? 400 : 600}
                        >
                          {notification.title}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <Typography variant='body2' color='text.secondary'>
                              {notification.message}
                            </Typography>
                            <Typography
                              variant='caption'
                              color='text.disabled'
                              sx={{ ml: 2, whiteSpace: 'nowrap' }}
                            >
                              {formatRelativeTime(
                                notification.created_at || ''
                              )}
                            </Typography>
                          </Box>

                          {/* Botones de acción para solicitudes de conexión */}
                          {notification.type === 'CONNECTION_REQUEST' &&
                            !notification.is_read && (
                              <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
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
                                    textTransform: 'none'
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
                                    textTransform: 'none'
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
        <Paper sx={{ borderRadius: 2, p: 4 }}>
          {saveMessage && (
            <Alert severity={saveMessage.type} sx={{ mb: 3 }}>
              {saveMessage.text}
            </Alert>
          )}

          <Typography variant='h6' fontWeight={600} sx={{ mb: 3 }}>
            Preferencias de Notificaciones
          </Typography>

          <FormGroup>
            {/* Tipo de notificaciones */}
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
                    checked={preferences.emailEnabled}
                    onChange={() => handlePreferenceChange('emailEnabled')}
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
                    checked={preferences.webEnabled}
                    onChange={() => handlePreferenceChange('webEnabled')}
                    color='primary'
                  />
                }
                label={
                  <Box>
                    <Typography variant='body1'>Notificaciones Web</Typography>
                    <Typography variant='caption' color='text.secondary'>
                      Recibe notificaciones en tu centro de notificaciones
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: 'flex-start' }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Tipos de Notificaciones */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant='subtitle2'
                color='text.secondary'
                sx={{ mb: 2 }}
              >
                Tipos de Notificaciones
              </Typography>

              {/* Conexiones */}
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.connectionRequests}
                    onChange={() =>
                      handlePreferenceChange('connectionRequests')
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
                sx={{
                  mb: 2.5,
                  alignItems: 'flex-start',
                  minHeight: 56,
                  display: 'flex',
                  width: '100%'
                }}
              />

              {/* Entradas */}
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.ticketNotifications}
                    onChange={() =>
                      handlePreferenceChange('ticketNotifications')
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
                sx={{
                  mb: 2.5,
                  alignItems: 'flex-start',
                  minHeight: 56,
                  display: 'flex',
                  width: '100%'
                }}
              />

              {/* Eventos de orgs seguidas */}
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.followedOrgsEvents}
                    onChange={() =>
                      handlePreferenceChange('followedOrgsEvents')
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
                sx={{
                  mb: 2.5,
                  alignItems: 'flex-start',
                  minHeight: 56,
                  display: 'flex',
                  width: '100%'
                }}
              />

              {/* Eventos en regiones */}
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.newEventsInRegions}
                    onChange={() =>
                      handlePreferenceChange('newEventsInRegions')
                    }
                    color='primary'
                  />
                }
                label={
                  <Box>
                    <Typography variant='body1'>
                      Eventos en mis regiones de interés
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      Eventos nuevos en las comunidades que selecciones
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

              {/* Recordatorios */}
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.eventReminders}
                    onChange={() => handlePreferenceChange('eventReminders')}
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

            {/* Regiones preferidas */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant='subtitle2'
                color='text.secondary'
                sx={{ mb: 2 }}
              >
                Regiones de Interés
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                Selecciona las comunidades autónomas de las que quieres recibir
                notificaciones de eventos
              </Typography>
              <Autocomplete
                multiple
                options={SPANISH_REGIONS}
                value={selectedRegions}
                onChange={(_, newValue) => setSelectedRegions(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder='Selecciona regiones...'
                    variant='outlined'
                  />
                )}
                ChipProps={{ size: 'small' }}
              />
            </Box>
          </FormGroup>

          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Button variant='primary' onClick={handleSavePreferences}>
              Guardar Preferencias
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  )
}
