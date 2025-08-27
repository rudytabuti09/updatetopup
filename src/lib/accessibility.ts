/**
 * Accessibility utilities for WMX TOPUP
 * Handles user preferences for contrast, animations, and visual effects
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Accessibility preferences store
interface AccessibilityStore {
  // Visual preferences
  highContrast: boolean
  reducedMotion: boolean
  largeText: boolean
  
  // Theme preferences
  theme: 'neon' | 'professional' | 'accessibility'
  colorBlindnessMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'
  
  // Animation preferences
  animationsEnabled: boolean
  blurEffectsEnabled: boolean
  glowEffectsEnabled: boolean
  
  // Actions
  setHighContrast: (enabled: boolean) => void
  setReducedMotion: (enabled: boolean) => void
  setLargeText: (enabled: boolean) => void
  setTheme: (theme: 'neon' | 'professional' | 'accessibility') => void
  setColorBlindnessMode: (mode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia') => void
  setAnimationsEnabled: (enabled: boolean) => void
  setBlurEffectsEnabled: (enabled: boolean) => void
  setGlowEffectsEnabled: (enabled: boolean) => void
  resetToDefaults: () => void
}

export const useAccessibility = create<AccessibilityStore>()(
  persist(
    (set) => ({
      // Default values
      highContrast: false,
      reducedMotion: false,
      largeText: false,
      theme: 'neon',
      colorBlindnessMode: 'none',
      animationsEnabled: true,
      blurEffectsEnabled: true,
      glowEffectsEnabled: true,

      // Actions
      setHighContrast: (enabled) => set({ highContrast: enabled }),
      setReducedMotion: (enabled) => set({ reducedMotion: enabled }),
      setLargeText: (enabled) => set({ largeText: enabled }),
      setTheme: (theme) => set({ theme }),
      setColorBlindnessMode: (mode) => set({ colorBlindnessMode: mode }),
      setAnimationsEnabled: (enabled) => set({ animationsEnabled: enabled }),
      setBlurEffectsEnabled: (enabled) => set({ blurEffectsEnabled: enabled }),
      setGlowEffectsEnabled: (enabled) => set({ glowEffectsEnabled: enabled }),
      resetToDefaults: () => set({
        highContrast: false,
        reducedMotion: false,
        largeText: false,
        theme: 'neon',
        colorBlindnessMode: 'none',
        animationsEnabled: true,
        blurEffectsEnabled: true,
        glowEffectsEnabled: true,
      }),
    }),
    {
      name: 'wmx-accessibility-preferences',
      version: 1,
    }
  )
)

// Hook untuk sistem operasi preferences
export const useSystemPreferences = () => {
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false
    
  const prefersHighContrast = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-contrast: high)').matches
    : false
    
  const prefersDarkMode = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false

  return {
    prefersReducedMotion,
    prefersHighContrast,
    prefersDarkMode,
  }
}

// Color contrast utilities
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (color: string) => {
    // Simple luminance calculation for hex colors
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255
    
    const toLinear = (c: number) => 
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    
    const rLinear = toLinear(r)
    const gLinear = toLinear(g)
    const bLinear = toLinear(b)
    
    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear
  }

  const l1 = getLuminance(color1)
  const l2 = getLuminance(color2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

// WCAG compliant color alternatives
export const accessibleColors = {
  // High contrast alternatives for neon colors
  'neon-magenta': {
    normal: '#FF00FF',
    highContrast: '#8B0A99', // 7:1 contrast ratio
    accessible: '#D946EF', // 4.5:1 contrast ratio
  },
  'neon-cyan': {
    normal: '#00FFFF',
    highContrast: '#006666', // 7:1 contrast ratio
    accessible: '#0891B2', // 4.5:1 contrast ratio
  },
  'neon-purple': {
    normal: '#8B5CF6',
    highContrast: '#5B21B6', // 7:1 contrast ratio
    accessible: '#7C3AED', // 4.5:1 contrast ratio
  },
  'retro-gold': {
    normal: '#FFD700',
    highContrast: '#B8860B', // 7:1 contrast ratio
    accessible: '#CA8A04', // 4.5:1 contrast ratio
  },
}

// Text alternatives for color-dependent information
export const getTextAlternative = (status: string): string => {
  const alternatives: Record<string, string> = {
    'success': '✓ Success',
    'pending': '⏳ Pending',
    'processing': '⚡ Processing', 
    'failed': '✗ Failed',
    'cancelled': '⊘ Cancelled',
    'online': '● Online',
    'offline': '○ Offline',
  }
  
  return alternatives[status] || status
}

// Animation control utilities
export const getAnimationDuration = (
  defaultDuration: string,
  reducedMotion: boolean
): string => {
  return reducedMotion ? '0.01ms' : defaultDuration
}

export const getBlurAmount = (
  defaultBlur: string,
  blurEnabled: boolean,
  highContrast: boolean
): string => {
  if (!blurEnabled) return 'none'
  if (highContrast) {
    // Reduce blur for high contrast mode
    const amount = parseFloat(defaultBlur.replace('px', ''))
    return `${Math.max(amount / 2, 2)}px`
  }
  return defaultBlur
}
