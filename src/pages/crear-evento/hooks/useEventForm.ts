import { useState, useEffect } from 'react'
import { useNavigate, useLoaderData } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import * as apiService from '../../../services/apiService'
import {
  CreateEventDTO,
  Event,
  AgendaItem,
  Speaker,
  TicketType
} from '../../../types'
import { getCitiesByCommunity } from '../../../constants/filters'
import { LocationData } from '../../../components/LocationPicker'

export const useEventForm = () => {
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
    is_free: loadedEvent ? loadedEvent.is_free : true,
    tags: loadedEvent?.tags || [],
    venue_name: loadedEvent?.venue_name || '',
    venue_address: loadedEvent?.venue_address || '',
    venue_city: loadedEvent?.venue_city || '',
    venue_community: loadedEvent?.venue_community || '',
    online_url: loadedEvent?.online_url || '',
    price: loadedEvent?.price ? loadedEvent.price / 100 : 0,
    image_url: loadedEvent?.image_url || '',
    ticket_types: loadedEvent?.ticket_types
      ? loadedEvent.ticket_types.map((t) => ({ ...t, price: t.price / 100 }))
      : [],
    max_attendees: loadedEvent?.max_attendees || 0,
    agenda: loadedEvent?.agenda || [],
    speakers: loadedEvent?.speakers || [],
    requirements: loadedEvent?.requirements || '',
    latitude: loadedEvent?.latitude || null,
    longitude: loadedEvent?.longitude || null
  })

  // Location logic
  const [availableCities, setAvailableCities] = useState<string[]>([])

  useEffect(() => {
    if (isEditMode && formData.venue_community) {
      setAvailableCities(getCitiesByCommunity(formData.venue_community))
    }
  }, [isEditMode, formData.venue_community])

  // --- HANDLERS ---

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
        setAvailableCities(getCitiesByCommunity(newCommunity))
      } else {
        setFormData((prev: any) => ({ ...prev, [field]: value || '' }))
      }
    }

  // Handler for LocationPicker
  const handleLocationChange = (location: LocationData | null) => {
    if (location) {
      setFormData((prev: any) => ({
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude,
        venue_address: location.address,
        ...(location.city && { venue_city: location.city })
      }))
    } else {
      setFormData((prev: any) => ({
        ...prev,
        latitude: null,
        longitude: null
      }))
    }
  }

  // Handler for image upload
  const handleImageChange = (url: string | null) => {
    setFormData((prev: any) => ({ ...prev, image_url: url || '' }))
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

  // --- TICKET TYPES MANAGEMENT ---
  const handleAddTicketType = () => {
    setFormData((prev: any) => ({
      ...prev,
      ticket_types: [
        ...prev.ticket_types,
        {
          id: Date.now().toString(),
          name: '',
          description: '',
          price: 0,
          capacity: 0,
          sold: 0,
          is_active: true
        }
      ]
    }))
  }

  const handleRemoveTicketType = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      ticket_types: prev.ticket_types.filter(
        (item: TicketType) => item.id !== id
      )
    }))
  }

  const handleTicketTypeChange = (
    id: string,
    field: keyof TicketType,
    value: string | number | boolean
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      ticket_types: prev.ticket_types.map((item: TicketType) =>
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
      // Clean empty strings that would fail URL validation
      const cleanData = { ...formData }
      const urlFields = [
        'image_url',
        'banner_url',
        'online_url',
        'streaming_url',
        'registration_url'
      ]
      urlFields.forEach((field) => {
        if (cleanData[field] === '') {
          delete cleanData[field]
        }
      })

      // Remove null coordinates for online events
      if (cleanData.is_online) {
        delete cleanData.latitude
        delete cleanData.longitude
        delete cleanData.venue_address
        delete cleanData.venue_city
        delete cleanData.venue_name
      }

      // Serialize agenda and speakers arrays to JSON strings for backend
      if (cleanData.agenda && Array.isArray(cleanData.agenda)) {
        cleanData.agenda =
          cleanData.agenda.length > 0
            ? JSON.stringify(cleanData.agenda)
            : undefined
      }
      if (cleanData.speakers && Array.isArray(cleanData.speakers)) {
        cleanData.speakers =
          cleanData.speakers.length > 0
            ? JSON.stringify(cleanData.speakers)
            : undefined
      }

      if (cleanData.ticket_types && Array.isArray(cleanData.ticket_types)) {
        // Convert prices to cents for backend
        const ticketsToSend = cleanData.ticket_types.map((t: any) => ({
          ...t,
          price: Math.round(t.price * 100)
        }))

        cleanData.ticket_types =
          ticketsToSend.length > 0 ? JSON.stringify(ticketsToSend) : undefined
      }

      // Convert main price to cents if present
      if (cleanData.price) {
        cleanData.price = Math.round(cleanData.price * 100)
      }

      const eventData: CreateEventDTO = {
        ...cleanData,
        organization_id: user.organization.id,
        max_attendees: Number(cleanData.max_attendees)
      } as CreateEventDTO

      if (isEditMode) {
        await apiService.updateEvent(loadedEvent.id, eventData)
      } else {
        await apiService.createEvent(eventData)
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

  return {
    formData,
    setFormData,
    isLoading,
    error,
    isEditMode,
    availableCities,
    handleChange,
    handleDateChange,
    handleAutocompleteChange,
    handleLanguageChange,
    handleSingleAutocompleteChange,
    handleAddAgendaItem,
    handleRemoveAgendaItem,
    handleAgendaItemChange,
    handleAddSpeaker,
    handleRemoveSpeaker,
    handleSpeakerChange,
    handleLocationChange,
    handleImageChange,
    handleAddTicketType,
    handleRemoveTicketType,
    handleTicketTypeChange,
    handleSubmit
  }
}
