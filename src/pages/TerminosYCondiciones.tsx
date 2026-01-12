// src/pages/TerminosYCondiciones.tsx
import React from 'react'
import { Box, Container, Typography, Paper, Divider } from '@mui/material'
import { motion } from 'framer-motion'
import GavelIcon from '@mui/icons-material/Gavel'

const TerminosYCondiciones: React.FC = () => {
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
            <GavelIcon sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
            <Typography
              variant='h2'
              fontWeight='900'
              sx={{
                mb: 2,
                fontSize: { xs: '2rem', md: '3.5rem' },
                textShadow: '0 4px 10px rgba(0,0,0,0.2)'
              }}
            >
              Términos y Condiciones
            </Typography>
            <Typography
              variant='h6'
              sx={{
                opacity: 0.9,
                fontWeight: 400
              }}
            >
              Última actualización: 12 de Enero, 2026
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
              sx={{ fontSize: '1.1rem', color: '#475569' }}
            >
              Bienvenido a CybESphere. Al acceder y utilizar nuestro sitio web,
              aceptas cumplir con los siguientes términos y condiciones. Por
              favor, léelos detenidamente.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Box component='section' sx={{ mb: 4 }}>
              <Typography
                variant='h5'
                fontWeight='700'
                color='var(--color-cadetblue)'
                gutterBottom
              >
                1. Aceptación de los Términos
              </Typography>
              <Typography variant='body1' color='text.secondary' paragraph>
                Al registrarte, acceder o utilizar nuestros servicios, confirmas
                que tienes la edad legal para formar un contrato vinculante y
                que aceptas estos Términos de Servicio en su totalidad. Si no
                estás de acuerdo con alguna parte, no debes utilizar nuestros
                servicios.
              </Typography>
            </Box>

            <Box component='section' sx={{ mb: 4 }}>
              <Typography
                variant='h5'
                fontWeight='700'
                color='var(--color-cadetblue)'
                gutterBottom
              >
                2. Uso de la Plataforma
              </Typography>
              <Typography variant='body1' color='text.secondary' paragraph>
                CybESphere es una comunidad dedicada a la ciberseguridad. Te
                comprometes a utilizar la plataforma de manera ética y legal.
                Está estrictamente prohibido:
              </Typography>
              <Box component='ul' sx={{ color: 'text.secondary', pl: 2 }}>
                <li>
                  Publicar contenido ilegal, ofensivo o que vulnere derechos de
                  terceros.
                </li>
                <li>
                  Intentar vulnerar la seguridad de la plataforma o de otros
                  usuarios.
                </li>
                <li>
                  Utilizar la información obtenida para actividades maliciosas
                  (Black Hat Hacking fuera de entornos controlados).
                </li>
                <li>Suplantar la identidad de otras personas o entidades.</li>
              </Box>
            </Box>

            <Box component='section' sx={{ mb: 4 }}>
              <Typography
                variant='h5'
                fontWeight='700'
                color='var(--color-cadetblue)'
                gutterBottom
              >
                3. Propiedad Intelectual
              </Typography>
              <Typography variant='body1' color='text.secondary' paragraph>
                Todo el contenido, diseño, logotipos y código de CybESphere son
                propiedad exclusiva de CybESphere o de sus licenciantes. Los
                usuarios conservan los derechos sobre el contenido que publican,
                pero otorgan a CybESphere una licencia para mostrarlo y
                distribuirlo en la plataforma.
              </Typography>
            </Box>

            <Box component='section' sx={{ mb: 4 }}>
              <Typography
                variant='h5'
                fontWeight='700'
                color='var(--color-cadetblue)'
                gutterBottom
              >
                4. Cuentas y Seguridad
              </Typography>
              <Typography variant='body1' color='text.secondary' paragraph>
                Eres responsable de mantener la confidencialidad de tu
                contraseña y de todas las actividades que ocurran bajo tu
                cuenta. CybESphere no será responsable por cualquier pérdida
                derivada del incumplimiento de esta obligación.
              </Typography>
            </Box>

            <Box component='section' sx={{ mb: 4 }}>
              <Typography
                variant='h5'
                fontWeight='700'
                color='var(--color-cadetblue)'
                gutterBottom
              >
                5. Modificaciones
              </Typography>
              <Typography variant='body1' color='text.secondary' paragraph>
                Nos reservamos el derecho de modificar estos términos en
                cualquier momento. Las modificaciones entrarán en vigor
                inmediatamente después de su publicación. El uso continuado de
                la plataforma constituirá tu aceptación de los términos
                modificados.
              </Typography>
            </Box>

            <AlertBox type='info'>
              Para consultas legales específicas o reportes de violaciones a
              estos términos, por favor contáctanos a través de nuestro soporte
              o formulario de contacto.
            </AlertBox>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  )
}

// Simple Helper Component for Alerts inside text
const AlertBox = ({
  children,
  type
}: {
  children: React.ReactNode
  type: 'info' | 'warning'
}) => (
  <Box
    sx={{
      mt: 4,
      p: 3,
      bgcolor:
        type === 'info' ? 'rgba(0, 217, 255, 0.05)' : 'rgba(255, 165, 0, 0.05)',
      borderLeft: `4px solid ${
        type === 'info' ? 'var(--color-cadetblue)' : 'orange'
      }`,
      borderRadius: '8px',
      color: '#334155'
    }}
  >
    {children}
  </Box>
)

export default TerminosYCondiciones
