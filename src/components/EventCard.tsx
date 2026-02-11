// src/components/EventCard.tsx
import React, { useCallback, useState, useEffect } from 'react'
import { Box, Typography, Grid, Chip, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Event, Role } from '../types'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import GroupIcon from '@mui/icons-material/Group'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { useAuth } from '../context/AuthContext'
import { toggleBookmarkWithStatus, getMe } from '../services/apiService'
import { motion } from 'framer-motion'

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

const capitalizeTag = (tag: string) => {
  if (!tag) return ''
  return tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate()

  const { user, refreshUserData } = useAuth()
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    if (user) {
      // El backend devuelve 'favorite_events' en snake_case
      const favorites = user.favorite_events || (user as any).FavoriteEvents
      if (favorites && Array.isArray(favorites)) {
        setIsBookmarked(favorites.some((e: any) => e.id === event.id))
      } else {
        setIsBookmarked(false)
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
      const result = await toggleBookmarkWithStatus(
        user.id,
        event.id,
        isBookmarked
      )
      setIsBookmarked(result.isBookmarked)

      // Update global user context to reflect changes in "Guardados" immediately
      const updatedUser = await getMe()
      refreshUserData(updatedUser)
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    }
  }

  return (
    <Grid size={{ xs: 12 }} sx={{ maxWidth: '100%' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
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
            mb: { xs: 2, sm: 3, md: 2 },
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
              event.card_image_url ||
              event.image_url ||
              '/img/brand/logo-main-full.png'
            }
            alt={`Imagen de ${event.title}`}
            sx={{
              width: { xs: '100%', md: 260 },
              height: { xs: 140, sm: 180, md: 260 },
              objectFit: 'contain',
              zIndex: 2,
              marginRight: { md: -6 },
              marginBottom: { xs: -2, md: 0 },
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
              p: { xs: 2, sm: 3, md: 4 },
              pt: { xs: 4, sm: 5, md: 4 },
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
            {user?.role !== Role.Organizer && (
              <Box
                sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}
              >
                <IconButton
                  onClick={handleBookmarkClick}
                  aria-label={
                    isBookmarked
                      ? 'Eliminar de favoritos'
                      : 'Guardar en favoritos'
                  }
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
            )}

            <Box>
              <Typography variant='h5' component='h3' fontWeight='bold' mb={1}>
                {event.title}
              </Typography>
              <Typography
                variant='body2'
                color='var(--Gray-700)'
                sx={{ mb: 2 }}
              >
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
                        event.venue_state || event.venue_community
                          ? ', ' + (event.venue_state || event.venue_community)
                          : ''
                      }`}
                </Typography>
              </Grid>
              <Grid
                size={{ xs: 12, sm: 4 }}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <GroupIcon sx={{ mr: 1, color: 'var(--Logo-2)' }} />
                <Typography variant='body2'>
                  {event.max_attendees
                    ? `${event.current_attendees || 0}/${
                        event.max_attendees
                      } asistentes`
                    : `${event.current_attendees || 0} asistentes`}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {event.tags &&
                event.tags.slice(0, 5).map((tag) => (
                  <Chip
                    key={tag}
                    label={capitalizeTag(tag)}
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
      </motion.div>
    </Grid>
  )
}
