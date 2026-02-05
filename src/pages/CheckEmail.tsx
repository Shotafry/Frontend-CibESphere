// src/pages/CheckEmail.tsx
import React from 'react'
import { Container, Paper, Typography, Box } from '@mui/material'
import { Button } from '../components/Button'
import { Email as EmailIcon } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const CheckEmail: React.FC = () => {
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
            background: 'linear-gradient(145deg, #ffffff, #f5f7fa)'
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              p: 2,
              borderRadius: '50%',
              bgcolor: 'rgba(79, 186, 200, 0.1)',
              mb: 3
            }}
          >
            <EmailIcon sx={{ fontSize: 60, color: '#4fbac8' }} />
          </Box>

          <Typography variant='h4' component='h1' gutterBottom fontWeight='800'>
            Revisa tu correo
          </Typography>

          <Typography
            variant='body1'
            color='text.secondary'
            paragraph
            sx={{ mb: 4 }}
          >
            Hemos enviado un enlace de confirmación a tu dirección de correo
            electrónico. Por favor, haz clic en el enlace para activar tu cuenta
            y comenzar a usar CybESphere.
          </Typography>

          <Button to='/login' variant='primary' fullWidth sx={{ mb: 2 }}>
            Volver al Inicio de Sesión
          </Button>

          <Typography variant='body2' color='text.secondary'>
            ¿No recibiste el correo? Revisa tu carpeta de spam.
          </Typography>
        </Paper>
      </motion.div>
    </Container>
  )
}

export default CheckEmail
