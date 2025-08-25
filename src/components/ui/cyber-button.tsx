'use client'

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cyberButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none relative overflow-hidden uppercase tracking-wider font-mono",
  {
    variants: {
      variant: {
        cyber: [
          "bg-black/40 border-2 border-neon-cyan/50 text-neon-cyan backdrop-blur-sm",
          "hover:bg-neon-cyan/10 hover:border-neon-cyan hover:text-neon-cyan hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]",
          "active:scale-95"
        ],
        neon: [
          "bg-gradient-to-r from-neon-magenta to-neon-pink border-2 border-neon-magenta/30 text-white",
          "hover:from-neon-magenta/80 hover:to-neon-pink/80 hover:border-neon-magenta hover:shadow-[0_0_30px_rgba(255,0,255,0.5)]",
          "active:scale-95"
        ],
        matrix: [
          "bg-black/60 border border-neon-green/40 text-neon-green backdrop-blur-sm",
          "hover:bg-neon-green/10 hover:border-neon-green hover:shadow-[0_0_15px_rgba(0,255,136,0.4)]",
          "before:content-[''] before:absolute before:inset-0 before:bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,255,136,0.03)_2px,rgba(0,255,136,0.03)_4px)]",
          "active:scale-95"
        ],
        warning: [
          "bg-gradient-to-r from-orange-500 to-red-500 border-2 border-orange-400/40 text-black",
          "hover:from-orange-400 hover:to-red-400 hover:border-orange-400 hover:shadow-[0_0_25px_rgba(249,115,22,0.5)]",
          "animate-pulse",
          "active:scale-95"
        ],
        ghost: [
          "border border-white/20 text-white/70 backdrop-blur-sm",
          "hover:bg-white/5 hover:border-white/40 hover:text-white",
          "active:scale-95"
        ]
      },
      size: {
        sm: "h-8 rounded-md gap-1.5 px-3 text-xs",
        default: "h-10 rounded-lg px-4 py-2 text-sm",
        lg: "h-12 rounded-lg px-6 text-base",
        icon: "size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "cyber",
      size: "default",
    },
  }
)

export interface CyberButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof cyberButtonVariants> {
  asChild?: boolean
  glitch?: boolean
}

const CyberButton = React.forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant, size, glitch = false, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(cyberButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {/* Glitch effect overlay */}
        {glitch && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        )}
        
        {/* Corner brackets for cyber aesthetic */}
        {variant === 'cyber' && (
          <>
            <div className="absolute top-1 left-1 w-2 h-2 border-l border-t border-neon-cyan/60" />
            <div className="absolute top-1 right-1 w-2 h-2 border-r border-t border-neon-cyan/60" />
            <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-neon-cyan/60" />
            <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-neon-cyan/60" />
          </>
        )}
        
        <span className="relative z-10">{children}</span>
      </Comp>
    )
  }
)
CyberButton.displayName = "CyberButton"

export { CyberButton, cyberButtonVariants }
