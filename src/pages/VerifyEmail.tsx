// src/pages/VerifyEmail.tsx
import React, { useEffect, useState } from 'react'
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress
} from '@mui/material'
import { Button } from '../components/Button'
import {
  CheckCircleOutline as CheckIcon,
  ErrorOutline as ErrorIcon
} from '@mui/icons-material'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as authService from '../services/api/auth.service'

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  )
  const [message, setMessage] = useState('')

  const effectRan = React.useRef(false)

  useEffect(() => {
    if (effectRan.current === true || !token) return

    const verifyToken = async () => {
      try {
        await authService.verifyEmail(token)
        setStatus('success')
      } catch (error: any) {
        setStatus('error')
        setMessage(
          error.response?.data?.message ||
            'El enlace de verificación es inválido o ha expirado.'
        )
      }
    }

    verifyToken()

    return () => {
      effectRan.current = true
    }
  }, [token])

  return (
    <Container maxWidth='sm' sx={{ mt: 8, mb: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 5,
            textAlign: 'center',
            borderRadius: 4,
            minHeight: 300,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {status === 'loading' && (
            <>
              <CircularProgress size={60} sx={{ mb: 3, color: '#4fbac8' }} />
              <Typography variant='h5' color='text.secondary'>
                Verificando tu cuenta...
              </Typography>
            </>
          )}

          {status === 'success' && (
            <>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: '50%',
                  bgcolor: 'rgba(76, 175, 80, 0.1)',
                  mb: 3
                }}
              >
                <CheckIcon sx={{ fontSize: 60, color: '#4caf50' }} />
              </Box>
              <Typography
                variant='h4'
                gutterBottom
                fontWeight='800'
                color='success.main'
              >
                ¡Cuenta Verificada!
              </Typography>
              <Typography variant='body1' color='text.secondary' paragraph>
                Tu correo electrónico ha sido confirmado exitosamente. Ya puedes
                acceder a todas las funcionalidades de CybESphere.
              </Typography>
              <Button to='/login' variant='primary' fullWidth sx={{ mt: 2 }}>
                Iniciar Sesión
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: '50%',
                  bgcolor: 'rgba(244, 67, 54, 0.1)',
                  mb: 3
                }}
              >
                <ErrorIcon sx={{ fontSize: 60, color: '#f44336' }} />
              </Box>
              <Typography
                variant='h4'
                gutterBottom
                fontWeight='800'
                color='error.main'
              >
                Error de Verificación
              </Typography>
              <Typography variant='body1' color='text.secondary' paragraph>
                {message}
              </Typography>
              <Button to='/contacto' variant='secondary' sx={{ mt: 2 }}>
                Contactar Soporte
              </Button>
            </>
          )}
        </Paper>
      </motion.div>
    </Container>
  )
}

export default VerifyEmail
