// src/pages/Page.tsx
import { FunctionComponent, useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Button,
  Container,
  Paper,
  Grid,
  CircularProgress,
  Switch,
  FormControlLabel,
  Autocomplete,
  Alert,
  Collapse
} from '@mui/material'
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useNavigate, useLoaderData } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as apiService from '../services/apiService'
import { CreateEventDTO, Event } from '../types'
import {
  CYBERSECURITY_TAGS,
  EVENT_LEVELS,
  LOCATION_DATA,
  AUTONOMOUS_COMMUNITIES
} from '../constants/filters'

// Estilo común para inputs modernos
const commonInputSx = {
  '& .MuiFilledInput-root': {
    backgroundColor: '#F3F6F9',
    borderRadius: '12px',
    border: '1px solid transparent',
    transition: 'all 0.2s',
    '&:hover': { backgroundColor: '#EBEEF2' },
    '&.Mui-focused': {
      backgroundColor: '#fff',
      borderColor: 'var(--color-cadetblue)',
      boxShadow: '0 0 0 4px rgba(79, 186, 200, 0.1)'
    },
    '&:before, &:after': { display: 'none' }
  }
}

const Page: FunctionComponent = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const loadedEvent = useLoaderData() as Event | null
  const isEditMode = !!loadedEvent

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<any>({
    title: loadedEvent?.title || '',
    description: loadedEvent?.description || '',
    short_desc: loadedEvent?.short_desc || '',
    type: loadedEvent?.type || 'conference',
    category: loadedEvent?.category || '',
    level: loadedEvent?.level || 'intermediate',
    language: loadedEvent?.language || 'Español', // Nuevo campo
    start_date: loadedEvent ? new Date(loadedEvent.start_date) : new Date(),
    end_date: loadedEvent ? new Date(loadedEvent.end_date) : new Date(),
    is_online: loadedEvent?.is_online || false,
    is_free: loadedEvent?.is_free || true,
    tags: loadedEvent?.tags || [],
    venue_name: loadedEvent?.venue_name || '',
    venue_address: loadedEvent?.venue_address || '',
    venue_city: loadedEvent?.venue_city || '',
    venue_community: loadedEvent?.venue_community || '',
    online_url: loadedEvent?.online_url || '',
    price: loadedEvent?.price || 0
  })

  const [availableCities, setAvailableCities] = useState<string[]>([])

  useEffect(() => {
    if (isEditMode && formData.venue_community) {
      setAvailableCities(LOCATION_DATA[formData.venue_community] || [])
    }
  }, [isEditMode, formData.venue_community])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleDateChange =
    (field: 'start_date' | 'end_date') => (date: Date | null) => {
      if (date) {
        setFormData((prev: any) => ({ ...prev, [field]: date }))
      }
    }

  const handleAutocompleteChange =
    (field: 'tags') => (event: any, value: string[]) => {
      setFormData((prev: any) => ({ ...prev, [field]: value }))
    }

  const handleLanguageChange = (event: any, value: string | null) => {
    setFormData((prev: any) => ({ ...prev, language: value || 'Español' }))
  }

  const handleSingleAutocompleteChange =
    (field: 'venue_city' | 'venue_community') =>
    (event: any, value: string | null) => {
      if (field === 'venue_community') {
        const newCommunity = value || ''
        setFormData((prev: any) => ({
          ...prev,
          venue_community: newCommunity,
          venue_city: ''
        }))
        setAvailableCities(newCommunity ? LOCATION_DATA[newCommunity] : [])
      } else {
        setFormData((prev: any) => ({ ...prev, [field]: value || '' }))
      }
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !user.organization) {
      setError(
        'Debes ser un organizador verificado para ' +
          (isEditMode ? 'editar' : 'crear') +
          ' un evento.'
      )
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const eventData: CreateEventDTO = {
        ...formData,
        organization_id: user.organization.id
      } as CreateEventDTO

      if (isEditMode) {
        await apiService.updateEvent(loadedEvent.id, eventData)
      } else {
        await apiService.createEvent(eventData, user.organization)
      }

      navigate('/panel-de-organizador')
    } catch (err: any) {
      setError(
        err.message ||
          `Error al ${isEditMode ? 'actualizar' : 'crear'} el evento.`
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth='md' sx={{ my: 5 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: '25px',
            background: 'var(--White)',
            boxShadow: 'var(--shadow-drop)'
          }}
        >
          <Typography
            variant='h4'
            component='h1'
            fontWeight='bold'
            gutterBottom
            sx={{ color: 'var(--color-cadetblue)', mb: 3 }}
          >
            {isEditMode ? 'Editar Evento' : 'Crear Nuevo Evento'}
          </Typography>
          <Box component='form' onSubmit={handleSubmit}>
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

              {/* Fila: Tipo, Nivel, Idioma */}
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
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_online}
                      onChange={handleChange}
                      name='is_online'
                    />
                  }
                  label='Evento Online'
                />
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
                      onChange={handleSingleAutocompleteChange(
                        'venue_community'
                      )}
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
                <TextField
                  name='online_url'
                  label='URL del Evento Online'
                  fullWidth
                  variant='filled'
                  value={formData.online_url}
                  onChange={handleChange}
                  sx={commonInputSx}
                />
              </Collapse>
              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_free}
                      onChange={handleChange}
                      name='is_free'
                    />
                  }
                  label='Evento Gratuito'
                />
              </Grid>
              <Collapse in={!formData.is_free} sx={{ width: '100%', px: 2 }}>
                <TextField
                  name='price'
                  label='Precio'
                  type='number'
                  fullWidth
                  variant='filled'
                  value={formData.price}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>€</InputAdornment>
                    )
                  }}
                  sx={commonInputSx}
                />
              </Collapse>
              {error && (
                <Grid size={{ xs: 12 }}>
                  <Alert severity='error'>{error}</Alert>
                </Grid>
              )}
              <Grid
                size={{ xs: 12 }}
                sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}
              >
                <Button
                  type='submit'
                  variant='contained'
                  size='large'
                  disabled={isLoading}
                  sx={{
                    borderRadius: '25px',
                    background: 'var(--gradient-button-primary)',
                    boxShadow: '0 4px 14px rgba(0, 217, 255, 0.3)',
                    '&:hover': {
                      background: 'var(--gradient-button-primary-hover)',
                      boxShadow: '0 6px 20px rgba(0, 217, 255, 0.5)'
                    }
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} />
                  ) : isEditMode ? (
                    'Guardar Cambios'
                  ) : (
                    'Crear Evento'
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  )
}

export default Page
