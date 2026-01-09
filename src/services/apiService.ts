// src/services/apiService.ts
import { httpClient } from './httpClient'
import {
  Event,
  EventFilterParams,
  User,
  LoginDTO,
  RegisterDTO,
  AuthResponse,
  DashboardStats,
  OrganizationSummary,
  CreateEventDTO,
  Notification,
  Review
} from '../types'

// --- AUTH ---

export const login = async (data: LoginDTO): Promise<AuthResponse> => {
  const response = await httpClient.post<AuthResponse>('/auth/login', data)
  return response.data
}

export const register = async (data: RegisterDTO): Promise<AuthResponse> => {
  const response = await httpClient.post<AuthResponse>('/auth/register', data)
  return response.data
}

export const getMe = async (): Promise<User> => {
  // Asumimos que hay un endpoint /auth/me o /users/profile
  // Si no existe, podría ser /users/me
  const response = await httpClient.get<User>('/auth/me')
  return response.data
}

export const getUserById = async (userId: string): Promise<User> => {
  const response = await httpClient.get<User>(`/users/${userId}`)
  return response.data
}

export const updateUser = async (
  userId: string,
  data: Partial<User>
): Promise<User> => {
  const response = await httpClient.put<User>(`/users/${userId}`, data)
  return response.data
}

// --- EVENTS ---

export const getEvents = async (
  filters: EventFilterParams
): Promise<Event[]> => {
  const params = new URLSearchParams()

  if (filters.startDate) {
    params.append('start_date', filters.startDate.toISOString())
  }
  if (filters.endDate) {
    params.append('end_date', filters.endDate.toISOString())
  }

  if (filters.locations && filters.locations.length > 0) {
    // Si el backend soporta múltiple selección, se podría enviar múltiple 'city'
    // O una lista separada por comas. Asumimos repetición de clave 'city'
    filters.locations.forEach((loc) => params.append('city', loc))
  }

  if (filters.tags && filters.tags.length > 0) {
    filters.tags.forEach((tag) => params.append('tags', tag))
  }

  if (filters.levels && filters.levels.length > 0) {
    filters.levels.forEach((level) => params.append('level', level))
  }

  if (filters.languages && filters.languages.length > 0) {
    filters.languages.forEach((lang) => params.append('language', lang))
  }

  // Si el backend devuelve { data: events[], ... } ajustar aquí.
  // Asumimos que httpClient ya devuelve `response` y data es el body.
  // Muchos backends devuelven un wrapper { success: true, data: [...] }
  // Aquí asumimos que response.data es el wrapper o el array.
  // Si backend devuelve ApiResponse<Event[]>, retornamos response.data.data

  // Como definimos ApiResponse<T>, el get genérico devuelve la respuesta completa.
  // Vamos a asumir que el backend devuelve { data: Event[], ... }
  // Pero axios devuelve { data: Body, status: ... }
  // Entonces response.data es el cuerpo JSON.

  // Ajuste según standard Go echo/gin response:
  const response = await httpClient.get<any>(
    `/public/events?${params.toString()}`
  )

  // Verificamos si la respuesta viene envuelta en 'data'
  if (response.data.data && Array.isArray(response.data.data)) {
    return response.data.data
  } else if (Array.isArray(response.data)) {
    return response.data
  } else if (response.data.events && Array.isArray(response.data.events)) {
    // UserListResponse / EventListResponse suele tener campo 'events'
    return response.data.events
  }
  return []
}

export const getEventBySlug = async (slug: string): Promise<Event> => {
  // Intentamos buscar por slug directo
  try {
    const response = await httpClient.get<Event>(`/public/events/${slug}`)
    return response.data
  } catch (error) {
    // Si falla, quizás el backend espera filtro ?slug=...
    // O es /events/slug/:slug
    throw error
  }
}

export const createEvent = async (
  eventData: CreateEventDTO
): Promise<Event> => {
  const response = await httpClient.post<Event>('/events', eventData)
  return response.data
}

export const updateEvent = async (
  eventId: string,
  eventData: Partial<CreateEventDTO>
): Promise<Event> => {
  const response = await httpClient.put<Event>(`/events/${eventId}`, eventData)
  return response.data
}

export const deleteEvent = async (eventId: string): Promise<void> => {
  await httpClient.delete(`/events/${eventId}`)
}

export const subscribeToEvent = async (
  eventId: string
): Promise<{ message: string }> => {
  const response = await httpClient.post<{ message: string }>(
    `/events/${eventId}/subscribe`
  )
  return response.data
}

export const unsubscribeFromEvent = async (eventId: string): Promise<void> => {
  await httpClient.delete(`/events/${eventId}/subscribe`)
}

export const toggleBookmark = async (
  userId: string,
  eventId: string
): Promise<{ isBookmarked: boolean; message: string }> => {
  // Asumimos endpoint de favoritos
  const response = await httpClient.post<{
    isBookmarked: boolean
    message: string
  }>(`/users/${userId}/favorites/${eventId}`)
  return response.data
}

// --- ADMIN / ORGANIZER ---

export const getAdminDashboard = async (): Promise<DashboardStats> => {
  const response = await httpClient.get<DashboardStats>('/admin/dashboard')
  return response.data
}

export const getAllUsers = async (): Promise<User[]> => {
  const response = await httpClient.get<any>('/users')
  // Manejo de paginación o wrapper
  return response.data.users || response.data.data || response.data
}

export const getAllOrganizations = async (): Promise<OrganizationSummary[]> => {
  const response = await httpClient.get<any>('/public/organizations')
  return response.data.organizations || response.data.data || response.data
}

export const verifyOrganization = async (
  orgId: string
): Promise<OrganizationSummary> => {
  const response = await httpClient.post<OrganizationSummary>(
    `/admin/organizations/${orgId}/verify`
  )
  return response.data
}

export const deleteUser = async (userId: string): Promise<void> => {
  await httpClient.delete(`/users/${userId}`)
}

export const getOrganizerDashboard = async (
  orgId: string
): Promise<DashboardStats> => {
  const response = await httpClient.get<DashboardStats>(
    `/organizations/${orgId}/dashboard`
  )
  return response.data
}

export const getOrganizationEvents = async (
  orgId: string
): Promise<Event[]> => {
  const response = await httpClient.get<any>(`/organizations/${orgId}/events`)
  return response.data.events || response.data.data || response.data
}

export const getOrganizationBySlug = async (
  slug: string
): Promise<OrganizationSummary> => {
  const response = await httpClient.get<OrganizationSummary>(
    `/public/organizations/${slug}`
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

// --- NOTIFICATIONS & REVIEWS (MOCK/PLACEHOLDERS SI NO HAY BACKEND) ---
// Si el backend aún no tiene implementado esto, podemos dejar placeholders o intentar endpoints estándar.
// Como el user pidió "Adiós Mock", lo intentaré conectar.

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

export const getEventReviews = async (eventId: string): Promise<Review[]> => {
  try {
    const response = await httpClient.get<any>(`/events/${eventId}/reviews`)
    return response.data.reviews || response.data.data || []
  } catch (e) {
    console.warn('Reviews endpoint not ready', e)
    return []
  }
}

export const createReview = async (
  review: Omit<Review, 'id' | 'date'>
): Promise<Review> => {
  const response = await httpClient.post<Review>(
    `/events/${review.eventId}/reviews`,
    review
  )
  return response.data
}
