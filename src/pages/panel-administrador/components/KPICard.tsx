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
        background: '#ffffff',
        border: '1px solid #e2e8f0', // Light slate border
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`,
          borderColor: color
        }
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`
        }}
      />

      <Box display='flex' alignItems='center' mb={2}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
            boxShadow: `0 2px 5px ${color}10`
          }}
        >
          {icon}
        </Box>
        <Typography
          variant='body2'
          color='text.secondary'
          fontWeight={600}
          textTransform='uppercase'
          letterSpacing={0.5}
        >
          {title}
        </Typography>
      </Box>

      <Typography
        variant='h4'
        fontWeight='800'
        sx={{ mb: 1, letterSpacing: '-1px', color: '#1e293b' }}
      >
        {value}
      </Typography>

      {trend && (
        <Box display='flex' alignItems='center' gap={1}>
          <Typography
            variant='caption'
            sx={{
              color: trend.value >= 0 ? '#10b981' : '#ef4444',
              fontWeight: '800',
              bgcolor: trend.value >= 0 ? '#10b98115' : '#ef444415',
              px: 1,
              py: 0.5,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </Typography>
          <Typography variant='caption' color='text.secondary' fontWeight={500}>
            {trend.label}
          </Typography>
        </Box>
      )}
    </Paper>
  )
}
