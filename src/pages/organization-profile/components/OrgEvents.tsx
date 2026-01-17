import React, { useState } from 'react'
import { Box, Tabs, Tab, Stack, Typography } from '@mui/material'
import { Event as EventIcon } from '@mui/icons-material'
import { Event } from '../../../types'
import { EventCard } from '../../../components/EventCard'

interface OrgEventsProps {
  events: Event[]
}

export const OrgEvents: React.FC<OrgEventsProps> = ({ events }) => {
  const [tabValue, setTabValue] = useState(0)
  const now = new Date()
  const upcomingEvents = events.filter((e) => new Date(e.start_date) >= now)
  const pastEvents = events.filter((e) => new Date(e.start_date) < now)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Box sx={{ mt: 6 }}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        centered
        variant='scrollable'
        scrollButtons='auto'
        allowScrollButtonsMobile
        sx={{
          mb: 4,
          '& .MuiTab-root': {
            fontSize: { xs: '0.9rem', md: '1.1rem' },
            fontWeight: 'bold',
            textTransform: 'none',
            color: 'var(--Gray-500)',
            minHeight: 48,
            '&.Mui-selected': { color: 'var(--color-cadetblue)' }
          },
          '& .MuiTabs-indicator': {
            backgroundColor: 'var(--color-cadetblue)',
            height: 3
          }
        }}
      >
        <Tab label={`Próximos (${upcomingEvents.length})`} />
        <Tab label={`Pasados (${pastEvents.length})`} />
      </Tabs>

      <Box role='tabpanel' hidden={tabValue !== 0}>
        {tabValue === 0 && (
          <Stack spacing={3}>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 8, opacity: 0.6 }}>
                <EventIcon
                  sx={{ fontSize: 60, color: 'var(--Gray-400)', mb: 2 }}
                />
                <Typography variant='h6' color='textSecondary'>
                  No hay eventos próximos programados.
                </Typography>
              </Box>
            )}
          </Stack>
        )}
      </Box>

      <Box role='tabpanel' hidden={tabValue !== 1}>
        {tabValue === 1 && (
          <Stack spacing={3}>
            {pastEvents.length > 0 ? (
              pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 8, opacity: 0.6 }}>
                <EventIcon
                  sx={{ fontSize: 60, color: 'var(--Gray-400)', mb: 2 }}
                />
                <Typography variant='h6' color='textSecondary'>
                  No hay eventos pasados.
                </Typography>
              </Box>
            )}
          </Stack>
        )}
      </Box>
    </Box>
  )
}
