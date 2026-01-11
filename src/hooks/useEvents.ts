// src/hooks/useEvents.ts
import { useCallback } from 'react'
import { useApi } from './useApi'
import * as api from '../services/apiService'
import { Event, EventFilterParams, CreateEventDTO } from '../types'

/**
 * Hook para gestionar eventos
 */
export function useEvents(initialFilters?: EventFilterParams) {
  const {
    data: events,
    loading,
    error,
    execute: fetchEvents
  } = useApi<Event[]>(api.getEvents)

  const loadEvents = useCallback(
    async (filters?: EventFilterParams) => {
      return fetchEvents(filters || initialFilters || {})
    },
    [fetchEvents, initialFilters]
  )

  return {
    events: events || [],
    loading,
    error,
    loadEvents,
    refetch: loadEvents
  }
}

/**
 * Hook para gestionar un evento individual
 */
export function useEvent(slug?: string) {
  const {
    data: event,
    loading,
    error,
    execute: fetchEvent
  } = useApi<Event>(api.getEventBySlug)

  const loadEvent = useCallback(
    async (eventSlug?: string) => {
      const slugToUse = eventSlug || slug
      if (!slugToUse) {
        throw new Error('Event slug is required')
      }
      return fetchEvent(slugToUse)
    },
    [fetchEvent, slug]
  )

  return {
    event,
    loading,
    error,
    loadEvent
  }
}

/**
 * Hook para crear/actualizar/eliminar eventos
 */
export function useEventMutations() {
  const {
    loading: creating,
    error: createError,
    execute: createEvent
  } = useApi<Event>(api.createEvent)

  const {
    loading: updating,
    error: updateError,
    execute: updateEvent
  } = useApi<Event>((id: string, data: Partial<CreateEventDTO>) =>
    api.updateEvent(id, data)
  )

  const {
    loading: deleting,
    error: deleteError,
    execute: deleteEvent
  } = useApi<void>(api.deleteEvent)

  const {
    loading: subscribing,
    error: subscribeError,
    execute: subscribeToEvent
  } = useApi<{ message: string }>(api.subscribeToEvent)

  const {
    loading: unsubscribing,
    error: unsubscribeError,
    execute: unsubscribeFromEvent
  } = useApi<void>(api.unsubscribeFromEvent)

  return {
    createEvent,
    creating,
    createError,
    updateEvent,
    updating,
    updateError,
    deleteEvent,
    deleting,
    deleteError,
    subscribeToEvent,
    subscribing,
    subscribeError,
    unsubscribeFromEvent,
    unsubscribing,
    unsubscribeError
  }
}
