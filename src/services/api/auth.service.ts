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

export const verifyEmail = async (token: string): Promise<void> => {
  await httpClient.get(`/auth/verify?token=${token}`)
}

export const logout = async (): Promise<void> => {
  await httpClient.post('/auth/logout')
}

export const logoutAll = async (): Promise<void> => {
  await httpClient.post('/auth/logout-all')
}

/**
 * Uploads an image to the server
 * @param file The file to upload
 * @param type The type of image: 'avatar', 'banner', or 'badge' (default: 'avatar')
 * @returns The public URL of the uploaded image
 */
export const uploadImage = async (
  file: File,
  type: 'avatar' | 'banner' | 'badge' | 'event' = 'avatar'
): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await httpClient.post<{ url: string }>(
    `/auth/upload?type=${type}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
  return response.data.url
}
