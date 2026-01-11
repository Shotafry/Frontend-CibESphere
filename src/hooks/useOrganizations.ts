// src/hooks/useOrganizations.ts
import { useCallback } from 'react'
import { useApi } from './useApi'
import * as api from '../services/apiService'
import { OrganizationSummary } from '../types'

/**
 * Hook para gestionar organizaciones
 */
export function useOrganizations() {
  const {
    data: organizations,
    loading,
    error,
    execute: fetchOrganizations
  } = useApi<OrganizationSummary[]>(api.getAllOrganizations)

  const loadOrganizations = useCallback(async () => {
    return fetchOrganizations()
  }, [fetchOrganizations])

  return {
    organizations: organizations || [],
    loading,
    error,
    loadOrganizations,
    refetch: loadOrganizations
  }
}

/**
 * Hook para gestionar una organización individual
 */
export function useOrganization(slug?: string) {
  const {
    data: organization,
    loading,
    error,
    execute: fetchOrganization
  } = useApi<OrganizationSummary>(api.getOrganizationBySlug)

  const loadOrganization = useCallback(
    async (orgSlug?: string) => {
      const slugToUse = orgSlug || slug
      if (!slugToUse) {
        throw new Error('Organization slug is required')
      }
      return fetchOrganization(slugToUse)
    },
    [fetchOrganization, slug]
  )

  return {
    organization,
    loading,
    error,
    loadOrganization
  }
}

/**
 * Hook para el dashboard del organizador
 */
export function useOrganizerDashboard(orgId: string) {
  const {
    data: dashboard,
    loading,
    error,
    execute: fetchDashboard
  } = useApi(api.getOrganizerDashboard)

  const {
    data: events,
    loading: eventsLoading,
    execute: fetchEvents
  } = useApi(api.getOrganizationEvents)

  const loadDashboard = useCallback(async () => {
    return fetchDashboard(orgId)
  }, [fetchDashboard, orgId])

  const loadEvents = useCallback(async () => {
    return fetchEvents(orgId)
  }, [fetchEvents, orgId])

  return {
    dashboard,
    events: events || [],
    loading: loading || eventsLoading,
    error,
    loadDashboard,
    loadEvents
  }
}
