// src/pages/Page.tsx
import { FunctionComponent, useState, useEffect } from 'react' // <-- AÑADIDO useEffect
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
  LOCATION_DATA, // <-- NUEVO: Importamos el objeto de datos
  AUTONOMOUS_COMMUNITIES // <-- Importamos la lista de comunidades
} from '../constants/filters'

const Page: FunctionComponent = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const loadedEvent = useLoaderData() as Event | null
  const isEditMode = !!loadedEvent

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // --- MODIFICADO: El estado se inicializa con los datos del loader si existen ---
  const [formData, setFormData] = useState<any>({
    title: loadedEvent?.title || '',
    description: loadedEvent?.description || '',
    short_desc: loadedEvent?.short_desc || '',
    type: loadedEvent?.type || 'conference',
    category: loadedEvent?.category || '',
    level: loadedEvent?.level || 'intermediate',
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

  // --- NUEVO: Estado para las ciudades disponibles según la comunidad ---
  const [availableCities, setAvailableCities] = useState<string[]>([])

  // --- NUEVO: Efecto para cargar las ciudades si estamos en modo edición ---
  useEffect(() => {
    if (isEditMode && formData.venue_community) {
      setAvailableCities(LOCATION_DATA[formData.venue_community] || [])
    }
  }, [isEditMode, formData.venue_community])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleDateChange =
    (field: 'start_date' | 'end_date') => (date: Date | null) => {
      if (date) {
        setFormData((prev) => ({ ...prev, [field]: date }))
      }
    }

  const handleAutocompleteChange =
    (field: 'tags') => (event: any, value: string[]) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }

  // --- MODIFICADO: Handler para Autocomplete ---
  const handleSingleAutocompleteChange =
    (field: 'venue_city' | 'venue_community') =>
    (event: any, value: string | null) => {
      // Lógica de dependencia
      if (field === 'venue_community') {
        // Si cambia la comunidad...
        const newCommunity = value || ''
        setFormData((prev) => ({
          ...prev,
          venue_community: newCommunity,
          venue_city: '' // <-- Reseteamos la ciudad
        }))
        // Actualizamos la lista de ciudades disponibles
        setAvailableCities(newCommunity ? LOCATION_DATA[newCommunity] : [])
      } else {
        // Si cambia la ciudad...
        setFormData((prev) => ({ ...prev, [field]: value || '' }))
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
        <Paper sx={{ p: 4, borderRadius: '16px' }}>
          <Typography
            variant='h4'
            component='h1'
            fontWeight='bold'
            gutterBottom
          >
            {isEditMode ? 'Editar Evento' : 'Crear Nuevo Evento'}
          </Typography>
          <Box component='form' onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* --- Campos Título, Descripciones, Fechas, etc. (se mantienen igual) --- */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  name='title'
                  label='Título del Evento'
                  fullWidth
                  required
                  value={formData.title}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  name='short_desc'
                  label='Descripción Corta (máx 200 caracteres)'
                  fullWidth
                  required
                  value={formData.short_desc}
                  onChange={handleChange}
                  inputProps={{ maxLength: 200 }}
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
                  value={formData.description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  name='type'
                  label='Tipo de Evento'
                  select
                  fullWidth
                  value={formData.type}
                  onChange={handleChange}
                >
                  <MenuItem value='conference'>Conferencia</MenuItem>
                  <MenuItem value='workshop'>Taller</MenuItem>
                  <MenuItem value='meetup'>Meetup</MenuItem>
                  <MenuItem value='webinar'>Webinar</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  name='level'
                  label='Nivel'
                  select
                  fullWidth
                  value={formData.level}
                  onChange={handleChange}
                >
                  {EVENT_LEVELS.map((level) => (
                    <MenuItem key={level} value={level.toLowerCase()}>
                      {level}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Autocomplete
                  multiple
                  options={CYBERSECURITY_TAGS}
                  value={formData.tags}
                  onChange={handleAutocompleteChange('tags')}
                  freeSolo
                  renderInput={(params) => (
                    <TextField {...params} label='Tags' />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DateTimePicker
                  label='Fecha y Hora de Inicio'
                  value={formData.start_date}
                  onChange={handleDateChange('start_date')}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DateTimePicker
                  label='Fecha y Hora de Fin'
                  value={formData.end_date}
                  onChange={handleDateChange('end_date')}
                />
              </Grid>
              {/* --- Fin campos sin cambios --- */}

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

              {/* --- CAMPOS DE LOCALIZACIÓN CORREGIDOS --- */}
              <Collapse in={!formData.is_online} sx={{ width: '100%' }}>
                <Grid container spacing={3} sx={{ p: 2, pt: 0 }}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      name='venue_name'
                      label='Nombre del Lugar (Ej: IFEMA, Palacio Euskalduna...)'
                      fullWidth
                      value={formData.venue_name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      name='venue_address'
                      label='Dirección (Ej: Av. del Partenón, 5)'
                      fullWidth
                      value={formData.venue_address}
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* --- 1. COMUNIDAD AUTÓNOMA (Elige primero) --- */}
                  <Grid size={{ xs: 12, sm: 6 }}>
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
                          required={!formData.is_online} // Requerido si no es online
                        />
                      )}
                    />
                  </Grid>

                  {/* --- 2. CIUDAD (Filtrada por comunidad) --- */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Autocomplete
                      options={availableCities} // <-- Opciones dinámicas
                      value={formData.venue_city || null}
                      onChange={handleSingleAutocompleteChange('venue_city')}
                      disabled={!formData.venue_community} // <-- Deshabilitado hasta elegir comunidad
                      freeSolo // Permitir ciudades no listadas
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='Ciudad'
                          required={!formData.is_online} // Requerido si no es online
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Collapse>
              {/* --- FIN DE CAMPOS DE LOCALIZACIÓN --- */}

              <Collapse in={formData.is_online} sx={{ width: '100%', px: 2 }}>
                <TextField
                  name='online_url'
                  label='URL del Evento Online'
                  fullWidth
                  value={formData.online_url}
                  onChange={handleChange}
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
                  value={formData.price}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>€</InputAdornment>
                    )
                  }}
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
                    '&:hover': {
                      background: 'var(--gradient-button-primary-hover)'
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
