import React, { useState } from 'react'
import {
  Box,
  Typography,
  Modal,
  Backdrop,
  Fade,
  IconButton,
  Collapse,
  Switch,
  FormControlLabel
} from '@mui/material'
import { Button } from './Button' // Usamos nuestro componente personalizado
import { useCookieConsent, CookiePreferences } from '../context/CookieContext'
import { motion, AnimatePresence } from 'framer-motion'
import CookieIcon from '@mui/icons-material/Cookie'
import CloseIcon from '@mui/icons-material/Close'
import SettingsIcon from '@mui/icons-material/Settings'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const CookieBanner: React.FC = () => {
  const { showBanner, acceptAll, acceptEssentials, saveConsent } =
    useCookieConsent()
  const [expanded, setExpanded] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essentials: true,
    analytics: false,
    marketing: false
  })

  if (!showBanner) return null

  const handleSavePreferences = () => {
    saveConsent(preferences)
  }

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essentials') return // Siempre activo
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none' // Para que no bloquee clicks fuera del banner si no ocupa todo
        }}
      >
        <Box
          sx={{
            pointerEvents: 'auto',
            width: '100%',
            maxWidth: '900px',
            background: 'rgba(15, 23, 42, 0.85)', // Dark background glass
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            p: { xs: 3, md: 4 },
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4fbac8 0%, #2a5298 100%)',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              <CookieIcon sx={{ color: 'white' }} />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography
                variant='h6'
                fontWeight='bold'
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                🍪 Respetamos tu privacidad
                <Box
                  component='span'
                  sx={{ display: { xs: 'block', sm: 'none' }, ml: 'auto' }}
                >
                  <CookieIcon sx={{ color: '#4fbac8' }} />
                </Box>
              </Typography>
              <Typography
                variant='body2'
                color='rgba(255,255,255,0.7)'
                sx={{ lineHeight: 1.6 }}
              >
                Utilizamos cookies propias y de terceros para mejorar tu
                experiencia, analizar el tráfico y personalizar contenido. Las
                cookies esenciales son necesarias para el funcionamiento básico
                (login, pagos).
              </Typography>
            </Box>

            {/* Configuración rápida en Desktop */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                gap: 1,
                minWidth: '200px'
              }}
            >
              <Button
                variant='primary'
                onClick={acceptAll}
                fullWidth
                size='small'
              >
                Aceptar Todas
              </Button>
              <Button
                variant='secondary'
                onClick={acceptEssentials}
                fullWidth
                size='small'
              >
                Solo Esenciales
              </Button>
              <Typography
                variant='caption'
                onClick={() => setExpanded(!expanded)}
                sx={{
                  cursor: 'pointer',
                  textAlign: 'center',
                  color: 'rgba(255,255,255,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  '&:hover': { color: '#4fbac8' }
                }}
              >
                <SettingsIcon fontSize='inherit' /> Configurar cookies
              </Typography>
            </Box>
          </Box>

          {/* Botones Mobile - Se muestran abajo */}
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              flexDirection: 'column',
              gap: 1.5
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant='primary' onClick={acceptAll} fullWidth>
                Aceptar
              </Button>
              <Button variant='secondary' onClick={acceptEssentials} fullWidth>
                Rechazar
              </Button>
            </Box>
            <Typography
              variant='body2'
              onClick={() => setExpanded(!expanded)}
              sx={{
                textAlign: 'center',
                color: '#4fbac8',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {expanded ? 'Ocultar configuración' : 'Configurar preferencias'}{' '}
              <ExpandMoreIcon
                sx={{
                  transform: expanded ? 'rotate(180deg)' : 'none',
                  transition: '0.3s'
                }}
              />
            </Typography>
          </Box>

          {/* Panel Expandible de Configuración */}
          <Collapse in={expanded}>
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 2
              }}
            >
              <Box
                sx={{
                  bgcolor: 'rgba(255,255,255,0.05)',
                  p: 2,
                  borderRadius: 2
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1
                  }}
                >
                  <Typography variant='subtitle2' fontWeight='bold'>
                    Esenciales
                  </Typography>
                  <Switch checked={true} disabled color='info' />
                </Box>
                <Typography variant='caption' color='rgba(255,255,255,0.6)'>
                  Necesarias para que la web funcione (Auth, Seguridad, Stripe).
                  No se pueden desactivar.
                </Typography>
              </Box>

              <Box
                sx={{
                  bgcolor: 'rgba(255,255,255,0.05)',
                  p: 2,
                  borderRadius: 2
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1
                  }}
                >
                  <Typography variant='subtitle2' fontWeight='bold'>
                    Analíticas
                  </Typography>
                  <Switch
                    checked={preferences.analytics}
                    onChange={() => togglePreference('analytics')}
                    color='info'
                  />
                </Box>
                <Typography variant='caption' color='rgba(255,255,255,0.6)'>
                  Nos ayudan a entender cómo usas la web para mejorarla (Google
                  Analytics, métricas de rendimiento).
                </Typography>
              </Box>

              <Box
                sx={{
                  bgcolor: 'rgba(255,255,255,0.05)',
                  p: 2,
                  borderRadius: 2
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1
                  }}
                >
                  <Typography variant='subtitle2' fontWeight='bold'>
                    Marketing
                  </Typography>
                  <Switch
                    checked={preferences.marketing}
                    onChange={() => togglePreference('marketing')}
                    color='info'
                  />
                </Box>
                <Typography variant='caption' color='rgba(255,255,255,0.6)'>
                  Permiten mostrarte contenido y anuncios relevantes según tus
                  intereses.
                </Typography>
              </Box>

              <Box sx={{ gridColumn: '1 / -1', mt: 1 }}>
                <Button
                  variant='primary'
                  onClick={handleSavePreferences}
                  fullWidth
                >
                  Guardar Preferencias
                </Button>
              </Box>
            </Box>
          </Collapse>
        </Box>
      </motion.div>
    </AnimatePresence>
  )
}

export default CookieBanner
