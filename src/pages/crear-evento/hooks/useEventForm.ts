import { useState, useEffect } from 'react'
import { useNavigate, useLoaderData } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import * as apiService from '../../../services/apiService'
import { CreateEventDTO, Event, AgendaItem, Speaker } from '../../../types'
import { LOCATION_DATA } from '../../../constants/filters'

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

  // Location logic
  const [availableCities, setAvailableCities] = useState<string[]>([])

  useEffect(() => {
    if (isEditMode && formData.venue_community) {
      setAvailableCities(LOCATION_DATA[formData.venue_community] || [])
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
    handleSubmit
  }
}
