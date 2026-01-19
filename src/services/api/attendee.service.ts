// src/services/api/attendee.service.ts
import { httpClient } from '../httpClient'

export interface Attendee {
  id: string
  user_id: string
  user_name: string
  user_email: string
  user_slug?: string
  user_avatar?: string
  ticket_type: string
  ticket_price: number // céntimos
  is_paid: boolean
  checked_in: boolean
  check_in_at?: string
  registered_at: string
  status: string
}

export interface AttendeeListResponse {
  attendees: Attendee[]
  total: number
  page: number
  limit: number
  has_more: boolean
}

export interface CheckInResponse {
  success: boolean
  message: string
  check_in_at?: string
}

export interface ValidateTicketResponse {
  valid: boolean
  message: string
  already_used?: boolean
  event_title?: string
  user_name?: string
  ticket_type?: string
  checked_in?: boolean
}

// Get attendees for an event (paginated)
export const getEventAttendees = async (
  eventId: string,
  page = 1,
  limit = 15
): Promise<AttendeeListResponse> => {
  // httpClient already unwraps { success, data } to just data
  const response = await httpClient.get<AttendeeListResponse>(
    `/events/${eventId}/attendees?page=${page}&limit=${limit}`
  )
  return response.data
}

// Manual check-in
export const checkInAttendee = async (
  eventId: string,
  registrationId: string
): Promise<CheckInResponse> => {
  const response = await httpClient.post<CheckInResponse>(
    `/events/${eventId}/attendees/${registrationId}/checkin`
  )
  return response.data
}

// Validate QR ticket
export const validateTicket = async (
  qrToken: string,
  autoCheckIn = true
): Promise<ValidateTicketResponse> => {
  const response = await httpClient.post<ValidateTicketResponse>(
    `/tickets/validate?check_in=${autoCheckIn}`,
    { qr_token: qrToken }
  )
  return response.data
}

// Export as object for convenience
export const attendeeService = {
  getEventAttendees,
  checkInAttendee,
  validateTicket
}
