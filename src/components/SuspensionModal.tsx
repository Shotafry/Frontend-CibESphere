import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Box, Paper, Typography, Fade } from '@mui/material'
import BlockIcon from '@mui/icons-material/Block'
import { Button } from './Button'

interface SuspensionModalProps {
  open: boolean
  onClose: () => void
  message?: string
}

export const SuspensionModal: React.FC<SuspensionModalProps> = ({
  open,
  onClose,
  message
}) => {
  if (!open) return null

  return createPortal(
    <Fade in={open} timeout={500}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
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
            background: 'linear-gradient(145deg, #FFF5F5 0%, #FFF 100%)',
            backdropFilter: 'blur(20px)',
            textAlign: 'center',
            maxWidth: 500,
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(220, 38, 38, 0.25)',
            border: '2px solid rgba(220, 38, 38, 0.1)'
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              color: '#DC2626'
            }}
          >
            <BlockIcon sx={{ fontSize: 50 }} />
          </Box>
          <Typography
            variant='h4'
            fontWeight='bold'
            sx={{
              mb: 2,
              color: '#DC2626'
            }}
          >
            Cuenta Suspendida
          </Typography>
          <Typography
            variant='body1'
            color='text.secondary'
            sx={{ mb: 4, px: 2 }}
          >
            {message ||
              'Tu cuenta ha sido suspendida por incumplimiento de nuestras políticas. Si crees que esto es un error, por favor contacta con soporte.'}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant='primary'
              size='large'
              fullWidth
              onClick={() =>
                (window.location.href = 'mailto:soporte@cybesphere.com')
              }
            >
              Contactar Soporte
            </Button>
            <Button variant='secondary' fullWidth onClick={onClose}>
              Cerrar
            </Button>
          </Box>
        </Paper>
      </Box>
    </Fade>,
    document.body
  )
}
