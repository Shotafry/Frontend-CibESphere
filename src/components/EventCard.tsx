// src/components/EventCard.tsx
import React, { useCallback } from 'react'
import { Box, Typography, Grid, Chip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Event } from '../types'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import GroupIcon from '@mui/icons-material/Group'

interface EventCardProps {
  event: Event
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate()

  const onCardClick = useCallback(() => {
    navigate(`/eventos/${event.slug || event.id}`)
  }, [navigate, event])

  return (
    <Grid size={{ xs: 12 }} sx={{ maxWidth: '100%' }}>
      <Box
        onClick={onCardClick}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center', // Centrado verticalmente
          width: '100%',
          maxWidth: 1362,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'visible', // Permitir que la imagen sobresalga si es necesario
          mt: { xs: 0, md: 2 }, // Margen superior en desktop para la imagen grande
          mb: { xs: 4, md: 2 }
        }}
      >
        {/* Imagen del Evento (Flotante/Superpuesta) */}
        <Box
          component='img'
          className='event-logo'
          src={
            event.image_url ||
            '/cyberLogo-gigapixel-art-scale-2-00x-godpix-1@2x.png'
          }
          alt={`Imagen de ${event.title}`}
          sx={{
            width: { xs: '100%', md: 260 },
            height: { xs: 200, md: 260 },
            objectFit: 'cover',
            borderRadius: { xs: '25px 25px 0 0', md: '25px' }, // Redondeado completo en desktop
            boxShadow: { md: '4px 4px 20px rgba(0,0,0,0.25)' }, // Sombra fuerte en desktop
            zIndex: 2, // Por encima de la tarjeta
            marginRight: { md: -6 }, // Margen negativo para superponerse
            marginBottom: { xs: -3, md: 0 }, // Margen negativo en mobile para unir
            position: 'relative'
          }}
        />

        {/* Contenido de la Card */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: { xs: 3, md: 4 },
            pt: { xs: 5, md: 4 }, // Padding extra arriba en mobile por el overlap
            pl: { md: 10 }, // Padding extra a la izquierda en desktop por el overlap
            borderRadius: '25px',
            background: 'var(--Background-events-2)',
            boxShadow: 'var(--shadow-drop)',
            color: 'var(--event-2)',
            fontFamily: 'var(--Heading-Font-Family)',
            minHeight: { md: '220px' },
            zIndex: 1,
            width: '100%'
          }}
        >
          <Box>
            <Typography variant='h5' component='h3' fontWeight='bold' mb={1}>
              {event.title}
            </Typography>
            <Typography variant='body2' color='var(--Gray-700)' sx={{ mb: 2 }}>
              {event.short_desc}
            </Typography>
          </Box>

          <Grid container spacing={2} alignItems='center'>
            <Grid
              size={{ xs: 12, sm: 4 }}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <CalendarTodayIcon sx={{ mr: 1, color: 'var(--Logo-2)' }} />
              <Typography variant='body2'>
                {formatDate(event.start_date)}
              </Typography>
            </Grid>
            <Grid
              size={{ xs: 12, sm: 4 }}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <LocationOnIcon sx={{ mr: 1, color: 'var(--Logo-2)' }} />
              <Typography variant='body2'>
                {event.is_online
                  ? 'Online'
                  : `${event.venue_city}, ${event.venue_community}`}
              </Typography>
            </Grid>
            <Grid
              size={{ xs: 12, sm: 4 }}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <GroupIcon sx={{ mr: 1, color: 'var(--Logo-2)' }} />
              <Typography variant='body2'>
                {event.current_attendees} asistentes
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {event.tags.slice(0, 4).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size='small'
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'var(--White)'
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Grid>
  )
}
