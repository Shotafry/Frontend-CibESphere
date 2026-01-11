// src/services/api/users.service.ts
import { httpClient } from '../httpClient'
import {
  User,
  UpdateUserDTO,
  UserCapabilities,
  UserSession,
  AccessCheckRequest,
  AccessCheckResponse,
  AvailableActionsResponse,
  RolesResponse,
  PublicUserProfile,
  ChangeRoleRequest,
  ActivateUserRequest,
  ChangeRoleResponse,
  ActivateUserResponse
} from '../../types'

// --- PROFILE ---

export const getMe = async (): Promise<User> => {
  const response = await httpClient.get<User>('/auth/me')
  return response.data
}

export const getUserById = async (userId: string): Promise<User> => {
  const response = await httpClient.get<User>(`/users/${userId}`)
  return response.data
}

export const getUserProfile = async (): Promise<User> => {
  const response = await httpClient.get<User>('/user/profile')
  return response.data
}

export const updateUserProfile = async (data: UpdateUserDTO): Promise<User> => {
  const response = await httpClient.put<User>('/user/profile', data)
  return response.data
}

export const updateUser = async (
  userId: string,
  data: Partial<User>
): Promise<User> => {
  const response = await httpClient.put<User>(`/users/${userId}`, data)
  return response.data
}

export const getPublicUserProfile = async (
  id: string
): Promise<PublicUserProfile> => {
  const response = await httpClient.get<PublicUserProfile>(
    `/public/users/${id}/profile`
  )
  return response.data
}

// --- CAPABILITIES & PERMISSIONS ---

export const getUserCapabilities = async (): Promise<UserCapabilities> => {
  const response = await httpClient.get<UserCapabilities>('/user/capabilities')
  return response.data
}

export const checkAccess = async (
  data: AccessCheckRequest
): Promise<AccessCheckResponse> => {
  const response = await httpClient.post<AccessCheckResponse>(
    '/user/check-access',
    data
  )
  return response.data
}

export const getAvailableActions =
  async (): Promise<AvailableActionsResponse> => {
    const response = await httpClient.get<AvailableActionsResponse>(
      '/user/available-actions'
    )
    return response.data
  }

export const getRoles = async (): Promise<RolesResponse> => {
  const response = await httpClient.get<RolesResponse>('/user/roles')
  return response.data
}

// --- SESSIONS ---

export const getUserSessions = async (): Promise<UserSession[]> => {
  const response = await httpClient.get<{ sessions: UserSession[] }>(
    '/user/sessions'
  )
  return response.data.sessions
}

export const deleteUserSession = async (sessionId: string): Promise<void> => {
  await httpClient.delete(`/user/sessions/${sessionId}`)
}

// --- ADMIN: USER MANAGEMENT ---

export const getAllUsers = async (): Promise<User[]> => {
  const response = await httpClient.get<any>('/users')
  return response.data.users || response.data.data || response.data
}

export const deleteUser = async (userId: string): Promise<void> => {
  await httpClient.delete(`/users/${userId}`)
}

export const changeUserRole = async (
  userId: string,
  data: ChangeRoleRequest
): Promise<ChangeRoleResponse> => {
  const response = await httpClient.put<ChangeRoleResponse>(
    `/users/${userId}/role`,
    data
  )
  return response.data
}

export const activateUser = async (
  userId: string,
  data: ActivateUserRequest
): Promise<ActivateUserResponse> => {
  const response = await httpClient.post<ActivateUserResponse>(
    `/users/${userId}/activate`,
    data
  )
  return response.data
}

export const deactivateUser = async (
  userId: string,
  data: ActivateUserRequest
): Promise<ActivateUserResponse> => {
  const response = await httpClient.post<ActivateUserResponse>(
    `/users/${userId}/deactivate`,
    data
  )
  return response.data
}
