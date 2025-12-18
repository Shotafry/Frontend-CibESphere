// src/components/Hero.tsx
import { FunctionComponent } from 'react'
import { Box, Typography, Container, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Button } from './Button'
// --- LOGO MODIFICADO ---
// Usando el nombre de archivo que me diste
const logoVertical = '/Logo-Vertical.png'

export const Hero: FunctionComponent = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        width: '100%',
        // --- PADDING MODIFICADO ---
        // 112px (altura del header) + 32px (espacio extra) = 144px
        pt: { xs: '90px', md: '144px' },
        pb: { xs: 4, md: 16 },
        background: 'var(--gradient-header-footer)',
        clipPath: 'ellipse(100% 60% at 50% 40%)' // La curva se mantiene para que coincida con el header
      }}
    >
      <Container maxWidth='lg'>
        <Grid container spacing={{ xs: 2, md: 4 }} alignItems='center' justifyContent='center' direction={{ xs: 'column', md: 'row' }}>
          {/* Columna Izquierda: Logo */}
          <Grid
            size={{ xs: 12, md: 5 }}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: { xs: 'center', md: 'left' }
            }}
          >
            <style>
              {`
                @keyframes shine {
                  0% {
                    filter: drop-shadow(0 0 0px #fff) drop-shadow(0 0 0px #01c0fa);
                  }
                  40% {
                    filter: drop-shadow(0 0 24px #fff) drop-shadow(0 0 12px #01c0fa);
                  }
                  60% {
                    filter: drop-shadow(0 0 32px #fff) drop-shadow(0 0 24px #4fbac8);
                  }
                  100% {
                    filter: drop-shadow(0 0 0px #fff) drop-shadow(0 0 0px #01c0fa);
                  }
                }
              `}
            </style>
            <Box
              component='img'
              src={logoVertical} // <-- Logo nuevo
              alt='CibESphere Logo'
              sx={{
                width: '100%',
                maxWidth: { xs: 160, sm: 220, md: 350 },
                height: 'auto',
                animation: 'shine 2.5s infinite',
                mb: { xs: 2, md: 0 }
              }}
            />
          </Grid>

          {/* Columna Derecha: Texto (sin cambios) */}
          <Grid
            size={{ xs: 12, md: 7 }}
            sx={{ textAlign: { xs: 'center', md: 'left' } }}
          >
            <Typography
              variant='h2'
              component='h1'
              fontWeight='bold'
              sx={{
                color: 'var(--Gray-700)',
                mb: { xs: 1.5, md: 2 },
                fontSize: { xs: '1.5rem', sm: '2.1rem', md: '2.7rem' },
                marginBottom: { xs: 2, md: 10 },
                textAlign: 'center'
              }}
            >
              La web de referencia para eventos y congresos de Ciberseguridad
              más grande de España.
            </Typography>
            <Typography
              variant='h6'
              component='p'
              sx={{
                color: 'var(--Gray-500)',
                mb: { xs: 2, md: 4 },
                fontSize: { xs: '1rem', md: '1.25rem' },
                textAlign: 'left'
              }}
            >
              Descubre eventos, conferencias, talleres y meetups de
              ciberseguridad en toda España. Conecta con profesionales, haz
              nuevos contactos e incluso amigos y mantente actualizado.
            </Typography>
            <Button
              variant="primary"
              size="large"
              onClick={() =>
                document
                  .getElementById('filtros')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              sx={{
                px: { xs: 2, md: 4 },
                py: { xs: 1, md: 1.5 },
                fontSize: { xs: '1rem', md: '1.2rem' }
              }}
            >
              Explorar Eventos
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
