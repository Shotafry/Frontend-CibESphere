// src/pages/ProgramaVulnerabilidades.tsx
import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Divider,
  Chip
} from '@mui/material'
import { Button } from '../components/Button'
import { motion } from 'framer-motion'
import SecurityIcon from '@mui/icons-material/Security'
import BugReportIcon from '@mui/icons-material/BugReport'
import GavelIcon from '@mui/icons-material/Gavel'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HowToRegIcon from '@mui/icons-material/HowToReg'

const ProgramaVulnerabilidades: React.FC = () => {
  const [formData, setFormData] = useState({
    handle: '',
    email: '',
    expertise: ''
  })
  const [registered, setRegistered] = useState(false)

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock registration
    setTimeout(() => setRegistered(true), 800)
  }

  return (
    <Box
      sx={{ minHeight: '100vh', bgcolor: '#1f2937', color: '#e2e8f0', pb: 12 }}
    >
      {/* HERO SECTION - Darker, "Hacker" theme */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
          textAlign: 'center',
          mb: 6,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Matrix-like decoration (optional simple CSS effect) */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage:
              'radial-gradient(circle at 50% 50%, var(--color-cadetblue) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        />

        <Container maxWidth='md' sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <BugReportIcon
              sx={{ fontSize: 70, mb: 2, color: 'var(--color-cadetblue)' }}
            />
            <Typography
              variant='h2'
              fontWeight='900'
              sx={{
                mb: 2,
                fontSize: { xs: '2rem', md: '3.5rem' },
                textShadow: '0 0 20px rgba(0, 217, 255, 0.5)',
                color: 'white'
              }}
            >
              Programa de Divulgación de Vulnerabilidades
            </Typography>
            <Typography
              variant='h6'
              sx={{
                opacity: 0.8,
                fontWeight: 400,
                color: '#94a3b8',
                maxWidth: '800px',
                mx: 'auto'
              }}
            >
              Ayúdanos a asegurar CybESphere. Hackea nuestro sitio (con
              permiso), reporta lo que encuentres y recibe nuestro eterno
              agradecimiento (y un certificado molón).
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth='lg'>
        <Grid container spacing={4}>
          {/* LEFT COLUMN: INFO */}
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* PHILOSOPHY */}
              <Box sx={{ mb: 6 }}>
                <Typography
                  variant='h4'
                  fontWeight='bold'
                  color='white'
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                >
                  <SecurityIcon color='primary' fontSize='large' /> Nuestra
                  Filosofía
                </Typography>
                <Typography paragraph color='#cbd5e1'>
                  Creemos que la seguridad es un esfuerzo comunitario. Si tienes
                  habilidades de pentesting, queremos colaborar contigo, no
                  pelear. Consideramos este programa un espacio seguro ("Safe
                  Harbor") para investigadores éticos.
                </Typography>
                <Alert
                  severity='info'
                  sx={{
                    bgcolor: 'rgba(0, 217, 255, 0.1)',
                    color: '#bae6fd',
                    border: '1px solid #0284c7'
                  }}
                >
                  Si sigues nuestras reglas, prometemos no emprender acciones
                  legales contra ti. Al contrario, ¡te daremos las gracias!
                </Alert>
              </Box>

              {/* RULES */}
              <Box sx={{ mb: 6 }}>
                <Typography
                  variant='h5'
                  fontWeight='bold'
                  color='white'
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                >
                  <GavelIcon color='warning' fontSize='large' /> Reglas del
                  Juego
                </Typography>
                <Paper
                  sx={{
                    bgcolor: '#1e293b',
                    p: 3,
                    borderRadius: '16px',
                    border: '1px solid #334155'
                  }}
                >
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleOutlineIcon color='success' />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{ color: '#e2e8f0' }}
                        primary='Reporta vulnerabilidades críticas (XSS, SQLi, RCE, IDOR).'
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleOutlineIcon color='success' />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{ color: '#e2e8f0' }}
                        primary='Respeta la privacidad de otros usuarios. Accede solo a tus propios datos test.'
                      />
                    </ListItem>
                    <ListItem>
                      {/* DoS Warning */}
                      <ListItemIcon>
                        <BlockIcon color='error' />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          color: '#f87171',
                          fontWeight: 'bold'
                        }}
                        primary='PROHIBIDO: Denegación de Servicio (DoS/DDoS).'
                        secondaryTypographyProps={{ color: '#cbd5e1' }}
                        secondary='Si intentas tumbar el servidor con miles de peticiones, tu IP será baneada automáticamente y lloraremos mucho. Por favor, no seas así.'
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <BlockIcon color='error' />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{ color: '#e2e8f0' }}
                        primary='Nada de ingeniería social contra nuestro equipo (ya sabemos que Angel da su contraseña por chocolate).'
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>

              {/* REWARDS */}
              <Box sx={{ mb: 6 }}>
                <Typography
                  variant='h5'
                  fontWeight='bold'
                  color='white'
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                >
                  <WorkspacePremiumIcon color='secondary' fontSize='large' />{' '}
                  Recompensas
                </Typography>
                <Typography paragraph color='#cbd5e1'>
                  Actualmente no ofrecemos recompensas monetarias (somos un
                  proyecto gratuito y sin ánimo de lucro, creado con cariño por
                  3 personas como regalo a la comunidad), pero ofrecemos algo
                  mejor para tu ego y CV.
                </Typography>
                <Alert
                  severity='success'
                  variant='outlined'
                  sx={{
                    mb: 3,
                    border: '1px solid var(--color-cadetblue)',
                    color: '#bae6fd',
                    bgcolor: 'rgba(0, 217, 255, 0.05)'
                  }}
                >
                  🔮 <strong>Futuro:</strong> Si la comunidad crece y
                  conseguimos partners, nos encantaría regalar entradas a
                  conferencias o eventos top a quienes reporten vulnerabilidades
                  "super chungas" (críticas).
                </Alert>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label='Carta de Agradecimiento Oficial'
                    color='primary'
                    variant='outlined'
                    sx={{
                      color: 'white',
                      borderColor: 'var(--color-cadetblue)'
                    }}
                  />
                  <Chip
                    label='Mención en nuestro Hall of Fame'
                    color='success'
                    variant='outlined'
                  />
                  <Chip
                    label='Acceso anticipado a features'
                    color='secondary'
                    variant='outlined'
                  />
                </Box>
              </Box>
            </motion.div>
          </Grid>

          {/* RIGHT COLUMN: REGISTRATION */}
          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Paper
                elevation={10}
                sx={{
                  p: 4,
                  borderRadius: '24px',
                  bgcolor: '#1e293b',
                  border: '1px solid #475569',
                  position: 'sticky',
                  top: 20
                }}
              >
                {!registered ? (
                  <>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                      <HowToRegIcon
                        sx={{
                          fontSize: 50,
                          color: 'var(--color-cadetblue)',
                          mb: 2
                        }}
                      />
                      <Typography variant='h5' fontWeight='bold' color='white'>
                        Únete al Programa
                      </Typography>
                      <Typography
                        variant='body2'
                        color='#94a3b8'
                        sx={{ mt: 1 }}
                      >
                        ¿Quieres hackearnos legalmente? Inscríbete primero. Es
                        un mero tecnicismo para saber a quién enviar la carta de
                        agradecimiento.
                      </Typography>
                    </Box>

                    <form onSubmit={handleRegister}>
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label='Hacker Handle / Alias'
                            variant='outlined'
                            value={formData.handle}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                handle: e.target.value
                              })
                            }
                            required
                            sx={darkInputSx}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label='Email de contacto'
                            type='email'
                            variant='outlined'
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value
                              })
                            }
                            required
                            sx={darkInputSx}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label='Áreas de especialidad (Web, API, Mobile...)'
                            variant='outlined'
                            value={formData.expertise}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                expertise: e.target.value
                              })
                            }
                            sx={darkInputSx}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <Button
                            type='submit'
                            fullWidth
                            variant='primary'
                            size='large'
                            startIcon={<SecurityIcon />}
                          >
                            Solicitar Acceso VDP
                          </Button>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <Typography
                            variant='caption'
                            color='#64748b'
                            align='center'
                            display='block'
                          >
                            Respondemos rápido. No somos robots (bueno, algunos
                            sí).
                          </Typography>
                        </Grid>
                      </Grid>
                    </form>
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                      <CheckCircleOutlineIcon
                        sx={{ fontSize: 80, color: '#4ade80', mb: 2 }}
                      />
                      <Typography
                        variant='h4'
                        fontWeight='bold'
                        color='white'
                        gutterBottom
                      >
                        ¡Estás dentro!
                      </Typography>
                      <Typography color='#cbd5e1' paragraph>
                        Has sido registrado en nuestro VDP. Revisa tu email para
                        ver las instrucciones de acceso y el alcance detallado.
                      </Typography>
                      <Typography variant='body2' color='#94a3b8'>
                        Happy Hacking! 🕵️‍♂️
                      </Typography>
                    </motion.div>
                  </Box>
                )}
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

const darkInputSx = {
  '& .MuiOutlinedInput-root': {
    color: 'white',
    bgcolor: '#0f172a',
    '& fieldset': { borderColor: '#475569' },
    '&:hover fieldset': { borderColor: 'var(--color-cadetblue)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--color-cadetblue)' }
  },
  '& .MuiInputLabel-root': { color: '#94a3b8' },
  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--color-cadetblue)' }
}

export default ProgramaVulnerabilidades
