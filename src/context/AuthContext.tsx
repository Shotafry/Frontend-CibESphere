// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect
} from 'react'
import { User, Role, AuthResponse, RegisterDTO, Event } from '../types'
import * as apiService from '../services/apiService'
import { useNavigate } from 'react-router-dom'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (data: RegisterDTO) => Promise<void>
  refreshUserData: (updatedUser: User) => void
  subscribeToEvent: (event: Event) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('access_token')
      const storedUser = localStorage.getItem('user')

      if (storedToken) {
        setToken(storedToken)
        try {
          // Fetch fresh user data from backend to ensure favorites are up to date
          const freshUser = await apiService.getMe()
          setUser(freshUser)
          localStorage.setItem('user', JSON.stringify(freshUser))
        } catch (e) {
          console.error('Error fetching fresh user data', e)
          // Fallback to stored user if network fails, but try to use it
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          } else {
            localStorage.removeItem('access_token')
            setToken(null)
          }
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const handleAuthSuccess = (data: AuthResponse) => {
    setUser(data.user)
    setToken(data.access_token)

    localStorage.setItem('access_token', data.access_token)
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token)
    }
    localStorage.setItem('user', JSON.stringify(data.user))

    if (data.user.role === Role.Admin) {
      navigate('/admin')
    } else if (data.user.role === Role.Organizer) {
      if (data.user.organization) {
        navigate('/panel-de-organizador')
      } else {
        navigate('/crear-organizacion')
      }
    } else {
      navigate('/panel-de-usuario')
    }
  }

  const login = async (email: string, password: string) => {
    // setIsLoading(true) // DO NOT toggle global loading, it unmounts the app!
    try {
      const data = await apiService.login({ email, password })
      handleAuthSuccess(data)
    } catch (error) {
      // setIsLoading(false)
      throw error
    } finally {
      // setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const refreshUserData = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const register = async (data: RegisterDTO) => {
    // setIsLoading(true) // DO NOT toggle global loading
    try {
      await apiService.register(data)
      // No login automatically, waiting for email verification
    } catch (error) {
      // setIsLoading(false)
      throw error
    } finally {
      // setIsLoading(false)
    }
  }

  const subscribeToEvent = async (event: Event): Promise<void> => {
    if (!user) throw new Error('Usuario no autenticado')
    await apiService.subscribeToEvent(event.id)
    // Refrescar datos del usuario para que isAlreadySubscribed se actualice inmediatamente
    const freshUser = await apiService.getMe()
    setUser(freshUser)
    localStorage.setItem('user', JSON.stringify(freshUser))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading, // Keep passing it, but it now represents initialization only
        login,
        logout,
        register,
        refreshUserData,
        subscribeToEvent
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
