import React from 'react'
import { Box, Typography, Divider } from '@mui/material'
import { Link } from 'react-router-dom'
import { Event } from '../../../types'
import defaultLogo from '/img/brand/logo-main-full.png'

interface EventHeroProps {
  event: Event
}

export const EventHero: React.FC<EventHeroProps> = ({ event }) => {
  return (
    <>
      <Box
        component='img'
        src={event.banner_url || event.image_url || defaultLogo}
        alt={`Banner de ${event.title}`}
        sx={{
          width: '100%',
          height: { xs: 200, sm: 280, md: 400 },
          objectFit: 'cover',
          borderRadius: '15px',
          mb: { xs: 2, md: 4 }
        }}
      />
      <Typography
        variant='h3'
        component='h1'
        fontWeight='900'
        gutterBottom
        sx={{
          color: 'var(--Gray-700)',
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
        }}
      >
        {event.title}
      </Typography>

      {/* ENLACE A ORGANIZACIÓN */}
      {event.organization && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant='subtitle1' color='text.secondary'>
            Organizado por:
          </Typography>
          <Link
            to={`/organizacion/${event.organization.slug || '#'}`}
            style={{ textDecoration: 'none' }}
          >
            <Typography
              variant='subtitle1'
              fontWeight='bold'
              sx={{
                color: '#01c0fa',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              {event.organization.name}
            </Typography>
          </Link>
        </Box>
      )}

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
    </>
  )
}
