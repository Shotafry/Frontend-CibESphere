// scripts/test-api-connection.ts
// Script para probar la conexión con el backend

import axios from 'axios'

const API_URL = 'http://localhost:8080/api/v1'

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
}

async function testEndpoint(
  name: string,
  method: 'GET' | 'POST',
  endpoint: string,
  data?: any
) {
  try {
    const response = await axios({
      method,
      url: `${API_URL}${endpoint}`,
      data,
      timeout: 5000
    })

    console.log(
      `${colors.green}✓${colors.reset} ${name}: ${colors.green}OK${colors.reset} (${response.status})`
    )
    return true
  } catch (error: any) {
    if (error.response) {
      console.log(
        `${colors.yellow}⚠${colors.reset} ${name}: ${colors.yellow}${error.response.status}${colors.reset} - ${error.response.statusText}`
      )
    } else if (error.code === 'ECONNREFUSED') {
      console.log(
        `${colors.red}✗${colors.reset} ${name}: ${colors.red}Backend no disponible${colors.reset}`
      )
    } else {
      console.log(
        `${colors.red}✗${colors.reset} ${name}: ${colors.red}${error.message}${colors.reset}`
      )
    }
    return false
  }
}

async function main() {
  console.log(
    `\n${colors.blue}Probando conexión con el backend...${colors.reset}\n`
  )
  console.log(`${colors.blue}URL Base:${colors.reset} ${API_URL}\n`)

  const tests = [
    {
      name: 'Eventos Públicos',
      method: 'GET' as const,
      endpoint: '/public/events'
    },
    {
      name: 'Organizaciones Públicas',
      method: 'GET' as const,
      endpoint: '/public/organizations'
    },
    {
      name: 'Estadísticas Públicas',
      method: 'GET' as const,
      endpoint: '/public/stats'
    }
  ]

  let passed = 0
  for (const test of tests) {
    const result = await testEndpoint(test.name, test.method, test.endpoint)
    if (result) passed++
  }

  console.log(
    `\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`
  )
  console.log(
    `${colors.blue}Resultados:${colors.reset} ${passed}/${tests.length} pruebas exitosas`
  )

  if (passed === tests.length) {
    console.log(
      `${colors.green} Backend conectado correctamente${colors.reset}\n`
    )
    process.exit(0)
  } else if (passed === 0) {
    console.log(
      `${colors.red}Backend no disponible. Asegúrate de que esté corriendo en ${API_URL}${colors.reset}\n`
    )
    process.exit(1)
  } else {
    console.log(
      `${colors.yellow}Algunos endpoints no están disponibles${colors.reset}\n`
    )
    process.exit(0)
  }
}

main()
