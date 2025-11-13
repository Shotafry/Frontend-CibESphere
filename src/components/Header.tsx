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

  // --- LÓGICA REVERTIDA ---
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
          padding: '16px 32px', // Padding simple
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
          src='/cyberLogo-1@2x.png' // <-- Tu logo
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
