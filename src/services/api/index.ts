// src/services/api/index.ts
// Re-exporta todos los servicios por dominio

export * from './auth.service'
export * from './users.service'
export * from './events.service'
export * from './organizations.service'
export * from './admin.service'
export * from './notifications.service'
export * from './reviews.service'

// v0.4.0 - Social & Notifications
// Exports selectivos para evitar conflicto con PaginatedResponse
export {
  followOrganization,
  unfollowOrganization,
  isFollowingOrganization,
  getOrganizationFollowers,
  getFollowingOrganizations,
  toggleFollowOrganization,
  type FollowerInfo,
  type FollowingOrganization
} from './subscriptions.service'

export {
  requestConnection,
  isConnectedWith,
  getPendingRequests,
  acceptConnection,
  rejectConnection,
  getConnections,
  getContactInfo,
  type ConnectionRequest,
  type Connection,
  type ContactInfo
} from './connections.service'
