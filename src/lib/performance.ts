// Performance utilities for smooth UI/UX
import { useEffect, useRef, useState } from 'react'

// Debounce hook for performance optimization
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Throttle hook for scroll events and animations
export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastExecuted = useRef<number>(Date.now())

  useEffect(() => {
    if (Date.now() >= lastExecuted.current + interval) {
      lastExecuted.current = Date.now()
      setThrottledValue(value)
    } else {
      const timerId = setTimeout(() => {
        lastExecuted.current = Date.now()
        setThrottledValue(value)
      }, interval)

      return () => clearTimeout(timerId)
    }
  }, [value, interval])

  return throttledValue
}

// Intersection Observer hook for lazy loading animations
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  {
    threshold = 0.1,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
  }: {
    threshold?: number
    root?: Element | null
    rootMargin?: string
    freezeOnceVisible?: boolean
  } = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false)

  useEffect(() => {
    const element = elementRef?.current

    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting
        if (!freezeOnceVisible || !isIntersecting) {
          setIsIntersecting(isElementIntersecting)
        }
      },
      { threshold, root, rootMargin }
    )

    observer.observe(element)

    return () => observer.unobserve(element)
  }, [elementRef, threshold, root, rootMargin, freezeOnceVisible, isIntersecting])

  return isIntersecting
}

// Prefers reduced motion hook
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// Performance optimized image loading
export function useImagePreload(src: string): boolean {
  const [loaded, setLoaded] = useState<boolean>(false)

  useEffect(() => {
    const img = new Image()
    img.onload = () => setLoaded(true)
    img.onerror = () => setLoaded(false)
    img.src = src
  }, [src])

  return loaded
}

// Optimized scroll position hook
export function useScrollPosition(): number {
  const [scrollPosition, setScrollPosition] = useState<number>(0)

  useEffect(() => {
    let ticking = false

    const updateScrollPosition = () => {
      setScrollPosition(window.pageYOffset)
      ticking = false
    }

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition)
        ticking = true
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true })

    return () => window.removeEventListener('scroll', requestTick)
  }, [])

  return scrollPosition
}

// FPS Monitor for development
export function useFPSMonitor(): number {
  const [fps, setFps] = useState<number>(60)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    let frames = 0
    let lastTime = performance.now()

    const measureFPS = () => {
      frames++
      const currentTime = performance.now()

      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frames * 1000) / (currentTime - lastTime)))
        frames = 0
        lastTime = currentTime
      }

      requestAnimationFrame(measureFPS)
    }

    const animationId = requestAnimationFrame(measureFPS)

    return () => cancelAnimationFrame(animationId)
  }, [])

  return fps
}

// Memory-efficient state management
export function useOptimizedState<T>(
  initialState: T,
  isEqual: (a: T, b: T) => boolean = (a, b) => a === b
): [T, (newState: T) => void] {
  const [state, setState] = useState<T>(initialState)

  const optimizedSetState = (newState: T) => {
    setState(currentState => {
      if (isEqual(currentState, newState)) {
        return currentState
      }
      return newState
    })
  }

  return [state, optimizedSetState]
}

// Device performance detection
export function useDevicePerformance(): 'high' | 'medium' | 'low' {
  const [performance, setPerformance] = useState<'high' | 'medium' | 'low'>('medium')

  useEffect(() => {
    // Check device capabilities
    const cores = navigator.hardwareConcurrency || 4
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4
    const connection = (navigator as unknown as { connection?: { effectiveType?: string } }).connection

    let score = 0

    // CPU cores
    if (cores >= 8) score += 3
    else if (cores >= 4) score += 2
    else score += 1

    // RAM
    if (memory >= 8) score += 3
    else if (memory >= 4) score += 2
    else score += 1

    // Network
    if (connection) {
      if (connection.effectiveType === '4g') score += 2
      else if (connection.effectiveType === '3g') score += 1
    } else {
      score += 1
    }

    // Set performance level
    if (score >= 7) setPerformance('high')
    else if (score >= 5) setPerformance('medium')
    else setPerformance('low')
  }, [])

  return performance
}
