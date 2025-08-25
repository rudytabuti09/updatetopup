'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  glow?: boolean
  variant?: 'default' | 'cyber' | 'neon'
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = false, glow = false, variant = 'cyber', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative p-6 group transition-all duration-300",
          // Base cyber styling
          variant === 'cyber' && [
            "backdrop-blur-xl bg-black/20 border border-neon-cyan/30",
            "shadow-[0_0_20px_rgba(0,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.1)]",
            "rounded-lg"
          ],
          // Neon variant
          variant === 'neon' && [
            "backdrop-blur-xl bg-black/30 border-2 border-neon-magenta/40",
            "shadow-[0_0_30px_rgba(255,0,255,0.2),0_0_60px_rgba(0,255,255,0.1)]",
            "rounded-lg"
          ],
          // Default variant (original)
          variant === 'default' && "glass-card",
          // Hover effects
          hover && "cursor-pointer hover:scale-[1.02] hover:border-neon-cyan/50 hover:shadow-[0_0_40px_rgba(0,255,255,0.2)]",
          // Glow animation
          glow && "animate-neon-pulse",
          className
        )}
        {...props}
      >
        {/* Animated border effects */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-lg overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-magenta/80 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/80 to-transparent" />
          <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-neon-purple/60 to-transparent" />
          <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-neon-pink/60 to-transparent" />
        </div>
        
        {/* Corner accents */}
        {variant === 'cyber' && (
          <>
            <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-neon-cyan/50 opacity-60" />
            <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-neon-magenta/50 opacity-60" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-neon-magenta/50 opacity-60" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-neon-cyan/50 opacity-60" />
          </>
        )}
        
        {children}
      </div>
    )
  }
)
GlassCard.displayName = "GlassCard"

export { GlassCard }
