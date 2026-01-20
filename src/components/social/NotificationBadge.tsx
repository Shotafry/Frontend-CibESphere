// src/components/social/NotificationBadge.tsx
// v0.4.0 - Badge de notificaciones con contador

import { useState, useEffect } from 'react'
import {
  IconButton,
  Badge,
  Menu,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Skeleton,
  Tooltip
} from '@mui/material'
import { Button } from '../Button'
import {
  Notifications as NotificationsIcon,
  MarkEmailRead as MarkReadIcon,
  NotificationsOff as NoNotificationsIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  getNotificationIcon,
  formatRelativeTime,
  Notification
} from '../../services/api/notifications.service'

interface NotificationBadgeProps {
  showPreview?: boolean
  maxPreviewItems?: number
}

export const NotificationBadge = ({
  showPreview = true,
  maxPreviewItems = 5
}: NotificationBadgeProps) => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar contador de no leídas
  useEffect(() => {
    const loadUnreadCount = async () => {
      if (!isAuthenticated) return

      try {
        const count = await getUnreadCount()
        setUnreadCount(count)
      } catch (error) {
        console.error('Error loading unread count:', error)
      }
    }

    loadUnreadCount()
    // Refrescar cada 30 segundos
    const interval = setInterval(loadUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [isAuthenticated])

  // Cargar notificaciones al abrir menú
  const handleOpen = async (event: React.MouseEvent<HTMLElement>) => {
    if (!isAuthenticated) return

    setAnchorEl(event.currentTarget)
    setLoading(true)

    try {
      const result = await getNotifications(1, maxPreviewItems)
      setNotifications(result.data)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationClick = async (notification: Notification) => {
    // Marcar como leída
    if (!notification.is_read) {
      await markAsRead(notification.id)
      setUnreadCount((prev) => Math.max(0, prev - 1))
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n
        )
      )
    }

    // Navegar si hay action_url
    if (notification.action_url) {
      navigate(notification.action_url)
    }
    handleClose()
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead()
      setUnreadCount(0)
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const handleViewAll = () => {
    navigate('/panel-de-usuario?tab=4') // Tab de notificaciones (índice 4, pestaña 5)
    handleClose()
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Tooltip title='Notificaciones'>
        <IconButton
          onClick={handleOpen}
          size='large'
          sx={{
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' }
          }}
        >
          <Badge
            badgeContent={unreadCount}
            color='error'
            max={99}
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.7rem',
                height: 18,
                minWidth: 18
              }
            }}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              maxHeight: 480,
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Typography variant='subtitle1' fontWeight={600}>
            Notificaciones
          </Typography>
          {unreadCount > 0 && (
            <Button
              size='small'
              variant='secondary'
              startIcon={<MarkReadIcon />}
              onClick={handleMarkAllRead}
            >
              Marcar todo
            </Button>
          )}
        </Box>

        {/* Lista de notificaciones */}
        {loading ? (
          <Box sx={{ p: 2 }}>
            {[1, 2, 3].map((i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Skeleton variant='circular' width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant='text' width='80%' />
                  <Skeleton variant='text' width='60%' />
                </Box>
              </Box>
            ))}
          </Box>
        ) : notifications.length === 0 ? (
          <Box
            sx={{
              py: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'text.secondary'
            }}
          >
            <NoNotificationsIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
            <Typography>Sin notificaciones</Typography>
          </Box>
        ) : (
          <List sx={{ py: 0 }}>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  cursor: 'pointer',
                  bgcolor: notification.is_read
                    ? 'transparent'
                    : 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' }
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: notification.is_read
                        ? 'grey.200'
                        : 'primary.light',
                      fontSize: '1.2rem'
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant='body2'
                      fontWeight={notification.is_read ? 400 : 600}
                    >
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant='caption' color='text.secondary'>
                      {formatRelativeTime(notification.created_at)}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

        {/* Footer */}
        <Divider />
        <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
          <Button variant='primary' size='small' onClick={handleViewAll}>
            Ver todas las notificaciones
          </Button>
        </Box>
      </Menu>
    </>
  )
}

export default NotificationBadge
