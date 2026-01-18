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
  employer?: string
  position?: string
  bio?: string
  personal_website?: string
  linkedin?: string
  twitter?: string
  github?: string

  // Roles y estado
  role: Role
  is_active: boolean
  is_verified: boolean

  // Ubicación
  city?: string
  country?: string
  latitude?: number
  longitude?: number

  // Configuración (Optional for mocks/legacy)
  timezone?: string
  language?: string
  newsletter_enabled?: boolean

  // UI Specific
  avatar_url?: string
  banner_url?: string
  personal_quote?: string
  slug?: string // Added slug support
  badges?: string // JSON array of badge objects

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

// --- TIPOS DE ORGANIZACIÓN ---

export interface SocialMediaLinks {
  linkedin?: string
  twitter?: string
  facebook?: string
  instagram?: string
  youtube?: string
  github?: string
}

export interface OrganizationResponse {
  id: string
  slug: string
  name: string
  description: string
  website?: string

  // Contact Info
  email?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  postal_code?: string

  // Location
  latitude?: number
  longitude?: number

  // Branding
  logo_url?: string
  banner_url?: string
  primary_color?: string
  secondary_color?: string

  // Social
  social_media?: SocialMediaLinks

  // Status
  status: string
  is_verified: boolean
  verified_at?: string

  // Stats
  events_count: number

  // Config
  can_create_events?: boolean
  max_events?: number

  // Timestamps
  created_at: string
  updated_at: string

  // Stripe
  stripe_account_id?: string
  stripe_onboarding_complete?: boolean
}

export interface OrganizationSummaryResponse
  extends Partial<OrganizationResponse> {
  id: string
  slug: string
  name: string
  // Mantener compatibilidad con usos anteriores si es necesario
  // pero idealmente usar OrganizationResponse donde sea el objeto completo
  social_links?: SocialMediaLinks // Legacy support if needed
  social_media?: SocialMediaLinks // Backend field
  stripe_account_id?: string
  stripe_onboarding_complete?: boolean
}

// --- TIPOS DE EVENTO ---

export interface TicketType {
  id: string
  name: string
  description?: string
  price: number // céntimos
  capacity: number
  sold: number
  is_active: boolean
}

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
  venue_state?: string // Comunidad Autónoma (para mostrar en tarjetas)
  venue_country?: string
  venue_community?: string // Legacy alias for venue_state
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
  ticket_types?: TicketType[]

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
  is_online?: boolean // Added for modality filtering
  organization_id?: string // Added for organization filtering
  page?: number // Added pagination
  limit?: number // Added pagination
  timeFilter?: 'upcoming' | 'past' | 'all' // Filter by event status
}

// --- TIPOS DE CREACIÓN ---

export interface CreateEventDTO {
  // Información básica
  title: string
  description: string
  short_desc?: string
  type: string
  category?: string
  level: string

  // Fechas
  start_date: string
  end_date: string
  timezone?: string
  registration_start_date?: string
  registration_end_date?: string

  // Ubicación
  is_online: boolean
  venue_name?: string
  venue_address?: string
  venue_city?: string
  venue_country?: string
  latitude?: number
  longitude?: number
  online_url?: string
  streaming_url?: string

  // Capacidad y precios
  max_attendees?: number
  is_free: boolean
  price?: number
  currency?: string
  registration_url?: string
  ticket_types?: string // JSON string of TicketType[]

  // Media
  image_url?: string
  banner_url?: string

  // Contenido adicional
  tags: string[]
  requirements?: string
  agenda?: string

  // Contacto
  contact_email?: string
  contact_phone?: string

  // SEO
  meta_title?: string
  meta_description?: string

  // Organización
  organization_id: string

