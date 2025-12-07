// src/services/apiService.ts
import {
  Event,
  EventFilterParams,
  User,
  LoginDTO,
  RegisterDTO,
  AuthResponse,
  Role,
  DashboardStats,
  OrganizationSummary,
  CreateEventDTO,
  Notification
} from '../types'
import { mockEvents, mockUsers } from '../mocks/db'

const SIMULATED_DELAY = 800

// --- LOCAL STORAGE PERSISTENCE HELPERS ---
const DBS_KEYS = {
  USERS: 'cibesphere_users_v1',
  EVENTS: 'cibesphere_events_v1'
}

// Initialize local state from LocalStorage or fallback to mocks
let localUsers: User[] = (() => {
  try {
    const stored = localStorage.getItem(DBS_KEYS.USERS)
    return stored ? JSON.parse(stored) : [...mockUsers]
  } catch (e) {
    console.error('Error loading users from LS:', e)
    return [...mockUsers]
  }
})()

let localEvents: Event[] = (() => {
  try {
    const stored = localStorage.getItem(DBS_KEYS.EVENTS)
    return stored ? JSON.parse(stored) : [...mockEvents]
  } catch (e) {
    console.error('Error loading events from LS:', e)
    return [...mockEvents]
  }
})()

const saveUsers = () => {
  try {
    localStorage.setItem(DBS_KEYS.USERS, JSON.stringify(localUsers))
  } catch (e) {
    console.error('Error saving users to LS:', e)
  }
}

const saveEvents = () => {
  try {
    localStorage.setItem(DBS_KEYS.EVENTS, JSON.stringify(localEvents))
  } catch (e) {
    console.error('Error saving events to LS:', e)
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// --- login ---
export const login = (data: LoginDTO): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = localUsers.find(
        (u) => u.email === data.email && u.password === data.password
      )
      if (user) {
        const authResponse: AuthResponse = {
          user,
          access_token: 'fake-access-token-' + Math.random(),
          refresh_token: 'fake-refresh-token-' + Math.random(),
          token_type: 'Bearer',
          expires_in: 3600
        }
        resolve(authResponse)
      } else {
        reject(new Error('Credenciales inválidas'))
      }
    }, SIMULATED_DELAY)
  })
}

// --- register ---
export const register = (data: RegisterDTO): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (localUsers.find((u) => u.email === data.email)) {
        reject(new Error('El email ya está registrado'))
        return
      }

      let newUserOrg: OrganizationSummary | undefined = undefined
      if (data.role === Role.Organizer && data.organization_name) {
        newUserOrg = {
          id: `org-00${localUsers.length + 1}`,
          slug: data.organization_name.toLowerCase().replace(/\s+/g, '-'),
          name: data.organization_name,
          logo_url: '',
          is_verified: false,
          city: 'Desconocida'
        }
      }

      const newUser: User = {
        id: `a1b2c3d4-${Math.floor(Math.random() * 9000) + 1000}`,
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        full_name: `${data.first_name} ${data.last_name}`,
        role: data.role,
        is_active: true,
        is_verified: false,
        created_at: new Date().toISOString(),
        organization: newUserOrg
      }

      localUsers.push(newUser)
      saveUsers()

      const authResponse: AuthResponse = {
        user: newUser,
        access_token: 'fake-access-token-' + Math.random(),
        refresh_token: 'fake-refresh-token-' + Math.random(),
        token_type: 'Bearer',
        expires_in: 3600
      }
      resolve(authResponse)
    }, SIMULATED_DELAY)
  })
}

// --- getEvents ---
export const getEvents = (filters: EventFilterParams): Promise<Event[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredEvents = [
        ...localEvents.filter((e) => e.status === 'published')
      ]
      if (filters.startDate) {
        filteredEvents = filteredEvents.filter(
          (e) => new Date(e.start_date) >= filters.startDate!
        )
      }
      if (filters.endDate) {
        filteredEvents = filteredEvents.filter(
          (e) => new Date(e.start_date) <= filters.endDate!
        )
      }
      if (filters.tags.length > 0) {
        filteredEvents = filteredEvents.filter((e) =>
          e.tags.some((tag) => filters.tags.includes(tag))
        )
      }
      if (filters.locations.length > 0) {
        filteredEvents = filteredEvents.filter(
          (e) =>
            (e.venue_city && filters.locations.includes(e.venue_city)) ||
            (e.venue_community && filters.locations.includes(e.venue_community))
        )
      }
      if (filters.levels.length > 0) {
        filteredEvents = filteredEvents.filter(
          (e) => e.level && filters.levels.includes(e.level)
        )
      }
      if (filters.languages.length > 0) {
        filteredEvents = filteredEvents.filter(
          (e) => e.language && filters.languages.includes(e.language)
        )
      }
      resolve(filteredEvents)
    }, SIMULATED_DELAY / 2)
  })
}

