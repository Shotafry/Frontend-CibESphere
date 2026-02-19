import { useEffect, useState, RefObject } from 'react'

export function useIntersectionObserver(
  ref: RefObject<Element | null>,
  { threshold = 0, root = null, rootMargin = '0px' }: IntersectionObserverInit = {}
): boolean {
  const [hasIntersected, setHasIntersected] = useState(false)

  useEffect(() => {
    if (hasIntersected || !ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasIntersected(true)
          observer.disconnect()
        }
      },
      { threshold, root, rootMargin }
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [ref, hasIntersected, threshold, root, rootMargin])

  return hasIntersected
}
