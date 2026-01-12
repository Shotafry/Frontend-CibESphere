// src/components/EventFilters.tsx
import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Grid,
  Paper,
  Collapse,
  IconButton,
  TextField,
  Autocomplete
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useSubmit } from 'react-router-dom'
import { EventFilterParams } from '../types'
import {
  LOCATION_DATA,
  AUTONOMOUS_COMMUNITIES,
  ALL_CITIES,
  CYBERSECURITY_TAGS,
  EVENT_LEVELS
} from '../constants/filters'
import ExpandMore from '@mui/icons-material/ExpandMore'
import FilterListIcon from '@mui/icons-material/FilterList'
import { Button } from './Button'

interface EventFiltersProps {
  initialFilters: EventFilterParams
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  initialFilters
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const submit = useSubmit()

  const [levels, setLevels] = useState<string[]>(initialFilters.levels || [])
  const [tags, setTags] = useState<string[]>(initialFilters.tags || [])
  const [languages, setLanguages] = useState<string[]>(
    initialFilters.languages || []
  )
  const [modality, setModality] = useState<string | null>(
    initialFilters.is_online === true
      ? 'Online'
      : initialFilters.is_online === false
      ? 'Presencial'
      : null
  )

  const [dates, setDates] = useState({
    startDate: initialFilters.startDate || null,
    endDate: initialFilters.endDate || null
  })

  const initialLocations = initialFilters.locations || []

  const [selectedCommunities, setSelectedCommunities] = useState<string[]>(
    initialLocations.filter((loc) => AUTONOMOUS_COMMUNITIES.includes(loc))
  )
  const [selectedCities, setSelectedCities] = useState<string[]>(
    initialLocations.filter((loc) => ALL_CITIES.includes(loc))
  )
  const [availableCities, setAvailableCities] = useState<string[]>(ALL_CITIES)

  useEffect(() => {
    if (selectedCommunities.length > 0) {
      const citiesFromSelectedCommunities = selectedCommunities.flatMap(
        (community) => LOCATION_DATA[community] || []
      )
      setAvailableCities([...new Set(citiesFromSelectedCommunities)].sort())
    } else {
      setAvailableCities(ALL_CITIES)
    }
  }, [selectedCommunities])

  const handleToggle = () => setIsOpen(!isOpen)

  const handleDateChange =
    (field: 'startDate' | 'endDate') => (date: Date | null) => {
      setDates((prev) => ({ ...prev, [field]: date }))
    }

  const handleCommunityChange = (
    event: React.SyntheticEvent,
    value: string[]
  ) => {
    setSelectedCommunities(value)

    if (value.length > 0) {
      const citiesFromSelectedCommunities = value.flatMap(
        (community) => LOCATION_DATA[community] || []
      )
      setAvailableCities([...new Set(citiesFromSelectedCommunities)].sort())
      setSelectedCities((prevCities) =>
        prevCities.filter((city) =>
          citiesFromSelectedCommunities.includes(city)
        )
      )
    } else {
      setAvailableCities(ALL_CITIES)
    }
  }

  const handleCityChange = (event: React.SyntheticEvent, value: string[]) => {
    setSelectedCities(value)
  }

  const handleModalityChange = (
    event: React.SyntheticEvent,
    value: string | null
  ) => {
    setModality(value)
  }

