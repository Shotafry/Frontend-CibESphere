// src/components/Hero.tsx
import { FunctionComponent } from 'react'
import { Box, Typography, Container, Grid, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
// --- LOGO MODIFICADO ---
// Usando el nombre de archivo que me diste
import logoVertical from '/Logo-Vertical.png'

export const Hero: FunctionComponent = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        width: '100%',
        // --- PADDING MODIFICADO ---
        // 112px (altura del header) + 32px (espacio extra) = 144px
        pt: { xs: '120px', md: '144px' },
        pb: { xs: 8, md: 16 },
        background: 'var(--gradient-header-footer)',
        // La curva se mantiene para que coincida con el header
        clipPath: 'ellipse(100% 60% at 50% 40%)'
      }}
    >
      <Container maxWidth='lg'>
        <Grid container spacing={4} alignItems='center' justifyContent='center'>
          {/* Columna Izquierda: Logo */}
          <Grid
            item
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
                maxWidth: { xs: 250, md: 350 },
                height: 'auto',
                animation: 'shine 2.5s infinite'
              }}
            />
          </Grid>

          {/* Columna Derecha: Texto (sin cambios) */}
          <Grid
            item
            size={{ xs: 12, md: 7 }}
            sx={{ textAlign: { xs: 'center', md: 'left' } }}
          >
            <Typography
              variant='h2'
              component='h1'
              fontWeight='bold'
              sx={{ color: 'var(--Gray-700)', mb: 2, marginBottom: 10,}}
            >
              La web de referencia para eventos y congresos de Ciberseguridad
              más grande de España.
            </Typography>
            <Typography
              variant='h6'
              component='p'
              sx={{ color: 'var(--Gray-500)', mb: 4 }}
            >
              Descubre eventos, conferencias, talleres y meetups de
              ciberseguridad en toda España. Conecta con profesionales, haz
              nuevos contactos e incluso amigos y mantente actualizado.
            </Typography>
            <Button
              variant='contained'
              size='large'
              onClick={() =>
                document
                  .getElementById('filtros')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              sx={{
                borderRadius: '25px',
                background: 'var(--gradient-button-primary)',
                color: 'var(--White)',
                '&:hover': {
                  background: 'var(--gradient-button-primary-hover)'
                },
                px: 4,
                py: 1.5,
                
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
