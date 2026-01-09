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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Hero } from '../components/Hero'
import { EventMap } from '../components/EventMap'
import { EventCard } from '../components/EventCard'
import { Event, EventFilterParams } from '../types'
import { EventFilters } from '../components/EventFilters'
import ComunidadBox from '../components/AboutThis'
import { getEvents } from '../services/apiService'

const LandingPage: FunctionComponent = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [filters, setFilters] = useState<EventFilterParams>({
    startDate: null,
    endDate: null,
    tags: [],
    locations: [],
    levels: [],
    languages: [],
    search: '',
    type: ''
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      try {
        const response = await getEvents({})
        if (Array.isArray(response)) {
          setEvents(response)
        } else if ((response as any).data) {
          setEvents((response as any).data)
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

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

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
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
        )}
      </Container>
    </LocalizationProvider>
  )
}

export default LandingPage
