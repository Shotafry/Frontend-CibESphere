// src/components/EventCard.tsx
import React, { useCallback, useState, useEffect } from 'react'
import { Box, Typography, Grid, Chip, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Event } from '../types'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import GroupIcon from '@mui/icons-material/Group'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { useAuth } from '../context/AuthContext'
import { toggleBookmark } from '../services/apiService'

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

  const { user, refreshUserData } = useAuth()
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    if (user && (user as any).FavoriteEvents) {
      const userDetail = user as any
      const favorites = userDetail.favorite_events || userDetail.FavoriteEvents
      if (favorites && Array.isArray(favorites)) {
        setIsBookmarked(favorites.some((e: any) => e.id === event.id))
      }
    }
  }, [user, event.id])

  const onCardClick = useCallback(() => {
    navigate(`/eventos/${event.slug || event.id}`)
  }, [navigate, event])

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) {
      navigate('/loginsign-up')
      return
    }
    try {
      const result = await toggleBookmark(user.id, event.id)
      setIsBookmarked(result.isBookmarked)

      if (user) {
        // Optimistic update handled by local state mostly for now
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    }
  }

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
          transition: 'all 0.3s ease-out',
          '&:hover': {
            transform: 'translateY(-8px)',
            '& .event-content': {
              boxShadow: '0 18px 40px -5px rgba(79, 186, 200, 0.5)'
            }
          }
        }}
      >
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
            objectFit: 'contain',
            zIndex: 2,
            marginRight: { md: -6 },
            marginBottom: { xs: -3, md: 0 },
            position: 'relative',
            filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.1))'
          }}
        />

        <Box
          className='event-content'
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: { xs: 3, md: 4 },
            pt: { xs: 5, md: 4 },
            pl: { md: 10 },
            borderRadius: '25px',
            backgroundColor: 'var(--White)',
            backgroundImage: 'var(--Background-events-2)',
            boxShadow: 'var(--shadow-drop)',
            color: 'var(--event-2)',
            fontFamily: 'var(--Heading-Font-Family)',
            minHeight: { md: '220px' },
            zIndex: 1,
            width: '100%',
            transition: 'all 0.3s ease',
            position: 'relative'
          }}
        >
          <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
            <IconButton
              onClick={handleBookmarkClick}
              sx={{
                bgcolor: 'rgba(255,255,255,0.8)',
                '&:hover': { bgcolor: 'white' }
              }}
            >
              {isBookmarked ? (
                <BookmarkIcon sx={{ color: 'var(--color-cadetblue)' }} />
              ) : (
                <BookmarkBorderIcon sx={{ color: 'var(--Gray-500)' }} />
              )}
            </IconButton>
          </Box>

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
                  : `${event.venue_city || ''}${
                      event.venue_country ? ', ' + event.venue_country : ''
                    }`}
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
            {event.tags &&
              event.tags.slice(0, 4).map((tag) => (
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
