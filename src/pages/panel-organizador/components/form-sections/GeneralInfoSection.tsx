import React from 'react'
import { Box, Typography, TextField, InputAdornment, Grid } from '@mui/material'
import BusinessIcon from '@mui/icons-material/Business'
import LinkIcon from '@mui/icons-material/Link'
import DescriptionIcon from '@mui/icons-material/Description'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import LanguageIcon from '@mui/icons-material/Language'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import { OrganizationResponse, User } from '../../../../types'
import * as apiService from '../../../../services/apiService'

interface GeneralInfoSectionProps {
  control: Control<OrganizationResponse>
  errors: FieldErrors<OrganizationResponse>
  user: User | null
}

export const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({
  control,
  errors,
  user
}) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <BusinessIcon sx={{ color: 'var(--color-cadetblue)' }} />
        <Typography variant='h6' fontWeight='bold'>
          Información General
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
              if (!value || value === user?.organization?.slug) return true
              try {
                const available = await apiService.checkSlugAvailability(value)
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
      </Box>
    </>
  )
}
