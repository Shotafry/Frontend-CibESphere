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
  'Región de Murcia': ['Murcia', 'Cartagena', 'Lorca'],
  Navarra: ['Pamplona', 'Tudela'],
  'País Vasco': ['Bilbao', 'Vitoria-Gasteiz', 'San Sebastián', 'Barakaldo'],
  'La Rioja': ['Logroño'],
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
  'Análisis de Malware',
  'Blockchain',
  'Blue Team',
  'Bootcamp',
  'Ciberinteligencia',
  'Competición',
  'Conferencia',
  'Contenedores (Docker, Kubernetes)',
  'Criptografía',
  'CTF (Capture The Flag)',
  'Cumplimiento (Compliance)',
  'Curso',
  'DevSecOps',
  'DFIR (Forense y Respuesta a Incidentes)',
  'Gobernanza (GRC)',
  'Hacking',
  'Hacking Ético',
  'Inteligencia Artificial (IA)',
  'Meetup',
  'Networking',
  'OSINT',
  'Pentesting',
  'Privacidad de Datos',
  'Purple Team',
  'Red Team',
  'Reversing',
  'Seguridad AWS',
  'Seguridad Azure',
  'Seguridad de Redes',
  'Seguridad Defensiva',
  'Seguridad en la Nube (Cloud Security)',
  'Seguridad GCP',
  'Seguridad IoT',
  'Seguridad Móvil (Android/iOS)',
  'Seguridad Ofensiva',
  'Seguridad OT / SCADA',
  'Taller',
  'Webinar'
]

export const EVENT_LEVELS = [
  'Principiante',
  'Intermedio',
  'Avanzado',
  'Experto' // Para ponentes o temas muy específicos
]
