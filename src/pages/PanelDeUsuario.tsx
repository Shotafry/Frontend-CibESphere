// src/pages/PanelDeUsuario.tsx
import React, { FunctionComponent } from 'react'
import {
  Box,
  Typography,
  Grid,
  Container,
  CircularProgress,
  Paper,
  Button,
  Divider
} from '@mui/material'
import { useLoaderData, useNavigate, useNavigation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Event, User } from '../types'
import * as apiService from '../services/apiService'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import PersonIcon from '@mui/icons-material/Person'

const EventSubscribedCard: React.FC<{
  event: Event
  onCancel: (eventId: string) => void
}> = ({ event, onCancel }) => {
  const navigate = useNavigate()
  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Box>
        <Typography
          variant='h6'
          onClick={() => navigate(`/eventos/${event.slug}`)}
          sx={{ cursor: 'pointer' }}
        >
          {event.title}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {new Date(event.start_date).toLocaleDateString('es-ES', {
            dateStyle: 'long'
          })}
        </Typography>
      </Box>
      <Button
        variant='outlined'
        color='error'
        onClick={() => onCancel(event.id)}
      >
        Cancelar Inscripción
      </Button>
    </Paper>
  )
}

const PanelDeUsuario: FunctionComponent = () => {
  const { user, refreshUserData } = useAuth() // Añadido refreshUserData

  // --- CORREGIDO: Tipado a Event[] y nombre de variable ---
  const initialEvents = useLoaderData() as Event[]
  const navigation = useNavigation()
  const [subscribedEvents, setSubscribedEvents] = React.useState(initialEvents)
  // --- FIN CORREGIDO ---

  const handleCancelSubscription = async (eventId: string) => {
    if (!user) return
    try {
      // Usamos la API simulada (que no necesita user.id, pero lo mantenemos por coherencia)
      await apiService.unsubscribeFromEvent(user.id, eventId)

      // Actualizamos el estado local
      const newSubscribedEvents = subscribedEvents.filter(
        (e) => e.id !== eventId
      )
      setSubscribedEvents(newSubscribedEvents)

      // Actualizamos el estado global en AuthContext
      const updatedUser = {
        ...user,
        FavoriteEvents: newSubscribedEvents
      }
      refreshUserData(updatedUser) // <-- Actualiza el localStorage
    } catch (error) {
      console.error('Error al cancelar la inscripción:', error)
      // Notificación de error
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

  return (
    <Container maxWidth='lg' sx={{ my: 5 }}>
      <Typography variant='h4' component='h1' gutterBottom fontWeight='bold'>
        Panel de Usuario
      </Typography>
      <Grid container spacing={4}>
        <Grid item size={{ xs: 12, md: 4 }}>
          {' '}
          {/* 'item' añadido */}
          <Paper sx={{ p: 3, borderRadius: '16px' }}>
            <Typography variant='h6' gutterBottom>
              Mi Perfil
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <PersonIcon />
              <Typography>
                {user?.first_name} {user?.last_name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <MailOutlineIcon />
              <Typography>{user?.email}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item size={{ xs: 12, md: 8 }}>
          {' '}
          {/* 'item' añadido */}
          <Typography variant='h5' component='h2' gutterBottom>
            Mis Eventos Inscritos (Favoritos)
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {subscribedEvents.length > 0 ? (
              subscribedEvents.map((event) => (
                <EventSubscribedCard
                  key={event.id}
                  event={event}
                  onCancel={handleCancelSubscription}
                />
              ))
            ) : (
              <Typography>No estás inscrito en ningún evento.</Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

export default PanelDeUsuario
