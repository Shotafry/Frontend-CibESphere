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
    // Grid v2: No se necesita el prop `component` ni `item`.
    // El tamaño se define con el prop `size`.
    <Grid size={{ xs: 12 }} sx={{ maxWidth: '100%' }}>
      <Box
        onClick={onCardClick}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'stretch',
          width: '100%',
          maxWidth: 1362,
          cursor: 'pointer',
          borderRadius: '25px',
          background: 'var(--Background-events-2)',
          boxShadow: 'var(--shadow-drop)',
          color: 'var(--event-2)',
          fontFamily: 'var(--Heading-Font-Family)',
          minHeight: '225px',
          overflow: 'hidden' // Para que el borde redondeado afecte a la imagen
        }}
      >
        {/* Imagen del Evento */}
        <Box
          component='img'
          className='event-logo'
          src={
            event.image_url ||
            '/cyberLogo-gigapixel-art-scale-2-00x-godpix-1@2x.png'
          }
          alt={`Imagen de ${event.title}`}
          sx={{
            width: { xs: '100%', md: 300 },
            height: { xs: 200, md: 'auto' },
            objectFit: 'cover',
            borderTopLeftRadius: { xs: '25px', md: '25px' },
            borderBottomLeftRadius: { xs: 0, md: '25px' },
            borderTopRightRadius: { xs: '25px', md: 0 }
          }}
        />

        {/* Contenido de la Card */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 3,
            flex: 1
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
              item // 'item' añadido por claridad
              size={{ xs: 12, sm: 4 }}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <CalendarTodayIcon
                sx={{ mr: 1, color: 'var(--Logo-2)' }}
              />
              <Typography variant='body2'>
                {formatDate(event.start_date)}
              </Typography>
            </Grid>
            <Grid
              item
              size={{ xs: 12, sm: 4 }}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <LocationOnIcon
                sx={{ mr: 1, color: 'var(--Logo-2)' }}
              />
              <Typography variant='body2'>
                {/* --- LÍNEA CORREGIDA --- */}
                {event.is_online
                  ? 'Online'
                  : `${event.venue_city}, ${event.venue_community}`}
                {/* --- FIN CORRECCIÓN --- */}
              </Typography>
            </Grid>
            <Grid
              item
              size={{ xs: 12, sm: 4 }}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <GroupIcon
                sx={{ mr: 1, color: 'var(--Logo-2)' }}
              />
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
