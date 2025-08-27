import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Zap } from "lucide-react"
import { useToast, type ToastProps } from "@/hooks/use-toast"

// Toast Viewport Component
export interface ToastViewportProps
  extends React.HTMLAttributes<HTMLDivElement> {
  position?: "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center"
}

const ToastViewport = React.forwardRef<HTMLDivElement, ToastViewportProps>(
  ({ className, position = "top-right", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("toast-viewport", className)}
        data-position={position}
        {...props}
      />
    )
  }
)
ToastViewport.displayName = "ToastViewport"

// Toast Component
const toastVariants = cva(
  "toast",
  {
    variants: {
      variant: {
        default: "",
        success: "",
        error: "",
        destructive: "",
        warning: "",
        info: "",
        neon: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ToastComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title?: string
  description?: string
  action?: React.ReactNode
  icon?: React.ReactNode
  dismissible?: boolean
  onClose?: () => void
  open?: boolean
  duration?: number
  showProgress?: boolean
}

const Toast = React.forwardRef<HTMLDivElement, ToastComponentProps>(
  ({ 
    className, 
    variant = "default", 
    title, 
    description, 
    action, 
    icon, 
    dismissible = true,
    onClose,
    open = true,
    duration,
    showProgress = false,
    ...props 
  }, ref) => {
    const progressRef = React.useRef<HTMLDivElement>(null)
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

    // Get default icon based on variant
    const getDefaultIcon = () => {
      switch (variant) {
        case "success":
          return <CheckCircle className="h-5 w-5 text-green-600" />
        case "error":
        case "destructive":
          return <AlertCircle className="h-5 w-5 text-red-600" />
        case "warning":
          return <AlertTriangle className="h-5 w-5 text-yellow-600" />
        case "info":
          return <Info className="h-5 w-5 text-blue-600" />
        case "neon":
          return <Zap className="h-5 w-5 text-neon-magenta" />
        default:
          return null
      }
    }

    const displayIcon = icon ?? getDefaultIcon()

    // Progress bar animation
    React.useEffect(() => {
      if (showProgress && duration && duration > 0 && progressRef.current) {
        const progressBar = progressRef.current
        progressBar.style.width = '100%'
        progressBar.style.transition = `width ${duration}ms linear`
        
        // Force reflow then animate to 0
        requestAnimationFrame(() => {
          progressBar.style.width = '0%'
        })
      }
    }, [duration, showProgress])

    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        data-state={open ? "open" : "closed"}
        data-variant={variant}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        {...props}
      >
        {displayIcon && (
          <div className="toast-icon">
            {displayIcon}
          </div>
        )}
        
        <div className="toast-content">
          {title && (
            <div className="toast-title">
              {title}
            </div>
          )}
          {description && (
            <div className="toast-description">
              {description}
            </div>
          )}
        </div>

        {action && (
          <div className="toast-action">
            {action}
          </div>
        )}

        {dismissible && (
          <button
            className="toast-close touch-target"
            onClick={onClose}
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {showProgress && duration && duration > 0 && (
          <div
            ref={progressRef}
            className="toast-progress"
            data-variant={variant}
          />
        )}
      </div>
    )
  }
)
Toast.displayName = "Toast"

// Toast Action Button Component
export interface ToastActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  altText?: string
  variant?: "default" | "outline" | "ghost"
}

const ToastAction = React.forwardRef<HTMLButtonElement, ToastActionProps>(
  ({ className, variant = "default", altText, ...props }, ref) => {
    const actionVariants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground"
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex h-8 shrink-0 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-target",
          actionVariants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
ToastAction.displayName = "ToastAction"

// Toast Provider Component
export interface ToastProviderProps {
  children: React.ReactNode
  position?: "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center"
  duration?: number
  maxToasts?: number
}

const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  position = "top-right", 
  duration = 5000, 
  maxToasts = 5 
}) => {
  const { toasts, config } = useToast()

  React.useEffect(() => {
    config({ position, duration, maxToasts })
  }, [position, duration, maxToasts, config])

  return (
    <>
      {children}
      <Toaster />
    </>
  )
}

// Toaster Component - Renders all active toasts
const Toaster: React.FC = () => {
  const { toasts, dismiss } = useToast()

  // Group toasts by position
  const toastGroups = React.useMemo(() => {
    const groups: Record<string, typeof toasts> = {}
    toasts.forEach(toast => {
      const position = toast.position || "top-right"
      if (!groups[position]) {
        groups[position] = []
      }
      groups[position].push(toast)
    })
    return groups
  }, [toasts])

  return (
    <>
      {Object.entries(toastGroups).map(([position, positionToasts]) => (
        <ToastViewport
          key={position}
          position={position as ToastViewportProps['position']}
        >
          {positionToasts.map((toast) => (
            <Toast
              key={toast.id}
              variant={toast.variant}
              title={toast.title}
              description={toast.description}
              icon={toast.icon}
              dismissible={toast.dismissible}
              onClose={() => dismiss(toast.id)}
              open={toast.open}
              duration={toast.duration}
              showProgress={!!toast.duration && toast.duration > 0}
              className={toast.className}
            >
              {toast.action && (
                <ToastAction
                  onClick={toast.action.onClick}
                  variant={toast.action.variant}
                >
                  {toast.action.label}
                </ToastAction>
              )}
            </Toast>
          ))}
        </ToastViewport>
      ))}
    </>
  )
}

// Utility function to create toast with common patterns
export const createToast = {
  success: (message: string, options?: Partial<ToastProps>) => ({
    title: "Success",
    description: message,
    variant: "success" as const,
    ...options
  }),
  
  error: (message: string, options?: Partial<ToastProps>) => ({
    title: "Error",
    description: message,
    variant: "error" as const,
    ...options
  }),
  
  warning: (message: string, options?: Partial<ToastProps>) => ({
    title: "Warning",
    description: message,
    variant: "warning" as const,
    ...options
  }),
  
  info: (message: string, options?: Partial<ToastProps>) => ({
    title: "Info",
    description: message,
    variant: "info" as const,
    ...options
  }),
  
  neon: (message: string, options?: Partial<ToastProps>) => ({
    title: "System Alert",
    description: message,
    variant: "neon" as const,
    ...options
  }),
  
  loading: (message: string, options?: Partial<ToastProps>) => ({
    title: "Loading",
    description: message,
    persistent: true,
    dismissible: false,
    icon: <div className="loading-spinner w-4 h-4" />,
    ...options
  })
}

export {
  Toast,
  ToastViewport,
  ToastAction,
  ToastProvider,
  Toaster,
  toastVariants,
  useToast,
}
