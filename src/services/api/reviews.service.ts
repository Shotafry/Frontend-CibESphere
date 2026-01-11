// src/services/api/reviews.service.ts
import { httpClient } from '../httpClient'
import { Review } from '../../types'

export const getEventReviews = async (eventId: string): Promise<Review[]> => {
  try {
    const response = await httpClient.get<any>(`/events/${eventId}/reviews`)
    return response.data.reviews || response.data.data || []
  } catch (e) {
    console.warn('Reviews endpoint not ready', e)
    return []
  }
}

export const createReview = async (
  review: Omit<Review, 'id' | 'date'>
): Promise<Review> => {
  const response = await httpClient.post<Review>(
    `/events/${review.eventId}/reviews`,
    review
  )
  return response.data
}
