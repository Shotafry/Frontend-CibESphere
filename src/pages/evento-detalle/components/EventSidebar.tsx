import React from 'react'
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import { Event, User, Role } from '../../../types'
import { LazySingleEventMap } from '../../../components/LazyMap'

interface EventSidebarProps {
  event: Event
  user: User | null
  isAuthenticated: boolean
  isSubscribing: boolean
  isAlreadySubscribed: boolean | undefined
  isEventEnded: boolean
  error: string | null
  onSubscribe: () => void
}

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

export const EventSidebar: React.FC<EventSidebarProps> = ({
  event,
  user,
  isAuthenticated,
  isSubscribing,
  isAlreadySubscribed,
  isEventEnded,
  error,
  onSubscribe
}) => {
  const isFull = !!(
    event.max_attendees &&
    event.max_attendees > 0 &&
    event.current_attendees >= event.max_attendees
  )

  const isDisabled =
    !isAuthenticated ||
    isAlreadySubscribed ||
    isSubscribing ||
    isEventEnded ||
    isFull

  return (
    <Box sx={{ position: 'sticky', top: 24 }}>
      <Box
        sx={{
          backgroundColor: 'var(--White)',
          borderRadius: '25px',
          p: 4,
          boxShadow: 'var(--shadow-drop)',
          mb: 4
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <CalendarTodayIcon
            sx={{ color: 'var(--color-cadetblue)', mr: 2, fontSize: 28 }}
          />
          <Box>
            <Typography variant='subtitle2' color='textSecondary'>
              Fecha y Hora
            </Typography>
            <Typography variant='body1' fontWeight='bold'>
              {formatDateRange(event.start_date, event.end_date)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <LocationOnIcon
            sx={{ color: 'var(--color-cadetblue)', mr: 2, fontSize: 28 }}
          />
          <Box>
            <Typography variant='subtitle2' color='textSecondary'>
              Ubicación
            </Typography>
            {event.is_online ? (
              <Typography variant='body1' fontWeight='bold'>
                Evento Online
              </Typography>
            ) : (
              <>
                <Typography variant='body1' fontWeight='bold'>
                  {event.venue_name}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  {[
                    event.venue_address,
                    event.venue_city,
                    event.venue_community
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </Typography>
              </>
            )}
          </Box>
        </Box>

        {/* Map for in-person events with coordinates */}
        {!event.is_online && event.latitude && event.longitude && (
          <Box
            sx={{
              mb: 3,
              borderRadius: '12px',
              overflow: 'hidden',
              height: '250px', // Explicit height required for Leaflet
              width: '100%'
            }}
          >
            <LazySingleEventMap event={event} />
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <ConfirmationNumberIcon
            sx={{ color: 'var(--color-cadetblue)', mr: 2, fontSize: 28 }}
          />
          <Box>
            <Typography variant='subtitle2' color='textSecondary'>
              Precio
            </Typography>
            <Typography
              variant='h5'
              fontWeight='bold'
              color='var(--color-cadetblue)'
            >
              {event.is_free
                ? 'Gratis'
                : `${
                    event.ticket_types && event.ticket_types.length > 1
                      ? 'Desde '
                      : ''
                  }${((event.price || 0) / 100).toFixed(2)} €`}
            </Typography>
          </Box>
        </Box>

        {user?.role !== Role.Organizer && (
          <>
            <Button
              variant='contained'
              fullWidth
              size='large'
              disabled={isDisabled}
              onClick={onSubscribe}
              sx={{
                borderRadius: '12px',
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                background: isDisabled
                  ? 'var(--Gray-300)'
                  : 'var(--gradient-button-primary)',
                color: isDisabled ? 'var(--Gray-500)' : 'var(--White)',
                boxShadow: isDisabled
                  ? 'none'
                  : '0 4px 14px rgba(0, 217, 255, 0.4)',
                '&:hover': {
                  background: isDisabled
                    ? 'var(--Gray-300)'
                    : 'var(--gradient-button-primary-hover)',
                  boxShadow: isDisabled
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
              ) : isEventEnded ? (
                'Evento Finalizado'
              ) : isFull ? (
                'Aforo Completo'
              ) : (
                'Inscribirse Ahora'
              )}
            </Button>
            {error && (
              <Alert severity='error' sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </>
        )}
      </Box>
    </Box>
  )
}
