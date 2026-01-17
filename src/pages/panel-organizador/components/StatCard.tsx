import React from 'react'
import { Paper, Box, Typography, Chip } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactElement<any>
  color: string
  trend?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  trend
}) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: '20px',
      background: 'white',
      border: '1px solid',
      borderColor: 'divider',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 10px 30px -10px ${color}40`,
        borderColor: color
      },
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Typography variant='h4' fontWeight='bold' sx={{ color: '#1e293b' }}>
        {value}
      </Typography>
      <Typography
        variant='body2'
        sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5 }}
      >
        {title}
      </Typography>
      {trend && (
        <Chip
          label={trend}
          size='small'
          icon={<TrendingUpIcon style={{ fontSize: 14 }} />}
          sx={{
            mt: 1.5,
            bgcolor: `${color}15`,
            color: color,
            fontWeight: 'bold',
            fontSize: '0.75rem'
          }}
        />
      )}
    </Box>
    <Box
      sx={{
        width: 60,
        height: 60,
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: `${color}15`,
        color: color
      }}
    >
      {React.cloneElement(icon, { fontSize: 'large' })}
    </Box>
  </Paper>
)
