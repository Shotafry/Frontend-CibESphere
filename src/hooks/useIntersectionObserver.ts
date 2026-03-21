import { useState, useEffect, RefObject } from 'react'

export function useIntersectionObserver(
  ref: RefObject<Element | null>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false)

  // Use stringified options to prevent infinite loops from inline object creation
  const optionsStr = JSON.stringify(options)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const parsedOptions = JSON.parse(optionsStr)

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true)
        observer.unobserve(element) // Solo observamos una vez
      }
    }, parsedOptions)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [ref, optionsStr])

  return isIntersecting
}
