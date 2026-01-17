import React from 'react'
import { Box, Container, Avatar, Typography, Chip } from '@mui/material'
import { motion } from 'framer-motion'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import WorkIcon from '@mui/icons-material/Work'
import { PublicUserProfile } from '../../../types'

interface UserHeroProps {
  user: PublicUserProfile
}

export const UserHero: React.FC<UserHeroProps> = ({ user }) => {
  const fullName =
    user.full_name ||
    `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
    'Usuario'

  return (
    <Box
      sx={{
        height: { xs: 280, md: 380 },
        backgroundImage: `url(${
          user.banner_url ||
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80'
        })`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(15,23,42,0.95) 100%)'
        }
      }}
    >
      <Container maxWidth='xl' sx={{ height: '100%', position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            bottom: -80,
            left: { xs: '50%', md: 40 },
            transform: { xs: 'translateX(-50%)', md: 'none' },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-end' },
            gap: 3
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Avatar
              src={user.avatar_url}
              alt={fullName}
              sx={{
                width: { xs: 140, md: 180 },
                height: { xs: 140, md: 180 },
                border: '6px solid white',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                bgcolor: 'var(--color-cadetblue)',
                fontSize: '4rem'
              }}
            >
              {user.first_name?.[0] || fullName[0]}
            </Avatar>
          </motion.div>
          <Box
            sx={{
              color: 'white',
              pb: { xs: 0, md: 2 },
              textAlign: { xs: 'center', md: 'left' }
            }}
          >
            <Typography
              variant='h3'
              fontWeight='900'
              sx={{
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                fontSize: { xs: '1.8rem', md: '2.8rem' }
              }}
            >
              {fullName}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                justifyContent: { xs: 'center', md: 'flex-start' },
                mt: 1,
                flexWrap: 'wrap'
              }}
            >
              {user.position && user.employer && (
                <Chip
                  icon={<WorkIcon />}
                  label={`${user.position} @ ${user.employer}`}
                  size='small'
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              )}
              {user.city && (
                <Chip
                  icon={<LocationOnIcon />}
                  label={user.city}
                  size='small'
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
