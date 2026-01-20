// src/services/api/subscriptions.service.ts
// v0.4.0 - Servicio para seguir organizaciones

import { httpClient } from '../httpClient'

// --- FOLLOW/UNFOLLOW ---

/**
 * Seguir una organización
 */
export const followOrganization = async (
  organizationId: string
): Promise<{ message: string }> => {
  const response = await httpClient.post<{ message: string }>(
    `/organizations/${organizationId}/follow`
  )
  return response.data
}

/**
 * Dejar de seguir una organización
 */
export const unfollowOrganization = async (
  organizationId: string
): Promise<{ message: string }> => {
  const response = await httpClient.delete<{ message: string }>(
    `/organizations/${organizationId}/unfollow`
  )
  return response.data
}

/**
 * Verificar si el usuario sigue una organización
 */
export const isFollowingOrganization = async (
  organizationId: string
): Promise<boolean> => {
  const response = await httpClient.get<{ is_following: boolean }>(
    `/organizations/${organizationId}/is-following`
  )
  return response.data.is_following
}

// --- LISTAR ---

export interface FollowerInfo {
  id: string
  first_name: string
  last_name: string
  avatar_url?: string
  slug: string
}

export interface FollowingOrganization {
  id: string
  name: string
  slug: string
  logo_url?: string
  is_verified: boolean
  followers_count: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

/**
 * Obtener seguidores de una organización
 */
export const getOrganizationFollowers = async (
  organizationId: string,
  page = 1,
  limit = 20
): Promise<PaginatedResponse<FollowerInfo>> => {
  const response = await httpClient.get<any>(
    `/organizations/${organizationId}/followers?page=${page}&limit=${limit}`
  )
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

  // Fallback
  return {
    data: Array.isArray(responseData) ? responseData : [],
    pagination: { page, limit, total: 0, total_pages: 0 }
  }
}

/**
 * Obtener organizaciones que sigue el usuario actual
 */
export const getFollowingOrganizations = async (
  page = 1,
  limit = 20
): Promise<PaginatedResponse<FollowingOrganization>> => {
  const response = await httpClient.get<any>(
    `/users/me/following?page=${page}&limit=${limit}`
  )
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

  // Fallback
  return {
    data: Array.isArray(responseData) ? responseData : [],
    pagination: { page, limit, total: 0, total_pages: 0 }
  }
}

/**
 * Obtener el número de seguidores de una organización (Público)
 */
export const getOrganizationFollowersCount = async (
  organizationId: string
): Promise<number> => {
  const response = await httpClient.get<{ count: number }>(
    `/public/organizations/${organizationId}/followers-count`
  )
  return response.data.count
}

// --- HELPERS ---

/**
 * Toggle seguir/dejar de seguir con estado
 */
export const toggleFollowOrganization = async (
  organizationId: string,
  isCurrentlyFollowing: boolean
): Promise<{ isFollowing: boolean; message: string }> => {
  if (isCurrentlyFollowing) {
    const result = await unfollowOrganization(organizationId)
    return { isFollowing: false, message: result.message }
  } else {
    const result = await followOrganization(organizationId)
    return { isFollowing: true, message: result.message }
  }
}
