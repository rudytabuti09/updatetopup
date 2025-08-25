'use client'

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const gradientButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-magenta focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-neon-magenta to-neon-cyan text-white hover:scale-105 hover:shadow-[0_0_30px_rgba(255,0,255,0.5)] font-mono uppercase tracking-[0.2em] border-2 border-neon-magenta/30 hover:border-neon-cyan backdrop-blur-sm",
        secondary: "bg-gradient-to-r from-retro-gold to-retro-orange text-black hover:scale-105 hover:shadow-glow-gold font-mono uppercase tracking-wide border-2 border-retro-gold/30",
        outline: "border-2 border-neon-cyan bg-black/60 text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-glow-cyan hover:scale-105 font-mono uppercase backdrop-blur-sm",
        ghost: "hover:bg-neon-magenta/10 text-neon-magenta hover:scale-105 font-mono border border-neon-magenta/20 backdrop-blur-sm",
        cyber: "bg-black/80 border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] hover:scale-105 font-mono uppercase tracking-wider backdrop-blur-sm",
        sunset: "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] hover:scale-105 font-mono uppercase border-2 border-purple-500/30",
      },
      size: {
        sm: "h-9 px-4 py-2 text-sm",
        md: "h-11 px-6 py-3",
        lg: "h-14 px-8 py-4 text-base",
        xl: "h-16 px-10 py-5 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gradientButtonVariants> {
  asChild?: boolean
  loading?: boolean
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(gradientButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <div className="loading-spinner mr-2" />
            Loading...
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
GradientButton.displayName = "GradientButton"

export { GradientButton, gradientButtonVariants }
