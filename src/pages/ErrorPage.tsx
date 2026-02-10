// src/pages/ErrorPage.tsx
import { FunctionComponent } from 'react'
import { useRouteError, isRouteErrorResponse } from 'react-router-dom'
import { Box, Typography, Container } from '@mui/material'
import { Button } from '../components/Button'
import { keyframes } from '@emotion/react'

// Definición de animaciones glitch
const glitchAnim = keyframes`
  0% { clip-path: inset(40px 0 61px 0); }
  20% { clip-path: inset(92px 0 1px 0); }
  40% { clip-path: inset(43px 0 1px 0); }
  60% { clip-path: inset(25px 0 58px 0); }
  80% { clip-path: inset(54px 0 7px 0); }
  100% { clip-path: inset(58px 0 43px 0); }
`

const glitchAnim2 = keyframes`
  0% { clip-path: inset(24px 0 29px 0); }
  20% { clip-path: inset(54px 0 21px 0); }
  40% { clip-path: inset(9px 0 5px 0); }
  60% { clip-path: inset(41px 0 13px 0); }
  80% { clip-path: inset(2px 0 97px 0); }
  100% { clip-path: inset(83px 0 40px 0); }
`

const ErrorPage: FunctionComponent = () => {
  const error = useRouteError()
  let status = 500
  let statusText = 'Error Inesperado'
  let message = 'Ha ocurrido un error al procesar tu solicitud.'
  let subMessage =
    'Parece que te has perdido en el ciberespacio. Vuelve a la base para seguir encontrando eventos.'

  if (isRouteErrorResponse(error)) {
    status = error.status
    statusText = error.statusText
    if (error.status === 404) {
      statusText = 'Página no encontrada'
      message = 'Esta página no existe...'
      subMessage =
        'o ha sido movida a la nube. Verifica la URL o regresa al inicio.'
    } else {
      message = error.data?.message || 'Algo ha salido mal.'
    }
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        bgcolor: '#020617', // slate-950
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        textAlign: 'center',
        color: 'white',
        px: 3
      }}
    >
      {/* Background Effects */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '25%',
            left: '25%',
            width: 384,
            height: 384,
            bgcolor: 'rgba(6, 182, 212, 0.1)', // cyan-500/10
            borderRadius: '50%',
            filter: 'blur(100px)'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '25%',
            right: '25%',
            width: 384,
            height: 384,
            bgcolor: 'rgba(37, 99, 235, 0.1)', // blue-600/10
            borderRadius: '50%',
            filter: 'blur(100px)'
          }}
        />
      </Box>

      <Container maxWidth='sm' sx={{ position: 'relative', zIndex: 10 }}>
        {/* Glitch 404/Status */}
        <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
          <Typography
            variant='h1'
            sx={{
              fontSize: { xs: '6rem', md: '8rem' },
              fontWeight: 900,
              lineHeight: 1,
              background: 'linear-gradient(to right, #22d3ee, #3b82f6)', // cyan-400 to blue-500
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              position: 'relative',
              '&::before, &::after': {
                content: `"${status}"`,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: '#020617'
              },
              '&::before': {
                left: '2px',
                textShadow: '-2px 0 #00ffff',
                animation: `${glitchAnim} 5s infinite linear alternate-reverse`
              },
              '&::after': {
                left: '-2px',
                textShadow: '-2px 0 #ff00ff',
                animation: `${glitchAnim2} 5s infinite linear alternate-reverse`
              }
            }}
          >
            {status}
          </Typography>
        </Box>

        <Typography
          variant='h4'
          component='h2'
          fontWeight='bold'
          sx={{ mb: 2, fontSize: { xs: '1.5rem', md: '2.5rem' } }}
        >
          {message}
        </Typography>

        <Typography
          variant='body1'
          paragraph
          sx={{
            color: '#94a3b8', // slate-400
            fontSize: '1.125rem',
            mb: 5,
            lineHeight: 1.6
          }}
        >
          {subMessage}
        </Typography>

        <Button
          to='/'
          variant='primary'
          sx={{
            py: 2,
            px: 5,
            borderRadius: '9999px', // rounded-full
            background: '#06b6d4', // cyan-500
            boxShadow: '0 10px 15px -3px rgba(6, 182, 212, 0.2)',
            fontSize: '1rem',
            fontWeight: 'bold',
            '&:hover': {
              background: '#0891b2', // cyan-600
              transform: 'scale(1.05)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Volver al Inicio
        </Button>
      </Container>
    </Box>
  )
}

export default ErrorPage
