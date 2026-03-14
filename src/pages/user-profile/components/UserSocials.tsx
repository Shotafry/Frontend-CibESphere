import React from 'react'
import { Paper, Typography, Stack, Tooltip, IconButton } from '@mui/material'
import { motion } from 'framer-motion'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import LanguageIcon from '@mui/icons-material/Language'
import { PublicUserProfile } from '../../../types'
import { sanitizeUrl } from '../../../utils/sanitizeUrl'

interface UserSocialsProps {
  user: PublicUserProfile
}

export const UserSocials: React.FC<UserSocialsProps> = ({ user }) => {
  const linkedInUrl = sanitizeUrl(user.linkedin)
  const githubUrl = sanitizeUrl((user as any).github)
  const websiteUrl = sanitizeUrl(user.personal_website)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          background: 'white'
        }}
      >
        <Typography variant='h6' fontWeight='bold' gutterBottom>
          Redes Sociales
        </Typography>
        <Stack direction='row' spacing={2} sx={{ mt: 2 }}>
          {linkedInUrl && (
            <Tooltip title='LinkedIn'>
              <IconButton
                component='a'
                href={linkedInUrl}
                target='_blank'
                rel="noopener noreferrer"
                sx={{
                  bgcolor: '#0A66C2',
                  color: 'white',
                  '&:hover': { bgcolor: '#004182' }
                }}
              >
                <LinkedInIcon />
              </IconButton>
            </Tooltip>
          )}
          {githubUrl && (
            <Tooltip title='GitHub'>
              <IconButton
                component='a'
                href={githubUrl}
                target='_blank'
                rel="noopener noreferrer"
                sx={{
                  bgcolor: '#181717',
                  color: 'white',
                  '&:hover': { bgcolor: '#333' }
                }}
              >
                <GitHubIcon />
              </IconButton>
            </Tooltip>
          )}
          {websiteUrl && (
            <Tooltip title='Website'>
              <IconButton
                component='a'
                href={websiteUrl}
                target='_blank'
                rel="noopener noreferrer"
                sx={{
                  bgcolor: 'var(--color-cadetblue)',
                  color: 'white',
                  '&:hover': { opacity: 0.8 }
                }}
              >
                <LanguageIcon />
              </IconButton>
            </Tooltip>
          )}
          {!linkedInUrl &&
            !githubUrl &&
            !websiteUrl && (
              <Typography variant='body2' color='text.secondary'>
                No hay redes sociales públicas.
              </Typography>
            )}
        </Stack>
      </Paper>
    </motion.div>
  )
}
