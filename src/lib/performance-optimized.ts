/**
 * Performance optimization utilities for WMX TOPUP
 * Manages animations, GPU usage, and reduces reflows
 */

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useAccessibility } from './accessibility'

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memoryUsage: 0,
    renderTime: 0,
    isLowEndDevice: false,
  })

  useEffect(() => {
    // Detect low-end devices
    const isLowEnd = () => {
      if (typeof navigator === 'undefined') return false
      
      const connection = (navigator as unknown as { connection?: { effectiveType?: string } }).connection || 
                        (navigator as unknown as { mozConnection?: { effectiveType?: string } }).mozConnection || 
                        (navigator as unknown as { webkitConnection?: { effectiveType?: string } }).webkitConnection
      const memory = (performance as unknown as { memory?: { usedJSHeapSize?: number; jsHeapSizeLimit?: number } }).memory
      
      // Check for slow connection
      const slowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')
      
      // Check for low memory
      const lowMemory = memory && memory.usedJSHeapSize && memory.jsHeapSizeLimit && memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8
      
      // Check for low-end hardware (rough estimation)
      const hardwareConcurrency = navigator.hardwareConcurrency || 1
      const lowCores = hardwareConcurrency <= 2
      
      return slowConnection || lowMemory || lowCores
    }

    // FPS monitoring
    let frames = 0
    let lastTime = performance.now()
    
    const measureFPS = () => {
      frames++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime))
        
        setMetrics(prev => ({
          ...prev,
          fps,
          isLowEndDevice: isLowEnd(),
          memoryUsage: (performance as unknown as { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize || 0,
        }))
        
        frames = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(measureFPS)
    }
    
    requestAnimationFrame(measureFPS)
  }, [])

  return metrics
}

// Optimized animation controller
export const useOptimizedAnimation = (
  animationName: string,
  dependencies: unknown[] = []
) => {
  const { animationsEnabled, reducedMotion } = useAccessibility()
  const { fps, isLowEndDevice } = usePerformanceMonitor()
  
  const shouldAnimate = useMemo(() => {
    if (!animationsEnabled || reducedMotion) return false
    if (isLowEndDevice && fps < 30) return false
    return true
  }, [animationsEnabled, reducedMotion, isLowEndDevice, fps])
  
  const animationConfig = useMemo(() => {
    if (!shouldAnimate) {
      return {
        duration: '0.01ms',
        easing: 'linear',
        iterations: 1,
      }
    }
    
    // Adjust animation complexity based on performance
    const complexity = fps > 50 ? 'high' : fps > 30 ? 'medium' : 'low'
    
    return {
      duration: complexity === 'high' ? '300ms' : complexity === 'medium' ? '200ms' : '150ms',
      easing: complexity === 'high' ? 'cubic-bezier(0.4, 0, 0.2, 1)' : 'ease-out',
      iterations: complexity === 'low' ? 1 : 'infinite',
    }
  }, [shouldAnimate, fps, ...dependencies])
  
  return { shouldAnimate, animationConfig }
}

// GPU memory management
export const useGPUOptimization = () => {
  const [gpuTier, setGpuTier] = useState<'low' | 'medium' | 'high'>('medium')
  
  useEffect(() => {
    // Detect GPU capabilities
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    
    if (!gl) {
      setGpuTier('low')
      return
    }
    
    try {
      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        
        // Simple GPU tier detection based on renderer string
        if (typeof renderer === 'string') {
          if (renderer.includes('Intel') && !renderer.includes('Iris')) {
            setGpuTier('low')
          } else if (renderer.includes('GeForce') || renderer.includes('Radeon')) {
            setGpuTier('high')
          } else {
            setGpuTier('medium')
          }
        }
      }
    } catch (error) {
      console.warn('GPU detection failed:', error)
      setGpuTier('medium')
    }
  }, [])
  
  const getOptimalSettings = useCallback(() => {
    switch (gpuTier) {
      case 'low':
        return {
          maxBlurElements: 3,
          maxGlowElements: 2,
          maxParticles: 10,
          useTransform3d: false,
          simplifiedAnimations: true,
        }
      case 'medium':
        return {
          maxBlurElements: 6,
          maxGlowElements: 4,
          maxParticles: 25,
          useTransform3d: true,
          simplifiedAnimations: false,
        }
      case 'high':
        return {
          maxBlurElements: 12,
          maxGlowElements: 8,
          maxParticles: 50,
          useTransform3d: true,
          simplifiedAnimations: false,
        }
    }
  }, [gpuTier])
  
  return { gpuTier, getOptimalSettings }
}

