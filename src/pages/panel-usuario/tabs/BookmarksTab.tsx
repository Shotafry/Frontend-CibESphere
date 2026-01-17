import React from 'react'
import { Box, Typography, Stack, Paper } from '@mui/material'
import { User } from '../../../types'
import { EventCard } from '../../../components/EventCard'
import { Button } from '../../../components/Button'

interface BookmarksTabProps {
  user: User | null
}

export const BookmarksTab: React.FC<BookmarksTabProps> = ({ user }) => {
  return (
    <Box>
      <Typography variant='h6' fontWeight='bold' gutterBottom sx={{ mb: 3 }}>
        Eventos Guardados
      </Typography>
      <Stack spacing={3}>
        {user?.favorite_events && user.favorite_events.length > 0 ? (
          user.favorite_events.map((event) => (
            <EventCard key={event.id} event={event as any} />
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
              No tienes eventos guardados.
            </Typography>
            <Button variant='primary' href='/' sx={{ mt: 2 }}>
              Explorar Eventos
            </Button>
          </Paper>
        )}
      </Stack>
    </Box>
  )
}
