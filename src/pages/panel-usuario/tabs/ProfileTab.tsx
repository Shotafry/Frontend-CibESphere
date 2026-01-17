import React from 'react'
import {
  Box,
  Paper,
  Grid,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  Button
} from '@mui/material'
import {
  Control,
  Controller,
  UseFormHandleSubmit,
  useWatch
} from 'react-hook-form'
import { User } from '../../../types'
import { ImageUpload } from '../../../components/ImageUpload'
import { BadgeUploader } from '../components/BadgeUploader'
import PersonIcon from '@mui/icons-material/Person'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import LanguageIcon from '@mui/icons-material/Language'
import MailOutlineIcon from '@mui/icons-material/MailOutline'

interface ProfileTabProps {
  user: User | null
  control: Control<User>
  handleSubmit: UseFormHandleSubmit<User>
  onSaveProfile: (data: User) => Promise<void>
  isSaving: boolean
  saveMessage: { type: 'success' | 'error'; text: string } | null
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  control,
  handleSubmit,
  onSaveProfile,
  isSaving,
  saveMessage
}) => {
  const watchedBanner = useWatch({ control, name: 'banner_url' })
  const watchedAvatar = useWatch({ control, name: 'avatar_url' })
  const watchedFirstName = useWatch({ control, name: 'first_name' })
  const watchedLastName = useWatch({ control, name: 'last_name' })
  const watchedCity = useWatch({ control, name: 'city' })
  const watchedEmployer = useWatch({ control, name: 'employer' })
  const watchedPosition = useWatch({ control, name: 'position' })

  const bannerUrl =
    watchedBanner ||
    user?.banner_url ||
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80'
  const avatarUrl = watchedAvatar || user?.avatar_url
  const fullName = `${watchedFirstName || user?.first_name || ''} ${
    watchedLastName || user?.last_name || ''
  }`

  return (
    <Box component='form' onSubmit={handleSubmit(onSaveProfile)}>
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
        <Button
          variant='contained'
          href={`/u/${user?.slug || user?.id}`}
          target='_blank'
          size='small'
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 10,
            fontSize: '0.75rem',
            py: 0.75,
            px: 1.5
          }}
        >
          Ver Perfil
        </Button>
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
        <Box sx={{ px: { xs: 2, sm: 4 }, pb: 4, position: 'relative' }}>
          <Box
            sx={{
              mt: -6,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-end' },
              gap: 3,
              mb: 4
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: { xs: 100, sm: 120, md: 140 },
                height: { xs: 100, sm: 120, md: 140 },
                borderRadius: '50%',
                border: '4px solid white',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                bgcolor: 'white'
              }}
            >
              <Box
                component='img'
                src={avatarUrl}
                alt={fullName}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
            <Box
              sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' }, mb: 1 }}
            >
              <Typography variant='h5' fontWeight='bold'>
                {fullName}
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 0.5, sm: 2 }}
                alignItems={{ xs: 'center', sm: 'center' }}
                sx={{ color: 'text.secondary', mt: 0.5 }}
              >
                {(watchedEmployer || watchedPosition) && (
                  <Typography
                    variant='body2'
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                  >
                    <PersonIcon sx={{ fontSize: 18 }} />
                    {[watchedPosition, watchedEmployer]
                      .filter(Boolean)
                      .join(' en ')}
                  </Typography>
                )}
                {watchedCity && (
                  <Typography
                    variant='body2'
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                  >
                    <LocationOnIcon sx={{ fontSize: 18 }} />
                    {watchedCity}
                  </Typography>
                )}
              </Stack>
            </Box>
          </Box>

          {saveMessage && (
            <Alert severity={saveMessage.type} sx={{ mb: 3 }}>
              {saveMessage.text}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                Información Personal
              </Typography>
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Controller
                      name='first_name'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label='Nombre'
                          fullWidth
                          variant='outlined'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      name='last_name'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label='Apellidos'
                          fullWidth
                          variant='outlined'
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Controller
                  name='slug'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Username (Slug)'
                      fullWidth
                      variant='outlined'
                      helperText='URL de tu perfil público: cybesphere.com/u/usuario'
                    />
                  )}
                />
                <Controller
                  name='bio'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Biografía'
                      fullWidth
                      multiline
                      rows={4}
                      variant='outlined'
                    />
                  )}
                />
                <Controller
                  name='personal_quote'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Frase Personal'
                      fullWidth
                      variant='outlined'
                    />
                  )}
                />
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                Detalles Profesionales
              </Typography>
              <Stack spacing={2}>
                <Controller
                  name='employer'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Empresa Actual'
                      fullWidth
                      variant='outlined'
                    />
                  )}
                />
                <Controller
                  name='position'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Cargo / Puesto'
                      fullWidth
                      variant='outlined'
                    />
                  )}
                />
                <Controller
                  name='city'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Ciudad / Ubicación'
                      fullWidth
                      variant='outlined'
                      InputProps={{
                        startAdornment: (
                          <LocationOnIcon
                            sx={{ color: 'text.secondary', mr: 1 }}
                          />
                        )
                      }}
                    />
                  )}
                />
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant='subtitle1'
                fontWeight='bold'
                gutterBottom
                sx={{ mt: 2 }}
              >
                Redes y Contacto
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name='linkedin'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='LinkedIn URL'
                        fullWidth
                        variant='outlined'
                        InputProps={{
                          startAdornment: (
                            <LinkedInIcon sx={{ color: '#0077b5', mr: 1 }} />
                          )
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name='github'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='GitHub URL'
                        fullWidth
                        variant='outlined'
                        InputProps={{
                          startAdornment: (
                            <GitHubIcon sx={{ color: '#333', mr: 1 }} />
                          )
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name='personal_website'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Sitio Web'
                        fullWidth
                        variant='outlined'
                        InputProps={{
                          startAdornment: (
                            <LanguageIcon
                              sx={{ color: 'text.secondary', mr: 1 }}
                            />
                          )
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    value={user?.email || ''}
                    label='Email (No editable)'
                    fullWidth
                    variant='outlined'
                    disabled
                    InputProps={{
                      startAdornment: (
                        <MailOutlineIcon
                          sx={{ color: 'text.secondary', mr: 1 }}
                        />
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant='subtitle1'
                fontWeight='bold'
                gutterBottom
                sx={{ mt: 2 }}
              >
                Imágenes de Perfil
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name='avatar_url'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <ImageUpload
                        label='Foto de Perfil (Cuadrada)'
                        currentImage={value}
                        onImageUpload={onChange}
                        folder='avatars'
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name='banner_url'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <ImageUpload
                        label='Banner de Perfil (Horizontal)'
                        currentImage={value}
                        onImageUpload={onChange}
                        folder='banners'
                        aspectRatio={3}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* BADGES SECTION */}
            <Grid item xs={12}>
              <BadgeUploader control={control} />
            </Grid>

            <Grid
              item
              xs={12}
              sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}
            >
              <Button
                type='submit'
                variant='contained'
                size='large'
                disabled={isSaving}
                sx={{
                  borderRadius: '12px',
                  background:
                    'linear-gradient(90deg, #00d9ff 0%, #0099ff 100%)',
                  boxShadow: '0 4px 14px rgba(0, 217, 255, 0.4)',
                  px: 4
                }}
              >
                {isSaving ? (
                  <CircularProgress size={24} color='inherit' />
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  )
}
