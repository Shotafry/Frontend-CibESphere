// src/constants/filters.ts
// Aquí definimos todas las opciones de filtro para que sea fácil editarlas en el futuro.

/**
 * NUEVA ESTRUCTURA DE DATOS
 * Esta es ahora la fuente principal de verdad para las localizaciones.
 * Define qué ciudades pertenecen a qué comunidad.
 */
export const LOCATION_DATA: Record<string, string[]> = {
  Andalucía: [
    'Sevilla',
    'Málaga',
    'Granada',
    'Córdoba',
    'Cádiz',
    'Huelva',
    'Jaén',
    'Almería',
    'Marbella',
    'Jerez de la Frontera',
    'Dos Hermanas'
  ],
  Aragón: ['Zaragoza', 'Huesca', 'Teruel'],
  'Principado de Asturias': ['Oviedo', 'Gijón', 'Avilés'],
  'Balears, Illes': ['Palma de Mallorca', 'Ibiza', 'Manacor'],
  Canarias: [
    'Las Palmas de Gran Canaria',
    'Santa Cruz de Tenerife',
    'La Laguna'
  ],
  Cantabria: ['Santander', 'Torrelavega', 'Castro Urdiales'],
  'Castilla y León': [
    'Valladolid',
    'León',
    'Burgos',
    'Salamanca',
    'Segovia',
    'Ávila',
    'Palencia',
    'Zamora',
    'Soria'
  ],
  'Castilla - La Mancha': [
    'Toledo',
    'Albacete',
    'Ciudad Real',
    'Guadalajara',
    'Cuenca',
    'Talavera de la Reina'
  ],
  Cataluña: [
    'Barcelona',
    'Tarragona',
    'Girona',
    'Lleida',
    "L'Hospitalet de Llobregat",
    'Badalona',
    'Sabadell',
    'Terrassa'
  ],
  'Comunitat Valenciana': [
    'Valencia',
    'Alicante',
    'Castellón de la Plana',
    'Elche',
    'Benidorm'
  ],
  Extremadura: ['Badajoz', 'Cáceres', 'Mérida'],
  Galicia: [
    'A Coruña',
    'Vigo',
    'Santiago de Compostela',
    'Lugo',
    'Ourense',
    'Pontevedra'
  ],
  'Comunidad de Madrid': [
    'Madrid',
    'Móstoles',
    'Alcalá de Henares',
    'Getafe',
    'Leganés',
    'Alcobendas'
  ],
  'Murcia, Región de': ['Murcia', 'Cartagena', 'Lorca'],
  'Comunidad Foral de Navarra': ['Pamplona', 'Tudela'],
  'País Vasco': ['Bilbao', 'Vitoria-Gasteiz', 'San Sebastián', 'Barakaldo'],
  'Rioja, La': ['Logroño'],
  Ceuta: ['Ceuta'],
  Melilla: ['Melilla']
}

// --- Listas generadas automáticamente desde LOCATION_DATA ---

// Lista de todas las Comunidades Autónomas
export const AUTONOMOUS_COMMUNITIES = Object.keys(LOCATION_DATA).sort()

// Lista de TODAS las ciudades (para filtros)
export const ALL_CITIES = [
  ...new Set(Object.values(LOCATION_DATA).flat())
].sort()

// Opciones combinadas para el filtro de localización en la Landing Page
export const LOCATION_OPTIONS = [
  ...new Set([...AUTONOMOUS_COMMUNITIES, ...ALL_CITIES])
].sort()

// --- Listas que se mantienen igual ---

export const CYBERSECURITY_TAGS = [
  // Tipos de Evento
  'Conferencia',
  'Taller',
  'Bootcamp',
  'Meetup',
  'Competición',
  'CTF (Capture The Flag)',
  'Webinar',
  'Curso',

  // Áreas Técnicas
  'Pentesting',
  'Hacking Ético',
  'Red Team',
  'Blue Team',
  'Purple Team',
  'Análisis de Malware',
  'DFIR (Forense y Respuesta a Incidentes)',
  'Reversing',
  'Criptografía',
  'Seguridad en la Nube (Cloud Security)',
  'Seguridad Ofensiva',
  'Seguridad Defensiva',

  // Plataformas y Tecnologías
  'Seguridad AWS',
  'Seguridad Azure',
  'Seguridad GCP',
  'Seguridad de Redes',
  'Seguridad IoT',
  'Seguridad Móvil (Android/iOS)',
  'Seguridad OT / SCADA',
  'Contenedores (Docker, Kubernetes)',
  'Blockchain',
  'Inteligencia Artificial (IA)',

  // Roles y Conceptos
  'Gobernanza (GRC)',
  'Cumplimiento (Compliance)',
  'Hacking',
  'Ciberinteligencia',
  'OSINT',
  'DevSecOps',
  'Networking',
  'Privacidad de Datos'
]

export const EVENT_LEVELS = [
  'Principiante',
  'Intermedio',
  'Avanzado',
  'Experto' // Para ponentes o temas muy específicos
]
