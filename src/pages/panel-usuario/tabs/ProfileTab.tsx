import React from 'react'
import {
  Box,
  Paper,
  Grid,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Stack
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
import { Button } from '../../../components/Button'
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
          href={`/u/${user?.slug || user?.id}`}
          target='_blank'
          size='small'
          variant='secondary'
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
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                Información Personal
              </Typography>
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
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
                  <Grid size={{ xs: 6 }}>
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
                  rules={{
                    required: 'El slug es obligatorio',
                    minLength: {
                      value: 3,
                      message: 'El slug debe tener al menos 3 caracteres'
                    },
                    pattern: {
                      value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                      message: 'Solo letras minúsculas (a-z), números y guiones'
                    }
                  }}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error }
                  }) => (
                    <TextField
                      value={value || ''}
                      onChange={(e) => {
                        // Forzar minúsculas al escribir
                        onChange(e.target.value.toLowerCase())
                      }}
                      onBlur={async (e) => {
                        onBlur()
                        const val = e.target.value
                        if (
                          val &&
                          val.length >= 3 &&
                          val !== user?.slug &&
                          !error
                        ) {
                          try {
                            const { checkSlugAvailability } =
                              await import('../../../services/api/users.service')
                            const res = await checkSlugAvailability(val)
                            if (!res.available) {
                              alert(
                                'Este slug ya está en uso. Por favor elige otro.'
                              )
                            }
                          } catch (err) {
                            console.error('Error checking slug', err)
                          }
                        }
                      }}
                      label='Username (Slug)'
                      fullWidth
                      error={!!error}
                      helperText={
                        error?.message ||
                        `URL de tu perfil público: cybesphere.com/u/${value || 'usuario'}`
                      }
                      variant='outlined'
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

            <Grid size={{ xs: 12, md: 6 }}>
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

            <Grid size={{ xs: 12 }}>
              <Typography
                variant='subtitle1'
                fontWeight='bold'
                gutterBottom
                sx={{ mt: 2 }}
              >
                Redes y Contacto
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name='linkedin'
                    control={control}
                    rules={{
                      pattern: {
                        value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                        message: 'Ingresa una URL válida'
                      },
                      validate: (value) =>
                        !value ||
                        !/^(javascript|vbscript|data):/i.test(value) ||
                        'URL no permitida'
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label='LinkedIn URL'
                        fullWidth
                        variant='outlined'
                        error={!!error}
                        helperText={error?.message}
                        InputProps={{
                          startAdornment: (
                            <LinkedInIcon sx={{ color: '#0077b5', mr: 1 }} />
                          )
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name='github'
                    control={control}
                    rules={{
                      pattern: {
                        value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                        message: 'Ingresa una URL válida'
                      },
                      validate: (value) =>
                        !value ||
                        !/^(javascript|vbscript|data):/i.test(value) ||
                        'URL no permitida'
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label='GitHub URL'
                        fullWidth
                        variant='outlined'
                        error={!!error}
                        helperText={error?.message}
                        InputProps={{
                          startAdornment: (
                            <GitHubIcon sx={{ color: '#333', mr: 1 }} />
                          )
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name='personal_website'
                    control={control}
                    rules={{
                      pattern: {
                        value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                        message: 'Ingresa una URL válida'
                      },
                      validate: (value) =>
                        !value ||
                        !/^(javascript|vbscript|data):/i.test(value) ||
                        'URL no permitida'
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label='Sitio Web'
                        fullWidth
                        variant='outlined'
                        error={!!error}
                        helperText={error?.message}
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
                <Grid size={{ xs: 12, md: 6 }}>
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

              {/* Datos de Conexión Social (v0.4.0) */}
              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  bgcolor: '#F0F9FF',
                  borderRadius: 2,
                  border: '1px solid #BAE6FD'
                }}
              >
                <Typography
                  variant='subtitle2'
                  fontWeight='bold'
                  sx={{ mb: 1, color: '#0369A1' }}
                >
                  🤝 Datos de Conexión
                </Typography>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ mb: 3 }}
                >
                  Esta información solo se compartirá con usuarios que acepten
                  tu solicitud de conexión. No aparecerá en tu perfil público.
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name='social_discord'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label='Discord'
                          placeholder='usuario#1234'
                          fullWidth
                          variant='outlined'
                          helperText='Tu usuario de Discord para networking'
                          InputProps={{
                            startAdornment: (
                              <Box
                                component='span'
                                sx={{
                                  mr: 1,
                                  fontSize: '1.2rem',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                🎮
                              </Box>
                            )
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name='social_telegram'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label='Telegram'
                          placeholder='@usuario'
                          fullWidth
                          variant='outlined'
                          helperText='Tu usuario de Telegram para networking'
                          InputProps={{
                            startAdornment: (
                              <Box
                                component='span'
                                sx={{
                                  mr: 1,
                                  fontSize: '1.2rem',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                ✈️
                              </Box>
                            )
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name='show_email_on_match'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                        >
                          <input
                            type='checkbox'
                            checked={value || false}
                            onChange={(e) => onChange(e.target.checked)}
                            style={{ width: 18, height: 18 }}
                          />
                          <Box>
                            <Typography variant='body2' fontWeight={500}>
                              Compartir mi email al conectar
                            </Typography>
                            <Typography
                              variant='caption'
                              color='text.secondary'
                            >
                              Si está activo, tu email se compartirá
                              automáticamente cuando aceptes o te acepten una
                              conexión
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography
                variant='subtitle1'
                fontWeight='bold'
                gutterBottom
                sx={{ mt: 2 }}
              >
                Imágenes de Perfil
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name='avatar_url'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <ImageUpload
                        label='Foto de Perfil (Cuadrada)'
                        currentUrl={value}
                        onUpload={onChange}
                        altText='Avatar'
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name='banner_url'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <ImageUpload
                        label='Banner de Perfil (Horizontal)'
                        currentUrl={value}
                        onUpload={onChange}
                        altText='Banner'
                        isBanner={true}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* BADGES SECTION */}
            <Grid size={{ xs: 12 }}>
              <BadgeUploader control={control} />
            </Grid>

            <Grid
              size={{ xs: 12 }}
              sx={{ display: 'flex', justifyContent: 'flex-start', mt: 4 }}
            >
              <Button type='submit' variant='primary' disabled={isSaving}>
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
