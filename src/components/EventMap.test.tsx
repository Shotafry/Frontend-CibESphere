import { render, screen } from '@testing-library/react'
import { EventMap } from './EventMap'
import { Event } from '../types'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'

// Mock react-leaflet
vi.mock('react-leaflet', () => {
  return {
    MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map-container">{children}</div>,
    TileLayer: () => <div data-testid="tile-layer" />,
    Marker: ({ children }: { children: React.ReactNode }) => <div data-testid="marker">{children}</div>,
    Popup: ({ children }: { children: React.ReactNode }) => <div data-testid="popup">{children}</div>,
  }
})

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}))

const mockEvent: Event = {
  id: '1',
  title: 'Test Event',
  slug: 'test-event',
  short_desc: 'Short description',
  description: 'Long description',
  start_date: '2023-10-10T10:00:00Z',
  end_date: '2023-10-10T12:00:00Z',
  is_online: false,
  venue_city: 'Madrid',
  venue_address: 'Calle Test 123',
  latitude: 40.416775,
  longitude: -3.70379,
  tags: ['tech'],
  organizer: { id: 'org1', name: 'Org 1' } as any,
  created_at: '2023-01-01',
  updated_at: '2023-01-01',
  organizer_id: 'org1',
  status: 'published'
} as unknown as Event

describe('EventMap', () => {
  it('renders without crashing and displays markers', () => {
    const events = [mockEvent]
    render(<EventMap events={events} />)

    expect(screen.getByTestId('map-container')).toBeInTheDocument()
    expect(screen.getByTestId('marker')).toBeInTheDocument()
  })

  it('does not render marker for online events without coordinates', () => {
    const onlineEvent = { ...mockEvent, id: '2', is_online: true, latitude: undefined, longitude: undefined }
    render(<EventMap events={[onlineEvent]} />)

    expect(screen.getByTestId('map-container')).toBeInTheDocument()
    expect(screen.queryByTestId('marker')).not.toBeInTheDocument()
  })
})