// --- getEventBySlug ---
export const getEventBySlug = (slug: string): Promise<Event> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const event = localEvents.find((e) => e.slug === slug)
      if (event) {
        resolve(event)
      } else {
        reject(new Error('Evento no encontrado'))
      }
    }, SIMULATED_DELAY / 3)
  })
}

// --- subscribeToEvent ---
export const subscribeToEvent = (
  eventId: string,
  email: string
): Promise<{ message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const eventIndex = localEvents.findIndex((e) => e.id === eventId)
      if (eventIndex !== -1) {
        localEvents[eventIndex].current_attendees += 1
        saveEvents()
      }

      console.log(`Email ${email} suscrito al evento ${eventId}`)
      resolve({ message: '¡Suscripción confirmada!' })
    }, SIMULATED_DELAY)
  })
}

// --- getMe ---
export const getMe = (userId: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = localUsers.find((u) => u.id === userId)
      if (user) {
        resolve(user)
      } else {
        reject(new Error('Usuario no encontrado'))
      }
    }, SIMULATED_DELAY / 2)
  })
}

// --- unsubscribeFromEvent ---
export const unsubscribeFromEvent = (
  userId: string,
  eventId: string
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 1. Modificamos la lista de favoritos del usuario (simulado)
      // En un caso real, esto sería una llamada a la API
      // 1. Modificamos la lista de favoritos del usuario (simulado)
      // En un caso real, esto sería una llamada a la API
      const userIndex = localUsers.findIndex((u) => u.id === userId)
      if (userIndex !== -1) {
        localUsers[userIndex].FavoriteEvents = localUsers[
          userIndex
        ].FavoriteEvents?.filter((event) => event.id !== eventId)
        saveUsers()
      }

      // Decrementar el contador de asistentes del evento
      const eventIndex = localEvents.findIndex((e) => e.id === eventId)
      if (eventIndex !== -1 && localEvents[eventIndex].current_attendees > 0) {
        localEvents[eventIndex].current_attendees -= 1
        saveEvents()
      }

      console.log(
        `Usuario ${userId} ha cancelado suscripción al evento ${eventId}`
      )
      resolve()
    }, SIMULATED_DELAY / 2)
  })
}

// --- getOrganizerDashboard ---
export const getOrganizerDashboard = (
  orgId: string
): Promise<DashboardStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orgEvents = localEvents.filter((e) => e.organization.id === orgId)
      const totalAttendees = orgEvents.reduce(
        (sum, e) => sum + e.current_attendees,
        0
      )
      const cities = new Set(orgEvents.map((e) => e.venue_city))
      resolve({
        total_events: orgEvents.length,
        total_attendees: totalAttendees,
        total_cities: cities.size,
        published_events: orgEvents.filter((e) => e.status === 'published')
          .length
      })
    }, SIMULATED_DELAY / 2)
  })
}

// --- getOrganizationEvents ---
export const getOrganizationEvents = (orgId: string): Promise<Event[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orgEvents = localEvents.filter((e) => e.organization.id === orgId)
      resolve(orgEvents)
    }, SIMULATED_DELAY / 2)
  })
}

// --- getOrganizationBySlug ---
export const getOrganizationBySlug = (
  slug: string
): Promise<OrganizationSummary> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Buscamos la organización en los eventos existentes
      const eventWithOrg = localEvents.find((e) => e.organization.slug === slug)
      if (eventWithOrg) {
        resolve(eventWithOrg.organization)
      } else {
        reject(new Error('Organización no encontrada'))
      }
    }, SIMULATED_DELAY / 2)
  })
}

// --- createEvent ---
export const createEvent = (
  eventData: CreateEventDTO,
  organization: OrganizationSummary
): Promise<Event> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEvent: Event = {
        id: `evt-00${localEvents.length + 1}`,
        slug: eventData.title.toLowerCase().replace(/\s+/g, '-'),
        status: 'published',
        current_attendees: 0,
        is_upcoming: true,
        is_past: false,
        is_ongoing: false,
        organization: organization,
        ...eventData,
        category: eventData.category || eventData.tags[0] || 'General',
        type: eventData.type || 'conference'
      }
      localEvents.push(newEvent)
      saveEvents()
      resolve(newEvent)
    }, SIMULATED_DELAY)
  })
}

// --- updateEvent ---
export const updateEvent = (
  eventId: string,
  eventData: Partial<CreateEventDTO>
): Promise<Event> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const eventIndex = localEvents.findIndex((e) => e.id === eventId)
      if (eventIndex === -1) {
        return reject(new Error('Evento no encontrado para actualizar'))
      }

      const originalEvent = localEvents[eventIndex]
      const updatedEvent: Event = {
        ...originalEvent,
        ...eventData,
        slug: eventData.title
          ? eventData.title.toLowerCase().replace(/\s+/g, '-')
          : originalEvent.slug,
        id: originalEvent.id,
        organization: originalEvent.organization
      }

      localEvents[eventIndex] = updatedEvent
      saveEvents()
      resolve(updatedEvent)
    }, SIMULATED_DELAY)
  })
}

