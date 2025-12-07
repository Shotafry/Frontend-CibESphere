import React from 'react'
import {
  Menu,
  MenuItem,
  Typography,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Button
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import WarningIcon from '@mui/icons-material/Warning'
import ErrorIcon from '@mui/icons-material/Error'
import { Notification } from '../types'
import { useNavigate } from 'react-router-dom'
import { markNotificationAsRead } from '../services/apiService'

interface NotificationMenuProps {
  anchorEl: null | HTMLElement
  open: boolean
  onClose: () => void
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
}

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <CheckCircleIcon color='success' />
    case 'warning':
      return <WarningIcon color='warning' />
    case 'error':
      return <ErrorIcon color='error' />
    default:
      return <InfoIcon color='info' />
  }
}

export const NotificationMenu: React.FC<NotificationMenuProps> = ({
  anchorEl,
  open,
  onClose,
  notifications,
  onMarkAsRead
}) => {
  const navigate = useNavigate()

  const handleItemClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markNotificationAsRead(notification.id)
      onMarkAsRead(notification.id)
    }
    if (notification.link) {
      navigate(notification.link)
      onClose()
    }
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          elevation: 4,
          sx: {
            width: 360,
            maxHeight: 480,
            borderRadius: '16px',
            mt: 1.5,
            overflow: 'hidden'
          }
        }
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid #F1F5F9' }}>
        <Typography variant='subtitle1' fontWeight='bold'>
          Notificaciones
        </Typography>
      </Box>
      <List sx={{ p: 0 }}>
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <React.Fragment key={notif.id}>
              <ListItem
                alignItems='flex-start'
                sx={{
                  bgcolor: notif.is_read ? 'transparent' : '#F8FAFC',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#F1F5F9' },
                  transition: 'background 0.2s'
                }}
                onClick={() => handleItemClick(notif)}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'transparent' }}>
                    {getIcon(notif.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant='subtitle2'
                      fontWeight={notif.is_read ? 'normal' : 'bold'}
                      color={notif.is_read ? 'text.secondary' : 'text.primary'}
                    >
                      {notif.title}
                    </Typography>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        component='span'
                        variant='body2'
                        color='text.primary'
                        sx={{
                          display: 'block',
                          fontSize: '0.85rem',
                          my: 0.5
                        }}
                      >
                        {notif.message}
                      </Typography>
                      <Typography
                        component='span'
                        variant='caption'
                        color='text.secondary'
                      >
                        {new Date(notif.date).toLocaleDateString()}
                      </Typography>
                    </React.Fragment>
                  }
                />
                {!notif.is_read && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      mt: 1.5,
                      ml: 1
                    }}
                  />
                )}
              </ListItem>
              <Divider component='li' />
            </React.Fragment>
          ))
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <NotificationsIcon
              sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }}
            />
            <Typography variant='body2' color='text.secondary'>
              No tienes notificaciones
            </Typography>
          </Box>
        )}
      </List>
      <Box sx={{ p: 1.5, borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
        <Button size='small' onClick={onClose}>
          Cerrar
        </Button>
      </Box>
    </Menu>
  )
}
