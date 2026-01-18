import React from 'react'
import {
  Grid,
  TextField,
  MenuItem,
  Autocomplete,
  Collapse
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import { commonInputSx } from '../styles'
import { AUTONOMOUS_COMMUNITIES } from '../../../constants/filters'
import {
  LocationPicker,
  LocationData
} from '../../../components/LocationPicker'

interface DateLocationSectionProps {
  formData: any
  availableCities: string[]
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleDateChange: (
    field: 'start_date' | 'end_date'
  ) => (date: Date | null) => void
  handleSingleAutocompleteChange: (
    field: 'venue_city' | 'venue_community'
  ) => (event: any, value: string | null) => void
  handleLocationChange?: (location: LocationData | null) => void
}

export const DateLocationSection: React.FC<DateLocationSectionProps> = ({
  formData,
  availableCities,
  handleChange,
  handleDateChange,
  handleSingleAutocompleteChange,
  handleLocationChange
}) => {
  // Build LocationData value from formData
  const locationValue: LocationData | null =
    formData.latitude && formData.longitude
      ? {
          latitude: formData.latitude,
          longitude: formData.longitude,
          address: formData.venue_address || '',
          city: formData.venue_city
        }
      : null

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <DateTimePicker
          label='Fecha y Hora de Inicio'
          value={formData.start_date}
          onChange={handleDateChange('start_date')}
          slotProps={{
            textField: {
              variant: 'filled',
              fullWidth: true,
              sx: commonInputSx
            }
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <DateTimePicker
          label='Fecha y Hora de Fin'
          value={formData.end_date}
          onChange={handleDateChange('end_date')}
          slotProps={{
            textField: {
              variant: 'filled',
              fullWidth: true,
              sx: commonInputSx
            }
          }}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          name='is_online'
          label='Modalidad'
          select
          fullWidth
          variant='filled'
          value={formData.is_online ? 'online' : 'presencial'}
          onChange={(e) => {
            const isOnline = e.target.value === 'online'
            const syntheticEvent = {
              target: {
                name: 'is_online',
                value: isOnline,
                type: 'text'
              }
            } as any
            handleChange(syntheticEvent)
          }}
          sx={commonInputSx}
        >
          <MenuItem value='presencial'>Presencial</MenuItem>
          <MenuItem value='online'>Online</MenuItem>
        </TextField>
      </Grid>

      <Collapse in={!formData.is_online} sx={{ width: '100%' }}>
        <Grid container spacing={3} sx={{ p: 2, pt: 0 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              name='venue_name'
              label='Nombre del Lugar'
              fullWidth
              variant='filled'
              value={formData.venue_name}
              onChange={handleChange}
              sx={commonInputSx}
            />
          </Grid>

          {/* LocationPicker with Geocoding */}
          {handleLocationChange && (
            <Grid size={{ xs: 12 }}>
              <LocationPicker
                value={locationValue}
                onChange={handleLocationChange}
                label='Buscar Dirección'
                helperText='Busca la dirección o haz clic en el mapa para seleccionar ubicación'
              />
            </Grid>
          )}

          {/* Fallback manual address input if no LocationPicker handler */}
          {!handleLocationChange && (
            <Grid size={{ xs: 12 }}>
              <TextField
                name='venue_address'
                label='Dirección'
                fullWidth
                variant='filled'
                value={formData.venue_address}
                onChange={handleChange}
                sx={commonInputSx}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12, md: 6 }}>
            <Autocomplete
              options={AUTONOMOUS_COMMUNITIES}
              value={formData.venue_community || null}
              onChange={handleSingleAutocompleteChange('venue_community')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Comunidad Autónoma'
                  variant='filled'
                  required={!formData.is_online}
                  sx={commonInputSx}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Autocomplete
              options={availableCities}
              value={formData.venue_city || null}
              onChange={handleSingleAutocompleteChange('venue_city')}
              disabled={!formData.venue_community}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Ciudad'
                  variant='filled'
                  required={!formData.is_online}
                  sx={commonInputSx}
                />
              )}
            />
          </Grid>
        </Grid>
      </Collapse>

      <Collapse in={formData.is_online} sx={{ width: '100%', px: 2 }}>
        <Grid size={{ xs: 12 }}>
          <TextField
            name='online_url'
            label='URL del Evento Online'
            fullWidth
            variant='filled'
            value={formData.online_url}
            onChange={handleChange}
            sx={commonInputSx}
          />
        </Grid>
      </Collapse>
    </Grid>
  )
}
