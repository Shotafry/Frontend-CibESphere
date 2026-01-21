// src/services/api/notifications.service.ts
// v0.4.0 - Servicio para centro de notificaciones

import { httpClient } from '../httpClient'

// --- TIPOS ---

export type NotificationType =
  | 'EVENT_CREATED'
  | 'TICKET_PURCHASED'
  | 'CONNECTION_REQUEST'
  | 'CONNECTION_ACCEPTED'
  | 'EVENT_REMINDER'
  | 'ORG_VERIFIED'
  | 'GENERAL'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  is_read: boolean
  read_at?: string
  action_url?: string
  created_at: string
  event_id?: string
  organization_id?: string
  related_user_id?: string
}

export interface PaginatedNotifications {
  data: Notification[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

// --- OBTENER NOTIFICACIONES ---

/**
 * Obtener notificaciones del usuario
 */
export const getNotifications = async (
  page = 1,
  limit = 20
): Promise<PaginatedNotifications> => {
  try {
    const response = await httpClient.get<any>(
      `/notifications?page=${page}&limit=${limit}`
    )
    // El httpClient ahora preserva la estructura { data, pagination } cuando hay paginación
    const responseData = response.data

    // Si la respuesta tiene la estructura { data, pagination }
    if (
      responseData &&
      typeof responseData === 'object' &&
      'data' in responseData
    ) {
      return {
        data: responseData.data || [],
        pagination: responseData.pagination || {
          page,
          limit,
          total: 0,
          total_pages: 0
        }
      }
    }

    // Fallback: si es un array directamente (sin paginación)
    return {
      data: Array.isArray(responseData) ? responseData : [],
      pagination: { page, limit, total: 0, total_pages: 0 }
    }
  } catch (e) {
    console.warn('Notifications endpoint not ready', e)
    return {
      data: [],
      pagination: { page, limit, total: 0, total_pages: 0 }
    }
  }
}

/**
 * Obtener número de notificaciones no leídas
 */
export const getUnreadCount = async (): Promise<number> => {
  try {
    const response = await httpClient.get<{ count: number }>(
      '/notifications/unread-count'
    )
    return response.data.count
  } catch (e) {
    console.warn('Unread count endpoint not ready', e)
    return 0
  }
}

// --- MARCAR COMO LEÍDAS ---

/**
 * Marcar una notificación como leída
 */
export const markAsRead = async (
  notificationId: string
): Promise<{ message: string }> => {
  const response = await httpClient.post<{ message: string }>(
    `/notifications/${notificationId}/read`
  )
  return response.data
}

/**
 * Marcar todas las notificaciones como leídas
 */
export const markAllAsRead = async (): Promise<{ message: string }> => {
  const response = await httpClient.post<{ message: string }>(
    '/notifications/read-all'
  )
  return response.data
}

// Legacy alias for backward compatibility
export const markNotificationAsRead = markAsRead

// --- HELPERS ---

/**
 * Obtener icono según tipo de notificación
 */
export const getNotificationIcon = (type: NotificationType): string => {
  const icons: Record<NotificationType, string> = {
    EVENT_CREATED: '🆕',
    TICKET_PURCHASED: '🎫',
    CONNECTION_REQUEST: '🤝',
    CONNECTION_ACCEPTED: '✅',
    EVENT_REMINDER: '⏰',
    ORG_VERIFIED: '✨',
    GENERAL: '📢'
  }
  return icons[type] || '📢'
}

/**
 * Obtener color según tipo de notificación
 */
export const getNotificationColor = (type: NotificationType): string => {
  const colors: Record<NotificationType, string> = {
    EVENT_CREATED: '#4fbac8',
    TICKET_PURCHASED: '#22c55e',
    CONNECTION_REQUEST: '#f59e0b',
    CONNECTION_ACCEPTED: '#22c55e',
    EVENT_REMINDER: '#6366f1',
    ORG_VERIFIED: '#8b5cf6',
    GENERAL: '#64748b'
  }
  return colors[type] || '#64748b'
}

/**
 * Formatear fecha relativa (hace X minutos/horas/días)
 */
export const formatRelativeTime = (dateString?: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Ahora mismo'
  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours}h`
  if (diffDays < 7) return `Hace ${diffDays}d`

  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short'
  })
}

// --- PREFERENCIAS DE NOTIFICACIONES ---

export interface NotificationPreferences {
  // Canales
  email_notifications: boolean
  web_notifications: boolean
  // Usuario
  connection_requests: boolean
  ticket_notifications: boolean
  new_events_in_regions: boolean
  followed_orgs_events: boolean
  event_reminders: boolean
  // Organizador
  ticket_sales: boolean
  new_followers: boolean
  daily_summary: boolean
  preferred_regions: string
}

/**
 * Obtener preferencias de notificaciones del usuario actual
 */
export const getNotificationPreferences =
  async (): Promise<NotificationPreferences> => {
    try {
      const response = await httpClient.get<NotificationPreferences>(
        '/user/notification-preferences'
      )
      return response.data
    } catch (e) {
      console.warn('Notification preferences endpoint not ready', e)
      // Return defaults
      return {
        email_notifications: true,
        web_notifications: true,
        connection_requests: true,
        ticket_notifications: true,
        new_events_in_regions: true,
        followed_orgs_events: true,
        event_reminders: true,
        ticket_sales: true,
        new_followers: true,
        daily_summary: false,
        preferred_regions: '[]'
      }
    }
  }

/**
 * Guardar preferencias de notificaciones
 */
export const saveNotificationPreferences = async (
  preferences: Partial<NotificationPreferences>
): Promise<void> => {
  await httpClient.put('/user/notification-preferences', preferences)
}