  const handleMultiSelectChange =
    (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    (event: React.SyntheticEvent, value: string[]) => {
      setter(value)
    }

  const handleApplyFilters = () => {
    const allLocations = [
      ...new Set([...selectedCommunities, ...selectedCities])
    ]

    const searchParams = new URLSearchParams()
    if (dates.startDate) {
      searchParams.set('startDate', dates.startDate.toISOString())
    }
    if (dates.endDate) {
      searchParams.set('endDate', dates.endDate.toISOString())
    }
    tags.forEach((tag) => searchParams.append('tags', tag))
    allLocations.forEach((loc) => searchParams.append('locations', loc))
    levels.forEach((level) => searchParams.append('levels', level))
    levels.forEach((level) => searchParams.append('levels', level))
    languages.forEach((lang) => searchParams.append('languages', lang))

    if (modality === 'Online') {
      searchParams.set('is_online', 'true')
    } else if (modality === 'Presencial') {
      searchParams.set('is_online', 'false')
    }

    submit(searchParams)
  }

  const handleClearFilters = () => {
    setDates({ startDate: null, endDate: null })
    setTags([])
    setLevels([])
    setTags([])
    setLevels([])
    setLanguages([])
    setModality(null)
    setSelectedCommunities([])
    setSelectedCities([])
    setAvailableCities(ALL_CITIES)

    submit(null, { action: '/', method: 'get' })
  }

  // Common styles for filter inputs
  const filterInputSx = {
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

  return (
    <Paper
      elevation={3}
      sx={{
        p: 1,
        mb: 2,
        borderRadius: '15px',
        background: 'var(--White)',
        boxShadow: 'var(--shadow-drop)'
      }}
    >
      <Box
        onClick={handleToggle}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <FilterListIcon
            sx={{ color: 'var(--color-cadetblue)', fontSize: 18 }}
          />
          <Typography
            variant='h6'
            sx={{ color: 'var(--color-cadetblue)', fontWeight: 400 }}
          >
            Filtros de Evento
          </Typography>
        </Box>
        <IconButton
          sx={{
            color: 'var(--color-cadetblue)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}
        >
          <ExpandMore />
        </IconButton>
      </Box>

      <Collapse in={isOpen}>
        <Box component='div' sx={{ pt: 4 }}>
          <Grid container spacing={3}>
            {/* FILA 1: FECHAS */}
            <Grid size={{ xs: 12, md: 6 }}>
              <DatePicker
                label='Desde'
                value={dates.startDate}
                onChange={handleDateChange('startDate')}
                sx={{ width: '100%' }}
                slotProps={{
                  textField: {
                    variant: 'filled',
                    fullWidth: true,
                    hiddenLabel: false,
                    sx: filterInputSx
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <DatePicker
                label='Hasta'
                value={dates.endDate}
                onChange={handleDateChange('endDate')}
                sx={{ width: '100%' }}
                slotProps={{
                  textField: {
                    variant: 'filled',
                    fullWidth: true,
                    sx: filterInputSx
                  }
                }}
              />
            </Grid>

            {/* FILA 2: UBICACIÓN */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Autocomplete
                multiple
                options={AUTONOMOUS_COMMUNITIES}
                value={selectedCommunities}
                onChange={handleCommunityChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Comunidad Autónoma'
                    variant='filled'
                    sx={filterInputSx}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Autocomplete
                multiple
                options={availableCities}
                value={selectedCities}
                onChange={handleCityChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Ciudad'
                    variant='filled'
                    sx={filterInputSx}
                  />
                )}
              />
            </Grid>

            {/* FILA 3: CATEGORÍAS (Ancho completo) */}
            <Grid size={{ xs: 12 }}>
              <Autocomplete
                multiple
                options={CYBERSECURITY_TAGS}
                value={tags}
                onChange={handleMultiSelectChange(setTags)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Categorías / Tags'
                    variant='filled'
                    sx={filterInputSx}
                  />
                )}
              />
            </Grid>

            {/* FILA 4: MODALIDAD, NIVEL E IDIOMA */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                options={['Online', 'Presencial']}
                value={modality}
                onChange={handleModalityChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Modalidad'
                    variant='filled'
                    sx={filterInputSx}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                multiple
                options={EVENT_LEVELS}
                value={levels}
                onChange={handleMultiSelectChange(setLevels)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Nivel del Evento'
                    variant='filled'
                    sx={filterInputSx}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                multiple
                options={[
                  'Español',
                  'Inglés',
                  'Catalán',
                  'Euskera',
                  'Gallego',
                  'Valenciano'
                ]}
                value={languages}
                onChange={handleMultiSelectChange(setLanguages)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Idioma'
                    variant='filled'
                    sx={filterInputSx}
                  />
                )}
              />
            </Grid>

            {/* BOTONES */}
            <Grid
              size={{ xs: 12 }}
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                mt: 2
              }}
            >
              <Button variant='primary' onClick={handleClearFilters}>
                Limpiar
              </Button>
              <Button variant='secondary' onClick={handleApplyFilters}>
                Aplicar Filtros
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  )
}
