// src/components/Header.tsx
import { FunctionComponent, useCallback, useState, useEffect } from 'react'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Role } from '../types'

export const Header: FunctionComponent = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, logout, isLoading } = useAuth()

  const [isScrolled, setIsScrolled] = useState(false)
  const isLandingPage = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      // El punto de corte es aprox donde termina el Hero (350-400px)
      setIsScrolled(window.scrollY > 380)
    }

    if (isLandingPage) {
      window.addEventListener('scroll', handleScroll)
      handleScroll()
    } else {
      // En otras páginas, siempre está "scrolled" (visible con color)
      setIsScrolled(true)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isLandingPage, location.pathname])

  // Lógica de estilos dinámica
  const isTransparent = isLandingPage && !isScrolled

  const headerBackground = isTransparent
    ? 'transparent'
    : 'var(--gradient-header-footer)'

  const headerShadow = isTransparent ? 'none' : 'var(--shadow-header)'

  // Clip-path solo cuando tiene color de fondo (para hacer la curva)
  // La curva debe ser sutil hacia abajo o recta?
  // El usuario pidió: "al bajar... comience a verse ya el header... coger el color de fondo igual que el hero o footer"
  // El footer tiene curva hacia ARRIBA. El Hero tiene curva hacia ABAJO.
  // Haremos una curva suave en el borde inferior si no es transparente.
  const headerClipPath = isTransparent ? 'none' : 'ellipse(150% 100% at 50% 0%)' // Curva convexa suave en la parte inferior

  // Color de texto
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
        backgroundColor: headerBackground,
        boxShadow: headerShadow,
        position: 'fixed',
        top: 0,
        zIndex: 1100,
        display: 'flex',
        justifyContent: 'center',
        transition: 'all 0.4s ease',
        // Si queremos que la curva se note, necesitamos un poco más de altura o padding cuando está activo
        pb: isTransparent ? 0 : 2,
        clipPath: headerClipPath
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1440,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 32px',
          boxSizing: 'border-box'
        }}
      >
        <img
          style={{
            height: '48px',
            width: '180px',
            objectFit: 'contain',
            cursor: 'pointer'
          }}
          alt='CibESphere Logo'
          src='/cyberLogo-1@2x.png'
          onClick={onLogoClick}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : isAuthenticated ? (
            <>
              <Typography sx={{ color: textColor, fontWeight: 500 }}>
                Hola, {user?.first_name || user?.email}
              </Typography>
              <Button
                variant='contained'
                onClick={onPanelClick}
                sx={{
                  borderRadius: '25px',
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
                  borderRadius: '25px',
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
                borderRadius: '25px',
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
