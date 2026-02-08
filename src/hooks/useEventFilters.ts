import { useState, useEffect } from 'react'
import { useSubmit } from 'react-router-dom'
import { EventFilterParams } from '../types'
import {
  LOCATION_DATA,
  AUTONOMOUS_COMMUNITIES,
  ALL_CITIES
} from '../constants/filters'

export const useEventFilters = (initialFilters: EventFilterParams) => {
  const submit = useSubmit()
  const [isOpen, setIsOpen] = useState(false)

  // State Definitions
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
  const [timeFilter, setTimeFilter] = useState<string | null>(
    initialFilters.timeFilter || 'upcoming'
  )

  const [dates, setDates] = useState({
    startDate: initialFilters.startDate || null,
    endDate: initialFilters.endDate || null
  })

  // Location Logic
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

  // Handlers
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
      // Backend expects start_date_from in YYYY-MM-DD format
      searchParams.set(
        'start_date_from',
        dates.startDate.toISOString().split('T')[0]
      )
    }
    if (dates.endDate) {
      // Backend expects start_date_to in YYYY-MM-DD format
      searchParams.set(
        'start_date_to',
        dates.endDate.toISOString().split('T')[0]
      )
    }
    tags.forEach((tag) => searchParams.append('tags', tag))
    allLocations.forEach((loc) => searchParams.append('locations', loc))
    levels.forEach((level) => searchParams.append('levels', level))
    languages.forEach((lang) => searchParams.append('languages', lang))

    if (modality === 'Online') {
      searchParams.set('is_online', 'true')
    } else if (modality === 'Presencial') {
      searchParams.set('is_online', 'false')
    }

    // Only send timeFilter if no dates are selected
    if (!dates.startDate && !dates.endDate && timeFilter) {
      searchParams.set('timeFilter', timeFilter)
    }

    submit(searchParams)
  }

  const handleClearFilters = () => {
    setDates({ startDate: null, endDate: null })
    setTags([])
    setLevels([])
    setLanguages([])
    setModality(null)
    setTimeFilter('upcoming')
    setSelectedCommunities([])
    setSelectedCities([])
    setAvailableCities(ALL_CITIES)

    submit(null, { action: '/', method: 'get' })
  }

  return {
    isOpen,
    handleToggle,
    // State
    dates,
    selectedCommunities,
    selectedCities,
    availableCities,
    tags,
    timeFilter,
    modality,
    levels,
    languages,
    // Setters (exposed for potential direct manipulation if needed, but mostly covered by handlers)
    setTags,
    setLevels,
    setLanguages,
    setTimeFilter,
    // Handlers
    handleDateChange,
    handleCommunityChange,
    handleCityChange,
    handleModalityChange,
    handleMultiSelectChange,
    handleApplyFilters,
    handleClearFilters
  }
}
