#!/usr/bin/env node
// scripts/verify-setup.js
// Script para verificar que todo esté correctamente configurado

const fs = require('fs')
const path = require('path')

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  section: (msg) =>
    console.log(`\n${colors.cyan}━━━ ${msg} ━━━${colors.reset}\n`)
}

let errors = 0
let warnings = 0

// ===== VERIFICACIONES =====

log.section('Verificando Configuración del Proyecto')

// 1. Verificar .env
if (fs.existsSync('.env')) {
  log.success('Archivo .env encontrado')
  const envContent = fs.readFileSync('.env', 'utf-8')

  if (envContent.includes('VITE_API_URL')) {
    log.success('VITE_API_URL configurado')
  } else {
    log.error('VITE_API_URL no encontrado en .env')
    errors++
  }

  if (envContent.includes('localhost:8080')) {
    log.success('URL del backend correcta (localhost:8080)')
  } else {
    log.warning('La URL del backend no apunta a localhost:8080')
    warnings++
  }
} else {
  log.error('Archivo .env no encontrado')
  log.info(
    'Crea el archivo .env con: echo "VITE_API_URL=http://localhost:8080/api/v1" > .env'
  )
  errors++
}

// 2. Verificar archivos del sistema API
log.section('Verificando Sistema API')

const coreFiles = ['src/services/httpClient.ts', 'src/services/apiService.ts']

const apiServiceFiles = [
  'src/services/api/index.ts',
  'src/services/api/auth.service.ts',
  'src/services/api/users.service.ts',
  'src/services/api/events.service.ts',
  'src/services/api/organizations.service.ts',
  'src/services/api/admin.service.ts',
  'src/services/api/notifications.service.ts',
  'src/services/api/reviews.service.ts'
]

const hooksFiles = [
  'src/hooks/useApi.ts',
  'src/hooks/useEvents.ts',
  'src/hooks/useOrganizations.ts',
  'src/hooks/index.ts'
]

log.info('Archivos Core:')
coreFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    log.success(`  ${file}`)
  } else {
    log.error(`  ${file} no encontrado`)
    errors++
  }
})

log.info('\nServicios por Dominio:')
apiServiceFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    log.success(`  ${file}`)
  } else {
    log.error(`  ${file} no encontrado`)
    errors++
  }
})

log.info('\nCustom Hooks:')
hooksFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    log.success(`  ${file}`)
  } else {
    log.error(`  ${file} no encontrado`)
    errors++
  }
})

// 3. Verificar documentación
log.section('Verificando Documentación')

const docFiles = [
  'API_SERVICE_README.md',
  'API_COVERAGE.md',
  'MIGRATION_GUIDE.md',
  'CHECKLIST.md'
]

docFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    log.success(`${file}`)
  } else {
    log.warning(`${file} no encontrado`)
    warnings++
  }
})

// 4. Verificar package.json
log.section('Verificando Dependencias')

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'))

const requiredDeps = {
  axios: '^1.13.2',
  react: '^19',
  'react-router-dom': '^7',
  '@mui/material': '^7'
}

Object.entries(requiredDeps).forEach(([dep, version]) => {
  if (packageJson.dependencies[dep]) {
    log.success(`${dep}: ${packageJson.dependencies[dep]}`)
  } else {
    log.error(`${dep} no encontrado en dependencies`)
    errors++
  }
})

// 5. Verificar scripts
log.section('Verificando Scripts')

const requiredScripts = ['start', 'build', 'test:api']

requiredScripts.forEach((script) => {
  if (packageJson.scripts[script]) {
    log.success(`Script '${script}' configurado`)
  } else {
    log.warning(`Script '${script}' no encontrado`)
    warnings++
  }
})

// 6. Verificar node_modules
log.section('Verificando Instalación')

if (fs.existsSync('node_modules')) {
  log.success('node_modules encontrado')

  const axiosPath = 'node_modules/axios'
  if (fs.existsSync(axiosPath)) {
    log.success('Axios instalado correctamente')
  } else {
    log.error('Axios no está instalado')
    log.info('Ejecuta: npm install')
    errors++
  }
} else {
  log.error('node_modules no encontrado')
  log.info('Ejecuta: npm install')
  errors++
}

// 7. Verificar TypeScript config
log.section('Verificando TypeScript')

if (fs.existsSync('tsconfig.json')) {
  log.success('tsconfig.json encontrado')
} else {
  log.error('tsconfig.json no encontrado')
  errors++
}

// ===== RESUMEN =====

log.section('Resumen')

const totalChecks =
  coreFiles.length +
  apiServiceFiles.length +
  hooksFiles.length +
  docFiles.length +
  Object.keys(requiredDeps).length +
  requiredScripts.length +
  5
const successes = totalChecks - errors - warnings

console.log(`Total de verificaciones: ${totalChecks}`)
console.log(`${colors.green}Éxitos: ${successes}${colors.reset}`)

if (warnings > 0) {
  console.log(`${colors.yellow}Advertencias: ${warnings}${colors.reset}`)
}

if (errors > 0) {
  console.log(`${colors.red}Errores: ${errors}${colors.reset}`)
}

console.log('')

if (errors === 0 && warnings === 0) {
  console.log(
    `${colors.green}✓ ¡Todo listo! El proyecto está correctamente configurado.${colors.reset}`
  )
  console.log('')
  console.log('Próximos pasos:')
  console.log('  1. Inicia el backend: cd ../backend && make run')
  console.log('  2. Prueba la conexión: npm run test:api')
  console.log('  3. Inicia el frontend: npm start')
  console.log('')
  console.log(
    `Para más información, consulta: ${colors.cyan}QUICK_START.md${colors.reset}`
  )
} else if (errors === 0) {
  console.log(
    `${colors.yellow}⚠ Configuración parcial. Revisa las advertencias.${colors.reset}`
  )
} else {
  console.log(
    `${colors.red}✗ Hay errores que deben corregirse antes de continuar.${colors.reset}`
  )
  process.exit(1)
}

console.log('')
