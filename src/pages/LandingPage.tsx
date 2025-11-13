// src/pages/LandingPage.tsx
import { FunctionComponent } from 'react'
import {
  Box,
  Typography,
  Container,
  Grid,
  CircularProgress,
  Divider // <-- Añadido para separar
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useLoaderData, useNavigation } from 'react-router-dom'
import { Hero } from '../components/Hero' // <-- 1. IMPORTAR EL HERO
import { EventMap } from '../components/EventMap'
import { EventCard } from '../components/EventCard'
import { Event, EventFilterParams } from '../types'
import { EventFilters } from '../components/EventFilters'
import ComunidadBox from '../components/AboutThis'

interface LandingLoaderData {
  events: Event[]
  filters: EventFilterParams
}

const LandingPage: FunctionComponent = () => {
  const { events, filters } = useLoaderData() as LandingLoaderData
  const navigation = useNavigation()

  const isLoading = navigation.state === 'loading'

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* 2. AÑADIR EL HERO AQUÍ (fuera del Container) */}
      <Hero />

      {/* El resto del contenido de la página */}
      <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
        {/* Box de comunidad antes de Próximos Eventos */}
        <ComunidadBox />

        {/* Título de la sección de eventos */}
        <Typography
          variant='h3' // Un poco más pequeño que el del Hero
          component='h2'
          gutterBottom
          align='center'
          fontWeight='bold'
          sx={{ mt: 4, mb: 4 }}
        >
          Próximos Eventos
        </Typography>

        {/* Damos un ID a los filtros para que el botón del Hero pueda "saltar" aquí */}
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
              <Grid item size={{ xs: 12 }}>
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
