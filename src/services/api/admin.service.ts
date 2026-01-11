// src/services/api/admin.service.ts
import { httpClient } from '../httpClient'
import { DashboardStats } from '../../types'

export const getAdminDashboard = async (): Promise<DashboardStats> => {
  const response = await httpClient.get<DashboardStats>('/admin/dashboard')
  return response.data
}
