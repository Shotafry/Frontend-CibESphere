import React from 'react'
import { Box, Container, Typography } from '@mui/material'

interface HeroSectionProps {
  title: string
  subtitle?: string
  variant?: 'primary' | 'secondary'
  children?: React.ReactNode
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  variant = 'primary',
  children
}) => {
  const isSecondary = variant === 'secondary'

  const background = isSecondary
    ? 'var(--gradient-hero-secondary)'
    : 'var(--gradient-header-footer)'

  const textColor = 'white'
  const subtextColor = 'white'
  // For primary variant, existing logic used 'white' for title.
  // For secondary, user asked for Cyan title in plan ("Texto en cian para destacar").

  return (
    <Box
      sx={{
        background: background,
        color: 'white',
        pt: { xs: 12, md: 20 },
        pb: { xs: 12, md: 16 },
        clipPath: 'ellipse(150% 100% at 50% 0%)',
        textAlign: 'center',
        mb: 8,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth='md'>
        <Typography
          variant='h2'
          fontWeight='900'
          sx={{
            mb: 3,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            textShadow: '0 4px 10px rgba(0,0,0,0.2)',
            color: 'white'
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant='h6'
            sx={{
              opacity: 0.9,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
              color: subtextColor,
              fontWeight: 400
            }}
          >
            {subtitle}
          </Typography>
        )}
        {children && <Box sx={{ mt: 4 }}>{children}</Box>}
      </Container>
    </Box>
  )
}
