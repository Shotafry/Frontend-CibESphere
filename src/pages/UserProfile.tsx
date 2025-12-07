import React from 'react'
import {
  Box,
  Container,
  Typography,
  Avatar,
  Paper,
  Grid,
  Stack,
  Button,
  Tab,
  Tabs
} from '@mui/material'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { User } from '../types'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import LanguageIcon from '@mui/icons-material/Language'
import { EventCard } from '../components/EventCard'

interface LoaderData {
  user: User
}

const UserProfile: React.FC = () => {
  const { user } = useLoaderData() as LoaderData
  const [tabValue, setTabValue] = React.useState(0)
  const navigate = useNavigate()

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const attendedEvents = user.FavoriteEvents || []
  const upcomingEvents = attendedEvents.filter(
    (e) => new Date(e.start_date) > new Date()
  )
  const pastEvents = attendedEvents.filter(
    (e) => new Date(e.start_date) <= new Date()
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 8 }}>
      {/* HERO SECTION */}
      <Box
        sx={{
          height: 300,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          position: 'relative',
          mb: 12
        }}
      >
        <Container maxWidth='lg' sx={{ height: '100%', position: 'relative' }}>
          <Box
            sx={{
              position: 'absolute',
              bottom: -60,
              left: { xs: '50%', md: 24 },
              transform: { xs: 'translateX(-50%)', md: 'none' },
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'center', md: 'flex-end' },
              gap: 3
            }}
          >
            <Avatar
              src={user.avatar_url}
              alt={user.full_name}
              sx={{
                width: 160,
                height: 160,
                border: '6px solid white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                bgcolor: 'var(--color-cadetblue)',
                fontSize: '3rem'
              }}
            >
              {user.first_name[0]}
            </Avatar>
            <Box
              sx={{
                color: 'white',
                pb: 1,
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              <Typography
                variant='h3'
                fontWeight='900'
                sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
              >
                {user.full_name}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  mt: 1,
                  opacity: 0.9
                }}
              >
                {user.city && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOnIcon fontSize='small' />
                    <Typography variant='body1'>{user.city}</Typography>
                  </Box>
                )}
                {user.company && (
                  <Typography variant='body1'>
                    {user.position ? `${user.position} at ` : ''}
                    <strong>{user.company}</strong>
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth='lg'>
        <Grid container spacing={4}>
          {/* LEFT COLUMN: BIO & SOCIAL */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              {user.bio && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '20px',
                    border: '1px solid #E2E8F0'
                  }}
                >
                  <Typography variant='h6' fontWeight='bold' gutterBottom>
                    Sobre mí
                  </Typography>
                  <Typography
                    variant='body1'
                    color='text.secondary'
                    sx={{ lineHeight: 1.6 }}
                  >
                    {user.bio}
                  </Typography>
                </Paper>
              )}

              <Paper
                elevation={0}
                sx={{ p: 3, borderRadius: '20px', border: '1px solid #E2E8F0' }}
              >
                <Typography variant='h6' fontWeight='bold' gutterBottom>
                  Conectar
                </Typography>
                <Stack spacing={2}>
                  {user.social_links?.twitter && (
                    <Button
                      startIcon={<TwitterIcon />}
                      fullWidth
                      variant='outlined'
                      href={user.social_links.twitter}
                      target='_blank'
                      sx={{
                        justifyContent: 'flex-start',
                        color: '#1DA1F2',
                        borderColor: '#E2E8F0'
                      }}
                    >
                      Twitter
                    </Button>
                  )}
                  {user.social_links?.linkedin && (
                    <Button
                      startIcon={<LinkedInIcon />}
                      fullWidth
                      variant='outlined'
                      href={user.social_links.linkedin}
                      target='_blank'
                      sx={{
                        justifyContent: 'flex-start',
                        color: '#0A66C2',
                        borderColor: '#E2E8F0'
                      }}
                    >
                      LinkedIn
                    </Button>
                  )}
                  {user.social_links?.github && (
                    <Button
                      startIcon={<GitHubIcon />}
                      fullWidth
                      variant='outlined'
                      href={user.social_links.github}
                      target='_blank'
                      sx={{
                        justifyContent: 'flex-start',
                        color: '#333',
                        borderColor: '#E2E8F0'
                      }}
                    >
                      GitHub
                    </Button>
                  )}
                  {user.social_links?.website && (
                    <Button
                      startIcon={<LanguageIcon />}
                      fullWidth
                      variant='outlined'
                      href={user.social_links.website}
                      target='_blank'
                      sx={{
                        justifyContent: 'flex-start',
                        color: 'var(--Gray-700)',
                        borderColor: '#E2E8F0'
                      }}
                    >
                      Sitio Web
                    </Button>
                  )}
                  {!user.social_links && (
                    <Typography variant='body2' color='text.secondary'>
                      No hay redes sociales públicas.
                    </Typography>
                  )}
                </Stack>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '20px',
                  border: '1px solid #E2E8F0',
                  bgcolor: '#F1F5F9'
                }}
              >
                <Typography
                  variant='subtitle2'
                  color='text.secondary'
                  gutterBottom
                >
                  Miembro desde
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayIcon fontSize='small' color='action' />
                  <Typography variant='body2' fontWeight='bold'>
                    {new Date(user.created_at).toLocaleDateString('es-ES', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </Typography>
                </Box>
              </Paper>
            </Stack>
          </Grid>

          {/* RIGHT COLUMN: EVENTS */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                minHeight: 400
              }}
            >
              <Box
                sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 2 }}
              >
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  textColor='primary'
                  indicatorColor='primary'
                  sx={{
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      mr: 2
                    }
                  }}
                >
                  <Tab label={`Próximos Eventos (${upcomingEvents.length})`} />
                  <Tab label={`Historial (${pastEvents.length})`} />
                </Tabs>
              </Box>

              <Box sx={{ p: 4 }}>
                {tabValue === 0 && (
                  <Stack spacing={3}>
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 8, opacity: 0.6 }}>
                        <CalendarTodayIcon
                          sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }}
                        />
                        <Typography variant='h6'>
                          No hay eventos próximos
                        </Typography>
                        <Typography variant='body2'>
                          Este usuario no está inscrito en eventos futuros.
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                )}

                {tabValue === 1 && (
                  <Stack spacing={3}>
                    {pastEvents.length > 0 ? (
                      pastEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 8, opacity: 0.6 }}>
                        <CalendarTodayIcon
                          sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }}
                        />
                        <Typography variant='h6'>No hay historial</Typography>
                        <Typography variant='body2'>
                          Este usuario no ha asistido a eventos pasados.
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default UserProfile
