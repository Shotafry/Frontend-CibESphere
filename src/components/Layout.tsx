// src/components/Layout.tsx
import React, { ReactNode } from 'react'
import { Box } from '@mui/material'
import { Header } from './Header'
import { Footer } from './Footer'
import { Outlet, useNavigation, useLocation } from 'react-router-dom'

interface LayoutProps {
  children?: ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigation = useNavigation()
  const location = useLocation()
  const isLandingPage = location.pathname === '/'

  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        backgroundColor: 'var(--White)',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        lineHeight: 'normal',
        letterSpacing: 'normal'
      }}
    >
      <Header />
      <Box
        component='main'
        sx={{
          width: '100%',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: navigation.state === 'loading' ? 0.7 : 1,

          // --- ARREGLO DEL WARNING DE VITE ---
          // Combinamos las dos transiciones en una sola línea
          transition: 'opacity 0.2s ease-in-out, margin-top 0.3s ease',

          // --- LÓGICA REVERTIDA ---
          // Volvemos al margen de 80px (el header plano)
          // El Hero ya tiene su propio padding para compensar esto.
          mt: isLandingPage ? 0 : '80px'
        }}
      >
        {children || <Outlet />}
      </Box>
      <Footer />
    </Box>
  )
}
