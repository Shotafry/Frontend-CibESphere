import React from 'react'
import {
  Box,
  Typography,
  Grid,
  Stack,
  Paper,
  Button as MuiButton,
  Fade
} from '@mui/material'
import StarHalfIcon from '@mui/icons-material/StarHalf'
import { Event } from '../../../types'
import { EventCard } from '../../../components/EventCard'
import { Button } from '../../../components/Button'

interface EventsTabProps {
  upcomingEvents: Event[]
  pastEvents: Event[]
  handleCancelSubscription: (eventId: string) => void
  handleOpenReviewModal: (event: Event) => void
}

export const EventsTab: React.FC<EventsTabProps> = ({
  upcomingEvents,
  pastEvents,
  handleCancelSubscription,
  handleOpenReviewModal
}) => {
  return (
    <Box>
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        <Grid item xs={12} md={8}>
          <Typography
            variant='h6'
            fontWeight='bold'
            gutterBottom
            sx={{ mb: 3 }}
          >
            Próximos Eventos ({upcomingEvents.length})
          </Typography>
          <Stack spacing={3}>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <Box key={event.id} sx={{ position: 'relative' }}>
                  <EventCard event={event} />
                  <Button
                    variant='secondary'
                    size='small'
                    onClick={() => handleCancelSubscription(event.id)}
                    sx={{
                      position: 'absolute',
                      top: { xs: 8, md: 'auto' },
                      bottom: { xs: 'auto', md: 26 },
                      right: { xs: 8, md: 14 },
                      zIndex: 20,
                      fontSize: { xs: '0.7rem', md: '0.875rem' },
                      py: { xs: 0.5, md: 0.75 },
                      px: { xs: 1.5, md: 2 },
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  >
                    Cancelar
                  </Button>
                </Box>
              ))
            ) : (
              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: '16px',
                  bgcolor: 'white'
                }}
              >
                <Typography color='text.secondary'>
                  No tienes eventos próximos.
                </Typography>
                <Button variant='primary' href='/' sx={{ mt: 2 }}>
                  Explorar Eventos
                </Button>
              </Paper>
            )}
          </Stack>

          {pastEvents.length > 0 && (
            <Box sx={{ mt: 6 }}>
              <Typography
                variant='h6'
                fontWeight='bold'
                gutterBottom
                sx={{ mb: 3, opacity: 0.7 }}
              >
                Historial de Eventos ({pastEvents.length})
              </Typography>
              <Stack spacing={3} sx={{ opacity: 0.8 }}>
                {pastEvents.map((event) => (
                  <Paper
                    key={event.id}
                    elevation={0}
                    sx={{
                      p: 0,
                      borderRadius: '25px',
                      overflow: 'hidden',
                      bgcolor: 'white',
                      border: '1px solid #E2E8F0',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <EventCard event={event} />
                    <Box
                      sx={{
                        p: 2,
                        borderTop: '1px solid #E2E8F0',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        bgcolor: '#FAFAFA'
                      }}
                    >
                      <Button
                        variant='secondary'
                        startIcon={<StarHalfIcon />}
                        onClick={() => handleOpenReviewModal(event)}
                      >
                        Escribir Reseña
                      </Button>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: '20px',
              bgcolor: 'white',
              border: '1px solid #E2E8F0'
            }}
          >
            <Typography variant='h6' fontWeight='bold' gutterBottom>
              Resumen
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: '#F8FAFC',
                  borderRadius: '12px'
                }}
              >
                <Typography color='text.secondary'>
                  Eventos Asistidos
                </Typography>
                <Typography fontWeight='bold'>{pastEvents.length}</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: '#F8FAFC',
                  borderRadius: '12px'
                }}
              >
                <Typography color='text.secondary'>Próximos</Typography>
                <Typography fontWeight='bold' color='primary'>
                  {upcomingEvents.length}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
