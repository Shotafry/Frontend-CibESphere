// src/pages/panel-organizador/tabs/NotificationsTab.tsx
// v0.5.0 - Refactorizado con useNotifications hook

import React, { useState } from 'react'
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
  Divider,
  Switch,
  FormControlLabel,
  FormGroup,
  Skeleton,
  Tabs,
  Tab,
  Badge,
  Alert
} from '@mui/material'
import { Button } from '../../../components/Button'
import {
  Notifications as NotificationsIcon,
  CheckCircle as ReadIcon,
  Circle as UnreadIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  MarkEmailRead as MarkAllReadIcon
} from '@mui/icons-material'
import { useNotifications } from '../../../hooks/useNotifications'
import {
  formatRelativeTime,
  NotificationPreferences
} from '../../../services/api/notifications.service'

interface NotificationsTabProps {
  organizationId?: string
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({
  organizationId
}) => {
  const [subTab, setSubTab] = useState(0) // 0: Historial, 1: Configuración

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

  const handleMarkAllAsRead = async () => {
    await markAllAsReadUser()
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'TICKET_PURCHASED':
        return <PaymentIcon />
      case 'EVENT_CREATED':
      case 'EVENT_REMINDER':
        return <EventIcon />
      case 'CONNECTION_REQUEST':
      case 'CONNECTION_ACCEPTED':
        return <PersonIcon />
      default:
        return <NotificationsIcon />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'TICKET_PURCHASED':
        return '#22c55e'
      case 'EVENT_CREATED':
        return '#4fbac8'
      case 'CONNECTION_REQUEST':
        return '#f59e0b'
      default:
        return '#64748b'
    }
  }

  const handleTogglePreference = async (key: keyof NotificationPreferences) => {
    if (!preferences) return
    const currentVal = preferences[key] as unknown as boolean
    try {
      await updatePreferences({ [key]: !currentVal })
      setSaveMessage({ type: 'success', text: 'Preferencia actualizada' })
    } catch (e) {
      setSaveMessage({ type: 'error', text: 'Error al actualizar preferencia' })
    }
    setTimeout(() => setSaveMessage(null), 2000)
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 1, sm: 2 } }}>
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
              startIcon={<MarkAllReadIcon />}
              onClick={handleMarkAllAsRead}
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
            label='Configuración'
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {subTab === 0 ? (
        /* Historial de Notificaciones */
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ p: 2 }}>
              {[1, 2, 3, 4, 5].map((i) => (
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
            <Box
              sx={{
                py: 6,
                textAlign: 'center',
                color: 'text.secondary'
              }}
            >
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
                    onClick={() =>
                      !notification.is_read && markOneAsRead(notification.id)
                    }
                    secondaryAction={
                      <IconButton
                        size='small'
                        onClick={(e) => {
                          e.stopPropagation()
                          markOneAsRead(notification.id)
                        }}
                        disabled={notification.is_read}
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
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            mt: 0.5,
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
                            {formatRelativeTime(notification.created_at || '')}
                          </Typography>
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
        <Paper sx={{ borderRadius: 2, p: { xs: 2, md: 3 } }}>
          <Typography variant='h6' fontWeight={600} sx={{ mb: 3 }}>
            Preferencias de Notificaciones
          </Typography>

          {saveMessage && (
            <Alert severity={saveMessage.type} sx={{ mb: 2 }}>
              {saveMessage.text}
            </Alert>
          )}

          {loadingPreferences ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Skeleton height={40} />
              <Skeleton height={40} />
              <Skeleton height={40} />
            </Box>
          ) : (
            preferences && (
              <FormGroup>
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant='subtitle2'
                    color='text.secondary'
                    sx={{ mb: 2 }}
                  >
                    Notificaciones por Email
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.ticket_sales}
                        onChange={() => handleTogglePreference('ticket_sales')}
                        color='primary'
                      />
                    }
                    label={
                      <Box>
                        <Typography variant='body1'>
                          Venta de entrada
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          Recibe un email cada vez que alguien compre una
                          entrada
                        </Typography>
                      </Box>
                    }
                    sx={{
                      mb: 2.5,
                      alignItems: 'flex-start',
                      display: 'flex',
                      width: '100%'
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.new_followers}
                        onChange={() => handleTogglePreference('new_followers')}
                        color='primary'
                      />
                    }
                    label={
                      <Box>
                        <Typography variant='body1'>
                          Nuevos seguidores
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          Recibe un email cuando un usuario siga tu organización
                        </Typography>
                      </Box>
                    }
                    sx={{
                      mb: 2.5,
                      alignItems: 'flex-start',
                      display: 'flex',
                      width: '100%'
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.daily_summary}
                        onChange={() => handleTogglePreference('daily_summary')}
                        color='primary'
                      />
                    }
                    label={
                      <Box>
                        <Typography variant='body1'>Resumen diario</Typography>
                        <Typography variant='caption' color='text.secondary'>
                          Recibe un resumen diario de actividad en lugar de
                          emails individuales
                        </Typography>
                      </Box>
                    }
                    sx={{
                      mb: 2.5,
                      alignItems: 'flex-start',
                      display: 'flex',
                      width: '100%'
                    }}
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
                          Recordatorios de evento
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          Recibe recordatorios antes de que empiecen tus eventos
                        </Typography>
                      </Box>
                    }
                    sx={{ alignItems: 'flex-start' }}
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box>
                  <Typography
                    variant='subtitle2'
                    color='text.secondary'
                    sx={{ mb: 2 }}
                  >
                    Notificaciones Web
                  </Typography>
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
                          Notificaciones web
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          Recibe notificaciones en tu centro de notificaciones
                        </Typography>
                      </Box>
                    }
                    sx={{ alignItems: 'flex-start' }}
                  />
                </Box>
              </FormGroup>
            )
          )}

          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Button variant='primary' disabled>
              Guardado Automático
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  )
}

export default NotificationsTab
