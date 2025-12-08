// src/mocks/db.ts
import { Role, User, Event, OrganizationSummary } from '../types'

// --- ORGANIZACIONES (Simuladas) ---
const org1: OrganizationSummary = {
  id: 'org-001',
  slug: 'cybersecurity-spain',
  name: 'CyberSecurity Spain',
  logo_url: '/CloudEvents-logo-2@2x.png',
  is_verified: true,
  city: 'Madrid',
  description:
    'Somos la comunidad líder en ciberseguridad en España. Organizamos eventos, conferencias y talleres para profesionales y entusiastas del sector. Nuestro objetivo es fomentar el conocimiento y la colaboración en el ámbito de la seguridad informática.',
  banner_url:
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80',
  website: 'https://cybersecurityspain.local',
  email: 'contacto@cybersecurityspain.local',
  social_links: {
    twitter: 'https://twitter.com/cyberspain',
    linkedin: 'https://linkedin.com/company/cyberspain',
    github: 'https://github.com/cyberspain'
  }
}
const org2: OrganizationSummary = {
  id: 'org-002',
  slug: 'hackingetic',
  name: 'Hackingétic',
  logo_url: '/cyberLogo-gigapixel-art-scale-2-00x-godpix-1@2x.png',
  is_verified: true,
  city: 'Barcelona',
  description:
    'Grupo dedicado al Hacking Ético y la Ciberinteligencia. Realizamos CTFs, talleres de Red Team y Blue Team, y charlas sobre las últimas vulnerabilidades.',
  banner_url:
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
  website: 'https://hackingetic.local',
  email: 'info@hackingetic.local',
  social_links: {
    twitter: 'https://twitter.com/hackingetic',
    github: 'https://github.com/hackingetic'
  }
}
const org3: OrganizationSummary = {
  id: 'org-003',
  slug: 'securit-all',
  name: 'SecurIT All',
  logo_url: '/asturcon-low-1@2x.png',
  is_verified: true,
  city: 'Sevilla',
  description:
    'Consultora de seguridad que organiza eventos formativos gratuitos para la comunidad. Especializados en DFIR y respuesta a incidentes.',
  banner_url:
    'https://images.unsplash.com/photo-1563206767-5b1d972d9323?auto=format&fit=crop&w=1600&q=80',
  website: 'https://securitall.local',
  email: 'events@securitall.local',
  social_links: {
    linkedin: 'https://linkedin.com/company/securitall'
  }
}

