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
  Collapse,
  IconButton,
  Divider,
  Card,
  CardContent
} from '@mui/material'
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useNavigate, useLoaderData } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as apiService from '../services/apiService'
import { CreateEventDTO, Event, AgendaItem, Speaker } from '../types'
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
    language: loadedEvent?.language || 'Español',
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
    price: loadedEvent?.price || 0,
    image_url: loadedEvent?.image_url || '',
    max_attendees: loadedEvent?.max_attendees || 0,
    agenda: loadedEvent?.agenda || [],
    speakers: loadedEvent?.speakers || [],
    requirements: loadedEvent?.requirements || ''
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

  // --- AGENDA MANAGEMENT ---
  const handleAddAgendaItem = () => {
    setFormData((prev: any) => ({
      ...prev,
      agenda: [
        ...prev.agenda,
        { id: Date.now().toString(), time: '', title: '', description: '' }
      ]
    }))
  }

  const handleRemoveAgendaItem = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      agenda: prev.agenda.filter((item: AgendaItem) => item.id !== id)
    }))
  }

  const handleAgendaItemChange = (
    id: string,
    field: keyof AgendaItem,
    value: string
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      agenda: prev.agenda.map((item: AgendaItem) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  // --- SPEAKER MANAGEMENT ---
  const handleAddSpeaker = () => {
    setFormData((prev: any) => ({
      ...prev,
      speakers: [
        ...prev.speakers,
        { id: Date.now().toString(), name: '', role: '', topic: '', time: '' }
      ]
    }))
  }

  const handleRemoveSpeaker = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      speakers: prev.speakers.filter((item: Speaker) => item.id !== id)
    }))
  }

  const handleSpeakerChange = (
    id: string,
    field: keyof Speaker,
    value: string
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      speakers: prev.speakers.map((item: Speaker) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
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
        organization_id: user.organization.id,
        max_attendees: Number(formData.max_attendees)
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

              {/* --- SECCIÓN ITINERARIO --- */}
              <Grid size={{ xs: 12 }}>
                <Card
                  variant='outlined'
                  sx={{
                    borderRadius: '16px',
                    borderColor: 'var(--Gray-300)',
                    mt: 2,
                    backgroundColor: '#FAFAFA'
                  }}
                >
                  <CardContent>
                    <Typography
                      variant='h6'
                      fontWeight='bold'
                      sx={{ color: 'var(--color-cadetblue)', mb: 2 }}
                    >
                      Itinerario / Agenda
                    </Typography>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{ mb: 3 }}
                    >
                      Añade los detalles de la agenda y ponentes. Si dejas esto
                      vacío, no se mostrará en la página del evento.
                    </Typography>

                    {/* AGENDA */}
                    <Typography
                      variant='subtitle1'
                      fontWeight='bold'
                      sx={{ mb: 1 }}
                    >
                      Agenda
                    </Typography>
                    {formData.agenda.map((item: AgendaItem, index: number) => (
                      <Box
                        key={item.id}
                        sx={{
                          display: 'flex',
                          gap: 2,
                          mb: 2,
                          alignItems: 'flex-start'
                        }}
                      >
                        <TextField
                          label='Hora'
                          value={item.time}
                          onChange={(e) =>
                            handleAgendaItemChange(
                              item.id,
                              'time',
                              e.target.value
                            )
                          }
                          variant='filled'
                          size='small'
                          sx={{ ...commonInputSx, width: '120px' }}
                          placeholder='09:00'
                        />
                        <TextField
                          label='Título / Actividad'
                          value={item.title}
                          onChange={(e) =>
                            handleAgendaItemChange(
                              item.id,
                              'title',
                              e.target.value
                            )
                          }
                          variant='filled'
                          size='small'
                          fullWidth
                          sx={commonInputSx}
                        />
                        <TextField
                          label='Descripción (Opcional)'
                          value={item.description}
                          onChange={(e) =>
                            handleAgendaItemChange(
                              item.id,
                              'description',
                              e.target.value
                            )
                          }
                          variant='filled'
                          size='small'
                          fullWidth
                          sx={commonInputSx}
                        />
                        <IconButton
                          onClick={() => handleRemoveAgendaItem(item.id)}
                          color='error'
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={handleAddAgendaItem}
                      sx={{ mb: 4 }}
                    >
                      Añadir Actividad
                    </Button>

                    <Divider sx={{ my: 2 }} />

                    {/* PONENTES */}
                    <Typography
                      variant='subtitle1'
                      fontWeight='bold'
                      sx={{ mb: 1 }}
                    >
                      Ponentes
                    </Typography>
                    {formData.speakers.map(
                      (speaker: Speaker, index: number) => (
                        <Box
                          key={speaker.id}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            mb: 3,
                            p: 2,
                            border: '1px dashed #ccc',
                            borderRadius: '8px'
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between'
                            }}
                          >
                            <Typography
                              variant='caption'
                              color='text.secondary'
                            >
                              Ponente #{index + 1}
                            </Typography>
                            <IconButton
                              onClick={() => handleRemoveSpeaker(speaker.id)}
                              color='error'
                              size='small'
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                              label='Nombre'
                              value={speaker.name}
                              onChange={(e) =>
                                handleSpeakerChange(
                                  speaker.id,
                                  'name',
                                  e.target.value
                                )
                              }
                              variant='filled'
                              size='small'
                              fullWidth
                              sx={commonInputSx}
                            />
                            <TextField
                              label='Cargo / Rol'
                              value={speaker.role}
                              onChange={(e) =>
                                handleSpeakerChange(
                                  speaker.id,
                                  'role',
                                  e.target.value
                                )
                              }
                              variant='filled'
                              size='small'
                              fullWidth
                              sx={commonInputSx}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                              label='Tema / Título de la Charla'
                              value={speaker.topic}
                              onChange={(e) =>
                                handleSpeakerChange(
                                  speaker.id,
                                  'topic',
                                  e.target.value
                                )
                              }
                              variant='filled'
                              size='small'
                              fullWidth
                              sx={commonInputSx}
                            />
                            <TextField
                              label='Hora Ligada'
                              value={speaker.time}
                              onChange={(e) =>
                                handleSpeakerChange(
                                  speaker.id,
                                  'time',
                                  e.target.value
                                )
                              }
                              variant='filled'
                              size='small'
                              sx={{ ...commonInputSx, width: '150px' }}
                              placeholder='09:00'
                            />
                          </Box>
                        </Box>
                      )
                    )}
                    <Button startIcon={<AddIcon />} onClick={handleAddSpeaker}>
                      Añadir Ponente
                    </Button>
                  </CardContent>
                </Card>
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
                <TextField
                  name='max_attendees'
                  label='Límite de Asistentes'
                  type='number'
                  fullWidth
                  variant='filled'
                  value={formData.max_attendees}
                  onChange={handleChange}
                  helperText='Dejar en 0 para aforo ilimitado'
                  sx={commonInputSx}
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
