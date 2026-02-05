// src/components/Header.tsx
import { FunctionComponent, useCallback, useState, useEffect } from 'react'
import {
  Box,
  CircularProgress,
  Typography,
  IconButton,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MenuIcon from '@mui/icons-material/Menu'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Role } from '../types'
import { MobileMenu } from './MobileMenu'
import { NotificationBadge } from './social'
import { Button } from './Button'
import { LanguageSelector } from './LanguageSelector'
import {
  getNotifications,
  getUnreadCount,
  Notification
} from '../services/api/notifications.service'
import logoAndTextUrl from '/img/brand/logo-and-text.png'
import logoOnlyTextUrl from '/img/brand/logo-onlytext.png'
import logoIconUrl from '/img/brand/logo-icon.png'
import viteLogo from '/img/brand/vite-logo.svg'

export const Header: FunctionComponent = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { isAuthenticated, user, logout, isLoading } = useAuth()

  const [isScrolled, setIsScrolled] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isLandingPage = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    if (isLandingPage) {
      window.addEventListener('scroll', handleScroll)
      handleScroll()
    } else {
      setIsScrolled(true)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isLandingPage, location.pathname])

  // v0.4.0 - Cargar notificaciones para MobileMenu
  useEffect(() => {
    const loadNotifications = async () => {
      if (isAuthenticated) {
        try {
          const [notifData, count] = await Promise.all([
            getNotifications(1, 10),
            getUnreadCount()
          ])
          setNotifications(notifData.data as any)
          setUnreadCount(count)
        } catch (error) {
          console.error('Error loading notifications:', error)
        }
      }
    }
    loadNotifications()
  }, [isAuthenticated])

  // --- LÓGICA ORIGINAL RESTAURADA ---
  // Vuelve a ser 'transparent' o 'var(--White)'
  const headerBackground =
    !isLandingPage || isScrolled ? 'var(--White)' : 'transparent'
  const headerShadow =
    !isLandingPage || isScrolled ? 'var(--shadow-header)' : 'none'

  // Color oscuro para que se lea sobre el fondo claro del Hero
  const textColor = 'var(--Gray-700)'

  const onLogoClick = useCallback(() => {
    navigate('/')
  }, [navigate])

  const onLoginClick = useCallback(() => {
    navigate('/loginsign-up')
  }, [navigate])

  const onPanelClick = useCallback(() => {
    if (user?.role === Role.Admin) {
      navigate('/admin')
    } else if (user?.role === Role.Organizer) {
      navigate('/panel-de-organizador')
    } else {
      navigate('/panel-de-usuario')
    }
  }, [navigate, user])

  const getProfilePath = () => {
    if (user?.role === Role.Organizer && user?.organization?.slug) {
      return `/organizacion/${user.organization.slug}`
    }
    return `/u/${user?.slug || user?.id}`
  }

  return (
    <>
      <Box
        component='header'
        sx={{
          width: '100%',
          backgroundColor: headerBackground,
          boxShadow: headerShadow,
          position: 'fixed',
          top: 0,
          zIndex: 1100,
          display: 'flex',
          justifyContent: 'center',
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 1440,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: { xs: '10px 16px', sm: '12px 16px', md: '16px 32px' },
            boxSizing: 'border-box',
            gap: { xs: 1, sm: 2 }
          }}
        >
          {/* MOBILE LAYOUT: Icon Left | Text Center | Hamburger Right */}
          {isMobile ? (
            <>
              {/* Left: Logo Icon */}
              <Box
                onClick={onLogoClick}
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  flex: '0 0 auto'
                }}
              >
                <img
                  style={{
                    height: '36px',
                    width: '36px',
                    objectFit: 'contain'
                  }}
                  alt='CybESphere'
                  src={logoIconUrl}
                  role='button'
                  aria-label='Ir a inicio'
                  tabIndex={0}
                />
              </Box>

              {/* Center: Text Logo */}
              <Box
                onClick={onLogoClick}
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1
                }}
              >
                <img
                  style={{
                    height: '32px',
                    maxWidth: '160px',
                    objectFit: 'contain'
                  }}
                  alt='CybESphere'
                  src={logoOnlyTextUrl}
                  role='button'
                  aria-label='Ir a inicio'
                  tabIndex={0}
                />
              </Box>

              {/* Right: Hamburger Menu */}
              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                sx={{
                  color: 'var(--color-cadetblue)',
                  p: 1,
                  '&:hover': {
                    bgcolor: 'rgba(0, 192, 250, 0.1)'
                  }
                }}
                aria-label='Abrir menú'
              >
                <MenuIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </>
          ) : (
            /* DESKTOP LAYOUT: Logo | Buttons */
            <>
              <img
                style={{
                  height: '36px',
                  width: '120px',
                  objectFit: 'contain',
                  cursor: 'pointer'
                }}
                alt='CibESphere Logo'
                src={logoAndTextUrl}
                onClick={onLogoClick}
                role='button'
                aria-label='Ir a inicio'
                tabIndex={0}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <div className='hidden md:block'>
                  <LanguageSelector />
                </div>
                {isLoading ? (
                  <CircularProgress size={24} />
                ) : isAuthenticated ? (
                  <>
                    <NotificationBadge />
                    <Typography sx={{ color: textColor, fontWeight: 500 }}>
                      Hola, {user?.first_name || user?.email}
                    </Typography>
                    <Button variant='primary' onClick={onPanelClick}>
                      Mi Panel
                    </Button>
                    <Button variant='secondary' onClick={logout}>
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <Button variant='primary' onClick={onLoginClick}>
                    Login / Sign Up
                  </Button>
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
      />
    </>
  )
}
