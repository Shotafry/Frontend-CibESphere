import React, { useState } from 'react'
import { Paper, Box, Tabs, Tab, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { Event } from '../../../types'
import { EventCard } from '../../../components/EventCard'

interface UserEventsTabProps {
  events: Event[]
}

export const UserEventsTab: React.FC<UserEventsTabProps> = ({ events }) => {
  const [tabValue, setTabValue] = useState(0)
  const now = new Date()
  const upcomingEvents = events.filter((e) => new Date(e.start_date) > now)
  const pastEvents = events.filter((e) => new Date(e.start_date) <= now)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const renderEmptyState = (message: string, subMessage: string) => (
    <Box sx={{ textAlign: 'center', py: 10, opacity: 0.6 }}>
      <CalendarTodayIcon sx={{ fontSize: 60, mb: 2, color: '#CBD5E1' }} />
      <Typography variant='h6' color='text.secondary'>
        {message}
      </Typography>
      <Typography variant='body2' color='text.secondary'>
        {subMessage}
      </Typography>
    </Box>
  )

  return (
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
            <Tab label={`Próximos Eventos (${upcomingEvents.length})`} />
            <Tab label={`Historial (${pastEvents.length})`} />
          </Tabs>
        </Box>

        <Box sx={{ p: 4 }}>
          {tabValue === 0 && (
            <Stack spacing={3}>
              {upcomingEvents.length > 0
                ? upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))
                : renderEmptyState(
                    'No hay eventos próximos',
                    'Este usuario no está inscrito en eventos futuros.'
                  )}
            </Stack>
          )}

          {tabValue === 1 && (
            <Stack spacing={3}>
              {pastEvents.length > 0
                ? pastEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))
                : renderEmptyState(
                    'No hay historial',
                    'Este usuario no ha asistido a eventos pasados.'
                  )}
            </Stack>
          )}
        </Box>
      </Paper>
    </motion.div>
  )
}
