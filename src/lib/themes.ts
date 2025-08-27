/**
 * Theme system for WMX TOPUP
 * Provides Neon, Professional, and Accessibility themes
 */

export type Theme = 'neon' | 'professional' | 'accessibility'

export interface ThemeConfig {
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: {
      primary: string
      secondary: string
      muted: string
    }
    status: {
      success: string
      warning: string
      error: string
      info: string
    }
    border: string
    shadow: string
  }
  typography: {
    fontFamily: {
      heading: string
      body: string
      mono: string
    }
    scale: {
      xs: string
      sm: string
      base: string
      lg: string
      xl: string
      '2xl': string
      '3xl': string
    }
  }
  effects: {
    blur: boolean
    glow: boolean
    animations: boolean
    gradients: boolean
    shadows: boolean
  }
  accessibility: {
    contrastRatio: number
    focusVisible: boolean
    motionSafe: boolean
  }
}

// Neon Gaming Theme (Original)
export const neonTheme: ThemeConfig = {
  name: 'Neon Gaming',
  description: 'Futuristic cyberpunk aesthetic for gaming enthusiasts',
  colors: {
    primary: '#FF00FF',
    secondary: '#00FFFF', 
    accent: '#FFD700',
    background: '#F8F9FE',
    surface: '#FFFFFF',
    text: {
      primary: '#1A1A2E',
      secondary: '#6B7280',
      muted: '#9CA3AF',
    },
    status: {
      success: '#00FF88',
      warning: '#FFD700',
      error: '#FF4444',
      info: '#00FFFF',
    },
    border: '#E5E7EB',
    shadow: 'rgba(255, 0, 255, 0.15)',
  },
  typography: {
    fontFamily: {
      heading: "'Orbitron', 'Oxanium', system-ui, sans-serif",
      body: "'Inter', system-ui, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
    scale: {
      xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
      sm: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
      base: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
      lg: 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
      xl: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
      '2xl': 'clamp(1.5rem, 1.3rem + 1vw, 2rem)',
      '3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.5rem)',
    },
  },
  effects: {
    blur: true,
    glow: true,
    animations: true,
    gradients: true,
    shadows: true,
  },
  accessibility: {
    contrastRatio: 4.5,
    focusVisible: true,
    motionSafe: false,
  },
}

// Professional Business Theme
export const professionalTheme: ThemeConfig = {
  name: 'Professional',
  description: 'Clean, corporate-friendly design for business environments',
  colors: {
    primary: '#2563EB', // Blue 600
    secondary: '#64748B', // Slate 500
    accent: '#059669', // Emerald 600
    background: '#FFFFFF',
    surface: '#F8FAFC', // Slate 50
    text: {
      primary: '#0F172A', // Slate 900
      secondary: '#334155', // Slate 700
      muted: '#64748B', // Slate 500
    },
    status: {
      success: '#16A34A', // Green 600
      warning: '#D97706', // Amber 600
      error: '#DC2626', // Red 600
      info: '#2563EB', // Blue 600
    },
    border: '#E2E8F0', // Slate 200
    shadow: 'rgba(15, 23, 42, 0.08)', // Slate 900 with opacity
  },
  typography: {
    fontFamily: {
      heading: "'Inter', system-ui, sans-serif",
      body: "'Inter', system-ui, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
    scale: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
  },
  effects: {
    blur: false,
    glow: false,
    animations: false,
    gradients: false,
    shadows: true,
  },
  accessibility: {
    contrastRatio: 7,
    focusVisible: true,
    motionSafe: true,
  },
}

// High Accessibility Theme
export const accessibilityTheme: ThemeConfig = {
  name: 'High Accessibility',
  description: 'Maximum accessibility with high contrast and clear typography',
  colors: {
    primary: '#000000',
    secondary: '#1F2937', // Gray 800
    accent: '#1F2937', // Gray 800
    background: '#FFFFFF',
    surface: '#F9FAFB', // Gray 50
    text: {
      primary: '#000000',
      secondary: '#1F2937', // Gray 800
      muted: '#374151', // Gray 700
    },
    status: {
      success: '#059669', // Emerald 600 (WCAG AA)
      warning: '#D97706', // Amber 600 (WCAG AA)
      error: '#DC2626', // Red 600 (WCAG AA)
      info: '#2563EB', // Blue 600 (WCAG AA)
    },
    border: '#000000',
    shadow: 'rgba(0, 0, 0, 0.25)',
  },
  typography: {
    fontFamily: {
      heading: "'Inter', system-ui, sans-serif",
      body: "'Inter', system-ui, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
    scale: {
      xs: '0.875rem', // Larger base sizes
      sm: '1rem',
      base: '1.125rem',
      lg: '1.25rem',
      xl: '1.375rem',
      '2xl': '1.625rem',
      '3xl': '2rem',
    },
  },
  effects: {
    blur: false,
    glow: false,
    animations: false,
    gradients: false,
    shadows: false,
  },
  accessibility: {
    contrastRatio: 21, // Maximum contrast
    focusVisible: true,
    motionSafe: true,
  },
}

// Theme configurations
export const themes: Record<Theme, ThemeConfig> = {
  neon: neonTheme,
  professional: professionalTheme,
  accessibility: accessibilityTheme,
}

// CSS custom properties generator
export const generateCSSProperties = (theme: ThemeConfig): Record<string, string> => {
  return {
    // Colors
    '--color-primary': theme.colors.primary,
    '--color-secondary': theme.colors.secondary,
    '--color-accent': theme.colors.accent,
    '--color-background': theme.colors.background,
    '--color-surface': theme.colors.surface,
    '--color-text-primary': theme.colors.text.primary,
    '--color-text-secondary': theme.colors.text.secondary,
    '--color-text-muted': theme.colors.text.muted,
    '--color-success': theme.colors.status.success,
    '--color-warning': theme.colors.status.warning,
    '--color-error': theme.colors.status.error,
    '--color-info': theme.colors.status.info,
    '--color-border': theme.colors.border,
    '--color-shadow': theme.colors.shadow,

    // Typography
    '--font-heading': theme.typography.fontFamily.heading,
    '--font-body': theme.typography.fontFamily.body,
    '--font-mono': theme.typography.fontFamily.mono,
    '--text-xs': theme.typography.scale.xs,
    '--text-sm': theme.typography.scale.sm,
    '--text-base': theme.typography.scale.base,
    '--text-lg': theme.typography.scale.lg,
    '--text-xl': theme.typography.scale.xl,
    '--text-2xl': theme.typography.scale['2xl'],
    '--text-3xl': theme.typography.scale['3xl'],

    // Effects
    '--blur-enabled': theme.effects.blur ? '1' : '0',
    '--glow-enabled': theme.effects.glow ? '1' : '0',
    '--animations-enabled': theme.effects.animations ? '1' : '0',
    '--gradients-enabled': theme.effects.gradients ? '1' : '0',
    '--shadows-enabled': theme.effects.shadows ? '1' : '0',

    // Accessibility
    '--contrast-ratio': theme.accessibility.contrastRatio.toString(),
    '--focus-visible': theme.accessibility.focusVisible ? '1' : '0',
    '--motion-safe': theme.accessibility.motionSafe ? '1' : '0',
  }
}

// Apply theme to document
export const applyTheme = (theme: Theme) => {
  const config = themes[theme]
  const properties = generateCSSProperties(config)
  
  // Apply CSS custom properties to root
  const root = document.documentElement
  Object.entries(properties).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })
  
  // Add theme class to body
  document.body.classList.remove('theme-neon', 'theme-professional', 'theme-accessibility')
  document.body.classList.add(`theme-${theme}`)
  
  // Store theme preference
  localStorage.setItem('wmx-theme', theme)
}

// Get theme from localStorage or default to neon
export const getCurrentTheme = (): Theme => {
  if (typeof window === 'undefined') return 'neon'
  const stored = localStorage.getItem('wmx-theme') as Theme
  return stored && themes[stored] ? stored : 'neon'
}

// Theme-aware component utilities
export const getThemeAwareClasses = (
  theme: Theme,
  baseClasses: string,
  variants: Partial<Record<Theme, string>> = {}
): string => {
  const themeClasses = variants[theme] || ''
  return `${baseClasses} ${themeClasses}`.trim()
}

// Generate button classes based on theme
export const getButtonClasses = (
  theme: Theme,
  variant: 'primary' | 'secondary' | 'outline' = 'primary'
): string => {
  const config = themes[theme]
  
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  switch (theme) {
    case 'neon':
      switch (variant) {
        case 'primary':
          return `${baseClasses} bg-gradient-to-r from-neon-magenta to-neon-cyan text-white hover:scale-105 hover:shadow-glow-magenta font-heading uppercase tracking-wider`
        case 'secondary':
          return `${baseClasses} bg-gradient-to-r from-neon-purple to-neon-pink text-white hover:scale-105 hover:shadow-glow-cyan font-retro`
        case 'outline':
          return `${baseClasses} border-2 border-neon-magenta bg-white/80 backdrop-blur-sm text-neon-magenta hover:bg-neon-magenta hover:text-white`
      }
      break
    case 'professional':
      switch (variant) {
        case 'primary':
          return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`
        case 'secondary':
          return `${baseClasses} bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-500`
        case 'outline':
          return `${baseClasses} border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500`
      }
      break
    case 'accessibility':
      switch (variant) {
        case 'primary':
          return `${baseClasses} bg-black text-white border-2 border-black hover:bg-gray-800 focus:ring-black text-lg font-bold`
        case 'secondary':
          return `${baseClasses} bg-gray-800 text-white border-2 border-gray-800 hover:bg-gray-700 focus:ring-gray-800 text-lg font-bold`
        case 'outline':
          return `${baseClasses} border-2 border-black text-black hover:bg-black hover:text-white focus:ring-black text-lg font-bold`
      }
      break
  }
  
  return baseClasses
}

// Generate card classes based on theme
export const getCardClasses = (theme: Theme): string => {
  const baseClasses = 'p-6 rounded-lg border transition-all duration-200'
  
  switch (theme) {
    case 'neon':
      return `${baseClasses} glass-card backdrop-blur-xl bg-white/95 border-neon-magenta/10 shadow-glow-magenta hover:border-neon-magenta/30`
    case 'professional':
      return `${baseClasses} bg-white border-slate-200 shadow-sm hover:shadow-md`
    case 'accessibility':
      return `${baseClasses} bg-white border-2 border-black shadow-lg hover:shadow-xl`
  }
}

// Generate status indicator classes
export const getStatusClasses = (
  theme: Theme,
  status: 'success' | 'warning' | 'error' | 'info'
): string => {
  const config = themes[theme]
  const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider'
  
  const statusColor = config.colors.status[status]
  
  switch (theme) {
    case 'neon':
      return `${baseClasses} bg-${status === 'success' ? 'green' : status === 'warning' ? 'yellow' : status === 'error' ? 'red' : 'blue'}-500/20 text-${status === 'success' ? 'green' : status === 'warning' ? 'yellow' : status === 'error' ? 'red' : 'blue'}-400 border border-${status === 'success' ? 'green' : status === 'warning' ? 'yellow' : status === 'error' ? 'red' : 'blue'}-500/30`
    case 'professional':
    case 'accessibility':
      return `${baseClasses} bg-${status === 'success' ? 'green' : status === 'warning' ? 'amber' : status === 'error' ? 'red' : 'blue'}-100 text-${status === 'success' ? 'green' : status === 'warning' ? 'amber' : status === 'error' ? 'red' : 'blue'}-800 border border-${status === 'success' ? 'green' : status === 'warning' ? 'amber' : status === 'error' ? 'red' : 'blue'}-200`
  }
}
