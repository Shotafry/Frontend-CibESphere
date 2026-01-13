// src/components/MobileMenu.tsx
import React from 'react'
import {
  Box,
  Drawer,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  IconButton
} from '@mui/material'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close'
import HomeIcon from '@mui/icons-material/Home'
import DashboardIcon from '@mui/icons-material/Dashboard'
import NotificationsIcon from '@mui/icons-material/Notifications'
import LogoutIcon from '@mui/icons-material/Logout'
import LoginIcon from '@mui/icons-material/Login'
import InfoIcon from '@mui/icons-material/Info'
import ContactMailIcon from '@mui/icons-material/ContactMail'
import GavelIcon from '@mui/icons-material/Gavel'
import CookieIcon from '@mui/icons-material/Cookie'
import PersonIcon from '@mui/icons-material/Person'
import { useAuth } from '../context/AuthContext'
import { Role, Notification } from '../types'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  notifications: Notification[]
  unreadCount: number
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  open,
  onClose,
  notifications,
  unreadCount
}) => {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  const handleNavigation = (path: string) => {
    navigate(path)
    onClose()
  }

  const handleLogout = () => {
    logout()
    onClose()
    navigate('/')
  }

  const getPanelPath = () => {
    if (user?.role === Role.Admin) return '/admin'
    if (user?.role === Role.Organizer) return '/panel-de-organizador'
    return '/panel-de-usuario'
  }

  const getPanelLabel = () => {
    if (user?.role === Role.Admin) return 'Panel Admin'
    if (user?.role === Role.Organizer) return 'Panel Organizador'
    return 'Mi Panel'
  }

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '85%',
          maxWidth: 320,
          bgcolor: '#FAFBFC',
          borderTopLeftRadius: 24,
          borderBottomLeftRadius: 24
        }
      }}
    >
      {/* Header del Drawer */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          background: 'var(--gradient-header-footer)',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <img
            src='/Logo-Icon.png'
            alt='CybESphere'
            style={{ height: 36, width: 36, objectFit: 'contain' }}
          />
          <Typography variant='h6' fontWeight='bold'>
            Menú
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* User Info (si autenticado) */}
      {isAuthenticated && user && (
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: 'white',
            borderBottom: '1px solid #E2E8F0'
          }}
        >
          <Avatar
            src={user.avatar_url}
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'var(--color-cadetblue)',
              fontSize: '1.25rem'
            }}
          >
            {user.first_name?.[0]}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              fontWeight='bold'
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {user.first_name} {user.last_name}
            </Typography>
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {user.email}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Navigation List */}
      <List sx={{ flex: 1, pt: 1 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/')}>
            <ListItemIcon>
              <HomeIcon sx={{ color: 'var(--color-cadetblue)' }} />
            </ListItemIcon>
            <ListItemText primary='Inicio' />
          </ListItemButton>
        </ListItem>

        {isAuthenticated && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigation(getPanelPath())}>
                <ListItemIcon>
                  <DashboardIcon sx={{ color: 'var(--color-cadetblue)' }} />
                </ListItemIcon>
                <ListItemText primary={getPanelLabel()} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(`/u/${user?.slug || user?.id}`)}
              >
                <ListItemIcon>
                  <PersonIcon sx={{ color: 'var(--color-cadetblue)' }} />
                </ListItemIcon>
                <ListItemText primary='Ver mi Perfil' />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(`/panel-de-usuario?tab=3`)}
              >
                <ListItemIcon>
                  <Badge badgeContent={unreadCount} color='error'>
                    <NotificationsIcon
                      sx={{ color: 'var(--color-cadetblue)' }}
                    />
                  </Badge>
                </ListItemIcon>
                <ListItemText
                  primary='Notificaciones'
                  secondary={
                    unreadCount > 0 ? `${unreadCount} sin leer` : undefined
                  }
                />
              </ListItemButton>
            </ListItem>
          </>
        )}

        <Divider sx={{ my: 2 }} />

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/sobre-nosotros')}>
            <ListItemIcon>
              <InfoIcon sx={{ color: 'var(--Gray-500)' }} />
            </ListItemIcon>
            <ListItemText primary='Sobre Nosotros' />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/contacto')}>
            <ListItemIcon>
              <ContactMailIcon sx={{ color: 'var(--Gray-500)' }} />
            </ListItemIcon>
            <ListItemText primary='Contacto' />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant='caption'
          color='text.secondary'
          sx={{ px: 2, py: 1, display: 'block' }}
        >
          Legal
        </Typography>

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/terminos')}>
            <ListItemIcon>
              <GavelIcon sx={{ color: 'var(--Gray-400)' }} />
            </ListItemIcon>
            <ListItemText
              primary='Términos y Condiciones'
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/cookies')}>
            <ListItemIcon>
              <CookieIcon sx={{ color: 'var(--Gray-400)' }} />
            </ListItemIcon>
            <ListItemText
              primary='Política de Cookies'
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItemButton>
        </ListItem>
      </List>

      {/* Footer con Login/Logout */}
      <Box sx={{ p: 2, borderTop: '1px solid #E2E8F0' }}>
        {isAuthenticated ? (
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              bgcolor: 'rgba(220, 53, 69, 0.08)',
              '&:hover': { bgcolor: 'rgba(220, 53, 69, 0.15)' }
            }}
          >
            <ListItemIcon>
              <LogoutIcon sx={{ color: '#DC3545' }} />
            </ListItemIcon>
            <ListItemText
              primary='Cerrar Sesión'
              primaryTypographyProps={{ color: '#DC3545', fontWeight: 500 }}
            />
          </ListItemButton>
        ) : (
          <ListItemButton
            onClick={() => handleNavigation('/loginsign-up')}
            sx={{
              borderRadius: 2,
              background: 'var(--gradient-button-primary)',
              color: 'white',
              '&:hover': { opacity: 0.9 }
            }}
          >
            <ListItemIcon>
              <LoginIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText
              primary='Iniciar Sesión / Registrarse'
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItemButton>
        )}
      </Box>
    </Drawer>
  )
}
