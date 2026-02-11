import React from 'react'
import { Box, Typography, Grid, Paper, Divider, Avatar } from '@mui/material'
import { Event } from '../../../types'

interface EventItineraryProps {
  event: Event
}

export const EventItinerary: React.FC<EventItineraryProps> = ({ event }) => {
  const hasAgenda = event.agenda && event.agenda.length > 0
  const hasSpeakers = event.speakers && event.speakers.length > 0

  if (!hasAgenda && !hasSpeakers) return null

  return (
    <>
      <Divider sx={{ my: 4, borderColor: 'var(--Gray-300)' }} />
      <Box sx={{ mb: 4 }}>
        <Typography
          variant='h4'
          fontWeight='bold'
          gutterBottom
          sx={{ color: 'var(--color-cadetblue)', mb: 3 }}
        >
          Itinerario del Evento
        </Typography>

        <Grid container spacing={4}>
          {/* AGENDA */}
          {hasAgenda && (
            <Grid
              size={{
                xs: 12,
                md: hasSpeakers ? 6 : 12
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  bgcolor: '#F8FAFC',
                  border: '1px solid #E2E8F0'
                }}
              >
                <Typography
                  variant='h6'
                  fontWeight='bold'
                  sx={{ mb: 3, color: 'var(--Gray-800)' }}
                >
                  Agenda
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}
                >
                  {event.agenda!.map((item) => (
                    <Box key={item.id} sx={{ display: 'flex', gap: 2 }}>
                      <Box
                        sx={{
                          minWidth: '60px',
                          textAlign: 'right',
                          fontWeight: 'bold',
                          color: 'var(--color-cadetblue)',
                          pt: 0.5
                        }}
                      >
                        {item.time}
                      </Box>
                      <Box
                        sx={{
                          borderLeft: '2px solid var(--Gray-300)',
                          pl: 2,
                          pb: 2,
                          position: 'relative'
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            left: '-5px',
                            top: '8px',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            bgcolor: 'var(--color-cadetblue)'
                          }}
                        />
                        <Typography
                          variant='subtitle1'
                          fontWeight='bold'
                          sx={{ lineHeight: 1.2 }}
                        >
                          {item.title}
                        </Typography>
                        {item.description && (
                          <Typography
                            variant='body2'
                            color='text.secondary'
                            sx={{ mt: 0.5 }}
                          >
                            {item.description}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          )}

          {/* PONENTES */}
          {hasSpeakers && (
            <Grid
              size={{
                xs: 12,
                md: hasAgenda ? 6 : 12
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  bgcolor: '#F8FAFC',
                  border: '1px solid #E2E8F0'
                }}
              >
                <Typography
                  variant='h6'
                  fontWeight='bold'
                  sx={{ mb: 3, color: 'var(--Gray-800)' }}
                >
                  Ponentes
                </Typography>
                <Grid container spacing={2}>
                  {event.speakers!.map((speaker) => (
                    <Grid size={{ xs: 12 }} key={speaker.id}>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 2,
                          p: 2,
                          bgcolor: 'white',
                          borderRadius: '12px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                          alignItems: 'center'
                        }}
                      >
                        <Avatar
                          src={speaker.avatar_url}
                          alt={speaker.name}
                          sx={{ width: 64, height: 64, borderRadius: '12px' }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant='subtitle1' fontWeight='bold'>
                            {speaker.name}
                          </Typography>
                          <Typography
                            variant='caption'
                            sx={{
                              color: 'var(--color-cadetblue)',
                              fontWeight: 600,
                              display: 'block',
                              mb: 1
                            }}
                          >
                            {speaker.role}
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            <span style={{ fontWeight: 'bold' }}>Tema:</span>{' '}
                            {speaker.topic}
                          </Typography>
                          {speaker.time && (
                            <Typography
                              variant='caption'
                              color='text.secondary'
                              sx={{ display: 'block', mt: 1 }}
                            >
                              🕒 {speaker.time}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* REQUISITOS (Included here as it often goes with content) */}
      {event.requirements && (
        <>
          <Divider sx={{ my: 4, borderColor: 'var(--Gray-300)' }} />
          <Box>
            <Typography
              variant='h5'
              fontWeight='bold'
              gutterBottom
              sx={{ color: 'var(--Gray-700)' }}
            >
              Requisitos
            </Typography>
            <Typography
              variant='body1'
              sx={{
                whiteSpace: 'pre-wrap',
                color: 'var(--Gray-600)',
                lineHeight: 1.6
              }}
            >
              {event.requirements}
            </Typography>
          </Box>
        </>
      )}
    </>
  )
}
