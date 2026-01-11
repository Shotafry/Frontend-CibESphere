// src/types/index.ts

// --- TIPOS DE RESPUESTA DE API ---

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  error?: unknown
  pagination?: PaginationMeta
}

export interface PaginationMeta {
  current_page: number
  total_pages: number
  limit: number
  total_items: number
  has_next: boolean
  has_prev: boolean
}

// --- TIPOS DE AUTENTICACIÓN ---

export enum Role {
  Admin = 'admin',
  Organizer = 'organizer',
  User = 'user'
}

export interface AuthResponse {
  user: User
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

// --- TIPO DE USUARIO ---

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name: string

  // Perfil profesional
  company?: string
  position?: string
  bio?: string
  website?: string
  linkedin?: string
  twitter?: string

  // Roles y estado
  role: Role
  is_active: boolean
  is_verified: boolean

  // Ubicación
  city?: string
  country?: string
  latitude?: number
  longitude?: number
  slug?: string

  // Configuración (Optional for mocks/legacy)
  timezone?: string
  language?: string
  newsletter_enabled?: boolean

  // UI Specific
  avatar_url?: string
  banner_url?: string
  personal_quote?: string

  // Organización (si aplica)
  organization?: OrganizationSummaryResponse

  // Timestamps
  last_login_at?: string
  created_at: string
  updated_at?: string

  // Frontend legacy support
  favorite_events?: EventSummary[]
  registered_events?: EventSummary[]
  FavoriteEvents?: EventSummary[] // Legacy alias support

  // Mocks/Internal
  password?: string
}

export interface UserDetail extends User {
  favorite_events?: EventSummary[]
  registered_events?: EventSummary[]
}

// --- TIPOS DE ORGANIZACIÓN ---

export interface OrganizationSummaryResponse {
  id: string
  slug: string
  name: string
  logo_url: string
  is_verified: boolean
  city: string

  // Frontend legacy support
  website?: string
  description?: string
  banner_url?: string
  email?: string
  social_links?: {
    twitter?: string
    linkedin?: string
    github?: string
    website?: string
  }
}

// --- TIPOS DE EVENTO ---

export interface AgendaItem {
  id: string // Required for UI keying
  time: string
  title: string
  description?: string
}

export interface Speaker {
  id: string
  name: string
  role: string
  avatar_url?: string
  company?: string

  // Legacy UI fields
  topic?: string
  time?: string
}

export interface Event {
  id: string
  slug: string
  title: string
  short_desc: string
  description: string
  type: string
  category: string
  level: string

  organization_id: string
  organization?: OrganizationSummaryResponse
  organization_name?: string // Legacy/Mock

  // Fechas
  start_date: string
  end_date: string
  timezone: string

  // Ubicación
  is_online: boolean
  venue_name?: string
  venue_address?: string
  venue_city?: string
  venue_state?: string
  venue_country?: string
  online_url?: string
  latitude?: number
  longitude?: number

  // Asistencia y Precios
  max_attendees?: number
  current_attendees: number
  is_free: boolean
  price?: number
  currency: string
  registration_url?: string

  // Media
  image_url: string
  banner_url?: string

  // Estado
  status: 'draft' | 'published' | 'canceled' | 'completed'
  is_public: boolean
  is_featured: boolean
  is_upcoming?: boolean
  is_past?: boolean
  is_ongoing?: boolean // Mock support

  tags: string[]

  // Detalles adicionales (Legacy support for UI)
  agenda?: AgendaItem[]
  speakers?: Speaker[]
  requirements?: string[]
  language?: string

  // Timestamps
  created_at: string
  updated_at: string
  published_at?: string
  canceled_at?: string
}

export interface EventDetail extends Event {
  requirements?: string[]
  agenda?: AgendaItem[]
  contact_email?: string
  contact_phone?: string
}

export interface EventSummary {
  id: string
  slug: string
  title: string
  short_desc: string
  type: string
  category: string
  start_date: string
  is_online: boolean
  venue_city?: string
  image_url: string
  organization_name: string
  price?: number
  is_free: boolean
}

// --- OTROS TIPOS NECESARIOS ---

export interface LoginDTO {
  email: string
  password: string
}

export interface RegisterDTO {
  email: string
  password: string
  first_name: string
  last_name: string
  role: Role
  organization_name?: string
  organization_website?: string
}

export interface OrganizationSummary extends OrganizationSummaryResponse {}

// --- TIPOS DE FILTROS ---

export interface EventFilterParams {
  startDate?: Date | null
  endDate?: Date | null
  tags?: string[]
  locations?: string[]
  levels?: string[]
  languages?: string[]
  search?: string
  type?: string
  page?: number
  limit?: number
}

// --- TIPOS DE CREACIÓN ---

export interface CreateEventDTO {
  title: string
  description: string
  short_desc: string
  type: string
  category: string
  level: string
  start_date: string
  end_date: string
  is_online: boolean
  venue_name?: string
  venue_address?: string
  venue_city?: string
  venue_country?: string
  online_url?: string
  max_attendees?: number
  is_free: boolean
  price?: number
  currency: string
  image_url: string
  tags: string[]
  organization_id: string
}

// --- DASHBOARD ---

export interface DashboardStats {
  total_events: number
  total_attendees: number
  total_cities: number
  published_events: number
}

// --- NOTIFICACIONES ---

export interface Notification {
  id: string
  title: string
  message: string
  date: string
  is_read: boolean
  type: 'info' | 'success' | 'warning' | 'error'
  link?: string
}

// --- RESEÑAS ---

export interface Review {
  id: string
  eventId: string
  userId: string
  userName: string
  rating: number
  comment: string
  date: string
  userAvatar?: string
  userCompany?: string
  userPosition?: string
  userQuote?: string
}
