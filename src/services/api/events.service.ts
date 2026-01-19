// src/services/api/events.service.ts
import { httpClient } from '../httpClient'
import {
  Event,
  EventFilterParams,
  CreateEventDTO,
  EventsUpcoming,
  PublishEventRequest,
  CancelEventRequest,
  EventStatusChangeResponse
} from '../../types'

// --- PUBLIC DISCOVERY ---

export const getEvents = async (
  filters: EventFilterParams
): Promise<Event[]> => {
  const params = new URLSearchParams()

  if (filters.startDate) {
    params.append('start_date', filters.startDate.toISOString())
  }
  if (filters.endDate) {
    params.append('end_date', filters.endDate.toISOString())
  }

  if (filters.locations && filters.locations.length > 0) {
    filters.locations.forEach((loc) => params.append('locations', loc))
  }

  if (filters.tags && filters.tags.length > 0) {
    filters.tags.forEach((tag) => params.append('tags', tag))
  }

  if (filters.levels && filters.levels.length > 0) {
    filters.levels.forEach((level) => params.append('levels', level))
  }

  if (filters.languages && filters.languages.length > 0) {
    filters.languages.forEach((lang) => params.append('languages', lang))
  }

  // Modality filter
  if (filters.is_online !== undefined) {
    params.append('is_online', filters.is_online.toString())
  }

  // Organization filter
  if (filters.organization_id) {
    params.append('organization_id', filters.organization_id)
  }

  // Pagination support
  if (filters.page) {
    params.append('page', filters.page.toString())
  }
  if (filters.limit) {
    params.append('limit', filters.limit.toString())
  }

  // Time filter (upcoming, past, all)
  if (filters.timeFilter) {
    params.append('time_filter', filters.timeFilter)
  }

  const response = await httpClient.get<any>(
    `/public/events?${params.toString()}`
  )

  // Verificamos si la respuesta viene envuelta en 'data'
  if (response.data.data && Array.isArray(response.data.data)) {
    return response.data.data
  } else if (Array.isArray(response.data)) {
    return response.data
  } else if (response.data.events && Array.isArray(response.data.events)) {
    return response.data.events
  }
  return []
}

export const getEventBySlug = async (slug: string): Promise<Event> => {
  const response = await httpClient.get<Event>(`/public/events/${slug}`)
  return response.data
}

export const getFeaturedEvents = async (): Promise<Event[]> => {
  const response = await httpClient.get<{ events: Event[] }>(
    '/public/events/featured'
  )
  return response.data.events
}

export const getUpcomingEvents = async (): Promise<EventsUpcoming> => {
  const response = await httpClient.get<EventsUpcoming>(
    '/public/events/upcoming'
  )
  return response.data
}

// --- CRUD ---

export const createEvent = async (
  eventData: CreateEventDTO
): Promise<Event> => {
  const response = await httpClient.post<Event>('/events', eventData)
  return response.data
}

export const updateEvent = async (
  eventId: string,
  eventData: Partial<CreateEventDTO>
): Promise<Event> => {
  const response = await httpClient.put<Event>(`/events/${eventId}`, eventData)
  return response.data
}

export const deleteEvent = async (eventId: string): Promise<void> => {
  await httpClient.delete(`/events/${eventId}`)
}

// --- STATUS MANAGEMENT ---

export const publishEvent = async (
  eventId: string,
  data: PublishEventRequest
): Promise<EventStatusChangeResponse> => {
  const response = await httpClient.post<EventStatusChangeResponse>(
    `/events/${eventId}/publish`,
    data
  )
  return response.data
}

export const cancelEvent = async (
  eventId: string,
  data: CancelEventRequest
): Promise<EventStatusChangeResponse> => {
  const response = await httpClient.post<EventStatusChangeResponse>(
    `/events/${eventId}/cancel`,
    data
  )
  return response.data
}

// --- INTERACTIONS ---

export const subscribeToEvent = async (
  eventId: string
): Promise<{ message: string }> => {
  const response = await httpClient.post<{ message: string }>(
    `/events/${eventId}/subscribe`
  )
  return response.data
}

export const unsubscribeFromEvent = async (eventId: string): Promise<void> => {
  await httpClient.delete(`/events/${eventId}/subscribe`)
}

export const toggleBookmark = async (
  userId: string,
  eventId: string
): Promise<{ isBookmarked: boolean; message: string }> => {
  const response = await httpClient.post<{
    isBookmarked: boolean
    message: string
  }>(`/users/${userId}/favorites/${eventId}`)
  return response.data
}

/**
 * Add event to favorites
 */
export const addToFavorites = async (eventId: string): Promise<void> => {
  await httpClient.post(`/events/${eventId}/favorite`, {})
}

/**
 * Remove event from favorites
 */
export const removeFromFavorites = async (eventId: string): Promise<void> => {
  await httpClient.delete(`/events/${eventId}/favorite`)
}

/**
 * Toggle bookmark helper with status tracking
 */
export const toggleBookmarkWithStatus = async (
  userId: string,
  eventId: string,
  currentStatus: boolean
): Promise<{ isBookmarked: boolean; message: string }> => {
  if (currentStatus) {
    await removeFromFavorites(eventId)
    return { isBookmarked: false, message: 'Removed from favorites' }
  } else {
    await addToFavorites(eventId)
    return { isBookmarked: true, message: 'Added to favorites' }
  }
}

// --- PURCHASING ---

export interface PurchaseItem {
  ticket_type_id: string
  quantity: number
}

export interface CheckoutResponse {
  session_id: string
  url: string
}

export const purchaseEvent = async (
  eventId: string,
  items: PurchaseItem[]
): Promise<CheckoutResponse> => {
  const response = await httpClient.post<CheckoutResponse>(
    `/events/${eventId}/purchase`,
    { items }
  )
  return response.data
}