// --- deleteEvent ---
export const deleteEvent = (eventId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = localEvents.findIndex((e) => e.id === eventId)
      if (index !== -1) {
        localEvents.splice(index, 1)
        saveEvents()
      }
      resolve()
    }, SIMULATED_DELAY / 2)
  })
}

// --- updateOrganization (NUEVO) ---
export const updateOrganization = async (
  orgId: string,
  data: Partial<OrganizationSummary>
): Promise<OrganizationSummary> => {
  await delay(500)
  // En un backend real, esto actualizaría la DB.
  // Aquí actualizamos los eventos asociados para reflejar cambios (mock)
  let updatedOrg: OrganizationSummary | undefined

  localEvents.forEach((e) => {
    if (e.organization.id === orgId) {
      e.organization = { ...e.organization, ...data }
      updatedOrg = e.organization
    }
  })
  if (updatedOrg) saveEvents()

  // También actualizar en mockUsers si el usuario tiene esa org
  localUsers.forEach((u) => {
    if (u.organization && u.organization.id === orgId) {
      u.organization = { ...u.organization, ...data }
      updatedOrg = u.organization
    }
  })
  saveUsers()

  if (!updatedOrg) {
    // Si no se encontró en eventos ni usuarios, buscar en eventos de nuevo por si acaso
    const event = localEvents.find((e) => e.organization.id === orgId)
    if (event) updatedOrg = event.organization
  }

  if (!updatedOrg) throw new Error('Organización no encontrada')
  return updatedOrg
}

// --- getUserById (NUEVO) ---
export const getUserById = async (userId: string): Promise<User> => {
  await delay(500)
  const user = mockUsers.find((u) => u.id === userId)
  if (!user) throw new Error('Usuario no encontrado')
  return user
}

// --- updateUser (NUEVO) ---
export const updateUser = async (
  userId: string,
  data: Partial<User>
): Promise<User> => {
  await delay(500)
  const userIndex = localUsers.findIndex((u) => u.id === userId)
  if (userIndex === -1) throw new Error('Usuario no encontrado')

  const updatedUser = { ...localUsers[userIndex], ...data }
  localUsers[userIndex] = updatedUser
  saveUsers()
  return updatedUser
}

// --- BOOKMARKS (MOCK) ---

export const toggleBookmark = async (
  userId: string,
  eventId: string
): Promise<{ isBookmarked: boolean; message: string }> => {
  await delay(300)
  const userIndex = localUsers.findIndex((u) => u.id === userId)
  if (userIndex === -1) throw new Error('Usuario no encontrado')

  const user = localUsers[userIndex]
  const event = localEvents.find((e) => e.id === eventId)
  if (!event) throw new Error('Evento no encontrado')

  if (!user.BookmarkedEvents) {
    user.BookmarkedEvents = []
  }

  const alreadyBookmarked = user.BookmarkedEvents.some((e) => e.id === eventId)
  let isBookmarked = false

  if (alreadyBookmarked) {
    user.BookmarkedEvents = user.BookmarkedEvents.filter(
      (e) => e.id !== eventId
    )
    isBookmarked = false
  } else {
    user.BookmarkedEvents.push(event)
    isBookmarked = true
  }

  localUsers[userIndex] = user
  saveUsers()

  return {
    isBookmarked,
    message: isBookmarked ? 'Evento guardado' : 'Evento eliminado de guardados'
  }
}

// --- NOTIFICACIONES (MOCK) ---

const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Evento Próximo',
    message: 'Tu evento "CyberSec 2024" comienza mañana.',
    date: new Date().toISOString(),
    is_read: false,
    type: 'info',
    link: '/eventos/cybersec-2024'
  },
  {
    id: 'notif-2',
    title: 'Registro Exitoso',
    message: 'Te has registrado correctamente en "Workshop Hacking Ético".',
    date: new Date(Date.now() - 86400000).toISOString(),
    is_read: true,
    type: 'success',
    link: '/eventos/workshop-hacking-etico'
  },
  {
    id: 'notif-3',
    title: 'Nueva Organización',
    message: 'Una nueva organización "SecOps Madrid" se ha unido.',
    date: new Date(Date.now() - 172800000).toISOString(),
    is_read: false,
    type: 'info'
  }
]

export const getNotifications = (userId: string): Promise<Notification[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockNotifications])
    }, 500)
  })
}

export const markNotificationAsRead = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const notif = mockNotifications.find((n) => n.id === id)
      if (notif) {
        notif.is_read = true
      }
      resolve()
    }, 300)
  })
}
