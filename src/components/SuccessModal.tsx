import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Box, Paper, Typography, CircularProgress, Fade } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

interface SuccessModalProps {
  open: boolean
  onClose: () => void
  duration?: number
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  open,
  onClose,
  duration = 5000
}) => {
  // Estado interno para controlar el montaje/desmontaje si es necesario
  // pero usaremos 'open' del prop principalmente.

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [open, duration, onClose])

  if (!open) return null

  // Usamos Portal para renderizar en document.body y evitar problemas de z-index con footers/contenedores
  return ReactDOM.createPortal(
    <Fade in={open} timeout={500}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          // zIndex extremadamente alto y directo en body asegura estar encima de todo
          zIndex: 9999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          p: 2
        }}
      >
        <Paper
          elevation={24}
          sx={{
            p: { xs: 4, sm: 6 },
            borderRadius: '24px',
            background:
              'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(240,255,240,0.98) 100%)',
            backdropFilter: 'blur(20px)',
            textAlign: 'center',
            maxWidth: 500,
            width: '100%',
            boxShadow:
              '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 60px rgba(34, 197, 94, 0.3)',
            border: '2px solid rgba(34, 197, 94, 0.3)'
          }}
        >
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'linear-gradient(145deg, #22c55e, #16a34a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 10px 30px rgba(34, 197, 94, 0.4)'
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 60, color: 'white' }} />
          </Box>
          <Typography
            variant='h4'
            fontWeight='bold'
            sx={{
              mb: 2,
              background: 'linear-gradient(90deg, #16a34a, #22c55e)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            ¡Organización Creada! 🎉
          </Typography>
          <Typography
            variant='body1'
            color='text.secondary'
            sx={{ mb: 3, px: 2 }}
          >
            Tu organización está en <strong>revisión</strong>. Te notificaremos
            cuando sea aprobada.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              color: 'text.disabled'
            }}
          >
            <CircularProgress size={16} color='success' />
            <Typography variant='body2' fontSize='0.8rem'>
              Este mensaje se cerrará automáticamente...
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Fade>,
    document.body
  )
}
