// src/pages/Contacto.tsx
import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button
} from '@mui/material'
import { motion } from 'framer-motion'
import EmailIcon from '@mui/icons-material/Email'
import SendIcon from '@mui/icons-material/Send'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
// import { commonInputSx } from '../styles/commonStyles'

const commonInputSx = {
  '& .MuiFilledInput-root': {
    bgcolor: 'white',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    '&:before': { display: 'none' },
    '&:after': { display: 'none' },
    '&:hover': { bgcolor: '#F8FAFC' },
    '&.Mui-focused': {
      bgcolor: 'white',
      boxShadow: '0 0 0 2px var(--color-cadetblue)'
    }
  }
}

const Contacto: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock simulado de envío
    setTimeout(() => {
      setSubmitted(true)
    }, 1000)
  }

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
            <SupportAgentIcon sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
            <Typography
              variant='h2'
              fontWeight='900'
              sx={{
                mb: 2,
                fontSize: { xs: '2rem', md: '3.5rem' },
                textShadow: '0 4px 10px rgba(0,0,0,0.2)'
              }}
            >
              Contáctanos
            </Typography>
            <Typography
              variant='h6'
              sx={{
                opacity: 0.9,
                fontWeight: 400
              }}
            >
              ¿Tienes alguna duda o sugerencia? Estamos aquí para ayudarte.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* CONTENT SECTION */}
      <Container maxWidth='lg'>
        <Grid container spacing={6}>
          {/* INFORMACIÓN DE CONTACTO */}
          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: '24px',
                  bgcolor: 'var(--color-cadetblue)',
                  color: 'white',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Decoration circle */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    zIndex: 0
                  }}
                />

                <Typography
                  variant='h5'
                  fontWeight='800'
                  gutterBottom
                  sx={{ position: 'relative', zIndex: 1 }}
                >
                  Información de contacto
                </Typography>
                <Typography
                  variant='body1'
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    position: 'relative',
                    zIndex: 1,
                    lineHeight: 1.7
                  }}
                >
                  Completa el formulario y nuestro equipo se pondrá en contacto
                  contigo lo antes posible (generalmente en menos de 24 horas).
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 3,
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  <EmailIcon sx={{ mr: 2 }} />
                  <Typography variant='body1'>
                    soporte@cybesphere.com
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 3,
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  <HelpOutlineIcon sx={{ mr: 2 }} />
                  <Typography variant='body1'>Centro de Ayuda</Typography>
                </Box>

                <Box sx={{ mt: 8, position: 'relative', zIndex: 1 }}>
                  <Typography variant='caption' sx={{ opacity: 0.7 }}>
                    CybESphere - Conectando la ciberseguridad.
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* FORMULARIO */}
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 4, md: 5 },
                  borderRadius: '24px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
                }}
              >
                {submitted ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <SendIcon
                        sx={{
                          fontSize: 80,
                          color: 'var(--color-cadetblue)',
                          mb: 2
                        }}
                      />
                      <Typography variant='h4' fontWeight='bold' gutterBottom>
                        ¡Mensaje Enviado!
                      </Typography>
                      <Typography color='text.secondary'>
                        Gracias por contactarnos. Te responderemos pronto.
                      </Typography>
                      <Button
                        variant='text'
                        sx={{ mt: 3, color: 'var(--color-cadetblue)' }}
                        onClick={() => setSubmitted(false)}
                      >
                        Enviar otro mensaje
                      </Button>
                    </motion.div>
                  </Box>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label='Nombre completo'
                          name='name'
                          variant='filled'
                          value={formData.name}
                          onChange={handleChange}
                          sx={commonInputSx}
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label='Correo electrónico'
                          name='email'
                          type='email'
                          variant='filled'
                          value={formData.email}
                          onChange={handleChange}
                          sx={commonInputSx}
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label='Asunto'
                          name='subject'
                          variant='filled'
                          value={formData.subject}
                          onChange={handleChange}
                          sx={commonInputSx}
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label='Mensaje'
                          name='message'
                          multiline
                          rows={4}
                          variant='filled'
                          value={formData.message}
                          onChange={handleChange}
                          sx={commonInputSx}
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Button
                          type='submit'
                          variant='contained'
                          size='large'
                          fullWidth
                          sx={{
                            bgcolor: 'var(--color-cadetblue)',
                            py: 1.5,
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            fontSize: '1rem',
                            '&:hover': {
                              bgcolor: 'var(--color-cadetblue)',
                              filter: 'brightness(1.1)'
                            }
                          }}
                          startIcon={<SendIcon />}
                        >
                          Enviar mensaje
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                )}
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Contacto
