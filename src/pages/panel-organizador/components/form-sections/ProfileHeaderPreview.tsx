import React from 'react'
import { Box, Paper, Typography, Avatar } from '@mui/material'
import LocationCityIcon from '@mui/icons-material/LocationCity'

interface ProfileHeaderPreviewProps {
  bannerUrl: string
  logoUrl: string
  name: string
  city: string
}

export const ProfileHeaderPreview: React.FC<ProfileHeaderPreviewProps> = ({
  bannerUrl,
  logoUrl,
  name,
  city
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '24px',
        overflow: 'hidden',
        mb: 4,
        border: '1px solid #E2E8F0',
        position: 'relative'
      }}
    >
      {/* Banner Background */}
      <Box
        sx={{
          height: { xs: 160, sm: 180, md: 200 },
          width: '100%',
          backgroundImage: `url(${bannerUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '70%',
            background:
              'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
            pointerEvents: 'none'
          }
        }}
      />

      {/* Glassmorphism Info Bar */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: { xs: 2, sm: 2.5, md: 3 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'flex-end' },
          gap: { xs: 1.5, sm: 2, md: 3 },
          zIndex: 2
        }}
      >
        <Avatar
          src={logoUrl}
          sx={{
            width: { xs: 70, sm: 85, md: 100 },
            height: { xs: 70, sm: 85, md: 100 },
            border: '3px solid white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}
        />
        <Box
          sx={{
            color: 'white',
            pb: { xs: 0, sm: 0.5 },
            textAlign: { xs: 'center', sm: 'left' },
            textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9)'
          }}
        >
          <Typography
            variant='h4'
            fontWeight='900'
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
              lineHeight: 1.2
            }}
          >
            {name || 'Tu Organización'}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', sm: 'flex-start' },
              gap: 1,
              mt: 0.5
            }}
          >
            <LocationCityIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
            <Typography
              variant='body1'
              fontWeight='500'
              sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}
            >
              {city || 'Ciudad'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}
