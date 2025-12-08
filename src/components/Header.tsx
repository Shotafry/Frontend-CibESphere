// src/components/Header.tsx
import { FunctionComponent, useCallback, useState, useEffect } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  IconButton,
  Badge
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Role, Notification } from '../types'
import { getNotifications } from '../services/apiService'
import { NotificationMenu } from './NotificationMenu'

export const Header: FunctionComponent = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, logout, isLoading } = useAuth()

  const [isScrolled, setIsScrolled] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isLandingPage = location.pathname === '/'
  const openNotifications = Boolean(anchorEl)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    if (isLandingPage) {
      window.addEventListener('scroll', handleScroll)
      handleScroll()
    } else {
      // Si no es la landing, el header es blanco por defecto
      setIsScrolled(true)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isLandingPage, location.pathname])

  useEffect(() => {
    if (isAuthenticated && user) {
      getNotifications(user.id).then((data) => {
        setNotifications(data)
        setUnreadCount(data.filter((n) => !n.is_read).length)
      })
    }
  }, [isAuthenticated, user])

  const handleOpenNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseNotifications = () => {
    setAnchorEl(null)
  }

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  // --- LÓGICA ORIGINAL RESTAURADA ---
  // Vuelve a ser 'transparent' o 'var(--White)'
  const headerBackground =
    !isLandingPage || isScrolled ? 'var(--White)' : 'transparent'
  const headerShadow =
    !isLandingPage || isScrolled ? 'var(--shadow-header)' : 'none'

  // Color oscuro para que se lea sobre el fondo claro del Hero
  const textColor = 'var(--Gray-700)'
  const buttonColor = 'var(--gradient-button-primary)'
  const buttonBorderColor = 'var(--color-cadetblue)'

  const onLogoClick = useCallback(() => {
    navigate('/')
  }, [navigate])

  const onLoginClick = useCallback(() => {
    navigate('/loginsign-up')
  }, [navigate])

  const onPanelClick = useCallback(() => {
    if (user?.role === Role.Organizer || user?.role === Role.Admin) {
      navigate('/panel-de-organizador')
    } else {
      navigate('/panel-de-usuario')
    }
  }, [navigate, user])

  return (
    <Box
      component='header'
      sx={{
        width: '100%',
        backgroundColor: headerBackground, // Fondo dinámico (blanco o trans)
        boxShadow: headerShadow, // Sombra dinámica
        position: 'fixed',
        top: 0,
        zIndex: 1100,
        display: 'flex',
        justifyContent: 'center',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease' // Transición simple
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1440,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: { xs: '10px 8px', sm: '12px 16px', md: '16px 32px' },
          boxSizing: 'border-box',
          gap: { xs: 1, sm: 2 }

        }}
      >
        <img
          style={{
            height: '36px',
            width: '120px',
            objectFit: 'contain',
            cursor: 'pointer'
          }}
          alt='CibESphere Logo'
          src='/cyberLogo-1@2x.png' // <-- Tu logo
          onClick={onLogoClick}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : isAuthenticated ? (
            <>
              <IconButton onClick={handleOpenNotifications} sx={{ mr: 1 }}>
                <Badge badgeContent={unreadCount} color='error'>
                  <NotificationsIcon sx={{ color: textColor }} />
                </Badge>
              </IconButton>
              <NotificationMenu
                anchorEl={anchorEl}
                open={openNotifications}
                onClose={handleCloseNotifications}
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
              />
              <Typography sx={{ color: textColor, fontWeight: 500 }}>
                Hola, {user?.first_name || user?.email}
              </Typography>
              <Button
                variant='contained'
                onClick={onPanelClick}
                sx={{
                  borderRadius: '12px',
                  background: 'var(--gradient-button-primary)',
                  color: 'var(--White)',
                  '&:hover': {
                    background: 'var(--gradient-button-primary-hover)'
                  }
                }}
              >
                Mi Panel
              </Button>
              <Button
                variant='outlined'
                onClick={logout}
                sx={{
                  borderRadius: '12px',
                  borderColor: buttonBorderColor,
                  color: buttonColor,
                  '&:hover': {
                    borderColor: buttonColor,
                    backgroundColor: 'rgba(79, 186, 200, 0.1)'
                  }
                }}
              >
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <Button
              variant='contained'
              onClick={onLoginClick}
              sx={{
                borderRadius: '12px',
                background: 'var(--gradient-button-primary)',
                color: 'var(--White)',
                '&:hover': {
                  background: 'var(--gradient-button-primary-hover)'
                }
              }}
            >
              Login / Sign Up
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}
