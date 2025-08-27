'use client'

import * as React from 'react'
import { 
  Settings, 
  Eye, 
  EyeOff, 
  Zap, 
  ZapOff, 
  Type, 
  Palette, 
  Monitor,
  Sun,
  Moon,
  RefreshCw,
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { 
  useAccessibility, 
  useSystemPreferences, 
  getTextAlternative 
} from '@/lib/accessibility'
import { 
  usePerformanceMonitor, 
  useGPUOptimization 
} from '@/lib/performance-optimized'
import { 
  applyTheme, 
  getCurrentTheme, 
  themes, 
  type Theme 
} from '@/lib/themes'
import { cn } from '@/lib/utils'

interface AccessibilityPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function AccessibilityPanel({ isOpen, onClose }: AccessibilityPanelProps) {
  const {
    highContrast,
    reducedMotion,
    largeText,
    theme,
    animationsEnabled,
    blurEffectsEnabled,
    glowEffectsEnabled,
    setHighContrast,
    setReducedMotion,
    setLargeText,
    setTheme,
    setAnimationsEnabled,
    setBlurEffectsEnabled,
    setGlowEffectsEnabled,
    resetToDefaults,
  } = useAccessibility()

  const systemPrefs = useSystemPreferences()
  const { fps, isLowEndDevice, memoryUsage } = usePerformanceMonitor()
  const { gpuTier } = useGPUOptimization()
  
  const [currentTheme, setCurrentTheme] = React.useState<Theme>(getCurrentTheme())

  // Apply theme when changed
  React.useEffect(() => {
    if (currentTheme !== theme) {
      applyTheme(currentTheme)
      setTheme(currentTheme)
    }
  }, [currentTheme, theme, setTheme])

  // Auto-detect system preferences
  React.useEffect(() => {
    if (systemPrefs.prefersReducedMotion && !reducedMotion) {
      setReducedMotion(true)
    }
    if (systemPrefs.prefersHighContrast && !highContrast) {
      setHighContrast(true)
    }
  }, [systemPrefs, reducedMotion, highContrast, setReducedMotion, setHighContrast])

  const handleThemeChange = (newTheme: Theme) => {
    setCurrentTheme(newTheme)
    applyTheme(newTheme)
  }

  const toggleSetting = (
    current: boolean, 
    setter: (value: boolean) => void,
    announcement?: string
  ) => {
    const newValue = !current
    setter(newValue)
    
    // Announce change to screen readers
    if (announcement) {
      const message = `${announcement} ${newValue ? 'enabled' : 'disabled'}`
      announceToScreenReader(message)
    }
  }

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    document.body.appendChild(announcement)
    
    setTimeout(() => document.body.removeChild(announcement), 1000)
  }

  const getPerformanceStatus = () => {
    if (isLowEndDevice) return { status: 'warning', text: 'Low-end device detected' }
    if (fps < 30) return { status: 'error', text: 'Poor performance' }
    if (fps < 50) return { status: 'warning', text: 'Moderate performance' }
    return { status: 'success', text: 'Good performance' }
  }

  const performanceStatus = getPerformanceStatus()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className={cn(
          "w-full max-w-2xl max-h-[90vh] overflow-y-auto",
          theme === 'accessibility' ? 'border-4 border-black' : ''
        )}
        role="dialog"
        aria-labelledby="accessibility-panel-title"
        aria-describedby="accessibility-panel-description"
      >
        <GlassCard variant={theme === 'neon' ? 'cyber' : 'default'}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-current/20">
            <div>
              <h2 
                id="accessibility-panel-title"
                className="text-2xl font-bold font-heading mb-1"
              >
                <Settings className="inline w-6 h-6 mr-2" />
                Accessibility & Preferences
              </h2>
              <p 
                id="accessibility-panel-description"
                className="text-sm text-current/70"
              >
                Customize your experience for comfort and accessibility
              </p>
            </div>
            
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              aria-label="Close accessibility panel"
            >
              ×
            </Button>
          </div>

          {/* Performance Status */}
          <div className="mb-6 p-4 rounded-lg bg-current/5">
            <h3 className="font-semibold mb-2 flex items-center">
              <Monitor className="w-4 h-4 mr-2" />
              System Performance
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                {performanceStatus.status === 'success' && <CheckCircle className="w-4 h-4 mr-2 text-green-500" />}
                {performanceStatus.status === 'warning' && <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />}
                {performanceStatus.status === 'error' && <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />}
                <span>{performanceStatus.text}</span>
              </div>
              
              <div>FPS: <strong>{fps}</strong></div>
              <div>GPU: <strong className="capitalize">{gpuTier}</strong></div>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              Theme Selection
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(themes).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => handleThemeChange(key as Theme)}
                  className={cn(
                    "p-4 rounded-lg border-2 text-left transition-all",
                    "hover:shadow-lg focus:ring-2 focus:ring-current/50",
                    currentTheme === key 
                      ? "border-current bg-current/10" 
                      : "border-current/20 hover:border-current/40"
                  )}
                  aria-pressed={currentTheme === key}
                >
                  <div className="font-medium mb-1">{config.name}</div>
                  <div className="text-xs text-current/70">{config.description}</div>
                  
                  {/* Theme preview dots */}
                  <div className="flex gap-1 mt-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: config.colors.primary }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: config.colors.secondary }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: config.colors.accent }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Visual Preferences */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Visual Preferences
            </h3>
            
            <div className="space-y-4">
              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">High Contrast Mode</label>
                  <p className="text-sm text-current/70">
                    Increases color contrast for better visibility
                  </p>
                </div>
                <Button
                  onClick={() => toggleSetting(highContrast, setHighContrast, 'High contrast mode')}
                  variant={highContrast ? "default" : "outline"}
                  size="sm"
                  aria-pressed={highContrast}
                >
                  {highContrast ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
              </div>

              {/* Large Text */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Large Text</label>
                  <p className="text-sm text-current/70">
                    Increases text size for better readability
                  </p>
                </div>
                <Button
                  onClick={() => toggleSetting(largeText, setLargeText, 'Large text mode')}
                  variant={largeText ? "default" : "outline"}
                  size="sm"
                  aria-pressed={largeText}
                >
                  <Type className={cn("w-4 h-4", largeText && "scale-125")} />
                </Button>
              </div>

              {/* Blur Effects */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Blur Effects</label>
                  <p className="text-sm text-current/70">
                    Glass morphism and backdrop blur effects
                  </p>
                </div>
                <Button
                  onClick={() => toggleSetting(blurEffectsEnabled, setBlurEffectsEnabled, 'Blur effects')}
                  variant={blurEffectsEnabled ? "default" : "outline"}
                  size="sm"
                  aria-pressed={blurEffectsEnabled}
                >
                  {blurEffectsEnabled ? '🌊' : '🚫'}
                </Button>
              </div>

              {/* Glow Effects */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Glow Effects</label>
                  <p className="text-sm text-current/70">
                    Neon glow and shadow effects
                  </p>
                </div>
                <Button
                  onClick={() => toggleSetting(glowEffectsEnabled, setGlowEffectsEnabled, 'Glow effects')}
                  variant={glowEffectsEnabled ? "default" : "outline"}
                  size="sm"
                  aria-pressed={glowEffectsEnabled}
                >
                  {glowEffectsEnabled ? '✨' : '🚫'}
                </Button>
              </div>
            </div>
          </div>

          {/* Motion Preferences */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Motion & Animation
            </h3>
            
            <div className="space-y-4">
              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Reduce Motion</label>
                  <p className="text-sm text-current/70">
                    Minimizes animations and transitions
                    {systemPrefs.prefersReducedMotion && (
                      <span className="block text-xs text-current/50 mt-1">
                        (Detected from system preferences)
                      </span>
                    )}
                  </p>
                </div>
                <Button
                  onClick={() => toggleSetting(reducedMotion, setReducedMotion, 'Reduced motion')}
                  variant={reducedMotion ? "default" : "outline"}
                  size="sm"
                  aria-pressed={reducedMotion}
                >
                  {reducedMotion ? <ZapOff className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                </Button>
              </div>

              {/* Animations Enabled */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Enable Animations</label>
                  <p className="text-sm text-current/70">
                    Allow decorative animations and transitions
                  </p>
                </div>
                <Button
                  onClick={() => toggleSetting(animationsEnabled, setAnimationsEnabled, 'Animations')}
                  variant={animationsEnabled ? "default" : "outline"}
                  size="sm"
                  aria-pressed={animationsEnabled}
                  disabled={reducedMotion}
                >
                  {animationsEnabled ? '🎬' : '🚫'}
                </Button>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="mb-6 p-4 rounded-lg bg-current/5">
            <h3 className="font-semibold mb-3 flex items-center">
              <Info className="w-4 h-4 mr-2" />
              System Detection
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Prefers Reduced Motion:</strong>
                <span className="ml-2">
                  {getTextAlternative(systemPrefs.prefersReducedMotion ? 'online' : 'offline')}
                </span>
              </div>
              <div>
                <strong>Prefers High Contrast:</strong>
                <span className="ml-2">
                  {getTextAlternative(systemPrefs.prefersHighContrast ? 'online' : 'offline')}
                </span>
              </div>
              <div>
                <strong>Device Type:</strong>
                <span className="ml-2 capitalize">
                  {isLowEndDevice ? 'Low-end' : 'Standard'}
                </span>
              </div>
              <div>
                <strong>Color Scheme:</strong>
                <span className="ml-2 capitalize">
                  {systemPrefs.prefersDarkMode ? 'Dark' : 'Light'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-current/20">
            <Button
              onClick={resetToDefaults}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
            
            <Button
              onClick={onClose}
              variant="default"
              className="flex-1"
            >
              Apply Changes
            </Button>
          </div>

          {/* Accessibility Notice */}
          <div className="mt-4 p-3 rounded bg-current/5 text-xs text-current/70">
            <p>
              <strong>Accessibility Notice:</strong> Changes are saved automatically. 
              For additional accessibility features, check your browser and operating system settings.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

// Hook for managing accessibility panel
export const useAccessibilityPanel = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  
  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])
  const toggle = React.useCallback(() => setIsOpen(prev => !prev), [])
  
  // Close on Escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, close])
  
  return { isOpen, open, close, toggle }
}
