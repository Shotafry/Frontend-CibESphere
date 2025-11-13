// src/pages/ErrorPage.tsx
import { FunctionComponent } from 'react'
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'
import { Box, Typography, Button, Container, Paper } from '@mui/material'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'

const ErrorPage: FunctionComponent = () => {
  const error = useRouteError()
  let status = 500
  let statusText = 'Error Inesperado'
  let message = 'Ha ocurrido un error al procesar tu solicitud.'

  if (isRouteErrorResponse(error)) {
    status = error.status
    statusText = error.statusText
    if (error.status === 404) {
      message = 'La página que buscas no existe.'
    } else {
      message = error.data?.message || 'Algo ha salido mal.'
    }
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <Container maxWidth='sm' sx={{ my: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          border: '1px solid var(--Gray-300)',
          borderRadius: '16px'
        }}
      >
        <ReportProblemOutlinedIcon
          sx={{
            fontSize: 80,
            color: 'var(--color-cadetblue)', // Color cian del proyecto
            mb: 2
          }}
        />
        <Typography
          variant='h1'
          component='h1'
          fontWeight='bold'
          sx={{ color: 'var(--color-cadetblue)', fontSize: '5rem' }}
        >
          {status}
        </Typography>
        <Typography variant='h4' component='h2' fontWeight='bold' gutterBottom>
          {statusText}
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>
          {message}
        </Typography>
        <Button
          component={Link}
          to='/'
          variant='contained'
          sx={{
            borderRadius: '25px',
            background: 'var(--gradient-button-primary)', // Usaremos el gradiente unificado
            '&:hover': {
              background: 'var(--gradient-button-primary-hover)'
            }
          }}
        >
          Volver al Inicio
        </Button>
      </Paper>
    </Container>
  )
}

export default ErrorPage
