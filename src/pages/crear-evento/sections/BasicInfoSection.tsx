import React from 'react'
import { Grid, TextField, MenuItem, Autocomplete } from '@mui/material'
import { commonInputSx } from '../styles'
import { CYBERSECURITY_TAGS, EVENT_LEVELS } from '../../../constants/filters'

interface BasicInfoSectionProps {
  formData: any
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleAutocompleteChange: (
    field: 'tags'
  ) => (event: any, value: string[]) => void
  handleLanguageChange: (event: any, value: string | null) => void
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  handleChange,
  handleAutocompleteChange,
  handleLanguageChange
}) => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <TextField
          name='title'
          label='Título del Evento'
          fullWidth
          required
          variant='filled'
          value={formData.title}
          onChange={handleChange}
          sx={commonInputSx}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          name='image_url'
          label='URL del Logo o Imagen Principal'
          fullWidth
          variant='filled'
          value={formData.image_url}
          onChange={handleChange}
          placeholder='https://ejemplo.com/imagen.jpg'
          sx={commonInputSx}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          name='short_desc'
          label='Descripción Corta (máx 200 caracteres)'
          fullWidth
          required
          variant='filled'
          value={formData.short_desc}
          onChange={handleChange}
          inputProps={{ maxLength: 200 }}
          sx={commonInputSx}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          name='description'
          label='Descripción Completa'
          fullWidth
          required
          multiline
          rows={4}
          variant='filled'
          value={formData.description}
          onChange={handleChange}
          sx={commonInputSx}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          name='type'
          label='Tipo de Evento'
          select
          fullWidth
          variant='filled'
          value={formData.type}
          onChange={handleChange}
          sx={commonInputSx}
        >
          <MenuItem value='conference'>Conferencia</MenuItem>
          <MenuItem value='workshop'>Taller</MenuItem>
          <MenuItem value='meetup'>Meetup</MenuItem>
          <MenuItem value='webinar'>Webinar</MenuItem>
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          name='level'
          label='Nivel'
          select
          fullWidth
          variant='filled'
          value={formData.level}
          onChange={handleChange}
          sx={commonInputSx}
        >
          {EVENT_LEVELS.map((level) => (
            <MenuItem key={level} value={level.toLowerCase()}>
              {level}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Autocomplete
          options={[
            'Español',
            'Inglés',
            'Catalán',
            'Euskera',
            'Gallego',
            'Valenciano'
          ]}
          value={formData.language}
          onChange={handleLanguageChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Idioma'
              variant='filled'
              required
              sx={commonInputSx}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Autocomplete
          multiple
          options={CYBERSECURITY_TAGS}
          value={formData.tags}
          onChange={handleAutocompleteChange('tags')}
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              label='Tags'
              variant='filled'
              sx={commonInputSx}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          name='requirements'
          label='Requisitos para Asistentes'
          fullWidth
          multiline
          rows={2}
          variant='filled'
          value={formData.requirements}
          onChange={handleChange}
          placeholder='Traer portátil, instalar X software...'
          sx={commonInputSx}
        />
      </Grid>
    </Grid>
  )
}
