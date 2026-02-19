import React, { Suspense, lazy, useRef } from 'react'
import { Skeleton } from '@mui/material'
import { Event } from '../types'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

// Lazy imports
const SingleEventMap = lazy(() =>
  import('./SingleEventMap').then((module) => ({
    default: module.SingleEventMap
  }))
)
const EventMap = lazy(() =>
  import('./EventMap').then((module) => ({ default: module.EventMap }))
)

// Skeleton Fallback
const MapSkeleton = () => (
  <Skeleton
    variant='rectangular'
    height='100%'
    sx={{ borderRadius: 2, minHeight: 300 }}
  />
)

// Wrapper for SingleEventMap
interface LazySingleEventMapProps {
  event: Event
}

export const LazySingleEventMap: React.FC<LazySingleEventMapProps> = ({
  event
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(ref, { rootMargin: '200px' })

  return (
    <div ref={ref} style={{ height: '100%', minHeight: '300px' }}>
      {isVisible ? (
        <Suspense fallback={<MapSkeleton />}>
          <SingleEventMap event={event} />
        </Suspense>
      ) : (
        <MapSkeleton />
      )}
    </div>
  )
}

// Wrapper for EventMap
interface LazyEventMapProps {
  events: Event[]
}

export const LazyEventMap: React.FC<LazyEventMapProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(ref, { rootMargin: '200px' })

  return (
    <div ref={ref} style={{ height: '100%', minHeight: '300px' }}>
      {isVisible ? (
        <Suspense fallback={<MapSkeleton />}>
          <EventMap {...props} />
        </Suspense>
      ) : (
        <MapSkeleton />
      )}
    </div>
  )
}
