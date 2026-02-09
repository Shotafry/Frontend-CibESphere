// src/services/api/connections.service.ts
// v0.4.0 - Servicio para conexiones entre usuarios (handshake)

import { httpClient } from '../httpClient'

// --- TIPOS ---

export interface ConnectionRequest {
  id: string
  message?: string
  created_at: string
  requester?: {
    id: string
    first_name: string
    last_name: string
    avatar_url?: string
    slug: string
  }
  event?: {
    id: string
    title: string
    slug: string
  }
}

export interface Connection {
  id: string
  first_name: string
  last_name: string
  avatar_url?: string
  slug: string
  company?: string
  position?: string
}

export interface ContactInfo {
  name: string
  email?: string
  discord?: string
  telegram?: string
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

// --- SOLICITUDES ---

/**
 * Enviar solicitud de conexión a otro usuario
 */
export const requestConnection = async (
  targetUserId: string,
  eventId?: string,
  message?: string
): Promise<{ message: string }> => {
  const response = await httpClient.post<{ message: string }>(
    `/users/${targetUserId}/connect`,
    { event_id: eventId, message }
  )
  return response.data
}

/**
 * Verificar si estás conectado con otro usuario
 */
export type ConnectionStatus =
  | 'none'
  | 'pending_sent'
  | 'pending_received'
  | 'connected'
  | 'rejected'

/**
 * Verificar si estás conectado con otro usuario
 */
export const isConnectedWith = async (
  targetUserId: string
): Promise<{
  is_connected: boolean
  status: ConnectionStatus
  request_id?: string
}> => {
  const response = await httpClient.get<{
    is_connected: boolean
    status: ConnectionStatus
    request_id?: string
  }>(`/users/${targetUserId}/connection-status`)
  return {
    is_connected: response.data.is_connected,
    status:
      response.data.status ||
      (response.data.is_connected ? 'connected' : 'none'),
    request_id: response.data.request_id
  }
}

// --- GESTIÓN DE SOLICITUDES ---

/**
 * Obtener solicitudes de conexión pendientes
 */
export const getPendingRequests = async (
  page = 1,
  limit = 20
): Promise<PaginatedResponse<ConnectionRequest>> => {
  const response = await httpClient.get<any>(
    `/connections/pending?page=${page}&limit=${limit}`
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
 * Aceptar solicitud de conexión
 */
export const acceptConnection = async (
  requestId: string
): Promise<{ message: string }> => {
  const response = await httpClient.post<{ message: string }>(
    `/connections/${requestId}/accept`
  )
  return response.data
}

/**
 * Rechazar solicitud de conexión
 */
export const rejectConnection = async (
  requestId: string
): Promise<{ message: string }> => {
  const response = await httpClient.post<{ message: string }>(
    `/connections/${requestId}/reject`
  )
  return response.data
}

// --- MIS CONEXIONES ---

/**
 * Obtener lista de usuarios conectados
 */
export const getConnections = async (
  page = 1,
  limit = 20
): Promise<PaginatedResponse<Connection>> => {
  const response = await httpClient.get<any>(
    `/connections?page=${page}&limit=${limit}`
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
 * Obtener información de contacto de un usuario conectado
 */
export const getContactInfo = async (
  connectedUserId: string
): Promise<ContactInfo> => {
  const response = await httpClient.get<ContactInfo>(
    `/connections/${connectedUserId}/contact`
  )
  return response.data
}
