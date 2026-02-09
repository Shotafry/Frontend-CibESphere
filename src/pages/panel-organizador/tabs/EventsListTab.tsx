import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Divider,
  Stack,
  Chip,
  LinearProgress,
  Collapse,
  Alert
} from '@mui/material'
import { Button } from '../../../components/Button'
import EventIcon from '@mui/icons-material/Event'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import PeopleIcon from '@mui/icons-material/People'
import { useNavigate } from 'react-router-dom'
import { Event } from '../../../types'
import { AttendeesList } from '../components/AttendeesList'

interface EventsListTabProps {
  events: Event[]
  onDeleteEvent: (id: string) => void
  onCreateEvent: () => void
  isDisabled?: boolean
}

export const EventsListTab: React.FC<EventsListTabProps> = ({
  events,
  onDeleteEvent,
  onCreateEvent,
  isDisabled = false
}) => {
  const navigate = useNavigate()
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)

  const handleToggleExpand = (eventId: string) => {
    setExpandedEvent((prev) => (prev === eventId ? null : eventId))
  }

  const now = new Date()

  const upcomingEvents = events
    .filter((e) => new Date(e.start_date) >= now)
    .sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    )

  const pastEvents = events
    .filter((e) => new Date(e.start_date) < now)
    .sort(
      (a, b) =>
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    )

  const renderEventList = (
    eventList: Event[],
    title: string,
    arePast: boolean = false
  ) => (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant='h6'
        fontWeight='bold'
        sx={{ mb: 2, color: arePast ? 'text.secondary' : 'var(--Gray-800)' }}
      >
        {title} ({eventList.length})
      </Typography>
      <Paper
        elevation={0}
        sx={{
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
          opacity: arePast ? 0.8 : 1,
          bgcolor: arePast ? '#F8FAFC' : 'white'
        }}
      >
        {eventList.map((event, index) => {
          const isLast = index === eventList.length - 1
          const isExpanded = expandedEvent === event.id
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
                  p: 3,
                  transition: 'background 0.2s',
                  '&:hover': { bgcolor: arePast ? '#F1F5F9' : '#F8FAFC' }
                }}
              >
                {/* Event Row */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    gap: 2
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant='h6'
                      fontWeight='bold'
                      onClick={() => navigate(`/eventos/${event.slug}`)}
                      sx={{
                        cursor: 'pointer',
                        color: arePast ? 'text.secondary' : 'var(--Gray-800)',
                        textDecoration: arePast ? 'line-through' : 'none',
                        '&:hover': {
                          color: 'var(--color-cadetblue)',
                          textDecoration: 'none'
                        }
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
                          arePast
                            ? 'Finalizado'
                            : event.status === 'published'
                              ? 'Publicado'
                              : 'Borrador'
                        }
                        size='small'
                        sx={{
                          bgcolor: arePast
                            ? '#E5E7EB'
                            : event.status === 'published'
                              ? '#DCFCE7'
                              : '#F3F4F6',
                          color: arePast
                            ? '#374151'
                            : event.status === 'published'
                              ? '#166534'
                              : '#4B5563',
                          fontWeight: 'bold'
                        }}
                      />
                      {event.current_attendees > 0 && (
                        <Chip
                          icon={<PeopleIcon sx={{ fontSize: 14 }} />}
                          label={`${event.current_attendees} asistentes`}
                          size='small'
                          sx={{
                            bgcolor: '#EDE9FE',
                            color: '#6D28D9',
                            fontWeight: 500
                          }}
                        />
                      )}
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
                      variant='primary'
                      size='small'
                      startIcon={
                        isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />
                      }
                      onClick={() => handleToggleExpand(event.id)}
                    >
                      {isExpanded ? 'Cerrar' : 'Asistentes'}
                    </Button>
                    <Button
                      variant='primary'
                      startIcon={<EditIcon />}
                      disabled={isDisabled || arePast}
                      onClick={() => navigate(`/eventos/${event.slug}/editar`)}
                      sx={
                        arePast ? { opacity: 0.5, pointerEvents: 'none' } : {}
                      }
                    >
                      Editar
                    </Button>
                    {!arePast && (
                      <IconButton
                        color='error'
                        onClick={() => onDeleteEvent(event.id)}
                        disabled={isDisabled}
                        sx={{
                          bgcolor: '#FEF2F2',
                          '&:hover': { bgcolor: '#FEE2E2' }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>

                {/* Expandable Attendees Section */}
                <Collapse in={isExpanded} timeout='auto' unmountOnExit>
                  <Box
                    sx={{
                      mt: 2,
                      pt: 2,
                      borderTop: '1px dashed #E2E8F0',
                      bgcolor: '#FAFAFA',
                      borderRadius: 2,
                      mx: { xs: -2, md: -1 },
                      px: { xs: 2, md: 3 },
                      pb: 1
                    }}
                  >
                    <AttendeesList eventId={event.id} limit={15} />
                  </Box>
                </Collapse>
              </Box>
              {!isLast && <Divider />}
            </React.Fragment>
          )
        })}
      </Paper>
    </Box>
  )

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography
          variant='h5'
          fontWeight='bold'
          sx={{ color: 'var(--Gray-800)' }}
        >
          Mis Eventos
        </Typography>
        {/* Podríamos poner filtros aquí si fuera necesario */}
      </Box>

      {events.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 8,
            textAlign: 'center',
            borderRadius: '20px',
            border: '1px solid #E2E8F0'
          }}
        >
          <EventIcon sx={{ fontSize: 60, color: 'var(--Gray-300)', mb: 2 }} />
          <Typography variant='h6' color='text.secondary'>
            No has creado ningún evento todavía.
          </Typography>
          <Button
            variant='secondary'
            onClick={onCreateEvent}
            sx={{ mt: 2 }}
            disabled={isDisabled}
          >
            Crear mi primer evento
          </Button>
        </Paper>
      ) : (
        <Box>
          {upcomingEvents.length > 0 &&
            renderEventList(upcomingEvents, 'Próximos Eventos')}

          {pastEvents.length > 0 &&
            renderEventList(pastEvents, 'Eventos Pasados', true)}

          {upcomingEvents.length === 0 && pastEvents.length === 0 && (
            <Alert severity='info'>No se encontraron eventos.</Alert>
          )}
        </Box>
      )}
    </Box>
  )
}
