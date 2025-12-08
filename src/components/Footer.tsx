// src/components/Footer.tsx
import { FunctionComponent } from 'react'
import { Box, Typography, Link as MuiLink, Container } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export const Footer: FunctionComponent = () => {
  return (
    <Box
      component='footer'
      sx={{
        width: '100%',
        background: 'var(--gradient-header-footer)',
        color: 'var(--Gray-700)',
        fontFamily: 'Inter, sans-serif',
        mt: 'auto',
        // --- NUEVA FORMA ---
        // Esto crea una curva hacia ARRIBA en el borde superior
        clipPath: 'ellipse(150% 85% at 50% 100%)',
        // Damos padding para que el contenido no se corte
        pt: { xs: 8, md: 10 },
        pb: 6,
        position: 'relative', // Asegurar contexto
        zIndex: 1 // Por encima del fondo
        // --- FIN NUEVA FORMA ---
      }}
    >
      <Container
        maxWidth='lg'
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: { md: 'center', xs: 'space-between' },
          margin: '8px',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: { xs: 2, md: 3 },
          px: { xs: 0.5, md: 0 }

        }}
      >
        {/* 1. Logo (Nuevo) */}
        {/* 1. Logo (Nuevo) - Ahora con Link */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: { xs: 'flex-start', md: 'center' }, mb: { xs: 2, md: 0 } }}>
          <RouterLink to='/'>
            <img
              style={{
                height: '40px',
                objectFit: 'contain',
              }}
              alt='CibESphere Logo'
              src='/Logo-Solo-Letras.png'
            />
          </RouterLink>
        </Box>

        {/* 2. Enlaces (sin cambios) */}
        <Box
          sx={{
            display: 'contents',
            gap: 2,
            textAlign: { xs: 'left', md: 'center' }
          }}
        >
          <MuiLink
            component={RouterLink}
            to='/sobre-nosotros' // Cambiado a una ruta real (aunque no exista aún)
            color='inherit'
            underline='hover'
            sx={{ fontWeight: 500 }}
          >
            Sobre nosotros
          </MuiLink>
          <MuiLink
            component={RouterLink}
            to='/'
            color='inherit'
            underline='hover'
            sx={{ fontWeight: 500 }}
          >
            Eventos
          </MuiLink>
        </Box>

        {/* 3. Copyright (sin cambios) */}
        <Typography
          variant='body2'
          color='var(--Gray-700)'
          sx={{
            width: '100%',
            textAlign: { xs: 'left', md: 'center' },
            mt: { xs: 2, md: 0 }
          }}
        >
          © {new Date().getFullYear()} CibESphere. Todos los derechos
          reservados.
        </Typography>
      </Container>
    </Box>
  )
}