  // Admin only (opcionales)
  status?: 'draft' | 'published'
  is_public?: boolean
  is_featured?: boolean
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

// --- CAPACIDADES Y SESIONES ---

export interface UserCapabilities {
  user_id: string
  role: Role
  permissions: {
    can_create_events: boolean
    can_manage_organization: boolean
    can_verify_organizations: boolean
    can_manage_users: boolean
    can_moderate_content: boolean
    can_access_admin_panel: boolean
    can_view_analytics: boolean
    can_manage_roles: boolean
  }
  organization: {
    id?: string
    name?: string
    role_in_org?: string
    can_edit_organization: boolean
    can_create_org_events: boolean
    can_manage_org_members: boolean
  }
  limits: {
    max_events?: number
    max_attendees_per_event?: number
  }
}

export interface UserSession {
  id: string
  token_id: string
  user_id: string
  device_type: string
  browser: string
  ip_address: string
  location: string
  created_at: string
  last_active_at: string
  expires_at: string
  is_current: boolean
}

export interface AccessCheckRequest {
  resource: string
  action: string
  resource_id?: string
}

export interface AccessCheckResponse {
  has_access: boolean
  resource: string
  action: string
  reason: string
}

export interface AvailableAction {
  action: string
  description: string
  requires: string[]
}

export interface AvailableActionsResponse {
  actions: Record<string, AvailableAction[]>
}

export interface RoleInfo {
  name: string
  description: string
  permissions: string[]
  level: number
}

export interface RolesResponse {
  roles: Record<string, RoleInfo>
}

// --- PERFILES PÚBLICOS ---

export interface PublicUserProfile {
  id: string
  slug?: string
  first_name?: string
  last_name?: string
  full_name: string
  employer?: string
  position?: string
  city?: string
  country?: string
  bio?: string
  avatar_url?: string
  banner_url?: string
  personal_website?: string
  linkedin?: string
  twitter?: string
  github?: string
  social_links?: string
  badges?: string // JSON array of badge objects
  joined_at: string
  events_attended?: number
  events_organized?: number
  organization?: {
    id: string
    name: string
    logo_url?: string
  }
  // Eventos registrados del usuario
  registered_events?: Event[]
}

// --- EVENTOS ESPECIALES ---

export interface EventsUpcoming {
  today: EventSummary[]
  this_week: EventSummary[]
  this_month: EventSummary[]
  later: EventSummary[]
}

export interface PublishEventRequest {
  send_notifications: boolean
}

export interface CancelEventRequest {
  reason: string
  send_notifications: boolean
}

export interface EventStatusChangeResponse {
  id: string
  old_status: string
  new_status: string
  changed_at: string
  changed_by: string
  message: string
}

// --- ORGANIZACIONES ---

export interface CreateOrganizationDTO {
  name: string
  description: string
  website?: string
  email: string
  phone?: string
  address?: string
  city: string
  country: string
  postal_code?: string
  latitude?: number
  longitude?: number
  logo_url?: string
  banner_url?: string
  primary_color?: string
  secondary_color?: string
  linkedin?: string
  twitter?: string
  facebook?: string
  instagram?: string
  youtube?: string
  tax_id?: string
  legal_name?: string
  registration_docs?: string
}

export interface OrganizationMember {
  id: string
  email: string
  full_name: string
  role: Role
  position?: string
  avatar_url?: string
  joined_at: string
  is_active: boolean
  can_edit: boolean
  can_manage: boolean
}

export interface OrganizationMembersResponse {
  members: OrganizationMember[]
  pagination: PaginationMeta
}

export interface BulkVerifyRequest {
  organization_ids: string[]
  notes?: string
}

export interface BulkVerifyResponse {
  success: boolean
  verified_count: number
  failed_count: number
  results: Array<{
    organization_id: string
    success: boolean
    message: string
  }>
}

// --- ACTUALIZACIÓN DE USUARIO ---

export interface UpdateUserDTO {
  first_name?: string
  last_name?: string
  employer?: string
  position?: string
  bio?: string
  personal_website?: string
  city?: string
  country?: string
  latitude?: number
  longitude?: number
  timezone?: string
  language?: string
  newsletter_enabled?: boolean
  avatar_url?: string
  banner_url?: string
  linkedin?: string
  twitter?: string
  github?: string

  // Custom additions
  slug?: string
  personal_quote?: string
}

export interface ChangeRoleRequest {
  role: Role
  reason: string
}

export interface ActivateUserRequest {
  is_active: boolean
  reason: string
}

export interface ChangeRoleResponse {
  user_id: string
  old_role: Role
  new_role: Role
  changed_at: string
  changed_by: string
  reason: string
  message: string
}

export interface ActivateUserResponse {
  user_id: string
  is_active: boolean
  changed_at: string
  changed_by: string
  reason: string
  message: string
}
