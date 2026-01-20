import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig
} from 'axios'
import { AuthResponse } from '../types'

// Definir la URL base fuera de la clase para facilitar configuración
const API_URL =
  (import.meta as any).env.VITE_API_URL || 'http://localhost:8080/api/v1'

// Tipos para la cola de peticiones pendientes
interface PendingRequest {
  resolve: (value: unknown) => void
  reject: (reason?: any) => void
  config: InternalAxiosRequestConfig // Usar el tipo interno correcto de Axios
}

class HttpClient {
  private static instance: HttpClient
  public axiosInstance: AxiosInstance
  private isRefreshing: boolean = false
  private failedQueue: PendingRequest[] = []

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    })

    this.initializeInterceptors()
  }

  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient()
    }
    return HttpClient.instance
  }

  private initializeInterceptors() {
    // Request Interceptor: Inyectar token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token')
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response Interceptor: Manejo de errores global y refresh token + Unwrapping Response
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Unwrapping automático de respuestas { success: true, data: { ... } }
        if (
          response.data &&
          typeof response.data === 'object' &&
          'data' in response.data &&
          'success' in response.data
        ) {
          // Si hay pagination, preservarla junto con los datos
          if ('pagination' in response.data && response.data.pagination) {
            response.data = {
              data: response.data.data,
              pagination: response.data.pagination
            }
          } else {
            // Si no hay pagination, devolver solo los datos directamente
            response.data = response.data.data
          }
        }
        return response
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean
        }

        if (!originalRequest) {
          return Promise.reject(error)
        }

        // Si es error 401 y no hemos reintentado aún, intentamos refrescar
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Si ya estamos refrescando, encolamos la petición
            return new Promise((resolve, reject) => {
              this.failedQueue.push({
                resolve,
                reject,
                config: originalRequest
              })
            })
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            const refreshToken = localStorage.getItem('refresh_token')

            if (!refreshToken) {
              throw new Error('No refresh token available')
            }

            // Llamada directa a axios para evitar bucles infinitos en los interceptores
            const response = await axios.post<AuthResponse>(
              `${API_URL}/auth/refresh`,
              {
                refresh_token: refreshToken
              }
            )

            const { access_token, refresh_token: new_refresh_token } =
              response.data

            // Actualizar tokens
            localStorage.setItem('access_token', access_token)
            if (new_refresh_token) {
              localStorage.setItem('refresh_token', new_refresh_token)
            }

            // Procesar la cola de peticiones fallidas
            this.processQueue(null, access_token)

            // Reintentar la petición original con el nuevo token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${access_token}`
            }
            return this.axiosInstance(originalRequest)
          } catch (refreshError) {
            this.processQueue(refreshError, null)
            this.handleLogout() // Logout forzado si falla el refresh
            return Promise.reject(refreshError)
          } finally {
            this.isRefreshing = false
          }
        }

        return Promise.reject(error)
      }
    )
  }

  // Procesar la cola de peticiones que esperaban el refresh
  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error)
      } else {
        if (prom.config.headers) {
          prom.config.headers.Authorization = `Bearer ${token}`
        }
        // Reintentar la petición
        this.axiosInstance(prom.config).then(prom.resolve).catch(prom.reject)
      }
    })

    this.failedQueue = []
  }

  private handleLogout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    // Validar si estamos en navegador
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }
}

export const httpClient = HttpClient.getInstance().axiosInstance
