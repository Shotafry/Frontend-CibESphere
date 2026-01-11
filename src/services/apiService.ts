// src/services/apiService.ts
// Facade for the new modular API architecture
// Maintains backward compatibility with legacy UI components

import { httpClient } from './httpClient'
import { User, DashboardStats, OrganizationSummary } from '../types'

// Export all modular services
export * from './api'

// --- LEGACY / CUSTOM ADAPTERS ---
// These functions are kept to prevent UI breakage where the new modules
// might have different signatures or where specfic UI logic was implemented.

/**
 * Uploads an image to the server
 * @param file The file to upload
 * @param type The type of image: 'avatar' or 'banner' (default: 'avatar')
 * @returns The public URL of the uploaded image
 */
export const uploadImage = async (
  file: File,
  type: 'avatar' | 'banner' = 'avatar'
): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await httpClient.post<{ url: string }>(
    `/auth/upload?type=${type}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
  return response.data.url
}

/**
 * Get public user profile by slug
 * (The modular service might expect ID, this ensures slug support if backend allows)
 */
export const getUserPublicProfile = async (slug: string): Promise<User> => {
  const response = await httpClient.get<User>(`/public/users/${slug}`)
  return response.data
}

/**
 * Add event to favorites (Legacy Wrapper)
 */
export const addToFavorites = async (eventId: string): Promise<void> => {
  // Assuming endpoint convention. If modular has a specific way, we could use that.
  // Using direct http for explicit control as per legacy code.
  await httpClient.post(`/events/${eventId}/favorite`, {})
}

/**
 * Remove event from favorites (Legacy Wrapper)
 */
export const removeFromFavorites = async (eventId: string): Promise<void> => {
  await httpClient.delete(`/events/${eventId}/favorite`)
}

/**
 * Toggle bookmark helper (Legacy UI Logic)
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
