// src/services/api/notifications.service.ts
import { httpClient } from '../httpClient'
import { Notification } from '../../types'

export const getNotifications = async (
  userId: string
): Promise<Notification[]> => {
  try {
    const response = await httpClient.get<any>(`/users/${userId}/notifications`)
    return response.data.notifications || response.data.data || []
  } catch (e) {
    console.warn('Notifications endpoint not ready', e)
    return []
  }
}

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await httpClient.put(`/notifications/${id}/read`)
}
