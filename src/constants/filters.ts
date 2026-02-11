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

export const EVENT_TYPES = [
  { value: 'conference', label: 'Conferencia' },
  { value: 'workshop', label: 'Taller' },
  { value: 'meetup', label: 'Meetup' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'training', label: 'Formación / Curso' },
  { value: 'competition', label: 'Competición / CTF' }
]

export const EVENT_CATEGORIES = [
  'Red Team',
  'Blue Team',
  'Purple Team',
  'GRC (Gobernanza, Riesgo y Cumplimiento)',
  'DevSecOps',
  'Cloud Security',
  'Forense y Respuesta a Incidentes (DFIR)',
  'Ciberinteligencia',
  'Seguridad IoT/OT',
  'Criptografía',
  'Investigación',
  'Concienciación y Divulgación',
  'Legal y Normativa',
  'Otros'
]

export const EVENT_TAGS = [
  'Active Directory',
  'Android',
  'Ansible',
  'AppSec',
  'Auditoría',
  'AWS',
  'Azure',
  'Bash',
  'Blockchain',
  'Bug Bounty',
  'C++',
  'CISO',
  'Compliance',
  'Contenedores',
  'Criptografía',
  'CTF',
  'Dark Web',
  'Docker',
  'Exploit Development',
  'Firewalls',
  'Forensics',
  'Fortinet',
  'GCP',
  'Git',
  'Hacking Ético',
  'Hardware Hacking',
  'IAM',
  'Incidente',
  'Ingeniería Social',
  'iOS',
  'ISO 27001',
  'Java',
  'JavaScript',
  'Kali Linux',
  'Kubernetes',
  'Linux',
  'Malware',
  'Metasploit',
  'MITRE ATT&CK',
  'Networking',
  'NIST',
  'Node.js',
  'Open Source',
  'OSINT',
  'OWASP',
  'Palo Alto',
  'Pentesting',
  'Phishing',
  'PowerShell',
  'Privacidad',
  'Python',
  'Ransomware',
  'React',
  'Reverse Engineering',
  'Rust',
  'SIEM',
  'SOC',
  'Threat Hunting',
  'Threat Intelligence',
  'VPN',
  'Vulnerabilidades',
  'Web Security',
  'Wireshark',
  'Zero Trust',
  'Zero Day'
]

// Mantener compatibilidad temporal si es necesario, o eliminar si ya no se usa.
// Por ahora lo redirigimos a EVENT_TAGS para minimizar roturas inmediatas,
// pero el objetivo es usar EVENT_TAGS.
export const CYBERSECURITY_TAGS = EVENT_TAGS

export const EVENT_LEVELS = [
  'Principiante',
  'Intermedio',
  'Avanzado',
  'Experto' // Para ponentes o temas muy específicos
]
