import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  InputAdornment
} from '@mui/material'
import GroupIcon from '@mui/icons-material/Group'
import XIcon from '@mui/icons-material/X'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { Control, Controller } from 'react-hook-form'
import { OrganizationResponse } from '../../../../types'

interface SocialMediaSectionProps {
  control: Control<OrganizationResponse>
}

export const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  control
}) => {
  return (
    <Paper
      elevation={0}
      sx={{ p: 4, borderRadius: '24px', border: '1px solid #E2E8F0' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <GroupIcon sx={{ color: 'var(--color-cadetblue)' }} />
        <Typography variant='h6' fontWeight='bold'>
          Redes Sociales
        </Typography>
      </Box>
      <Stack spacing={2}>
        <Controller
          name='social_media.twitter'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label='X (Twitter)'
              fullWidth
              size='small'
              placeholder='https://x.com/...'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <XIcon fontSize='small' sx={{ color: '#000' }} />
                  </InputAdornment>
                )
              }}
            />
          )}
        />
        <Controller
          name='social_media.linkedin'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label='LinkedIn'
              fullWidth
              size='small'
              placeholder='https://linkedin.com/...'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <LinkedInIcon fontSize='small' sx={{ color: '#0A66C2' }} />
                  </InputAdornment>
                )
              }}
            />
          )}
        />
        <Controller
          name='social_media.github'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label='GitHub'
              fullWidth
              size='small'
              placeholder='https://github.com/...'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <GitHubIcon fontSize='small' sx={{ color: '#333' }} />
                  </InputAdornment>
                )
              }}
            />
          )}
        />
        <Controller
          name='social_media.facebook'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label='Facebook'
              fullWidth
              size='small'
              placeholder='https://facebook.com/...'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <FacebookIcon fontSize='small' sx={{ color: '#1877F2' }} />
                  </InputAdornment>
                )
              }}
            />
          )}
        />
        <Controller
          name='social_media.instagram'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label='Instagram'
              fullWidth
              size='small'
              placeholder='https://instagram.com/...'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <InstagramIcon fontSize='small' sx={{ color: '#C13584' }} />
                  </InputAdornment>
                )
              }}
            />
          )}
        />
        <Controller
          name='social_media.youtube'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label='YouTube'
              fullWidth
              size='small'
              placeholder='https://youtube.com/...'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <YouTubeIcon fontSize='small' sx={{ color: '#FF0000' }} />
                  </InputAdornment>
                )
              }}
            />
          )}
        />
      </Stack>
    </Paper>
  )
}
