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
          alignItems: 'center',
          width: '100%',
          maxWidth: 1362,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'visible',
          mt: { xs: 0, md: 2 },
          mb: { xs: 4, md: 2 },
          // --- NUEVO: Efecto Hover en toda la tarjeta ---
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            // Aplicamos el efecto de sombra al contenedor del contenido, ya que es el que tiene fondo
            '& .event-content': {
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
            }
          }
        }}
      >
        {/* Imagen del Evento (Flotante/Superpuesta) - SIN SOMBRA NI CAJA */}
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
            objectFit: 'contain', // Cambiado a contain para que se vea el logo entero
            zIndex: 2,
            marginRight: { md: -6 },
            marginBottom: { xs: -3, md: 0 },
            position: 'relative',
            // Eliminadas sombras y bordes redondeados específicos
            filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.1))' // Sombra sutil SOLO a la silueta del logo si es PNG
          }}
        />

        {/* Contenido de la Card */}
        <Box
          className='event-content' // Clase para el selector del hover
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: { xs: 3, md: 4 },
            pt: { xs: 5, md: 4 },
            pl: { md: 10 },
            borderRadius: '25px',
            background: 'var(--Background-events-2)',
            boxShadow: 'var(--shadow-drop)',
            color: 'var(--event-2)',
            fontFamily: 'var(--Heading-Font-Family)',
            minHeight: { md: '220px' },
            zIndex: 1,
            width: '100%',
            transition: 'box-shadow 0.3s ease'
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
