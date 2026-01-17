import React from 'react'
import { Paper, Typography, Grid, Box } from '@mui/material'
import { motion } from 'framer-motion'
import { PublicUserProfile } from '../../../types'

interface UserStatsProps {
  user: PublicUserProfile
  eventsCount: number
}

export const UserStats: React.FC<UserStatsProps> = ({ user, eventsCount }) => {
  return (
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
          background: 'linear-gradient(135deg, #f0fdfa 0%, #ecfeff 100%)'
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
                {eventsCount}
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
  )
}
