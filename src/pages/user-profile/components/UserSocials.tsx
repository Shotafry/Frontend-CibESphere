import React from 'react'
import { Paper, Typography, Stack, Tooltip, IconButton } from '@mui/material'
import { motion } from 'framer-motion'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import LanguageIcon from '@mui/icons-material/Language'
import { PublicUserProfile } from '../../../types'

interface UserSocialsProps {
  user: PublicUserProfile
}

/**
 * Sanitizes a URL to ensure it starts with http:// or https://
 * If the URL is missing protocol, it prepends https://
 * If the URL is malicious (e.g. javascript:), it returns undefined to prevent rendering
 */
const sanitizeUrl = (url?: string): string | undefined => {
  if (!url) return undefined

  // Trim whitespace
  const trimmed = url.trim()

  // Check for malicious schemes (case insensitive)
  if (trimmed.match(/^(javascript|vbscript|data):/i)) {
    return undefined
  }

  // If it starts with http:// or https://, it's safe(r)
  if (trimmed.match(/^https?:\/\//i)) {
    return trimmed
  }

  // If it's just a domain (e.g. example.com), prepend https://
  // But be careful not to prepend to something that looks like a scheme
  if (!trimmed.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:/)) {
    return `https://${trimmed}`
  }

  // If it has another scheme (e.g. mailto:, tel:), we might want to allow or block.
  // For social links, we only expect web links.
  return undefined
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
