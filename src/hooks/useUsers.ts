import { useState, useCallback, useEffect } from 'react'
import { User, Role } from '../types'
import * as apiService from '../services/apiService'
import { useDebounce } from './useDebounce'

interface UseUsersReturn {
  users: User[]
  loading: boolean
  total: number

  // Filters
  page: number
  limit: number
  search: string
  roleFilter: string
  statusFilter: string
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  setSearch: (search: string) => void
  setRoleFilter: (role: string) => void
  setStatusFilter: (status: string) => void

  // Actions
  refreshUsers: () => Promise<void>
  changeUserRole: (userId: string, newRole: Role) => Promise<void>
  toggleUserStatus: (user: User) => Promise<void>
  deleteUser: (userId: string) => Promise<void>
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const [debouncedSearch] = useDebounce(search, 500)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const resp = await apiService.getAllUsers({
        page: page + 1,
        limit,
        search: debouncedSearch,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        is_active:
          statusFilter === 'active'
            ? true
            : statusFilter === 'suspended'
              ? false
              : undefined
      })
      setUsers(resp.users)
      setTotal(resp.pagination?.total_items || 0)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }, [page, limit, debouncedSearch, roleFilter, statusFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const changeUserRole = async (userId: string, newRole: Role) => {
    await apiService.changeUserRole(userId, {
      role: newRole,
      reason: 'Admin Panel Update'
    })
    await fetchUsers()
  }

  const toggleUserStatus = async (user: User) => {
    const isActive = user.is_active
    if (isActive) {
      await apiService.deactivateUser(user.id, {
        reason: 'Admin Action',
        is_active: false
      })
    } else {
      await apiService.activateUser(user.id, {
        reason: 'Admin Action',
        is_active: true
      })
    }
    await fetchUsers()
  }

  const deleteUser = async (userId: string) => {
    await apiService.deleteUser(userId)
    await fetchUsers()
  }

  return {
    users,
    loading,
    total,
    page,
    limit,
    search,
    roleFilter,
    statusFilter,
    setPage,
    setLimit,
    setSearch,
    setRoleFilter,
    setStatusFilter,
    refreshUsers: fetchUsers,
    changeUserRole,
    toggleUserStatus,
    deleteUser
  }
}
