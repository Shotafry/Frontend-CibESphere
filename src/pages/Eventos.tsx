// src/pages/Eventos.tsx
import { FunctionComponent, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Grid,
  Container,
  CircularProgress,
  Chip,
  Divider,
  Alert
} from '@mui/material'
import { useLoaderData, useNavigation } from 'react-router-dom'
import { Event } from '../types'
import { SingleEventMap } from '../components/SingleEventMap'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import CategoryIcon from '@mui/icons-material/Category'
import SchoolIcon from '@mui/icons-material/School'
import { useAuth } from '../context/AuthContext'

const formatDateRange = (start: string, end: string) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return `${startDate.toLocaleDateString(
    'es-ES',
    options
  )} - ${endDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })}`
}

const Eventos: FunctionComponent = () => {
  const event = useLoaderData() as Event
  const navigation = useNavigation()

  const { isAuthenticated, user, subscribeToEvent } = useAuth()
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isAlreadySubscribed = user?.FavoriteEvents?.some(
    (favEvent) => favEvent.id === event.id
  )

  const handleSubscribe = async () => {
    if (isAlreadySubscribed) return

    setIsSubscribing(true)
    setError(null)
    try {
      await subscribeToEvent(event)
    } catch (err: any) {
      setError(err.message || 'Error al inscribirse.')
    } finally {
      setIsSubscribing(false)
    }
  }

  if (navigation.state === 'loading') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh'
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!event) {
    return (
      <Container sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant='h4'>Evento no encontrado</Typography>
        <Typography>
          El evento que buscas no existe o ha sido eliminado.
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth='xl' sx={{ mt: 8, mb: 8, px: { xs: 2, md: 8 } }}>
      <Grid container spacing={8} justifyContent='center'>
        {/* Columna Principal: Contenido (Ancho ajustado) */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            sx={{
              backgroundColor: 'var(--White)',
              borderRadius: '25px',
              p: { xs: 3, md: 6 },
              boxShadow: 'var(--shadow-drop)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box
              component='img'
              src={
                event.banner_url ||
                event.image_url ||
                '/cyberLogo-gigapixel-art-scale-2-00x-godpix-1@2x.png'
              }
              alt={`Banner de ${event.title}`}
              sx={{
                width: '100%',
                height: 400,
                objectFit: 'cover',
                borderRadius: '15px',
                mb: 4
                // boxShadow eliminado
              }}
            />
            <Typography
              variant='h3'
              component='h1'
              fontWeight='900'
              gutterBottom
              sx={{ color: 'var(--Gray-700)' }}
            >
              {event.title}
            </Typography>

            <Box sx={{ my: 3 }}>
              <Typography
                variant='body1'
                paragraph
                sx={{
                  whiteSpace: 'pre-wrap',
                  color: 'var(--Gray-500)',
                  fontSize: '1.1rem',
                  lineHeight: 1.8
                }}
              >
                {event.description}
              </Typography>
            </Box>

            <Divider sx={{ my: 4, borderColor: 'var(--Gray-300)' }} />

            <Typography
              variant='h5'
              fontWeight='bold'
              gutterBottom
              sx={{ color: 'var(--Gray-700)' }}
            >
              Detalles del Evento
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mt: 2,
                p: 3,
                backgroundColor: 'var(--Gray-100)',
                borderRadius: '15px'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CategoryIcon sx={{ color: 'var(--color-cadetblue)' }} />
                <Typography variant='body1'>
                  <strong>Categoría:</strong> {event.category}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SchoolIcon sx={{ color: 'var(--color-cadetblue)' }} />
                <Typography variant='body1'>
                  <strong>Nivel:</strong> {event.level}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {event.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  sx={{
                    backgroundColor: 'rgba(79, 186, 200, 0.1)',
                    color: 'var(--color-cadetblue)',
                    fontWeight: 500,
                    fontSize: '0.9rem'
                  }}
                />
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Columna Lateral: Sticky Box (Más estrecha y separada) */}
        <Grid size={{ xs: 12, md: 3.5 }}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            <Box
              sx={{
                backgroundColor: 'var(--White)',
                borderRadius: '25px',
                p: 4,
                boxShadow: 'var(--shadow-drop)',
                mb: 3,
                border: '1px solid rgba(79, 186, 200, 0.2)'
              }}
            >
              <Typography
                variant='h6'
                fontWeight='bold'
                gutterBottom
                sx={{ mb: 3, color: 'var(--Gray-700)' }}
              >
                Información de Inscripción
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  mb: 3
                }}
              >
                <CalendarTodayIcon
                  sx={{ color: 'var(--color-cadetblue)', mt: 0.5 }}
                />
                <Box>
                  <Typography variant='subtitle2' color='text.secondary'>
                    Fecha y Hora
                  </Typography>
                  <Typography variant='body1' fontWeight='500'>
                    {formatDateRange(event.start_date, event.end_date)}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  mb: 3
                }}
              >
                <LocationOnIcon
                  sx={{ color: 'var(--color-cadetblue)', mt: 0.5 }}
                />
                <Box>
                  <Typography variant='subtitle2' color='text.secondary'>
                    Ubicación
                  </Typography>
                  <Typography variant='body1' fontWeight='500'>
                    {event.is_online
                      ? 'Evento Online'
                      : `${event.venue_name || ''}, ${event.venue_city || ''}`}
                  </Typography>
                  {!event.is_online && event.venue_community && (
                    <Typography variant='body2' color='text.secondary'>
                      {event.venue_community}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  mb: 4
                }}
              >
                <ConfirmationNumberIcon
                  sx={{ color: 'var(--color-cadetblue)', mt: 0.5 }}
                />
                <Box>
                  <Typography variant='subtitle2' color='text.secondary'>
                    Precio
                  </Typography>
                  <Typography
                    variant='h5'
                    fontWeight='bold'
                    color='var(--color-cadetblue)'
                  >
                    {event.is_free ? 'Gratuito' : `${event.price}€`}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant='contained'
                fullWidth
                size='large'
                disabled={
                  !isAuthenticated || isAlreadySubscribed || isSubscribing
                }
                onClick={handleSubscribe}
                sx={{
                  borderRadius: '12px',
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  background: isAlreadySubscribed
                    ? 'var(--Gray-300)'
                    : 'var(--gradient-button-primary)',
                  color: isAlreadySubscribed
                    ? 'var(--Gray-500)'
                    : 'var(--White)',
                  boxShadow: isAlreadySubscribed
                    ? 'none'
                    : '0 4px 14px rgba(0, 217, 255, 0.4)',
                  '&:hover': {
                    background: isAlreadySubscribed
                      ? 'var(--Gray-300)'
                      : 'var(--gradient-button-primary-hover)',
                    boxShadow: isAlreadySubscribed
                      ? 'none'
                      : '0 6px 20px rgba(0, 217, 255, 0.6)'
                  }
                }}
              >
                {isSubscribing ? (
                  <CircularProgress size={26} color='inherit' />
                ) : !isAuthenticated ? (
                  'Inicia sesión para inscribirte'
                ) : isAlreadySubscribed ? (
                  'Ya estás inscrito'
                ) : (
                  'Inscribirse Ahora'
                )}
              </Button>
              {error && (
                <Alert severity='error' sx={{ mt: 2, borderRadius: '12px' }}>
                  {error}
                </Alert>
              )}
            </Box>

            {/* Mapa (Si existe) */}
            {event.latitude && event.longitude && (
              <Box
                sx={{
                  borderRadius: '25px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-drop)',
                  border: '4px solid var(--White)'
                }}
              >
                <SingleEventMap event={event} />
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Eventos
