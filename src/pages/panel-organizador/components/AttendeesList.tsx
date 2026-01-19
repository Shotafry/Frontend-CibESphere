// src/pages/panel-organizador/components/AttendeesList.tsx
import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PersonIcon from '@mui/icons-material/Person'
import RefreshIcon from '@mui/icons-material/Refresh'
import {
  attendeeService,
  Attendee,
  AttendeeListResponse
} from '../../../services/api/attendee.service'

interface AttendeesListProps {
  eventId: string
  limit?: number
}

export const AttendeesList: React.FC<AttendeesListProps> = ({
  eventId,
  limit = 15
}) => {
  const [data, setData] = useState<AttendeeListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [checkingIn, setCheckingIn] = useState<string | null>(null)

  const fetchAttendees = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await attendeeService.getEventAttendees(
        eventId,
        1,
        limit
      )
      setData(response)
    } catch (err: any) {
      setError(err.message || 'Error al cargar asistentes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendees()
  }, [eventId])

  const handleCheckIn = async (attendee: Attendee) => {
    if (attendee.checked_in) return

    try {
      setCheckingIn(attendee.id)
      await attendeeService.checkInAttendee(eventId, attendee.id)
      // Refresh list
      await fetchAttendees()
    } catch (err) {
      console.error('Check-in error:', err)
    } finally {
      setCheckingIn(null)
    }
  }

  const formatPrice = (cents: number) => {
    if (cents === 0) return 'Gratis'
    return `${(cents / 100).toFixed(2)}€`
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress size={24} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography color='error' variant='body2'>
          {error}
        </Typography>
        <Button size='small' onClick={fetchAttendees} sx={{ mt: 1 }}>
          Reintentar
        </Button>
      </Box>
    )
  }

  if (!data || data.attendees.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <PersonIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
        <Typography color='text.secondary' variant='body2'>
          No hay asistentes registrados
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
          px: 1
        }}
      >
        <Typography variant='subtitle2' color='text.secondary'>
          Asistentes ({data.total})
        </Typography>
        <Tooltip title='Actualizar'>
          <IconButton size='small' onClick={fetchAttendees}>
            <RefreshIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      </Box>

      {/* List */}
      <List dense disablePadding>
        {data.attendees.map((attendee, index) => (
          <React.Fragment key={attendee.id}>
            <ListItem
              sx={{
                py: 1.5,
                px: 1,
                borderRadius: 1,
                '&:hover': { bgcolor: '#F8FAFC' }
              }}
              secondaryAction={
                <Tooltip
                  title={
                    attendee.checked_in ? 'Ya hizo check-in' : 'Hacer check-in'
                  }
                >
                  <span>
                    <IconButton
                      size='small'
                      onClick={() => handleCheckIn(attendee)}
                      disabled={
                        attendee.checked_in || checkingIn === attendee.id
                      }
                      sx={{
                        color: attendee.checked_in
                          ? 'success.main'
                          : 'text.secondary',
                        '&:hover': {
                          bgcolor: attendee.checked_in
                            ? 'transparent'
                            : 'success.lighter'
                        }
                      }}
                    >
                      {checkingIn === attendee.id ? (
                        <CircularProgress size={18} />
                      ) : attendee.checked_in ? (
                        <CheckCircleIcon />
                      ) : (
                        <AccessTimeIcon />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              }
            >
              <ListItemAvatar>
                <Avatar
                  src={attendee.user_avatar}
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'var(--color-cadetblue)'
                  }}
                >
                  {attendee.user_name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box>
                    <Typography
                      variant='body2'
                      fontWeight={500}
                      component='a'
                      href={`/u/${attendee.user_slug || attendee.user_id}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      sx={{
                        color: 'text.primary',
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'var(--color-cadetblue)',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {attendee.user_name || 'Usuario'}
                    </Typography>
                    <Typography
                      variant='caption'
                      display='block'
                      color='text.secondary'
                    >
                      {attendee.user_email}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      alignItems: 'center',
                      mt: 0.5
                    }}
                  >
                    <Chip
                      size='small'
                      label={attendee.ticket_type}
                      sx={{
                        fontSize: '0.7rem',
                        height: 20,
                        bgcolor: attendee.is_paid ? '#DBEAFE' : '#F3F4F6',
                        color: attendee.is_paid ? '#1D4ED8' : '#6B7280'
                      }}
                    />
                    <Typography variant='caption' color='text.secondary'>
                      {formatPrice(attendee.ticket_price)}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            {index < data.attendees.length - 1 && (
              <Divider variant='inset' component='li' />
            )}
          </React.Fragment>
        ))}
      </List>

      {/* Show more button */}
      {data.has_more && (
        <Box sx={{ textAlign: 'center', pt: 2 }}>
          <Button
            size='small'
            variant='text'
            sx={{ color: 'var(--color-cadetblue)' }}
          >
            Ver todos los asistentes ({data.total})
          </Button>
        </Box>
      )}
    </Box>
  )
}
