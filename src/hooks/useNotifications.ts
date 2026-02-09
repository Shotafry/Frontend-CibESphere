import { useState, useCallback, useEffect } from 'react'
import {
  Notification,
  PaginatedNotifications,
  NotificationPreferences,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  getNotificationPreferences,
  saveNotificationPreferences
} from '../services/api/notifications.service'

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  preferences: NotificationPreferences | null
  loadingPreferences: boolean

  // Actions
  refreshNotifications: () => Promise<void>
  markOneAsRead: (id: string) => Promise<void>
  markAllAsReadUser: () => Promise<void>
  fetchPreferences: () => Promise<void>
  updatePreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const [preferences, setPreferences] =
    useState<NotificationPreferences | null>(null)
  const [loadingPreferences, setLoadingPreferences] = useState(true)

  const refreshNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const [result, count] = await Promise.all([
        getNotifications(1, 50),
        getUnreadCount()
      ])
      setNotifications(result.data)
      setUnreadCount(count)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const markOneAsRead = useCallback(async (id: string) => {
    try {
      await markAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }, [])

  const markAllAsReadUser = useCallback(async () => {
    try {
      await markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }, [])

  const fetchPreferences = useCallback(async () => {
    setLoadingPreferences(true)
    try {
      const prefs = await getNotificationPreferences()
      setPreferences(prefs)
    } catch (error) {
      console.error('Error loading preferences:', error)
    } finally {
      setLoadingPreferences(false)
    }
  }, [])

  const updatePreferences = useCallback(
    async (newPrefs: Partial<NotificationPreferences>) => {
      try {
        // Optimistic update
        setPreferences((prev) => (prev ? { ...prev, ...newPrefs } : null))
        await saveNotificationPreferences(newPrefs)
      } catch (error) {
        console.error('Error saving preferences:', error)
        // Revert on error could be implemented here if we store previous state
        // For now we just reload to sync
        await fetchPreferences()
        throw error // Re-throw to let component handle UI feedback
      }
    },
    [fetchPreferences]
  )

  // Initial load
  useEffect(() => {
    refreshNotifications()
    fetchPreferences()
  }, [refreshNotifications, fetchPreferences])

  return {
    notifications,
    unreadCount,
    loading,
    preferences,
    loadingPreferences,
    refreshNotifications,
    markOneAsRead,
    markAllAsReadUser,
    fetchPreferences,
    updatePreferences
  }
}
