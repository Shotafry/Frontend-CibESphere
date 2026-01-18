// src/components/Footer.tsx
import { FunctionComponent } from 'react'
import { Box, Typography, Link as MuiLink, Container } from '@mui/material'
import logoUrl from '/img/brand/logo-onlytext.png'
import { Link as RouterLink } from 'react-router-dom'

export const Footer: FunctionComponent = () => {
  const footerLinks = [
    { to: '/sobre-nosotros', label: 'Sobre nosotros' },
    { to: '/terminos', label: 'Términos' },
    { to: '/cookies', label: 'Cookies' },
    { to: '/contacto', label: 'Contacto' },
    { to: '/vdp', label: 'VDP' }
  ]

  return (
    <Box
      component='footer'
      sx={{
        width: '100%',
        background: 'var(--gradient-header-footer)',
        color: 'var(--Gray-700)',
        fontFamily: 'Inter, sans-serif',
        mt: 'auto',
        clipPath: 'ellipse(150% 85% at 50% 100%)',
        pt: { xs: 6, md: 10 },
        pb: { xs: 4, md: 6 },
        position: 'relative',
        zIndex: 1
      }}
    >
      <Container
        maxWidth='lg'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, md: 4 },
          px: { xs: 2, md: 3 }
        }}
      >
        {/* Logo - Centrado y controlado */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          <RouterLink to='/' aria-label='Ir a inicio'>
            <img
              style={{
                height: '36px',
                maxWidth: '180px',
                objectFit: 'contain'
              }}
              alt='CybESphere Logo'
              src={logoUrl}
            />
          </RouterLink>
        </Box>

        {/* Enlaces - Grid responsive */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)', // 2 columnas en móvil
              sm: 'repeat(3, 1fr)', // 3 columnas en tablet
              md: 'repeat(6, auto)' // 6 en línea en desktop
            },
            gap: { xs: 1.5, sm: 2, md: 3 },
            width: '100%',
            maxWidth: '600px',
            justifyItems: 'center',
            textAlign: 'center'
          }}
        >
          {footerLinks.map((link) => (
            <MuiLink
              key={link.to}
              component={RouterLink}
              to={link.to}
              color='inherit'
              underline='hover'
              sx={{
                fontWeight: 500,
                fontSize: { xs: '0.875rem', md: '0.95rem' },
                py: 0.5,
                px: 1,
                borderRadius: 1,
                transition: 'all 0.2s',
                '&:hover': {
                  color: 'var(--color-cadetblue)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              {link.label}
            </MuiLink>
          ))}
        </Box>

        {/* Copyright */}
        <Typography
          variant='body2'
          color='var(--Gray-700)'
          sx={{
            textAlign: 'center',
            fontSize: { xs: '0.75rem', md: '0.875rem' },
            opacity: 0.8
          }}
        >
          © {new Date().getFullYear()} CybESphere. Todos los derechos
          reservados.
        </Typography>
      </Container>
    </Box>
  )
}