// --- EVENTOS ---
export let mockEvents: Event[] = [
  {
    id: 'evt-001',
    slug: 'cybersec-summit-madrid-2024',
    title: 'CyberSec Summit Madrid 2024',
    short_desc:
      'La mayor conferencia de ciberseguridad de España con speakers internacionales',
    description:
      'La mayor conferencia de ciberseguridad de España. Dos días llenos de charlas magistrales, talleres prácticos y networking con los mejores profesionales del sector.',
    type: 'conference',
    category: 'Security Conference',
    level: 'Intermedio',
    start_date: '2025-11-14T09:00:00Z',
    end_date: '2025-11-15T18:00:00Z',
    is_online: false,
    venue_name: 'Palacio de Congresos',
    venue_address: 'Paseo de la Castellana, 99',
    venue_city: 'Madrid',
    venue_community: 'Comunidad de Madrid',
    latitude: 40.452,
    longitude: -3.6922,
    max_attendees: 500,
    current_attendees: 287,
    is_free: false,
    price: 25000,
    image_url: '/asturcon-low-1@2x.png',
    banner_url: '',
    tags: ['Ciberinteligencia', 'Conferencia', 'Madrid', 'Networking'],
    language: 'Inglés',
    organization: org1,
    status: 'published',
    is_upcoming: true,
    is_past: false,
    is_ongoing: false,
    agenda: [],
    speakers: []
  },
  {
    id: 'evt-002',
    slug: 'ethical-hacking-bootcamp',
    title: 'Ethical Hacking Bootcamp Intensivo',
    short_desc:
      'Bootcamp intensivo de ethical hacking con laboratorios prácticos',
    description:
      'Bootcamp intensivo de 3 días para aprender ethical hacking desde cero hasta nivel avanzado. Incluye laboratorios prácticos.',
    type: 'training',
    category: 'Ethical Hacking',
    level: 'Principiante',
    start_date: '2025-12-10T09:00:00Z',
    end_date: '2025-12-12T17:00:00Z',
    is_online: true,
    online_url: 'https://zoom.us/j/123456',
    venue_city: 'Online',
    venue_community: 'Online',
    max_attendees: 30,
    current_attendees: 15,
    is_free: false,
    price: 49900,
    image_url: '/CloudEvents-logo-1@2x.png',
    banner_url: '',
    tags: ['Bootcamp', 'Curso', 'Hacking Ético', 'Online'],
    language: 'Español',
    organization: org1,
    status: 'published',
    is_upcoming: true,
    is_past: false,
    is_ongoing: false,
    agenda: [],
    speakers: []
  },
  {
    id: 'evt-003',
    slug: 'red-team-vs-blue-team-bcn',
    title: 'Red Team vs Blue Team: Simulacro en Vivo',
    short_desc: 'Competición Red Team vs Blue Team en tiempo real',
    description:
      'Evento presencial donde dos equipos competirán en tiempo real: Red Team intentando comprometer la infraestructura mientras Blue Team la defiende.',
    type: 'competition',
    category: 'Red Team',
    level: 'Avanzado',
    start_date: '2025-11-28T10:00:00Z',
    end_date: '2025-11-28T16:00:00Z',
    is_online: false,
    venue_name: 'Universidad Politécnica',
    venue_address: 'Campus Universitario, Aula Magna',
    venue_city: 'Barcelona',
    venue_community: 'Cataluña',
    latitude: 41.3851,
    longitude: 2.1734,
    max_attendees: 200,
    current_attendees: 120,
    is_free: true,
    image_url: '/cyberLogo-gigapixel-art-scale-2-00x-godpix-1@2x.png',
    banner_url: '',
    tags: ['Barcelona', 'Blue Team', 'Competición', 'CTF', 'Red Team'],
    language: 'Catalán',
    organization: org2,
    status: 'published',
    is_upcoming: true,
    is_past: false,
    is_ongoing: false,
    agenda: [],
    speakers: []
  },
  {
    id: 'evt-004',
    slug: 'dfir-workshop-sevilla',
    title: 'Taller de DFIR: De la Alerta a la Evidencia',
    short_desc:
      'Taller práctico sobre respuesta a incidentes y análisis forense.',
    description:
      'Jornada completa de taller práctico donde se simulará un incidente de seguridad y los asistentes, divididos en equipos, deberán gestionarlo de principio a fin.',
    type: 'Taller',
    category: 'DFIR',
    level: 'Intermedio',
    start_date: '2025-11-22T09:00:00Z',
    end_date: '2025-11-22T18:00:00Z',
    is_online: false,
    venue_name: 'Cámara de Comercio',
    venue_address: 'Plaza de la Contratación, 8',
    venue_city: 'Sevilla',
    venue_community: 'Andalucía',
    latitude: 37.3826,
    longitude: -5.9965,
    max_attendees: 50,
    current_attendees: 45,
    is_free: false,
    price: 7500,
    image_url: '/cyberLogo-gigapixel-art-scale-2-00x-godpix-11@2x.png',
    banner_url: '',
    tags: ['DFIR', 'Forense', 'Respuesta a Incidentes', 'Sevilla', 'Taller'],
    language: 'Español',
    organization: org3,
    status: 'published',
    is_upcoming: true,
    is_past: false,
    is_ongoing: false,
    agenda: [],
    speakers: []
  }
]

// --- USUARIOS ---
export let mockUsers: User[] = [
  {
    id: 'a1b2c3d4-0001-0001-0001-000000000001',
    email: 'admin@cybesphere.local',
    password: 'Admin123!',
    first_name: 'Admin',
    last_name: 'CybESphere',
    full_name: 'Admin CybESphere',
    role: Role.Admin,
    is_active: true,
    is_verified: true,
    company: 'CybESphere',
    position: 'System Administrator',
    created_at: new Date().toISOString(),
    organization: org1
  },
  {
    id: 'a1b2c3d4-0002-0002-0002-000000000002',
    email: 'organizer@cybesphere.local',
    password: 'Organizer123!',
    first_name: 'María',
    last_name: 'García',
    full_name: 'María García',
    role: Role.Organizer,
    is_active: true,
    is_verified: true,
    company: 'CyberSecurity Spain',
    position: 'Event Manager',
    created_at: new Date().toISOString(),
    organization: org1
  },
  {
    id: 'a1b2c3d4-0003-0003-0003-000000000003',
    email: 'attendee@cybesphere.local',
    password: 'Attendee123!',
    first_name: 'Juan',
    last_name: 'Pérez',
    full_name: 'Juan Pérez',
    role: Role.User,
    is_active: true,
    is_verified: true,
    company: 'TechCorp',
    position: 'Security Analyst',
    created_at: new Date().toISOString(),
    FavoriteEvents: [mockEvents[0], mockEvents[2]],
    avatar_url: 'https://i.pravatar.cc/300?img=11',
    banner_url:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80',
    bio: 'Apasionado de la ciberseguridad y el desarrollo seguro. Buscando siempre aprender nuevas técnicas de defensa y ataque.',
    city: 'Madrid, España',
    social_links: {
      twitter: 'https://twitter.com/juanperez_sec',
      linkedin: 'https://linkedin.com/in/juanperez',
      github: 'https://github.com/juanperez'
    }
  }
]