// Layout optimization hooks
export const useLayoutOptimization = () => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [element, setElement] = useState<Element | null>(null)
  
  const observerRef = useCallback((node: Element | null) => {
    if (node) {
      setElement(node)
    }
  }, [])
  
  useEffect(() => {
    if (!element) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    )
    
    observer.observe(element)
    
    return () => observer.disconnect()
  }, [element])
  
  return { observerRef, isIntersecting }
}

// Debounced resize observer
export const useOptimizedResize = (callback: () => void, delay = 150) => {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout>()
  
  useEffect(() => {
    const handleResize = () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
      
      const timer = setTimeout(callback, delay)
      setDebounceTimer(timer)
    }
    
    window.addEventListener('resize', handleResize, { passive: true })
    
    return () => {
      window.removeEventListener('resize', handleResize)
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, [callback, delay, debounceTimer])
}

// CSS-in-JS optimization for dynamic styles
export const createOptimizedStyles = (
  baseStyles: Record<string, unknown>,
  conditions: {
    reducedMotion?: boolean
    highContrast?: boolean
    lowEndDevice?: boolean
    blurEnabled?: boolean
    glowEnabled?: boolean
  }
) => {
  const {
    reducedMotion = false,
    highContrast = false,
    lowEndDevice = false,
    blurEnabled = true,
    glowEnabled = true,
  } = conditions
  
  let optimizedStyles = { ...baseStyles }
  
  // Remove expensive effects for low-end devices
  if (lowEndDevice) {
    optimizedStyles = {
      ...optimizedStyles,
      backdropFilter: 'none',
      filter: 'none',
      boxShadow: 'none',
      transform: 'none',
    }
  }
  
  // Reduce blur effects if disabled
  if (!blurEnabled) {
    optimizedStyles = {
      ...optimizedStyles,
      backdropFilter: 'none',
      filter: typeof optimizedStyles.filter === 'string' 
        ? optimizedStyles.filter.replace(/blur\([^)]*\)/g, '') || 'none'
        : 'none',
    }
  }
  
  // Remove glow effects if disabled
  if (!glowEnabled) {
    optimizedStyles = {
      ...optimizedStyles,
      boxShadow: 'none',
      textShadow: 'none',
    }
  }
  
  // High contrast adjustments
  if (highContrast) {
    optimizedStyles = {
      ...optimizedStyles,
      opacity: Math.min(parseFloat(String(optimizedStyles.opacity || '1')), 0.9),
      backdropFilter: blurEnabled ? 'blur(2px)' : 'none',
    }
  }
  
  // Remove animations if reduced motion
  if (reducedMotion) {
    optimizedStyles = {
      ...optimizedStyles,
      animation: 'none',
      transition: 'none',
      transform: 'none',
    }
  }
  
  return optimizedStyles
}

// Bundle size optimization - lazy import utilities
export const lazyImportWithFallback = async <T,>(
  importFn: () => Promise<{ default: T }>,
  fallback: T,
  timeout = 5000
): Promise<T> => {
  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Import timeout')), timeout)
    })
    
    const result = await Promise.race([importFn(), timeoutPromise])
    return result.default
  } catch (error) {
    console.warn('Lazy import failed, using fallback:', error)
    return fallback
  }
}

// Memory cleanup utilities
export const useMemoryCleanup = () => {
  useEffect(() => {
    const cleanup = () => {
      // Force garbage collection if available (dev mode)
      if ((window as unknown as { gc?: () => void }).gc) {
        (window as unknown as { gc: () => void }).gc()
      }
      
      // Clear any lingering timers or intervals
      const highestTimeoutId = Number(setTimeout(() => {}, 0))
      for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i)
      }
      
      const highestIntervalId = Number(setInterval(() => {}, 0))
      clearInterval(highestIntervalId)
      for (let i = 0; i < highestIntervalId; i++) {
        clearInterval(i)
      }
    }
    
    // Cleanup on page visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cleanup()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Cleanup on unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      cleanup()
    }
  }, [])
}
