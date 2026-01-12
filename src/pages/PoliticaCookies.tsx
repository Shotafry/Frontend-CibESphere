// src/pages/PoliticaCookies.tsx
import React from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Grid,
  Chip
} from '@mui/material'
import { motion } from 'framer-motion'
import CookieIcon from '@mui/icons-material/Cookie'
import SecurityIcon from '@mui/icons-material/Security'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'

const PoliticaCookies: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 12 }}>
      {/* HERO SECTION */}
      <Box
        sx={{
          background: 'var(--gradient-header-footer)',
          color: 'white',
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
          clipPath: 'ellipse(150% 100% at 50% 0%)',
          textAlign: 'center',
          mb: 6
        }}
      >
        <Container maxWidth='md'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CookieIcon sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
            <Typography
              variant='h2'
              fontWeight='900'
              sx={{
                mb: 2,
                fontSize: { xs: '2rem', md: '3.5rem' },
                textShadow: '0 4px 10px rgba(0,0,0,0.2)'
              }}
            >
              Política de Cookies
            </Typography>
            <Typography
              variant='h6'
              sx={{
                opacity: 0.9,
                fontWeight: 400
              }}
            >
              Transparencia sobre cómo utilizamos tus datos
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* CONTENT SECTION */}
      <Container maxWidth='lg'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 8 },
              borderRadius: '24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
            }}
          >
            <Typography
              variant='body1'
              paragraph
              sx={{ fontSize: '1.1rem', color: '#475569', mb: 4 }}
            >
              En CibESphere utilizamos cookies para mejorar tu experiencia,
              analizar el tráfico y personalizar el contenido. Esta política
              explica qué son las cookies, cómo las usamos y cómo puedes
              controlarlas.
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* TIPOS DE COOKIES */}
            <Typography
              variant='h4'
              fontWeight='800'
              sx={{ mb: 4, textAlign: 'center' }}
            >
              Tipos de Cookies que Utilizamos
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <CookieCard
                  title='Esenciales'
                  icon={<SecurityIcon color='primary' sx={{ fontSize: 40 }} />}
                  description='Necesarias para el funcionamiento básico del sitio, como mantener tu sesión iniciada o recordar tus preferencias de seguridad.'
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <CookieCard
                  title='Analíticas'
                  icon={
                    <AnalyticsIcon color='secondary' sx={{ fontSize: 40 }} />
                  }
                  description='Nos ayudan a entender cómo interactúas con la web, qué páginas visitas y si encuentras errores, para poder mejorar.'
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <CookieCard
                  title='Funcionales'
                  icon={
                    <ToggleOnIcon
                      sx={{ color: 'var(--color-cadetblue)', fontSize: 40 }}
                    />
                  }
                  description='Permiten recordar tus elecciones (como el idioma o tu ubicación) para ofrecerte características mejoradas y más personales.'
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 6 }} />

            {/* DETALLE */}
            <Box component='section' sx={{ mb: 4 }}>
              <Typography
                variant='h5'
                fontWeight='700'
                color='var(--color-cadetblue)'
                gutterBottom
              >
                ¿Qué es una Cookie?
              </Typography>
              <Typography variant='body1' color='text.secondary' paragraph>
                Una cookie es un pequeño archivo de texto que un sitio web
                guarda en tu ordenador o dispositivo móvil cuando lo visitas.
                Permite al sitio web recordar tus acciones y preferencias (como
                inicio de sesión, idioma, tamaño de letra y otras preferencias
                de visualización) durante un período de tiempo.
              </Typography>
            </Box>

            <Box component='section' sx={{ mb: 4 }}>
              <Typography
                variant='h5'
                fontWeight='700'
                color='var(--color-cadetblue)'
                gutterBottom
              >
                Gestión de Cookies
              </Typography>
              <Typography variant='body1' color='text.secondary' paragraph>
                Puedes controlar y/o borrar las cookies como desees. Puedes
                borrar todas las cookies que ya están en tu ordenador y puedes
                configurar la mayoría de los navegadores para que impidan su
                colocación. Sin embargo, si lo haces, es posible que tengas que
                ajustar manualmente algunas preferencias cada vez que visites un
                sitio y que dejen de funcionar algunos servicios y
                funcionalidades.
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  )
}

interface CookieCardProps {
  title: string
  description: string
  icon: React.ReactNode
  required?: boolean
}

const CookieCard: React.FC<CookieCardProps> = ({
  title,
  description,
  icon,
  required
}) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      height: '100%',
      bgcolor: '#F8FAFC',
      border: '1px solid #E2E8F0',
      borderRadius: '16px',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-5px)',
        borderColor: 'var(--color-cadetblue)'
      }
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
      {icon}
      <Typography variant='h6' fontWeight='bold'>
        {title}
      </Typography>
      {required && (
        <Chip
          label='Requerido'
          size='small'
          sx={{
            bgcolor: 'rgba(0, 192, 250, 0.1)',
            color: 'var(--color-primary)',
            fontWeight: 'bold',
            fontSize: '0.7rem'
          }}
        />
      )}
    </Box>
    <Typography variant='body2' color='text.secondary' lineHeight={1.6}>
      {description}
    </Typography>
  </Paper>
)

export default PoliticaCookies
