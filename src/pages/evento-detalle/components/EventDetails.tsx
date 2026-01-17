import React from 'react'
import { Box, Typography, Chip } from '@mui/material'
import CategoryIcon from '@mui/icons-material/Category'
import SchoolIcon from '@mui/icons-material/School'
import { Event } from '../../../types'

interface EventDetailsProps {
  event: Event
}

export const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  return (
    <>
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
    </>
  )
}
