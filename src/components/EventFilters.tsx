// src/components/EventFilters.tsx
import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
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
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import FilterListIcon from '@mui/icons-material/FilterList'

interface EventFiltersProps {
  initialFilters: EventFilterParams
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  initialFilters
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const submit = useSubmit()

  const [levels, setLevels] = useState<string[]>(initialFilters.levels)
  const [tags, setTags] = useState<string[]>(initialFilters.tags)
  const [dates, setDates] = useState({
    startDate: initialFilters.startDate,
    endDate: initialFilters.endDate
  })
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>(
    initialFilters.locations.filter((loc) =>
      AUTONOMOUS_COMMUNITIES.includes(loc)
    )
  )
  const [selectedCities, setSelectedCities] = useState<string[]>(
    initialFilters.locations.filter((loc) => ALL_CITIES.includes(loc))
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

    submit(searchParams)
  }

  const handleClearFilters = () => {
    setDates({ startDate: null, endDate: null })
    setTags([])
    setLevels([])
    setSelectedCommunities([])
    setSelectedCities([])
    setAvailableCities(ALL_CITIES)

    submit(null, { action: '/', method: 'get' })
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 4,
        borderRadius: '25px',
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon sx={{ color: 'var(--color-cadetblue)' }} />
          <Typography variant='h6' sx={{ color: 'var(--color-cadetblue)' }}>
            Filtros
          </Typography>
        </Box>
        <IconButton>{isOpen ? <ExpandLess /> : <ExpandMore />}</IconButton>
      </Box>

      <Collapse in={isOpen}>
        <Box component='div' sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <DatePicker
                label='Desde'
                value={dates.startDate}
                onChange={handleDateChange('startDate')}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <DatePicker
                label='Hasta'
                value={dates.endDate}
                onChange={handleDateChange('endDate')}
                sx={{ width: '100%' }}
              />
            </Grid>

            <Grid item size={{ xs: 12, md: 6 }}>
              <Autocomplete
                multiple
                options={AUTONOMOUS_COMMUNITIES}
                value={selectedCommunities}
                onChange={handleCommunityChange}
                renderInput={(params) => (
                  <TextField {...params} label='Comunidad Autónoma' />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Autocomplete
                multiple
                options={availableCities}
                value={selectedCities}
                onChange={handleCityChange}
                renderInput={(params) => (
                  <TextField {...params} label='Ciudad' />
                )}
              />
            </Grid>

            <Grid item size={{ xs: 12 }}>
              <Autocomplete
                multiple
                options={CYBERSECURITY_TAGS}
                value={tags}
                onChange={handleMultiSelectChange(setTags)}
                renderInput={(params) => (
                  <TextField {...params} label='Categorías / Tags' />
                )}
              />
            </Grid>

            <Grid item size={{ xs: 12 }}>
              <Autocomplete
                multiple
                options={EVENT_LEVELS}
                value={levels}
                onChange={handleMultiSelectChange(setLevels)}
                renderInput={(params) => (
                  <TextField {...params} label='Nivel del Evento' />
                )}
              />
            </Grid>

            <Grid
              item
              size={{ xs: 12 }}
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                mt: 2
              }}
            >
              <Button variant='outlined' onClick={handleClearFilters}>
                Limpiar Filtros
              </Button>
              <Button
                variant='contained'
                onClick={handleApplyFilters}
                sx={{
                  background: 'var(--gradient-button-primary)',
                  '&:hover': {
                    background: 'var(--gradient-button-primary-hover)'
                  }
                }}
              >
                Aplicar Filtros
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  )
}
