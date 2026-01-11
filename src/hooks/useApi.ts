// src/hooks/useApi.ts
import { useState, useCallback } from 'react'
import { AxiosError } from 'axios'

interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: ApiError) => void
  showLoading?: boolean
}

interface ApiError {
  message: string
  status?: number
  code?: string
  details?: any
}

interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
  execute: (...args: any[]) => Promise<T | undefined>
  reset: () => void
}

/**
 * Hook personalizado para manejar llamadas a la API
 *
 * @example
 * ```tsx
 * const { data, loading, error, execute } = useApi(getEvents)
 *
 * useEffect(() => {
 *   execute({ locations: ['Madrid'] })
 * }, [])
 * ```
 */
export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const execute = useCallback(
    async (...args: any[]): Promise<T | undefined> => {
      try {
        setLoading(true)
        setError(null)

        const result = await apiFunction(...args)
        setData(result)

        if (options.onSuccess) {
          options.onSuccess(result)
        }

        return result
      } catch (err) {
        const apiError = handleApiError(err)
        setError(apiError)

        if (options.onError) {
          options.onError(apiError)
        }

        return undefined
      } finally {
        setLoading(false)
      }
    },
    [apiFunction, options]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, execute, reset }
}

/**
 * Hook para operaciones de mutación (POST, PUT, DELETE)
 * Similar a useApi pero optimizado para operaciones que modifican datos
 */
export function useMutation<T = any>(
  mutationFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  return useApi(mutationFunction, options)
}

/**
 * Procesa errores de Axios en un formato consistente
 */
function handleApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    return {
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Error desconocido',
      status: error.response?.status,
      code: error.code,
      details: error.response?.data
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message
    }
  }

  return {
    message: 'Error desconocido'
  }
}
