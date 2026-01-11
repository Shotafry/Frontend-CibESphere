// src/pages/LandingPage.tsx
import { FunctionComponent, useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Container,
  Grid,
  CircularProgress,
  Divider
} from '@mui/material'
import { useLoaderData } from 'react-router-dom'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Hero } from '../components/Hero'
import { EventMap } from '../components/EventMap'
import { EventCard } from '../components/EventCard'
import { Event, EventFilterParams } from '../types'
import { EventFilters } from '../components/EventFilters'
import ComunidadBox from '../components/AboutThis'
import { getEvents } from '../services/apiService'
import { Button } from '../components/Button'

// ... imports

const LandingPage: FunctionComponent = () => {
  const { events: initialEvents, filters: loaderFilters } = useLoaderData() as {
    events: Event[]
    filters: EventFilterParams
  }

  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [filters, setFilters] = useState<EventFilterParams>(loaderFilters)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const LIMIT = 15

  // Reset state when filters (URL) change
  useEffect(() => {
    setEvents(initialEvents)
    setFilters(loaderFilters)
    setPage(1)
    // If we received fewer than LIMIT events, we probably reached the end
    setHasMore(initialEvents.length >= LIMIT)
  }, [initialEvents, loaderFilters])

  const handleLoadMore = async () => {
    setIsLoadingMore(true)
    const nextPage = page + 1
    try {
      const newEvents = await getEvents({
        ...filters,
        page: nextPage,
        limit: LIMIT
      })

      if (newEvents.length < LIMIT) {
        setHasMore(false)
      }

      setEvents((prev) => [...prev, ...newEvents])
      setPage(nextPage)
    } catch (error) {
      console.error('Failed to load more events', error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Hero />

      <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
        <ComunidadBox />

        <Typography
          variant='h3'
          component='h2'
          gutterBottom
          align='center'
          fontWeight='bold'
          sx={{ mt: 4, mb: 4 }}
        >
          Próximos Eventos
        </Typography>

        <Box id='filtros'>
          <EventFilters initialFilters={filters} />
        </Box>

        <Box sx={{ my: 5, display: 'flex', justifyContent: 'center' }}>
          <EventMap events={events} />
        </Box>

        <Grid container spacing={4} justifyContent='center'>
          {events.length > 0 ? (
            events.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <Grid size={{ xs: 12 }}>
              <Typography align='center' sx={{ mt: 5 }}>
                No se encontraron eventos que coincidan con los filtros
                seleccionados.
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Load More Button */}
        {hasMore && events.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              variant='secondary'
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                boxShadow: '0 4px 14px 0 rgba(0,118,255,0.15)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,118,255,0.23)'
                }
              }}
            >
              {isLoadingMore ? (
                <CircularProgress size={24} color='inherit' />
              ) : (
                'Cargar Más Eventos'
              )}
            </Button>
          </Box>
        )}
      </Container>
    </LocalizationProvider>
  )
}

export default LandingPage
