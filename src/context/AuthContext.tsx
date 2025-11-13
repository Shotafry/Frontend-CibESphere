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

// Esta interfaz se define LOCALMENTE. No se exporta.
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
    try {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error('Error al cargar datos de auth:', error)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleLoginSuccess = (data: AuthResponse) => {
    setUser(data.user)
    setToken(data.access_token)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('token', data.access_token)

    if (data.user.role === Role.Admin) {
      navigate('/panel-de-organizador')
    } else if (data.user.role === Role.Organizer) {
      navigate('/panel-de-organizador')
    } else {
      navigate('/panel-de-usuario')
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const data = await apiService.login(email, password)
      handleLoginSuccess(data)
    } catch (error) {
      setIsLoading(false)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/')
  }

  const refreshUserData = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const register = async (data: RegisterDTO) => {
    setIsLoading(true)
    try {
      const authData = await apiService.register(data)
      handleLoginSuccess(authData)
    } catch (error) {
      setIsLoading(false)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // --- NUEVA FUNCIÓN DE INSCRIPCIÓN ---
  const subscribeToEvent = async (event: Event): Promise<void> => {
    if (!user) throw new Error('Usuario no autenticado')

    const isAlreadySubscribed = user.FavoriteEvents?.some(
      (favEvent) => favEvent.id === event.id
    )
    if (isAlreadySubscribed) {
      console.log('El usuario ya está inscrito en este evento.')
      return
    }

    const updatedFavoriteEvents = [...(user.FavoriteEvents || []), event]
    const updatedUser = {
      ...user,
      FavoriteEvents: updatedFavoriteEvents
    }

    refreshUserData(updatedUser)

    try {
      await apiService.subscribeToEvent(event.id, user.email)
    } catch (error) {
      console.error('Error al llamar a la API de suscripción:', error)
    }
  }
  // --- FIN NUEVA FUNCIÓN ---

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
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
