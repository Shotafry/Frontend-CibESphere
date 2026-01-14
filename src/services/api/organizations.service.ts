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

export const getAllOrganizations = async (): Promise<OrganizationSummary[]> => {
  const response = await httpClient.get<any>('/public/organizations')
  return response.data.organizations || response.data.data || response.data
}

export const getMyOrganization = async (): Promise<OrganizationSummary> => {
  const response = await httpClient.get<OrganizationSummary>(
    '/organizations/me'
  )
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

export const getOrganizationEvents = async (
  orgId: string
): Promise<Event[]> => {
  const response = await httpClient.get<any>(`/organizations/${orgId}/events`)
  return response.data.events || response.data.data || response.data
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
