'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusIndicatorVariants = cva(
  "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider",
  {
    variants: {
      status: {
        online: "text-neon-green",
        offline: "text-red-400",
        processing: "text-neon-cyan",
        warning: "text-amber-400",
        error: "text-red-500",
        idle: "text-white/60"
      },
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base"
      }
    },
    defaultVariants: {
      status: "online",
      size: "default"
    }
  }
)

const dotVariants = cva(
  "rounded-full",
  {
    variants: {
      status: {
        online: "bg-neon-green shadow-[0_0_8px_rgba(0,255,136,0.6)]",
        offline: "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]",
        processing: "bg-neon-cyan shadow-[0_0_8px_rgba(0,255,255,0.6)]",
        warning: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]",
        error: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]",
        idle: "bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.3)]"
      },
      size: {
        sm: "w-2 h-2",
        default: "w-3 h-3",
        lg: "w-4 h-4"
      },
      animated: {
        true: "animate-pulse",
        false: ""
      }
    },
    defaultVariants: {
      status: "online",
      size: "default",
      animated: true
    }
  }
)

export interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusIndicatorVariants> {
  label?: string
  animated?: boolean
  showBrackets?: boolean
}

const StatusIndicator = React.forwardRef<HTMLDivElement, StatusIndicatorProps>(
  ({ className, status, size, label, animated = true, showBrackets = false, ...props }, ref) => {
    const getStatusText = () => {
      if (label) return label
      
      switch (status) {
        case 'online': return 'SYSTEM_ONLINE'
        case 'offline': return 'SYSTEM_OFFLINE'
        case 'processing': return 'PROCESSING'
        case 'warning': return 'WARNING'
        case 'error': return 'ERROR'
        case 'idle': return 'IDLE'
        default: return 'UNKNOWN'
      }
    }

    return (
      <div
        ref={ref}
        className={cn(statusIndicatorVariants({ status, size }), className)}
        {...props}
      >
        <div className={cn(dotVariants({ status, size, animated }))}>
          {/* Inner glow effect */}
          <div className="w-full h-full rounded-full opacity-60 animate-ping" />
        </div>
        
        {showBrackets ? (
          <span className="flex items-center">
            <span className="text-white/40">[</span>
            <span className="mx-1">{getStatusText()}</span>
            <span className="text-white/40">]</span>
          </span>
        ) : (
          <span>{getStatusText()}</span>
        )}
      </div>
    )
  }
)
StatusIndicator.displayName = "StatusIndicator"

export { StatusIndicator, statusIndicatorVariants }
