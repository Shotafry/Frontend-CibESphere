import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Stack,
  Chip
} from '@mui/material'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import { sanitizeUrl } from '../../utils/sanitizeUrl'

export interface CollaboratorProps {
  name: string
  role: string
  image: string
  contributions: string[]
  social?: {
    linkedin?: string
    github?: string
  }
}

export const CollaboratorCard: React.FC<CollaboratorProps> = ({
  name,
  role,
  image,
  contributions,
  social
}) => {
  const linkedInUrl = sanitizeUrl(social?.linkedin)
  const githubUrl = sanitizeUrl(social?.github)

  return (
    <Card
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' }, // Stack on mobile, row on tablet+
        alignItems: 'center',
        p: 2,
        borderRadius: '24px', // Matched with Member Card
        border: '1px solid #E2E8F0',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)', // Slightly less lift than members (-10px)
          boxShadow: '0 10px 20px rgba(0, 217, 255, 0.1)', // Cyan shadow, less intense
          borderColor: 'rgba(0, 217, 255, 0.3)'
        }
      }}
    >
      {/* Avatar Section */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: 120
        }}
      >
        <Avatar
          src={image}
          alt={name}
          sx={{
            width: 80,
            height: 80,
            border: '3px solid white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            mb: 1
          }}
        />
        {/* Social Icons (Compact) */}
        <Stack direction='row' spacing={0.5} mt={1}>
          {linkedInUrl && (
            <IconButton
              href={linkedInUrl}
              target='_blank'
              size='small'
              sx={{
                color: '#0A66C2',
                '&:hover': { bgcolor: 'rgba(10, 102, 194, 0.1)' }
              }}
            >
              <LinkedInIcon fontSize='small' />
            </IconButton>
          )}
          {githubUrl && (
            <IconButton
              href={githubUrl}
              target='_blank'
              size='small'
              sx={{
                color: '#333',
                '&:hover': { bgcolor: 'rgba(51, 51, 51, 0.1)' }
              }}
            >
              <GitHubIcon fontSize='small' />
            </IconButton>
          )}
        </Stack>
      </Box>

      {/* Content Section */}
      <CardContent
        sx={{
          flex: 1,
          textAlign: { xs: 'center', sm: 'left' },
          py: '16px !important'
        }}
      >
        <Box sx={{ mb: 1 }}>
          <Typography
            variant='h6'
            fontWeight='800'
            sx={{ fontSize: '1.1rem', lineHeight: 1.2 }}
          >
            {name}
          </Typography>
          <Typography
            variant='subtitle2'
            sx={{
              color: 'var(--color-cadetblue)',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              letterSpacing: '0.5px'
            }}
          >
            {role}
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: '#F8FAFC',
            p: 1.5,
            borderRadius: 2,
            borderLeft: '3px solid var(--color-cadetblue)'
          }}
        >
          <Typography
            variant='caption'
            display='block'
            color='text.secondary'
            fontWeight='bold'
            mb={0.5}
          >
            Contribuciones:
          </Typography>
          <Box component='ul' sx={{ m: 0, pl: 2, mb: 0 }}>
            {contributions.map((item, index) => (
              <Typography
                component='li'
                key={index}
                variant='body2'
                color='text.primary'
                sx={{ fontSize: '0.9rem', lineHeight: 1.5 }}
              >
                {item}
              </Typography>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
