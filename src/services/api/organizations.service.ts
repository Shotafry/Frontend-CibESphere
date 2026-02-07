// src/services/api/organizations.service.ts
import { httpClient } from '../httpClient'
import {
  Event,
  OrganizationSummary,
  CreateOrganizationDTO,
  OrganizationMembersResponse,
  BulkVerifyRequest,
  BulkVerifyResponse,
  DashboardStats
} from '../../types'

// --- PUBLIC DISCOVERY ---

export interface OrganizationFilterParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  is_verified?: boolean
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export const getAllOrganizations = async (
  params?: OrganizationFilterParams
): Promise<{ organizations: OrganizationSummary[]; pagination: any }> => {
  const queryParams = new URLSearchParams()

  if (params) {
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.search) queryParams.append('search', params.search)
    if (params.status && params.status !== 'all')
      queryParams.append('status', params.status)
    if (params.is_verified !== undefined)
      queryParams.append('is_verified', params.is_verified.toString())
    if (params.sort_by) queryParams.append('order_by', params.sort_by)
    if (params.sort_order) queryParams.append('order_dir', params.sort_order)
  }

  // Use protected endpoint for admin capabilities
  const response = await httpClient.get<any>(
    `/organizations?${queryParams.toString()}`
  )
  return {
    organizations: response.data.data || [],
    pagination: response.data.pagination
  }
}

export const getMyOrganization = async (): Promise<OrganizationSummary> => {
  const response =
    await httpClient.get<OrganizationSummary>('/organizations/me')
  return response.data
}

export const getOrganizationBySlug = async (
  slug: string
): Promise<OrganizationSummary> => {
  const response = await httpClient.get<OrganizationSummary>(
    `/public/organizations/${slug}`
  )
  return response.data
}

export const checkSlugAvailability = async (slug: string): Promise<boolean> => {
  try {
    await getOrganizationBySlug(slug)
    return false // Exists -> Not available
  } catch (error: any) {
    if (error.response?.status === 404) {
      return true // Not found -> Available
    }
    throw error
  }
}

// Import getEvents lazily to avoid circular dependency if needed, or better, assume typical usage
import { getEvents } from './events.service'

export const getOrganizationEvents = async (
  orgId: string
): Promise<Event[]> => {
  // Use public events endpoint with organization filter
  return getEvents({ organization_id: orgId, timeFilter: 'all' })
}

// --- CRUD ---

export const createOrganization = async (
  data: CreateOrganizationDTO
): Promise<OrganizationSummary> => {
  const response = await httpClient.post<OrganizationSummary>(
    '/organizations',
    data
  )
  return response.data
}

export const updateOrganization = async (
  orgId: string,
  data: Partial<OrganizationSummary>
): Promise<OrganizationSummary> => {
  const response = await httpClient.put<OrganizationSummary>(
    `/organizations/${orgId}`,
    data
  )
  return response.data
}

export const deleteOrganization = async (id: string): Promise<void> => {
  await httpClient.delete(`/organizations/${id}`)
}

// --- MEMBERS ---

export const getOrganizationMembers = async (
  id: string,
  page: number = 1,
  perPage: number = 20
): Promise<OrganizationMembersResponse> => {
  const response = await httpClient.get<OrganizationMembersResponse>(
    `/organizations/${id}/members`,
    { params: { page, per_page: perPage } }
  )
  return response.data
}

// --- ADMIN ---

export const verifyOrganization = async (
  orgId: string
): Promise<OrganizationSummary> => {
  const response = await httpClient.post<OrganizationSummary>(
    `/admin/organizations/${orgId}/verify`
  )
  return response.data
}

export const bulkVerifyOrganizations = async (
  data: BulkVerifyRequest
): Promise<BulkVerifyResponse> => {
  const response = await httpClient.post<BulkVerifyResponse>(
    '/admin/organizations/bulk-verify',
    data
  )
  return response.data
}

// --- DASHBOARD ---

export const getOrganizerDashboard = async (
  orgId: string
): Promise<DashboardStats> => {
  const response = await httpClient.get<DashboardStats>(
    `/organizations/${orgId}/dashboard`
  )
  return response.data
}

// --- PAYMENTS ---

export const connectStripe = async (): Promise<{
  url: string
  account_id: string
}> => {
  const response = await httpClient.post<{ url: string; account_id: string }>(
    '/organizations/stripe/connect'
  )
  return response.data
}
