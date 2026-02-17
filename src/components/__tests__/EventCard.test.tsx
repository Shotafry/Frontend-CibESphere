import { render, screen } from '@testing-library/react'
import { EventCard } from '../EventCard'
import { Event } from '../../types'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import '@testing-library/jest-dom'

// Mock useAuth
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    refreshUserData: vi.fn(),
  }),
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children }: any) => <div>{children}</div>,
  },
}))

const mockEvent: Event = {
  id: '1',
  slug: 'test-event',
  title: 'Test Event',
  short_desc: 'Short description',
  description: 'Full description',
  type: 'conference',
  category: 'security',
  level: 'beginner',
  organization_id: 'org1',
  start_date: '2023-01-01T10:00:00Z',
  end_date: '2023-01-01T12:00:00Z',
  timezone: 'UTC',
  is_online: true,
  current_attendees: 10,
  is_free: true,
  currency: 'EUR',
  image_url: 'https://example.com/image.jpg',
  card_image_url: 'https://example.com/card.jpg',
  status: 'published',
  is_public: true,
  is_featured: false,
  tags: ['tag1'],
  created_at: '2023-01-01T09:00:00Z',
  updated_at: '2023-01-01T09:00:00Z',
} as Event

describe('EventCard Performance', () => {
  it('renders image with loading="lazy" and decoding="async"', () => {
    render(
      <BrowserRouter>
        <EventCard event={mockEvent} />
      </BrowserRouter>
    )

    const img = screen.getByAltText(/Imagen de Test Event/i)
    expect(img).toHaveAttribute('loading', 'lazy')
    expect(img).toHaveAttribute('decoding', 'async')
  })
})
