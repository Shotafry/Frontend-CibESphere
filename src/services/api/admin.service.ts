// src/services/api/admin.service.ts
import { httpClient } from '../httpClient'
import {
  AdminStats,
  AuditLogEntry,
  PaginationMeta,
  ApiResponse
} from '../../types'

export const getAdminStats = async (): Promise<AdminStats> => {
  const response = await httpClient.get<ApiResponse<AdminStats>>('/admin/stats')
  return response.data.data!
}

export const getAuditLogs = async (
  page = 1,
  limit = 20,
  userId?: string,
  action?: string
): Promise<{ data: AuditLogEntry[]; pagination: PaginationMeta }> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  })
  if (userId) params.append('user_id', userId)
  if (action) params.append('action', action)

  const response = await httpClient.get<ApiResponse<AuditLogEntry[]>>(
    `/admin/audit-logs?${params.toString()}`
  )
  return {
    data: response.data.data || [],
    pagination: response.data.pagination!
  }
}

export const updateOrganizationStatus = async (
  orgId: string,
  status: 'active' | 'suspended'
): Promise<void> => {
  await httpClient.patch(`/organizations/${orgId}/status`, { status })
}

export const verifyOrganization = async (orgId: string): Promise<void> => {
  await httpClient.post(`/organizations/${orgId}/verify`)
}
