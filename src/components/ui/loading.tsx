import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// Spinner Component
const spinnerVariants = cva(
  "animate-spin rounded-full border-2 border-solid",
  {
    variants: {
      size: {
        xs: "w-3 h-3 border",
        sm: "w-4 h-4 border",
        md: "w-6 h-6 border-2",
        lg: "w-8 h-8 border-2",
        xl: "w-12 h-12 border-[3px]",
      },
      variant: {
        default: "border-muted border-t-foreground",
        primary: "border-primary/20 border-t-primary",
        secondary: "border-secondary/20 border-t-secondary",
        neon: "loading-spinner-neon",
        gradient: "border-transparent bg-gradient-to-r from-primary to-secondary rounded-full",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
)

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof spinnerVariants> {
  label?: string
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, label = "Loading", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(spinnerVariants({ size, variant }), className)}
        role="status"
        aria-label={label}
        {...props}
      >
        <span className="sr-only">{label}</span>
      </div>
    )
  }
)
Spinner.displayName = "Spinner"

// Loading Dots Component
export interface LoadingDotsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  color?: "default" | "primary" | "neon"
}

const LoadingDots = React.forwardRef<HTMLDivElement, LoadingDotsProps>(
  ({ className, size = "md", color = "default", ...props }, ref) => {
    const dotSizes = {
      sm: "w-1 h-1",
      md: "w-2 h-2", 
      lg: "w-3 h-3"
    }
    
    const dotColors = {
      default: "bg-muted-foreground",
      primary: "bg-primary",
      neon: "bg-gradient-to-r from-primary to-secondary"
    }

    return (
      <div
        ref={ref}
        className={cn("loading-dots", className)}
        role="status"
        aria-label="Loading"
        {...props}
      >
        <div className={cn("rounded-full", dotSizes[size], dotColors[color])} />
        <div className={cn("rounded-full", dotSizes[size], dotColors[color])} />
        <div className={cn("rounded-full", dotSizes[size], dotColors[color])} />
      </div>
    )
  }
)
LoadingDots.displayName = "LoadingDots"

// Loading Bars Component
export interface LoadingBarsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  color?: "default" | "primary" | "neon"
}

const LoadingBars = React.forwardRef<HTMLDivElement, LoadingBarsProps>(
  ({ className, size = "md", color = "default", ...props }, ref) => {
    const barColors = {
      default: "bg-muted-foreground",
      primary: "bg-primary",
      neon: "bg-gradient-to-t from-primary to-secondary"
    }

    const containerHeight = {
      sm: "h-4",
      md: "h-6",
      lg: "h-8"
    }

    return (
      <div
        ref={ref}
        className={cn("loading-bars", containerHeight[size], className)}
        role="status"
        aria-label="Loading"
        {...props}
      >
        <div className={cn("rounded-sm", barColors[color])} />
        <div className={cn("rounded-sm", barColors[color])} />
        <div className={cn("rounded-sm", barColors[color])} />
        <div className={cn("rounded-sm", barColors[color])} />
        <div className={cn("rounded-sm", barColors[color])} />
      </div>
    )
  }
)
LoadingBars.displayName = "LoadingBars"

// Skeleton Component
const skeletonVariants = cva(
  "rounded-md bg-muted animate-pulse",
  {
    variants: {
      variant: {
        default: "skeleton",
        neon: "skeleton-neon",
        pulse: "loading-pulse bg-muted/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant }), className)}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

// Progress Bar Component
export interface ProgressBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  indeterminate?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "default" | "neon" | "gradient"
  showPercentage?: boolean
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ 
    className, 
    value = 0, 
    max = 100, 
    indeterminate = false,
    size = "md",
    variant = "default",
    showPercentage = false,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    
    const heights = {
      sm: "h-1",
      md: "h-2",
      lg: "h-3"
    }
    
    const fillVariants = {
      default: "bg-primary",
      neon: "progress-bar-fill",
      gradient: "bg-gradient-to-r from-primary to-secondary"
    }

    return (
      <div className="space-y-1">
        <div
          ref={ref}
          className={cn(
            "progress-bar w-full", 
            heights[size], 
            className
          )}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          {...props}
        >
          {indeterminate ? (
            <div className={cn(
              "progress-bar-indeterminate h-full rounded-inherit",
              heights[size]
            )} />
          ) : (
            <div
              className={cn(
                "h-full rounded-inherit transition-all duration-300 ease-out",
                variant === "neon" ? fillVariants.neon : fillVariants[variant]
              )}
              style={{ width: `${percentage}%` }}
            />
          )}
        </div>
        {showPercentage && !indeterminate && (
          <div className="text-xs text-muted-foreground text-center">
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    )
  }
)
ProgressBar.displayName = "ProgressBar"

// Loading Overlay Component
export interface LoadingOverlayProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isVisible: boolean
  spinner?: React.ReactNode
  text?: string
  variant?: "default" | "blur" | "neon"
}

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ 
    className, 
    isVisible, 
    spinner, 
    text = "Loading...",
    variant = "default",
    children,
    ...props 
  }, ref) => {
    if (!isVisible) return null

    const overlayVariants = {
      default: "bg-background/80",
      blur: "bg-background/50 backdrop-blur-sm",
      neon: "bg-background/90 backdrop-blur-md"
    }

    const contentVariants = {
      default: "bg-card border shadow-lg",
      blur: "glass-card",
      neon: "glass-card border-primary/20 shadow-2xl shadow-primary/10"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "loading-overlay",
          overlayVariants[variant],
          className
        )}
        {...props}
      >
        <div className={cn(
          "loading-overlay-content max-w-sm",
          contentVariants[variant]
        )}>
          <div className="flex flex-col items-center gap-4">
            {spinner || <Spinner variant={variant === "neon" ? "neon" : "primary"} size="lg" />}
            {text && (
              <p className={cn(
                "text-sm font-medium text-center",
                variant === "neon" ? "text-neon-cyan" : "text-foreground"
              )}>
                {text}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }
)
LoadingOverlay.displayName = "LoadingOverlay"

// Pulse Component (for loading states)
export interface PulseProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean
}

const Pulse = React.forwardRef<HTMLDivElement, PulseProps>(
  ({ className, isLoading = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          isLoading && "loading-pulse",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Pulse.displayName = "Pulse"

// Loading Button Component
export interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
  spinner?: React.ReactNode
  variant?: "default" | "primary" | "neon"
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ 
    className, 
    children, 
    isLoading = false, 
    loadingText,
    spinner,
    variant = "default",
    disabled,
    ...props 
  }, ref) => {
    const buttonVariants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      neon: "btn-neon"
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          buttonVariants[variant],
          className
        )}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && (
          spinner || <Spinner size="sm" variant={variant === "neon" ? "neon" : "default"} />
        )}
        {isLoading ? loadingText || "Loading..." : children}
      </button>
    )
  }
)
LoadingButton.displayName = "LoadingButton"

export {
  Spinner,
  LoadingDots,
  LoadingBars,
  Skeleton,
  ProgressBar,
  LoadingOverlay,
  Pulse,
  LoadingButton,
  spinnerVariants,
  skeletonVariants,
}
