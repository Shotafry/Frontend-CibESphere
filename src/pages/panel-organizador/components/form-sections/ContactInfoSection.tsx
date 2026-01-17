import React from 'react'
import { Box, Typography, TextField, InputAdornment, Grid } from '@mui/material'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import MapIcon from '@mui/icons-material/Map'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import { OrganizationResponse } from '../../../../types'

interface ContactInfoSectionProps {
  control: Control<OrganizationResponse>
  errors: FieldErrors<OrganizationResponse>
}

export const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  control,
  errors
}) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
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
    </>
  )
}
