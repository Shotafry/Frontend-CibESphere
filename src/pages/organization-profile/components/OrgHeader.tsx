import React from 'react'
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Paper,
  Stack,
  Divider
} from '@mui/material'
import {
  Verified as VerifiedIcon,
  Language as WebsiteIcon,
  Email as EmailIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  X as XIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material'
import { OrganizationSummary } from '../../../types'
import { FollowButton } from '../../../components/social'
import { sanitizeUrl } from '../../../utils/security'

interface OrgHeaderProps {
  organization: OrganizationSummary
  eventsCount: number
  totalAttendees: number
  subscribersCount?: number
  onFollowChange?: (isFollowing: boolean) => void
}

export const OrgHeader: React.FC<OrgHeaderProps> = ({
  organization,
  eventsCount,
  totalAttendees,
  subscribersCount,
  onFollowChange
}) => {
  // Support both social_media (backend) and social_links (legacy) fields
  const socialLinks =
    organization.social_links || organization.social_media || {}

  // Sanitize URLs to prevent XSS and phishing (Sentinel)
  const websiteUrl = sanitizeUrl(organization.website)
  const twitterUrl = sanitizeUrl(socialLinks?.twitter)
  const linkedinUrl = sanitizeUrl(socialLinks?.linkedin)
  const githubUrl = sanitizeUrl(socialLinks?.github)

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: { xs: '16px', md: '24px' },
        p: { xs: 2.5, sm: 3, md: 5 },
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'center', md: 'flex-start' },
        gap: { xs: 3, md: 4 },
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
      }}
    >
      {/* LOGO */}
      <Avatar
        src={organization.logo_url}
        alt={organization.name}
        sx={{
          width: { xs: 100, sm: 120, md: 160 },
          height: { xs: 100, sm: 120, md: 160 },
          border: { xs: '4px solid white', md: '5px solid white' },
          boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
          mt: { xs: -8, md: -10 },
          bgcolor: 'white'
        }}
      />

      {/* INFO PRINCIPAL */}
      <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'center', md: 'flex-start' },
            gap: 1,
            mb: 1,
            flexWrap: 'wrap'
          }}
        >
          <Typography
            variant='h3'
            fontWeight='900'
            sx={{
              color: 'var(--Gray-900)',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              wordBreak: 'break-word'
            }}
          >
            {organization.name}
          </Typography>
          {organization.is_verified && (
            <VerifiedIcon
              sx={{
                color: 'var(--color-cadetblue)',
                fontSize: { xs: 24, md: 32 }
              }}
            />
          )}
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2 }}
          alignItems='center'
          justifyContent={{ xs: 'center', md: 'flex-start' }}
          sx={{ mb: 3, color: 'var(--Gray-600)' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationIcon fontSize='small' />
            <Typography
              variant='body1'
              sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
            >
              {organization.city}
            </Typography>
          </Box>
          {websiteUrl && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <WebsiteIcon fontSize='small' />
              <a
                href={websiteUrl}
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '0.9rem'
                }}
              >
                Sitio Web
              </a>
            </Box>
          )}
        </Stack>

        <Typography
          variant='body1'
          sx={{
            maxWidth: 800,
            mb: 3,
            color: 'var(--Gray-700)',
            lineHeight: 1.6,
            fontSize: { xs: '0.95rem', md: '1rem' }
          }}
        >
          {organization.description || 'Sin descripción disponible.'}
        </Typography>

        {/* REDES SOCIALES */}
        <Stack
          direction='row'
          spacing={1}
          justifyContent={{ xs: 'center', md: 'flex-start' }}
          flexWrap='wrap'
          useFlexGap
          sx={{ gap: 1 }}
        >
          {twitterUrl && (
            <IconButton
              href={twitterUrl}
              target='_blank'
              size='small'
              sx={{
                color: '#000000',
                bgcolor: '#F0F0F0',
                width: 36,
                height: 36
              }}
            >
              <XIcon fontSize='small' />
            </IconButton>
          )}
          {linkedinUrl && (
            <IconButton
              href={linkedinUrl}
              target='_blank'
              size='small'
              sx={{
                color: '#0A66C2',
                bgcolor: '#E1F0FF',
                width: 36,
                height: 36
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
                bgcolor: '#F0F0F0',
                width: 36,
                height: 36
              }}
            >
              <GitHubIcon fontSize='small' />
            </IconButton>
          )}
          {organization.email && (
            <IconButton
              href={`mailto:${organization.email}`}
              size='small'
              sx={{
                color: 'var(--color-cadetblue)',
                bgcolor: 'rgba(79, 186, 200, 0.1)',
                width: 36,
                height: 36
              }}
            >
              <EmailIcon fontSize='small' />
            </IconButton>
          )}
        </Stack>
      </Box>

      {/* ACCIONES Y ESTADÍSTICAS */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'stretch', sm: 'center', md: 'flex-end' },
          gap: 3,
          minWidth: { xs: '100%', md: 200 }
        }}
      >
        <FollowButton
          organizationId={organization.id}
          organizationName={organization.name}
          ownerId={organization.owner_id}
          onFollowChange={onFollowChange}
          sx={{ minWidth: 120 }}
        />

        <Stack
          direction='row'
          spacing={{ xs: 2, sm: 3 }}
          justifyContent='center'
          sx={{
            bgcolor: '#F1F5F9',
            p: 2,
            borderRadius: '16px',
            maxWidth: 400
          }}
        >
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography
              variant='h5'
              fontWeight='bold'
              color='var(--Gray-900)'
              sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}
            >
              {eventsCount}
            </Typography>
            <Typography
              variant='caption'
              color='var(--Gray-500)'
              fontWeight='bold'
              sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
            >
              EVENTOS
            </Typography>
          </Box>
          <Divider orientation='vertical' flexItem />
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography
              variant='h5'
              fontWeight='bold'
              color='var(--Gray-900)'
              sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}
            >
              {totalAttendees}
            </Typography>
            <Typography
              variant='caption'
              color='var(--Gray-500)'
              fontWeight='bold'
              sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
            >
              ASISTENTES
            </Typography>
          </Box>
          {subscribersCount !== undefined && (
            <>
              <Divider orientation='vertical' flexItem />
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography
                  variant='h5'
                  fontWeight='bold'
                  color='var(--Gray-900)'
                  sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}
                >
                  {subscribersCount}
                </Typography>
                <Typography
                  variant='caption'
                  color='var(--Gray-500)'
                  fontWeight='bold'
                  sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                >
                  SUSCRITOS
                </Typography>
              </Box>
            </>
          )}
        </Stack>
      </Box>
    </Paper>
  )
}
