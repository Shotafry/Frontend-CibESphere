// src/types/index.ts

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

// --- TIPO DE USUARIO ---

export interface User {
  id: string
  email: string
  password?: string // Solo en el mock
  first_name: string
  last_name: string
  full_name: string
  role: Role
  is_active: boolean
  is_verified: boolean
  company?: string
  position?: string
  created_at: string
  organization?: OrganizationSummary
  FavoriteEvents?: Event[] // Para el panel de usuario
  // Perfil Público
  avatar_url?: string
  bio?: string
  city?: string
  social_links?: {
    twitter?: string
    linkedin?: string
    github?: string
    website?: string
  }
}

// --- TIPOS DE ORGANIZACIÓN ---

export interface OrganizationSummary {
  id: string
  slug: string
  name: string
  logo_url: string
  is_verified: boolean
  city: string
  description?: string
  banner_url?: string
  website?: string
  email?: string
  social_links?: {
    twitter?: string
    linkedin?: string
    github?: string
  }
}

// --- TIPOS de EVENTO ---

export interface Event {
  id: string
  slug: string
  title: string
  short_desc: string
  description: string
  type: string
  category: string
  level: string
  start_date: string
  end_date: string
  is_online: boolean
  venue_name?: string
  venue_address?: string
  venue_city?: string
  venue_community?: string
  latitude?: number
  longitude?: number
  online_url?: string
  max_attendees?: number
  current_attendees: number
  is_free: boolean
  price?: number
  image_url: string
  banner_url: string
  tags: string[]
  language:
    | 'Español'
    | 'Inglés'
    | 'Catalán'
    | 'Euskera'
    | 'Gallego'
    | 'Valenciano'
  organization: OrganizationSummary
  status: 'published' | 'draft' | 'canceled'
  is_upcoming: boolean
  is_past: boolean
  is_ongoing: boolean
  agenda: AgendaItem[]
  speakers: Speaker[]
  requirements?: string
}

export interface AgendaItem {
  id: string
  time: string
  title: string
  description: string
}

export interface Speaker {
  id: string
  name: string
  role: string
  topic: string
  time: string // Linked to agenda time
  image_url?: string
}

export interface CreateEventDTO
  extends Omit<
    Event,
    | 'id'
    | 'slug'
    | 'organization'
    | 'status'
    | 'is_upcoming'
    | 'is_past'
    | 'is_ongoing'
    | 'current_attendees'
  > {
  organization_id: string
}

// --- TIPOS DE FILTROS (EL TIPO QUE FALTABA) ---

export interface EventFilterParams {
  startDate: Date | null
  endDate: Date | null
  tags: string[]
  locations: string[]
  levels: string[]
  languages: string[]
}

// --- TIPOS DE DASHBOARD ---

export interface DashboardStats {
  total_events: number
  total_attendees: number
  total_cities: number
  published_events: number
}
