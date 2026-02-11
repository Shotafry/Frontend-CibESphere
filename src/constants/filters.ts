// src/constants/filters.ts
// Aquí definimos todas las opciones de filtro para que sea fácil editarlas en el futuro.

/**
 * NUEVA ESTRUCTURA DE DATOS
 * Esta es ahora la fuente principal de verdad para las localizaciones.
 * Define qué ciudades pertenecen a qué comunidad.
 */
// ==========================================
// 5. DATOS DE UBICACIÓN (Normalizados +15 ciudades)
// ==========================================
export const LOCATION_DATA: Record<string, string[]> = {
  Andalucía: [
    'Sevilla',
    'Málaga',
    'Córdoba',
    'Granada',
    'Jerez de la Frontera',
    'Almería',
    'Huelva',
    'Marbella',
    'Dos Hermanas',
    'Algeciras',
    'Cádiz',
    'Jaén',
    'Roquetas de Mar',
    'San Fernando',
    'El Puerto de Santa María'
  ],
  Aragón: [
    'Zaragoza',
    'Huesca',
    'Teruel',
    'Calatayud',
    'Utebo',
    'Monzón',
    'Barbastro',
    'Ejea de los Caballeros',
    'Alcañiz',
    'Fraga',
    'Cuarte de Huerva',
    'Jaca',
    'Tarazona',
    'Caspe',
    'Binéfar'
  ],
  'Principado de Asturias': [
    'Gijón',
    'Oviedo',
    'Avilés',
    'Siero',
    'Langreo',
    'Mieres',
    'Castrillón',
    'San Martín del Rey Aurelio',
    'Corvera de Asturias',
    'Villaviciosa',
    'Llanera',
    'Llanes',
    'Laviana',
    'Cangas del Narcea',
    'Valdés'
  ],
  'Islas Baleares': [
    'Palma',
    'Calvià',
    'Ibiza',
    'Manacor',
    'Santa Eulària des Riu',
    'Marratxí',
    'Llucmajor',
    'Inca',
    'Ciutadella de Menorca',
    'Maó',
    'Sant Josep de sa Talaia',
    'Sant Antoni de Portmany',
    'Alcúdia',
    'Felanitx',
    'Pollença'
  ],
  Canarias: [
    'Las Palmas de Gran Canaria',
    'Santa Cruz de Tenerife',
    'San Cristóbal de La Laguna',
    'Telde',
    'Arona',
    'Santa Lucía de Tirajana',
    'Granadilla de Abona',
    'Arrecife',
    'San Bartolomé de Tirajana',
    'La Orotava',
    'Puerto del Rosario',
    'Arucas',
    'Adeje',
    'Santa Cruz de La Palma',
    'Puerto de la Cruz'
  ],
  Cantabria: [
    'Santander',
    'Torrelavega',
    'Castro-Urdiales',
    'Camargo',
    'Piélagos',
    'El Astillero',
    'Santa Cruz de Bezana',
    'Laredo',
    'Santoña',
    'Los Corrales de Buelna',
    'Reinosa',
    'Suances',
    'Cabezón de la Sal',
    'Medio Cudeyo',
    'Polanco'
  ],
  'Castilla y León': [
    'Valladolid',
    'Burgos',
    'Salamanca',
    'León',
    'Palencia',
    'Ponferrada',
    'Zamora',
    'Segovia',
    'Ávila',
    'Soria',
    'Miranda de Ebro',
    'Aranda de Duero',
    'San Andrés del Rabanedo',
    'Laguna de Duero',
    'Medina del Campo'
  ],
  'Castilla-La Mancha': [
    'Albacete',
    'Guadalajara',
    'Toledo',
    'Ciudad Real',
    'Cuenca',
    'Talavera de la Reina',
    'Puertollano',
    'Tomelloso',
    'Azuqueca de Henares',
    'Valdepeñas',
    'Hellín',
    'Alcázar de San Juan',
    'Illescas',
    'Seseña',
    'Villarrobledo'
  ],
  Cataluña: [
    'Barcelona',
    "L'Hospitalet de Llobregat",
    'Badalona',
    'Terrassa',
    'Sabadell',
    'Lleida',
    'Tarragona',
    'Mataró',
    'Santa Coloma de Gramenet',
    'Reus',
    'Girona',
    'Sant Cugat del Vallès',
    'Cornellà de Llobregat',
    'Sant Boi de Llobregat',
    'Rubí'
  ],
  'Comunidad Valenciana': [
    'Valencia',
    'Alicante',
    'Elche',
    'Castellón de la Plana',
    'Torrevieja',
    'Torrent',
    'Orihuela',
    'Gandia',
    'Paterna',
    'Benidorm',
    'Sagunto',
    'Alcoy',
    'San Vicente del Raspeig',
    'Elda',
    'Villarreal'
  ],
  Extremadura: [
    'Badajoz',
    'Cáceres',
    'Mérida',
    'Plasencia',
    'Don Benito',
    'Almendralejo',
    'Villanueva de la Serena',
    'Navalmoral de la Mata',
    'Zafra',
    'Montijo',
    'Villafranca de los Barros',
    'Coria',
    'Olivenza',
    'Miajadas',
    'Trujillo'
  ],
  Galicia: [
    'Vigo',
    'A Coruña',
    'Ourense',
    'Santiago de Compostela',
    'Lugo',
    'Pontevedra',
    'Ferrol',
    'Narón',
    'Vilagarcía de Arousa',
    'Oleiros',
    'Ames',
    'Carballo',
    'Arteixo',
    'Culleredo',
    'Redondela'
  ],
  'Comunidad de Madrid': [
    'Madrid',
    'Móstoles',
    'Alcalá de Henares',
    'Fuenlabrada',
    'Leganés',
    'Getafe',
    'Alcorcón',
    'Parla',
    'Torrejón de Ardoz',
    'Alcobendas',
    'Las Rozas de Madrid',
    'San Sebastián de los Reyes',
    'Rivas-Vaciamadrid',
    'Pozuelo de Alarcón',
    'Coslada'
  ],
  'Región de Murcia': [
    'Murcia',
    'Cartagena',
    'Lorca',
    'Molina de Segura',
    'Alcantarilla',
    'Torre-Pacheco',
    'Águilas',
    'Cieza',
    'Yecla',
    'San Javier',
    'Mazarrón',
    'Totana',
    'Caravaca de la Cruz',
    'Jumilla',
    'San Pedro del Pinatar'
  ],
  'Comunidad Foral de Navarra': [
    'Pamplona',
    'Tudela',
    'Valle de Egüés',
    'Barañáin',
    'Burlada',
    'Zizur Mayor',
    'Estella-Lizarra',
    'Tafalla',
    'Ansoáin',
    'Villava',
    'Berriozar',
    'Aranguren',
    'Baztan',
    'Corella',
    'Noáin'
  ],
  'País Vasco': [
    'Bilbao',
    'Vitoria-Gasteiz',
    'San Sebastián',
    'Barakaldo',
    'Getxo',
    'Irun',
    'Portugalete',
    'Santurtzi',
    'Basauri',
    'Errenteria',
    'Leioa',
    'Galdakao',
    'Durango',
    'Sestao',
    'Eibar'
  ],
  'La Rioja': [
    'Logroño',
    'Calahorra',
    'Arnedo',
    'Haro',
    'Alfaro',
    'Lardero',
    'Nájera',
    'Villamediana de Iregua',
    'Santo Domingo de la Calzada',
    'Autol',
    'Pradejón',
    'Rincón de Soto',
    'Albelda de Iregua',
    'Fuenmayor',
    'Navarrete'
  ],
  Ceuta: ['Ceuta'],
  Melilla: ['Melilla']
}

export const SPANISH_COMMUNITIES = Object.keys(LOCATION_DATA).sort()

export const getCitiesByCommunity = (community: string): string[] => {
  if (!community || !LOCATION_DATA[community]) return []
  return LOCATION_DATA[community].sort()
}

export const AUTONOMOUS_COMMUNITIES = SPANISH_COMMUNITIES

export const ALL_CITIES = [
  ...new Set(Object.values(LOCATION_DATA).flat())
].sort()

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
