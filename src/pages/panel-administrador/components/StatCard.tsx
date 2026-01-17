import React from 'react'
import { Paper, Box, Typography } from '@mui/material'

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactElement
  color: string
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color
}) => (
  <Paper
    elevation={0}
    sx={{
      p: { xs: 2, sm: 3 },
      borderRadius: '20px',
      background: 'white',
      border: '1px solid',
      borderColor: 'divider',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: { xs: 1.5, sm: 2 },
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 10px 30px -10px ${color}40`,
        borderColor: color
      }
    }}
  >
    <Box
      sx={{
        p: { xs: 1, sm: 1.5 },
        borderRadius: '16px',
        bgcolor: `${color}15`,
        color: color,
        display: 'flex'
      }}
    >
      {React.cloneElement(icon as React.ReactElement<any>, {
        fontSize: 'large'
      })}
    </Box>
    <Box>
      <Typography
        variant='h4'
        fontWeight='800'
        sx={{ color: '#1e293b', fontSize: { xs: '1.5rem', sm: '2rem' } }}
      >
        {value}
      </Typography>
      <Typography variant='body2' fontWeight='600' color='text.secondary'>
        {title}
      </Typography>
    </Box>
  </Paper>
)
