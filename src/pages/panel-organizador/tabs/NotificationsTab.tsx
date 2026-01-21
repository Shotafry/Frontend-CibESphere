// src/pages/panel-organizador/tabs/NotificationsTab.tsx
// v0.4.0 - Tab de notificaciones para organizador con historial y configuración

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
  Divider,
  Switch,
  FormControlLabel,
  FormGroup,
  Skeleton,
  Tabs,
  Tab,
  Badge
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
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  formatRelativeTime,
  Notification,
  getNotificationPreferences,
  saveNotificationPreferences
} from '../../../services/api/notifications.service'

interface NotificationsTabProps {
  organizationId?: string
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({
  organizationId
}) => {
  const [subTab, setSubTab] = useState(0) // 0: Historial, 1: Configuración
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  // Configuración de preferencias - Solo Email y Web (sin Push)
  const [preferences, setPreferences] = useState({
    // Canales
    emailEnabled: true,
    webEnabled: true,
    // Tipos de notificaciones
    emailOnSale: true,
    emailNewFollowers: true,
    emailDailyDigest: false,
    emailEventReminder: true
  })

  // Cargar notificaciones
  const loadNotifications = async () => {
    setLoading(true)
    try {
      const [result, count] = await Promise.all([
        getNotifications(1, 50),
        getUnreadCount()
      ])
      setNotifications(result.data)
      setUnreadCount(count)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
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
        ticket_sales: preferences.emailOnSale,
        new_followers: preferences.emailNewFollowers,
        daily_summary: preferences.emailDailyDigest,
        event_reminders: preferences.emailEventReminder
      })
      alert('Preferencias guardadas correctamente')
    } catch (e) {
      console.error('Error saving preferences:', e)
      alert('Error al guardar preferencias')
    }
  }

  // Cargar preferencias al montar
  useEffect(() => {
    getNotificationPreferences().then((prefs) => {
      setPreferences({
        emailEnabled: prefs.email_notifications,
        webEnabled: prefs.web_notifications,
        emailOnSale: prefs.ticket_sales,
        emailNewFollowers: prefs.new_followers,
        emailDailyDigest: prefs.daily_summary,
        emailEventReminder: prefs.event_reminders
      })
    })
  }, [])

  return (
    <Box>
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
                    sx={{
                      py: 2,
                      px: 3,
                      bgcolor: notification.is_read
                        ? 'transparent'
                        : 'action.hover',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.selected' }
                    }}
                    onClick={() =>
                      !notification.is_read && handleMarkAsRead(notification.id)
                    }
                    secondaryAction={
                      <IconButton
                        size='small'
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMarkAsRead(notification.id)
                        }}
                        disabled={notification.is_read}
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
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 0.5
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
        <Paper sx={{ borderRadius: 2, p: 3 }}>
          <Typography variant='h6' fontWeight={600} sx={{ mb: 3 }}>
            Preferencias de Notificaciones
          </Typography>

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
                    checked={preferences.emailOnSale}
                    onChange={() => handlePreferenceChange('emailOnSale')}
                    color='primary'
                  />
                }
                label={
                  <Box>
                    <Typography variant='body1'>Venta de entrada</Typography>
                    <Typography variant='caption' color='text.secondary'>
                      Recibe un email cada vez que alguien compre una entrada
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
                    checked={preferences.emailNewFollowers}
                    onChange={() => handlePreferenceChange('emailNewFollowers')}
                    color='primary'
                  />
                }
                label={
                  <Box>
                    <Typography variant='body1'>Nuevos seguidores</Typography>
                    <Typography variant='caption' color='text.secondary'>
                      Recibe un email cuando un usuario siga tu organización
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
                    checked={preferences.emailDailyDigest}
                    onChange={() => handlePreferenceChange('emailDailyDigest')}
                    color='primary'
                  />
                }
                label={
                  <Box>
                    <Typography variant='body1'>Resumen diario</Typography>
                    <Typography variant='caption' color='text.secondary'>
                      Recibe un resumen diario de actividad en lugar de emails
                      individuales
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
                    checked={preferences.emailEventReminder}
                    onChange={() =>
                      handlePreferenceChange('emailEventReminder')
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
                    checked={preferences.webEnabled}
                    onChange={() => handlePreferenceChange('webEnabled')}
                    color='primary'
                  />
                }
                label={
                  <Box>
                    <Typography variant='body1'>Notificaciones web</Typography>
                    <Typography variant='caption' color='text.secondary'>
                      Recibe notificaciones en tu centro de notificaciones
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: 'flex-start' }}
              />
            </Box>
          </FormGroup>

          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Button variant='primary'>Guardar preferencias</Button>
          </Box>
        </Paper>
      )}
    </Box>
  )
}

export default NotificationsTab
