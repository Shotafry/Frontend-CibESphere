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
        pb: 6
        // --- FIN NUEVA FORMA ---
      }}
    >
      <Container
        maxWidth='lg'
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 3
        }}
      >
        {/* 1. Logo (Nuevo) */}
        <img
          style={{
            height: '40px', // Ajustado a la altura del logo de solo letras
            objectFit: 'contain'
          }}
          alt='CibESphere Logo'
          src='/Logo-Solo-Letras.png' // <-- Logo nuevo
        />

        {/* 2. Enlaces (sin cambios) */}
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            textAlign: { xs: 'center', md: 'left' }
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
          sx={{ textAlign: { xs: 'center', md: 'right' } }}
        >
          © {new Date().getFullYear()} CibESphere. Todos los derechos
          reservados.
        </Typography>
      </Container>
    </Box>
  )
}
