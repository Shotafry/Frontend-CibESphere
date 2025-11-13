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
    <Container maxWidth='lg' sx={{ my: 5 }}>
      <Grid container spacing={4}>
        <Grid item size={{ xs: 12, md: 8 }}>
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
              borderRadius: '25px',
              mb: 3
            }}
          />
          <Typography
            variant='h3'
            component='h1'
            fontWeight='bold'
            gutterBottom
          >
            {event.title}
          </Typography>
          <Typography variant='body1' paragraph sx={{ whiteSpace: 'pre-wrap' }}>
            {event.description}
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography variant='h5' fontWeight='bold' gutterBottom>
            Detalles del Evento
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CategoryIcon color='primary' />
              <Typography>
                <strong>Categoría:</strong> {event.category}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <SchoolIcon color='primary' />
              <Typography>
                <strong>Nivel:</strong> {event.level}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {event.tags.map((tag) => (
              <Chip key={tag} label={tag} />
            ))}
          </Box>
        </Grid>

        <Grid item size={{ xs: 12, md: 4 }}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            <Box sx={{ border: '1px solid #ddd', borderRadius: '16px', p: 3 }}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}
              >
                <CalendarTodayIcon />
                <Typography variant='body2'>
                  {formatDateRange(event.start_date, event.end_date)}
                </Typography>
              </Box>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}
              >
                <LocationOnIcon />
                <Typography variant='body2'>
                  {event.is_online
                    ? 'Evento Online'
                    : `${event.venue_name || ''}, ${event.venue_city || ''}, ${
                        event.venue_community || ''
                      }`}
                </Typography>
              </Box>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}
              >
                <ConfirmationNumberIcon />
                <Typography variant='body2'>
                  {event.is_free ? 'Gratuito' : `Desde ${event.price}€`}
                </Typography>
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
                  borderRadius: '25px',
                  background: isAlreadySubscribed
                    ? 'grey'
                    : 'var(--gradient-button-primary)',
                  '&:hover': {
                    background: isAlreadySubscribed
                      ? 'grey'
                      : 'var(--gradient-button-primary-hover)'
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
                <Alert severity='error' sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </Box>
            {event.latitude && event.longitude && (
              <SingleEventMap event={event} />
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Eventos
