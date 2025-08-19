/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)', // gray-800
        input: 'var(--color-input)', // gray-800
        ring: 'var(--color-ring)', // cyan-400
        background: 'var(--color-background)', // black
        foreground: 'var(--color-foreground)', // white
        primary: {
          DEFAULT: 'var(--color-primary)', // cyan-400
          foreground: 'var(--color-primary-foreground)' // black
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', // violet-500
          foreground: 'var(--color-secondary-foreground)' // white
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', // red-500
          foreground: 'var(--color-destructive-foreground)' // white
        },
        muted: {
          DEFAULT: 'var(--color-muted)', // gray-800
          foreground: 'var(--color-muted-foreground)' // gray-400
        },
        accent: {
          DEFAULT: 'var(--color-accent)', // violet-500
          foreground: 'var(--color-accent-foreground)' // white
        },
        popover: {
          DEFAULT: 'var(--color-popover)', // gray-900
          foreground: 'var(--color-popover-foreground)' // white
        },
        card: {
          DEFAULT: 'var(--color-card)', // gray-900
          foreground: 'var(--color-card-foreground)' // white
        },
        success: {
          DEFAULT: 'var(--color-success)', // emerald-500
          foreground: 'var(--color-success-foreground)' // white
        },
        warning: {
          DEFAULT: 'var(--color-warning)', // amber-500
          foreground: 'var(--color-warning-foreground)' // black
        },
        error: {
          DEFAULT: 'var(--color-error)', // red-500
          foreground: 'var(--color-error-foreground)' // white
        },
        // Gaming Specific Colors
        'neon-blue': 'var(--color-neon-blue)', // cyan-400
        'neon-purple': 'var(--color-neon-purple)', // violet-500
        'gaming-gold': 'var(--color-gaming-gold)', // yellow-400
        'surface': 'var(--color-surface)', // gray-800
        'text-secondary': 'var(--color-text-secondary)' // gray-400
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'gaming': ['Poppins', 'system-ui', 'sans-serif'],
        'accent': ['Manrope', 'system-ui', 'sans-serif']
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading': ['2rem', { lineHeight: '1.3' }],
        'subheading': ['1.5rem', { lineHeight: '1.4' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'caption': ['0.875rem', { lineHeight: '1.5' }],
        'micro': ['0.75rem', { lineHeight: '1.4' }]
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem'
      },
      borderRadius: {
        'gaming': '0.75rem',
        'card': '0.5rem'
      },
      boxShadow: {
        'gaming': '0 4px 20px rgba(0, 212, 255, 0.1)',
        'gaming-lg': '0 8px 40px rgba(0, 0, 0, 0.3)',
        'neon-blue': '0 0 20px rgba(0, 212, 255, 0.4)',
        'neon-purple': '0 0 20px rgba(139, 92, 246, 0.4)',
        'neon-glow': '0 0 20px rgba(0, 212, 255, 0.4), 0 0 40px rgba(0, 212, 255, 0.2)',
        'neon-glow-purple': '0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)'
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s infinite',
        'achievement-bounce': 'achievement-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)'
          },
          '50%': {
            boxShadow: '0 0 30px rgba(0, 212, 255, 0.6), 0 0 40px rgba(0, 212, 255, 0.3)'
          }
        },
        'achievement-bounce': {
          '0%': {
            transform: 'scale(0.8)',
            opacity: '0'
          },
          '50%': {
            transform: 'scale(1.1)'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1'
          }
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px)'
          },
          '50%': {
            transform: 'translateY(-10px)'
          }
        },
        'glow': {
          '0%': {
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)'
          },
          '100%': {
            boxShadow: '0 0 30px rgba(0, 212, 255, 0.6), 0 0 40px rgba(0, 212, 255, 0.3)'
          }
        }
      },
      backdropBlur: {
        'gaming': '20px'
      },
      transitionTimingFunction: {
        'gaming': 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate')
  ],
}