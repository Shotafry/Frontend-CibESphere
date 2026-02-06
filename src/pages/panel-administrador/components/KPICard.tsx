import React from 'react'
import { Box, Typography, Paper, useTheme } from '@mui/material'

interface KPICardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  trend?: {
    value: number
    label: string
  }
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  color,
  trend
}) => {
  const theme = useTheme()

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        background: 'rgba(17, 25, 40, 0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 10px 30px -10px ${color}40`,
          border: `1px solid ${color}40`
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`
        }}
      />

      <Box display='flex' alignItems='center' mb={2}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
            boxShadow: `0 4px 12px ${color}20`
          }}
        >
          {icon}
        </Box>
        <Typography variant='subtitle2' color='text.secondary' fontWeight={500}>
          {title}
        </Typography>
      </Box>

      <Typography
        variant='h4'
        fontWeight='bold'
        sx={{ mb: 1, letterSpacing: '-0.5px' }}
      >
        {value}
      </Typography>

      {trend && (
        <Box display='flex' alignItems='center' gap={1}>
          <Typography
            variant='caption'
            sx={{
              color: trend.value >= 0 ? '#10b981' : '#ef4444',
              fontWeight: 'bold',
              bgcolor: trend.value >= 0 ? '#10b98115' : '#ef444415',
              px: 1,
              py: 0.5,
              borderRadius: 1
            }}
          >
            {trend.value >= 0 ? '+' : ''}
            {trend.value}%
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            {trend.label}
          </Typography>
        </Box>
      )}
    </Paper>
  )
}
