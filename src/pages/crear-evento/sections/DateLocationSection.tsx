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
}

export const DateLocationSection: React.FC<DateLocationSectionProps> = ({
  formData,
  availableCities,
  handleChange,
  handleDateChange,
  handleSingleAutocompleteChange
}) => {
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
            // Manual handling to match original logic which expects event but sets boolean
            // We can delegate to parent's handleChange if it handles the boolean conversion there?
            // Wait, the parent handleChange handles generic inputs.
            // In original Page.tsx:
            // onChange={(e) => { const value = e.target.value === 'online'; ... }}
            // So we should do the same here or pass a custom handler?
            // Let's assume parent passed a generic handleChange and we adapt here:
            // Actually, let's keep the logic consistent.
            const customEvent = {
              target: {
                name: 'is_online',
                value: e.target.value === 'online' // This logic is tricky if strict typing.
                // The hook's handleChange uses: [name]: type === 'checkbox' ? checked : value
                // e.target.value is a string here.
                // We need to pass the boolean.
                // Let's manually call setFormData from the prop? No, let's just use the hook's helper or adapt.
                // Quick fix: Use the custom logic from the original file by calling a specific handler or
                // just calling the prop with a fake event object if strictness allows, or better:
                // The Hook's `handleChange` handles `e.target.value`.
                // If we pass `value` as boolean, `handleChange` might just set it.
                // But `e.target.value` on a select is string.
                // We need a specific handler in parent or just do it here.
                // Let's assume we can't easily use the generic `handleChange` for this specific transformation
                // unless we modify the hook.
                // Modification to hook:
                // `handleChange` takes `ChangeEvent<HTMLInputElement>`.
                // Let's modify the hook to be more flexible or just handle it here by passing a custom object.
              }
            }
            // Actually, let's just do the logic here and call a setter if exposed, OR
            // just pass a `handleModeChange` prop.
            // Let's use the generic logic:
            // But wait, the component receives `handleChange`.
            // Let's cheat slightly and cast:
            const isOnline = e.target.value === 'online'
            // We can't use the generic handleChange because it reads from e.target.value and sets that.
            // We want to set a boolean.
            // Let's just create a synthetic event:
            const syntheticEvent = {
              target: {
                name: 'is_online',
                value: isOnline,
                type: 'text' // trick to avoid checkbox logic
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
