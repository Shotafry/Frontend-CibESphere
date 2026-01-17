// src/pages/Eventos.tsx
import { FunctionComponent, useState, useMemo, useEffect } from 'react'
import {
  Box,
  Typography,
  Grid,
  Container,
  CircularProgress
} from '@mui/material'
import { useLoaderData, useNavigation } from 'react-router-dom'
import { Event, Review } from '../types'
import { useAuth } from '../context/AuthContext'
import { getEventReviews } from '../services/apiService'
import { EventHero } from './evento-detalle/components/EventHero'
import { EventDetails } from './evento-detalle/components/EventDetails'
import { EventItinerary } from './evento-detalle/components/EventItinerary'
import { EventReviews } from './evento-detalle/components/EventReviews'
import { EventSidebar } from './evento-detalle/components/EventSidebar'
import { EventDetailSkeleton } from '../components/skeletons'

const Eventos: FunctionComponent = () => {
  const event = useLoaderData() as Event
  const navigation = useNavigation()

  const { isAuthenticated, user, subscribeToEvent } = useAuth()
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isAlreadySubscribed = user?.registered_events?.some(
    (regEvent) => regEvent.id === event.id
  )

  const isEventEnded = useMemo(() => {
    if (!event?.end_date) return false
    return new Date(event.end_date) < new Date()
  }, [event?.end_date])

  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    if (event?.id) {
      getEventReviews(event.id).then(setReviews)
    }
  }, [event])

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
    return <EventDetailSkeleton />
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
        {/* Columna Principal: Contenido */}
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
            <EventHero event={event} />

            <EventDetails event={event} />

            <EventItinerary event={event} />

            <EventReviews reviews={reviews} />
          </Box>
        </Grid>

        {/* Columna Lateral: Info Clave */}
        <Grid size={{ xs: 12, md: 4 }}>
          <EventSidebar
            event={event}
            user={user}
            isAuthenticated={isAuthenticated}
            isSubscribing={isSubscribing}
            isAlreadySubscribed={isAlreadySubscribed}
            isEventEnded={isEventEnded}
            error={error}
            onSubscribe={handleSubscribe}
          />
        </Grid>
      </Grid>
    </Container>
  )
}

export default Eventos
