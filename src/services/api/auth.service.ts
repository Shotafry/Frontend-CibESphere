// src/services/api/auth.service.ts
import { httpClient } from '../httpClient'
import { LoginDTO, RegisterDTO, AuthResponse } from '../../types'

export const login = async (data: LoginDTO): Promise<AuthResponse> => {
  const response = await httpClient.post<AuthResponse>('/auth/login', data)
  return response.data
}

export const register = async (data: RegisterDTO): Promise<AuthResponse> => {
  const response = await httpClient.post<AuthResponse>('/auth/register', data)
  return response.data
}

export const logout = async (): Promise<void> => {
  await httpClient.post('/auth/logout')
}

export const logoutAll = async (): Promise<void> => {
  await httpClient.post('/auth/logout-all')
}
