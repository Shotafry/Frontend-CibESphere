import React, { Suspense, lazy } from 'react'
import { Skeleton, Box } from '@mui/material'
import { Event } from '../types'

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
}) => (
  <Suspense fallback={<MapSkeleton />}>
    <SingleEventMap event={event} />
  </Suspense>
)

// Wrapper for EventMap
interface LazyEventMapProps {
  events: Event[]
}

export const LazyEventMap: React.FC<LazyEventMapProps> = (props) => (
  <Suspense fallback={<MapSkeleton />}>
    <EventMap {...props} />
  </Suspense>
)
