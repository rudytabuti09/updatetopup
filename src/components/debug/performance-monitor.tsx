'use client'

import * as React from "react"
import { useFPSMonitor, useDevicePerformance, usePrefersReducedMotion } from "@/lib/performance"
import { cn } from "@/lib/utils"

export function PerformanceMonitor() {
  const fps = useFPSMonitor()
  const devicePerformance = useDevicePerformance()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [isVisible, setIsVisible] = React.useState(false)

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null

  const getFPSColor = (fps: number) => {
    if (fps >= 50) return 'text-green-400'
    if (fps >= 30) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getPerformanceColor = (perf: string) => {
    switch (perf) {
      case 'high': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 left-4 z-[9999] w-12 h-12 bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-sm border border-neon-magenta/30 hover:border-neon-magenta/50 transition-colors"
        title="Toggle Performance Monitor"
      >
        📊
      </button>

      {/* Performance Panel */}
      {isVisible && (
        <div className="fixed bottom-20 left-4 z-[9998] bg-black/90 backdrop-blur-lg text-white text-xs p-4 rounded-lg border border-neon-magenta/30 font-mono space-y-2 min-w-[200px]">
          <div className="text-neon-magenta font-bold mb-2">⚡ PERFORMANCE MONITOR</div>
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>FPS:</span>
              <span className={cn('font-bold', getFPSColor(fps))}>{fps}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Device:</span>
              <span className={cn('font-bold uppercase', getPerformanceColor(devicePerformance))}>{devicePerformance}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Reduced Motion:</span>
              <span className={cn('font-bold', prefersReducedMotion ? 'text-yellow-400' : 'text-green-400')}>
                {prefersReducedMotion ? 'ON' : 'OFF'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>CPU Cores:</span>
              <span className="font-bold text-cyan-400">{navigator.hardwareConcurrency || 'N/A'}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Memory:</span>
              <span className="font-bold text-cyan-400">{(navigator as unknown as { deviceMemory?: number }).deviceMemory || 'N/A'}GB</span>
            </div>
            
            <div className="flex justify-between">
              <span>Connection:</span>
              <span className="font-bold text-cyan-400">
                {(navigator as unknown as { connection?: { effectiveType?: string } }).connection?.effectiveType || 'N/A'}
              </span>
            </div>
          </div>
          
          <div className="border-t border-gray-600 pt-2 mt-2 text-gray-400">
            Press Esc to close
          </div>
        </div>
      )}
    </>
  )
}

// Keyboard shortcut to toggle
export function PerformanceMonitorKeyboard() {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const monitor = document.querySelector('[data-performance-monitor]') as HTMLElement
        if (monitor) monitor.click()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return null
}
