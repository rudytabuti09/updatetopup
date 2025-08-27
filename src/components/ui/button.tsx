import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useAccessibility } from "@/lib/accessibility"
import { useOptimizedAnimation } from "@/lib/performance-optimized"
import { getButtonClasses } from "@/lib/themes"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none relative overflow-hidden focus:ring-2 focus:ring-offset-2 focus:ring-current touch-target",
  {
    variants: {
      variant: {
        default: "default-button",
        destructive: "destructive-button",
        outline: "outline-button",
        secondary: "secondary-button",
        ghost: "ghost-button",
        link: "link-button",
        retro: "retro-button",
        neon: "neon-button",
        accessible: "accessible-button",
        professional: "professional-button",
      },
      size: {
        default: "h-9 px-4 py-2 text-sm",
        sm: "h-8 rounded-md gap-1.5 px-3 text-xs",
        lg: "h-12 rounded-lg px-6 text-base",
        xl: "h-14 rounded-lg px-8 text-lg",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  loadingText,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const { theme, reducedMotion, animationsEnabled } = useAccessibility()
  const { shouldAnimate, animationConfig } = useOptimizedAnimation('button-hover')
  const Comp = asChild ? Slot : "button"

  // Get theme-aware button classes
  const themeClasses = React.useMemo(() => {
    const variantMap: Record<string, 'primary' | 'secondary' | 'outline'> = {
      default: 'primary',
      secondary: 'secondary', 
      outline: 'outline',
      neon: 'outline',
      retro: 'primary',
      accessible: 'primary',
      professional: 'primary',
    }
    return getButtonClasses(theme, variantMap[variant || 'default'] || 'primary')
  }, [theme, variant])

  // Animation styles based on preferences
  const animationStyles = React.useMemo(() => {
    if (!shouldAnimate) return {}
    
    return {
      '--animation-duration': animationConfig.duration,
      '--animation-easing': animationConfig.easing,
    } as React.CSSProperties
  }, [shouldAnimate, animationConfig])

  // Handle loading state
  const isDisabled = disabled || loading
  const buttonContent = loading ? (
    <>
      <svg 
        className="animate-spin -ml-1 mr-2 h-4 w-4" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {loadingText || 'Loading...'}
    </>
  ) : children

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size }),
        themeClasses,
        // Disable hover effects if animations are disabled
        !animationsEnabled && 'hover:scale-100 hover:shadow-none',
        // High contrast adjustments
        theme === 'accessibility' && 'font-bold border-2',
        // Loading state
        loading && 'cursor-wait',
        className
      )}
      style={animationStyles}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {buttonContent}
    </Comp>
  )
}

export { Button, buttonVariants }
