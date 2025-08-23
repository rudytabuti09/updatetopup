'use client'

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const gradientButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "btn-gradient hover:scale-105 hover:shadow-glow-blue",
        secondary: "btn-gradient-secondary hover:scale-105 hover:shadow-glow-purple",
        outline: "border border-white/20 bg-transparent hover:bg-white/5 text-white hover:scale-105",
        ghost: "hover:bg-white/5 text-white hover:scale-105",
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
