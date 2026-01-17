import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Divider,
  Stack,
  Chip,
  LinearProgress
} from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useNavigate } from 'react-router-dom'
import { Event } from '../../../types'

interface EventsListTabProps {
  events: Event[]
  onDeleteEvent: (id: string) => void
  onCreateEvent: () => void
}

export const EventsListTab: React.FC<EventsListTabProps> = ({
  events,
  onDeleteEvent,
  onCreateEvent
}) => {
  const navigate = useNavigate()

  return (
    <Box>
      <Typography
        variant='h5'
        fontWeight='bold'
        sx={{ mb: 3, color: 'var(--Gray-800)' }}
      >
        Mis Eventos Recientes
      </Typography>
      <Paper
        elevation={0}
        sx={{
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid #E2E8F0'
        }}
      >
        {events.length > 0 ? (
          events.map((event, index) => {
            const isLast = index === events.length - 1
            const occupancy =
              event.max_attendees && event.max_attendees > 0
                ? Math.round(
                    (event.current_attendees / event.max_attendees) * 100
                  )
                : 0

            return (
              <React.Fragment key={event.id}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    p: 3,
                    gap: 2,
                    transition: 'background 0.2s',
                    '&:hover': { bgcolor: '#F8FAFC' }
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant='h6'
                      fontWeight='bold'
                      onClick={() => navigate(`/eventos/${event.slug}`)}
                      sx={{
                        cursor: 'pointer',
                        color: 'var(--Gray-800)',
                        '&:hover': { color: 'var(--color-cadetblue)' }
                      }}
                    >
                      {event.title}
                    </Typography>
                    <Stack
                      direction='row'
                      spacing={2}
                      sx={{ mt: 1 }}
                      alignItems='center'
                    >
                      <Typography variant='body2' color='text.secondary'>
                        📅{' '}
                        {new Date(event.start_date).toLocaleDateString(
                          'es-ES',
                          { dateStyle: 'long' }
                        )}
                      </Typography>
                      <Chip
                        label={
                          event.status === 'published'
                            ? 'Publicado'
                            : 'Borrador'
                        }
                        size='small'
                        sx={{
                          bgcolor:
                            event.status === 'published'
                              ? '#DCFCE7'
                              : '#F3F4F6',
                          color:
                            event.status === 'published'
                              ? '#166534'
                              : '#4B5563',
                          fontWeight: 'bold'
                        }}
                      />
                    </Stack>
                  </Box>

                  {/* Barra de Aforo */}
                  {event.max_attendees && event.max_attendees > 0 && (
                    <Box sx={{ width: { xs: '100%', md: 200 } }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 0.5
                        }}
                      >
                        <Typography
                          variant='caption'
                          fontWeight='bold'
                          color='text.secondary'
                        >
                          Aforo
                        </Typography>
                        <Typography
                          variant='caption'
                          fontWeight='bold'
                          color={
                            occupancy >= 100 ? 'error.main' : 'primary.main'
                          }
                        >
                          {occupancy}% ({event.current_attendees}/
                          {event.max_attendees})
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant='determinate'
                        value={occupancy > 100 ? 100 : occupancy}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: '#E2E8F0',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: occupancy >= 100 ? '#EF4444' : '#3B82F6'
                          }
                        }}
                      />
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant='contained' // Was 'primary' in custom Button, using generic MUI or custom if available. Original used 'primary', assuming Theme has it or it's custom.
                      // Checking original PanelDeOrganizador.tsx: import { Button } from '../components/Button'.
                      // I should import Button from ../../components/Button to match style perfectly.
                      // Let's fix imports in next step or use standard MUI Button temporarily if custom one complex.
                      // PanelDeOrganizador used: import { Button } from '../components/Button'
                      // So I should use that.
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/eventos/${event.slug}/editar`)}
                      sx={{
                        bgcolor: 'var(--color-cadetblue)',
                        '&:hover': { bgcolor: '#3a8e99' }
                      }} // Fallback if custom variant fails
                    >
                      Editar
                    </Button>
                    <IconButton
                      color='error'
                      onClick={() => onDeleteEvent(event.id)}
                      sx={{
                        bgcolor: '#FEF2F2',
                        '&:hover': { bgcolor: '#FEE2E2' }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                {!isLast && <Divider />}
              </React.Fragment>
            )
          })
        ) : (
          <Box sx={{ p: 8, textAlign: 'center' }}>
            <EventIcon sx={{ fontSize: 60, color: 'var(--Gray-300)', mb: 2 }} />
            <Typography variant='h6' color='text.secondary'>
              No has creado ningún evento todavía.
            </Typography>
            <Button variant='outlined' onClick={onCreateEvent} sx={{ mt: 2 }}>
              Crear mi primer evento
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  )
}
