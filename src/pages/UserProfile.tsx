// src/pages/UserProfile.tsx
import React from 'react'
import {
  Box,
  Container,
  Typography,
  Avatar,
  Paper,
  Grid,
  Stack,
  Tab,
  Tabs,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { PublicUserProfile as PublicUserProfileType, Event } from '../types'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import LanguageIcon from '@mui/icons-material/Language'
import WorkIcon from '@mui/icons-material/Work'
import VerifiedIcon from '@mui/icons-material/Verified'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { EventCard } from '../components/EventCard'
import { Button } from '../components/Button'
import { motion } from 'framer-motion'

interface LoaderData {
  user: PublicUserProfileType
}

const UserProfile: React.FC = () => {
  const { user } = useLoaderData() as LoaderData
  const [tabValue, setTabValue] = React.useState(0)
  const navigate = useNavigate()

  // Detectar usuario logueado
  const loggedUserStr = localStorage.getItem('user')
  const loggedUser = loggedUserStr ? JSON.parse(loggedUserStr) : null
  const isOwner =
    loggedUser && (loggedUser.id === user.id || loggedUser.slug === user.slug)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  // Eventos desde registered_events (nuevo backend)
  const allEvents = user.registered_events || []
  const now = new Date()
  const upcomingEvents = allEvents.filter(
    (e: Event) => new Date(e.start_date) > now
  )
  const pastEvents = allEvents.filter(
    (e: Event) => new Date(e.start_date) <= now
  )

  const fullName =
    user.full_name ||
    `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
    'Usuario'

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 10 }}>
      {/* HERO SECTION - Full Width Banner */}
      <Box
        sx={{
          height: { xs: 280, md: 380 },
          backgroundImage: `url(${
            user.banner_url ||
            'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80'
          })`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(15,23,42,0.95) 100%)'
          }
        }}
      >
        <Container maxWidth='xl' sx={{ height: '100%', position: 'relative' }}>
          <Box
            sx={{
              position: 'absolute',
              bottom: -80,
              left: { xs: '50%', md: 40 },
              transform: { xs: 'translateX(-50%)', md: 'none' },
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'center', md: 'flex-end' },
              gap: 3
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Avatar
                src={user.avatar_url}
                alt={fullName}
                sx={{
                  width: { xs: 140, md: 180 },
                  height: { xs: 140, md: 180 },
                  border: '6px solid white',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                  bgcolor: 'var(--color-cadetblue)',
                  fontSize: '4rem'
                }}
              >
                {user.first_name?.[0] || fullName[0]}
              </Avatar>
            </motion.div>
            <Box
              sx={{
                color: 'white',
                pb: { xs: 0, md: 2 },
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              <Typography
                variant='h3'
                fontWeight='900'
                sx={{
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  fontSize: { xs: '1.8rem', md: '2.8rem' }
                }}
              >
                {fullName}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  mt: 1,
                  flexWrap: 'wrap'
                }}
              >
                {user.position && user.company && (
                  <Chip
                    icon={<WorkIcon />}
                    label={`${user.position} @ ${user.company}`}
                    size='small'
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.15)',
                      color: 'white',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                )}
                {user.city && (
                  <Chip
                    icon={<LocationOnIcon />}
                    label={user.city}
                    size='small'
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.15)',
                      color: 'white',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ACTION BAR (if owner) */}
      {isOwner && (
        <Container maxWidth='xl' sx={{ mt: 12, mb: -4, textAlign: 'right' }}>
          <Button
            variant='primary'
            onClick={() => navigate('/panel-de-usuario?tab=2')}
          >
            Editar Perfil
          </Button>
        </Container>
      )}

      {/* MAIN CONTENT */}
      <Container maxWidth='xl' sx={{ mt: isOwner ? 6 : 14 }}>
        <Grid container spacing={4}>
          {/* LEFT COLUMN: BIO, SOCIAL, STATS */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              {/* BIO */}
              {user.bio && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: '24px',
                      border: '1px solid #E2E8F0',
                      background: 'white'
                    }}
                  >
                    <Typography variant='h6' fontWeight='bold' gutterBottom>
                      Sobre mí
                    </Typography>
                    <Typography
                      variant='body1'
                      color='text.secondary'
                      sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}
                    >
                      {user.bio}
                    </Typography>
                  </Paper>
                </motion.div>
              )}

              {/* SOCIAL LINKS */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: '24px',
                    border: '1px solid #E2E8F0',
                    background: 'white'
                  }}
                >
                  <Typography variant='h6' fontWeight='bold' gutterBottom>
                    Redes Sociales
                  </Typography>
                  <Stack direction='row' spacing={2} sx={{ mt: 2 }}>
                    {user.linkedin && (
                      <Tooltip title='LinkedIn'>
                        <IconButton
                          component='a'
                          href={user.linkedin}
                          target='_blank'
                          sx={{
                            bgcolor: '#0A66C2',
                            color: 'white',
                            '&:hover': { bgcolor: '#004182' }
                          }}
                        >
                          <LinkedInIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {(user as any).github && (
                      <Tooltip title='GitHub'>
                        <IconButton
                          component='a'
                          href={(user as any).github}
                          target='_blank'
                          sx={{
                            bgcolor: '#181717',
                            color: 'white',
                            '&:hover': { bgcolor: '#333' }
                          }}
                        >
                          <GitHubIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {user.website && (
                      <Tooltip title='Website'>
                        <IconButton
                          component='a'
                          href={user.website}
                          target='_blank'
                          sx={{
                            bgcolor: 'var(--color-cadetblue)',
                            color: 'white',
                            '&:hover': { opacity: 0.8 }
                          }}
                        >
                          <LanguageIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {!user.linkedin &&
                      !(user as any).github &&
                      !user.website && (
                        <Typography variant='body2' color='text.secondary'>
                          No hay redes sociales públicas.
                        </Typography>
                      )}
                  </Stack>
                </Paper>
              </motion.div>

              {/* STATS */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: '24px',
                    border: '1px solid #E2E8F0',
                    background:
                      'linear-gradient(135deg, #f0fdfa 0%, #ecfeff 100%)'
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Box textAlign='center'>
                        <Typography
                          variant='h4'
                          fontWeight='900'
                          color='var(--color-cadetblue)'
                        >
                          {allEvents.length}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          Eventos
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Box textAlign='center'>
                        <Typography
                          variant='h4'
                          fontWeight='900'
                          color='var(--color-cadetblue)'
                        >
                          {user.joined_at
                            ? new Date(user.joined_at).getFullYear()
                            : 'N/A'}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          Miembro desde
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </motion.div>

              {/* CERTIFICATIONS PLACEHOLDER */}
              {/* Certificaciones/Badges Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: '24px',
                    border: '1px solid #E2E8F0',
                    bgcolor: '#F8FAFC'
                  }}
                >
                  <Typography
                    variant='subtitle2'
                    fontWeight='bold'
                    mb={2}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <EmojiEventsIcon sx={{ color: 'var(--color-cadetblue)' }} />
                    Certificaciones
                  </Typography>
                  {(() => {
                    let badgeList: Array<{
                      id: string
                      url: string
                      name: string
                    }> = []
                    try {
                      if ((user as any).badges) {
                        badgeList = JSON.parse((user as any).badges)
                      }
                    } catch {
                      badgeList = []
                    }

                    if (badgeList.length === 0) {
                      return (
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          textAlign='center'
                          display='block'
                        >
                          Este usuario aún no tiene certificaciones.
                        </Typography>
                      )
                    }

                    return (
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 2,
                          justifyContent: 'center'
                        }}
                      >
                        {badgeList.map((badge) => (
                          <Tooltip key={badge.id} title={badge.name}>
                            <Avatar
                              src={badge.url}
                              alt={badge.name}
                              sx={{
                                width: 60,
                                height: 60,
                                border: '3px solid var(--color-cadetblue)',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                  transform: 'scale(1.1)'
                                }
                              }}
                            />
                          </Tooltip>
                        ))}
                      </Box>
                    )
                  })()}
                </Paper>
              </motion.div>
            </Stack>
          </Grid>

          {/* RIGHT COLUMN: EVENTS */}
          <Grid size={{ xs: 12, md: 8 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Paper
                elevation={0}
                sx={{
                  borderRadius: '24px',
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  minHeight: 500,
                  background: 'white'
                }}
              >
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    px: 4,
                    pt: 2,
                    bgcolor: '#F8FAFC'
                  }}
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
                        mr: 3
                      }
                    }}
                  >
                    <Tab
                      label={`Próximos Eventos (${upcomingEvents.length})`}
                    />
                    <Tab label={`Historial (${pastEvents.length})`} />
                  </Tabs>
                </Box>

                <Box sx={{ p: 4 }}>
                  {tabValue === 0 && (
                    <Stack spacing={3}>
                      {upcomingEvents.length > 0 ? (
                        upcomingEvents.map((event: Event) => (
                          <EventCard key={event.id} event={event} />
                        ))
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 10, opacity: 0.6 }}>
                          <CalendarTodayIcon
                            sx={{ fontSize: 60, mb: 2, color: '#CBD5E1' }}
                          />
                          <Typography variant='h6' color='text.secondary'>
                            No hay eventos próximos
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            Este usuario no está inscrito en eventos futuros.
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  )}

                  {tabValue === 1 && (
                    <Stack spacing={3}>
                      {pastEvents.length > 0 ? (
                        pastEvents.map((event: Event) => (
                          <EventCard key={event.id} event={event} />
                        ))
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 10, opacity: 0.6 }}>
                          <CalendarTodayIcon
                            sx={{ fontSize: 60, mb: 2, color: '#CBD5E1' }}
                          />
                          <Typography variant='h6' color='text.secondary'>
                            No hay historial
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            Este usuario no ha asistido a eventos pasados.
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  )}
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default UserProfile
