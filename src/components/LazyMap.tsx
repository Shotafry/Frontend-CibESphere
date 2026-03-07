import React, { Suspense, lazy, useRef } from 'react'
import { Skeleton, Box } from '@mui/material'
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
  const entry = useIntersectionObserver(ref, { freezeOnceVisible: true, rootMargin: '200px' })
  const isVisible = !!entry?.isIntersecting

  return (
    <Box ref={ref} sx={{ minHeight: 300, height: '100%' }}>
      {isVisible ? (
        <Suspense fallback={<MapSkeleton />}>
          <SingleEventMap event={event} />
        </Suspense>
      ) : (
        <MapSkeleton />
      )}
    </Box>
  )
}

// Wrapper for EventMap
interface LazyEventMapProps {
  events: Event[]
}

export const LazyEventMap: React.FC<LazyEventMapProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null)
  const entry = useIntersectionObserver(ref, { freezeOnceVisible: true, rootMargin: '200px' })
  const isVisible = !!entry?.isIntersecting

  return (
    <Box ref={ref} sx={{ minHeight: 300, height: '100%' }}>
      {isVisible ? (
        <Suspense fallback={<MapSkeleton />}>
          <EventMap {...props} />
        </Suspense>
      ) : (
        <MapSkeleton />
      )}
    </Box>
  )
}
