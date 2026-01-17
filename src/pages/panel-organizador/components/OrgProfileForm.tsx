import React from 'react'
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Alert,
  Grid,
  Stack,
  TextField,
  InputAdornment,
  Divider,
  CircularProgress
} from '@mui/material'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import BusinessIcon from '@mui/icons-material/Business'
import LinkIcon from '@mui/icons-material/Link'
import DescriptionIcon from '@mui/icons-material/Description'
import LanguageIcon from '@mui/icons-material/Language'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import MapIcon from '@mui/icons-material/Map'
import ImageIcon from '@mui/icons-material/Image'
import GroupIcon from '@mui/icons-material/Group'
import XIcon from '@mui/icons-material/X'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import YouTubeIcon from '@mui/icons-material/YouTube'
import SaveIcon from '@mui/icons-material/Save'

import {
  useWatch,
  Control,
  FieldErrors,
  UseFormHandleSubmit,
  Controller
} from 'react-hook-form'
import { OrganizationResponse } from '../../../types'
import { Button } from '../../../components/Button'
import { ImageUpload } from '../../../components/ImageUpload'
import * as apiService from '../../../services/apiService'

interface OrgProfileFormProps {
  user: any
  control: Control<OrganizationResponse>
  errors: FieldErrors<OrganizationResponse>
  isSaving: boolean
  handleSubmit: UseFormHandleSubmit<OrganizationResponse>
  onSaveProfile: (data: OrganizationResponse) => Promise<void>
  saveMessage: { type: 'success' | 'error'; text: string } | null
}

export const OrgProfileForm: React.FC<OrgProfileFormProps> = ({
  user,
  control,
  errors,
  isSaving,
  handleSubmit,
  onSaveProfile,
  saveMessage
}) => {
  const watchedBanner = useWatch({ control, name: 'banner_url' })
  const watchedLogo = useWatch({ control, name: 'logo_url' })
  const watchedName = useWatch({ control, name: 'name' })
  const watchedCity = useWatch({ control, name: 'city' })

  const bannerUrl =
    watchedBanner ||
    user?.organization?.banner_url ||
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b'
  const logoUrl =
    watchedLogo || user?.organization?.logo_url || '/default-logo.png'

  return (
    <Box component='form' onSubmit={handleSubmit(onSaveProfile)}>
      {/* 1. HEADER PREVIEW (Immersive) */}
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
              {watchedName || 'Tu Organización'}
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
                {watchedCity || 'Ciudad'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {saveMessage && (
        <Alert severity={saveMessage.type} sx={{ mb: 4, borderRadius: '12px' }}>
          {saveMessage.text}
        </Alert>
      )}

      {/* 2. FORM GRID */}
      <Grid container spacing={4}>
        {/* LEFT COLUMN: MAIN INFO */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: '24px',
              border: '1px solid #E2E8F0',
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <BusinessIcon sx={{ color: 'var(--color-cadetblue)' }} />
              <Typography variant='h6' fontWeight='bold'>
                Información General
              </Typography>
            </Box>

            <Stack spacing={3}>
              <Controller
                name='name'
                control={control}
                rules={{ required: 'El nombre es obligatorio' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Nombre de la Organización'
                    fullWidth
                    variant='outlined'
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
              <Controller
                name='slug'
                control={control}
                rules={{
                  required: 'El slug es obligatorio',
                  pattern: {
                    value: /^[a-z0-9-]+$/,
                    message: 'Solo letras minúsculas, números y guiones'
                  },
                  validate: async (value) => {
                    if (!value || value === user?.organization?.slug)
                      return true
                    try {
                      const available = await apiService.checkSlugAvailability(
                        value
                      )
                      return available || 'Este URL ya está en uso'
                    } catch (e) {
                      console.error(e)
                      return 'Error al validar disponibilidad'
                    }
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='URL Personalizada (Slug)'
                    fullWidth
                    variant='outlined'
                    error={!!errors.slug}
                    helperText={
                      errors.slug?.message ||
                      `cybesphere.com/organizacion/${field.value}`
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <LinkIcon color='action' />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Sobre nosotros'
                    fullWidth
                    multiline
                    minRows={4}
                    placeholder='Describe tu misión, visión y los eventos que organizas...'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position='start'
                          sx={{ alignSelf: 'flex-start', mt: 1.5 }}
                        >
                          <DescriptionIcon color='action' />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='city'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Ciudad'
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <LocationCityIcon color='action' />
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='website'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Sitio Web'
                        fullWidth
                        placeholder='https://...'
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <LanguageIcon color='action' />
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              {/* Contact Info Fields */}
              <Divider sx={{ my: 4 }} />

              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
              >
                <PhoneIcon sx={{ color: 'var(--color-cadetblue)' }} />
                <Typography variant='h6' fontWeight='bold'>
                  Información de Contacto
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='email'
                    control={control}
                    rules={{
                      required: 'El email es obligatorio',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email inválido'
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Email Público'
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <EmailIcon color='action' />
                            </InputAdornment>
                          )
                        }}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='phone'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Teléfono'
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <PhoneIcon color='action' />
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name='address'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Dirección'
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <MapIcon color='action' />
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='postal_code'
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label='Código Postal' fullWidth />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='country'
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label='País' fullWidth />
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        </Grid>

        {/* RIGHT COLUMN: ASSETS & SOCIAL */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={4}>
            {/* Visual Assets Card */}
            <Paper
              elevation={0}
              sx={{ p: 4, borderRadius: '24px', border: '1px solid #E2E8F0' }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
              >
                <ImageIcon sx={{ color: 'var(--color-cadetblue)' }} />
                <Typography variant='h6' fontWeight='bold'>
                  Recursos Visuales
                </Typography>
              </Box>
              <Stack spacing={3}>
                <Controller
                  name='logo_url'
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      currentUrl={field.value}
                      onUpload={field.onChange}
                      label='Logo'
                      altText='Organization Logo'
                      isBanner={false}
                    />
                  )}
                />
                <Controller
                  name='banner_url'
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      currentUrl={field.value}
                      onUpload={field.onChange}
                      label='Banner'
                      altText='Organization Banner'
                      isBanner={true}
                    />
                  )}
                />
              </Stack>
            </Paper>

            {/* Social Media Card */}
            <Paper
              elevation={0}
              sx={{ p: 4, borderRadius: '24px', border: '1px solid #E2E8F0' }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
              >
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
                            <LinkedInIcon
                              fontSize='small'
                              sx={{ color: '#0A66C2' }}
                            />
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
                            <GitHubIcon
                              fontSize='small'
                              sx={{ color: '#333' }}
                            />
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
                            <FacebookIcon
                              fontSize='small'
                              sx={{ color: '#1877F2' }}
                            />
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
                            <InstagramIcon
                              fontSize='small'
                              sx={{ color: '#C13584' }}
                            />
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
                            <YouTubeIcon
                              fontSize='small'
                              sx={{ color: '#FF0000' }}
                            />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Stack>
            </Paper>

            {/* Save Button */}
            <Button
              type='submit'
              variant='primary'
              fullWidth
              disabled={isSaving}
              startIcon={
                isSaving ? (
                  <CircularProgress size={20} color='inherit' />
                ) : (
                  <SaveIcon />
                )
              }
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
