'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  glow?: boolean
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = false, glow = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass-card p-6",
          hover && "card-hover cursor-pointer",
          glow && "animate-glow",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
GlassCard.displayName = "GlassCard"

export { GlassCard }
