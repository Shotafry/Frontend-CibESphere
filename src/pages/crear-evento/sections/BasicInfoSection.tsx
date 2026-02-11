import React from 'react'
import {
  Grid,
  TextField,
  MenuItem,
  Autocomplete,
  Typography
} from '@mui/material'
import { commonInputSx } from '../styles'
import {
  EVENT_TYPES,
  EVENT_CATEGORIES,
  EVENT_TAGS,
  EVENT_LEVELS
} from '../../../constants/filters'
import { EventImageUploader } from '../../../components/EventImageUploader'

interface BasicInfoSectionProps {
  formData: any
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleAutocompleteChange: (
    field: 'tags'
  ) => (event: any, value: string[]) => void
  handleLanguageChange: (event: any, value: string | null) => void
  handleImageChange?: (url: string | null) => void
  handleCardImageChange?: (url: string | null) => void
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  handleChange,
  handleAutocompleteChange,
  handleLanguageChange,
  handleImageChange,
  handleCardImageChange
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
          helperText='Mínimo 5 caracteres'
          error={formData.title.length > 0 && formData.title.length < 5}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant='caption' sx={{ mb: 1, display: 'block' }}>
          Imagen de Cabecera (Banner)
        </Typography>
        {handleImageChange ? (
          <EventImageUploader
            imageUrl={formData.image_url || null}
            onImageChange={handleImageChange}
          />
        ) : (
          <TextField
            name='image_url'
            label='URL del Banner'
            fullWidth
            variant='filled'
            value={formData.image_url}
            onChange={handleChange}
            placeholder='https://ejemplo.com/banner.jpg'
            sx={commonInputSx}
          />
        )}
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant='caption' sx={{ mb: 1, display: 'block' }}>
          Imagen para Tarjeta (Logo / Cuadrada)
        </Typography>
        {handleCardImageChange ? (
          <EventImageUploader
            imageUrl={formData.card_image_url || null}
            onImageChange={handleCardImageChange}
          />
        ) : (
          <TextField
            name='card_image_url'
            label='URL del Logo'
            fullWidth
            variant='filled'
            value={formData.card_image_url}
            onChange={handleChange}
            placeholder='https://ejemplo.com/logo.jpg'
            sx={commonInputSx}
          />
        )}
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
          helperText='Mínimo 10 caracteres'
          error={
            formData.description.length > 0 && formData.description.length < 10
          }
        />
      </Grid>

      {/* TAXONOMÍA */}
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          name='type'
          label='Tipo de Evento'
          select
          fullWidth
          required
          variant='filled'
          value={formData.type}
          onChange={handleChange}
          sx={commonInputSx}
        >
          {EVENT_TYPES.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          name='category'
          label='Categoría'
          select
          fullWidth
          required
          variant='filled'
          value={formData.category || ''}
          onChange={handleChange}
          sx={commonInputSx}
        >
          {EVENT_CATEGORIES.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
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
            <MenuItem key={level.value} value={level.value}>
              {level.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
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

      <Grid size={{ xs: 12, md: 6 }}>
        <Autocomplete
          multiple
          options={EVENT_TAGS}
          value={formData.tags}
          onChange={handleAutocompleteChange('tags')}
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
