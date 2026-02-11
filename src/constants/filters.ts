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

// ==========================================
// 1. TIPOS DE EVENTO (Labels cortos para Badges)
// ==========================================
export const EVENT_TYPES = [
  { value: 'conference', label: 'Conferencia' },
  { value: 'workshop', label: 'Taller' },
  { value: 'meetup', label: 'Meetup' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'training', label: 'Formación' },
  { value: 'competition', label: 'CTF / Competición' },
  { value: 'bugbounty', label: 'Bug Bounty' },
  { value: 'networking', label: 'Networking' },
  { value: 'fair', label: 'Feria de Empleo' },
  { value: 'other', label: 'Otro' }
]

// ==========================================
// 2. NIVELES (Estándar)
// ==========================================
export const EVENT_LEVELS = [
  { value: 'beginner', label: 'Principiante' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
  { value: 'expert', label: 'Experto' }
]

// ==========================================
// 3. CATEGORÍAS PRINCIPALES (15 Categorías Clave)
// ==========================================
export const EVENT_CATEGORIES = [
  'Red Team & Pentesting',
  'Blue Team & Defensa',
  'DevSecOps & AppSec',
  'Cloud Security',
  'GRC & Cumplimiento',
  'Forense & DFIR',
  'Threat Intelligence',
  'Malware & Reversing',
  'Criptografía',
  'IoT & Hardware',
  'IA & Seguridad',
  'Gestión & CISO',
  'Ingeniería Social',
  'Carrera Profesional',
  'Otro'
]

// ==========================================
// 4. TAGS (+100 Tecnologías y Conceptos)
// ==========================================
export const EVENT_TAGS = [
  // Conceptos & Roles
  'CISO',
  'DPO',
  'SysAdmin',
  'Red Teamer',
  'Blue Teamer',
  'Threat Hunter',
  // Normativa & GRC
  'ENS',
  'NIS2',
  'RGPD',
  'ISO 27001',
  'PCI DSS',
  'HIPAA',
  'DORA',
  'Compliance',
  'Auditoría',
  // Cloud & Infra
  'AWS',
  'Azure',
  'GCP',
  'Kubernetes',
  'Docker',
  'Terraform',
  'Ansible',
  'Serverless',
  'Microservicios',
  // Hacking & Offensive
  'Pentesting',
  'Hacking Ético',
  'Bug Bounty',
  'Exploit Dev',
  'Web Hacking',
  'Mobile Hacking',
  'WiFi Hacking',
  'Ingeniería Social',
  'Phishing',
  'Ransomware',
  'C2',
  'Cobalt Strike',
  'Metasploit',
  'Burp Suite',
  // Defensive & Blue Team
  'SOC',
  'SIEM',
  'XDR',
  'EDR',
  'Firewall',
  'WAF',
  'Honeypot',
  'Splunk',
  'Elastic',
  'Wazuh',
  'Incident Response',
  'Forensics',
  'Malware Analysis',
  'YARA',
  'MITRE ATT&CK',
  // AppSec & Dev
  'DevSecOps',
  'Secure Coding',
  'OWASP Top 10',
  'SCA',
  'SAST',
  'DAST',
  'API Security',
  'Python',
  'Go',
  'Rust',
  'Java',
  'JavaScript',
  'Bash',
  'PowerShell',
  'C++',
  // Tecnologías Emergentes
  'IA Security',
  'LLM Hacking',
  'Blockchain',
  'Smart Contracts',
  'Web3',
  'Quantum Crypto',
  'Zero Trust',
  // Otros
  'OSINT',
  'Privacidad',
  'Hardware Hacking',
  'Lockpicking',
  'IoT',
  'SCADA/ICS',
  'Active Directory'
].sort()

// Mantener compatibilidad temporal si es necesario
export const CYBERSECURITY_TAGS = EVENT_TAGS
