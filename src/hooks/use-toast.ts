import * as React from "react"

type ToastVariant = "default" | "success" | "error" | "destructive" | "warning" | "info" | "neon"
type ToastPosition = "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center"

type ToastAction = {
  label: string
  onClick: () => void
  variant?: "default" | "outline" | "ghost"
}

export type ToastProps = {
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
  action?: ToastAction
  icon?: React.ReactNode
  dismissible?: boolean
  persistent?: boolean
  position?: ToastPosition
  onDismiss?: () => void
  className?: string
}

type ToastState = ToastProps & {
  id: string
  open: boolean
  createdAt: number
}

type ToastConfig = {
  position: ToastPosition
  duration: number
  maxToasts: number
}

const DEFAULT_CONFIG: ToastConfig = {
  position: "top-right",
  duration: 5000,
  maxToasts: 5
}

const toastStore = {
  toasts: [] as ToastState[],
  listeners: new Set<() => void>(),
  config: DEFAULT_CONFIG,
  
  addToast: (toast: ToastProps) => {
    const id = Math.random().toString(36).slice(2, 9)
    const duration = toast.duration ?? (toast.persistent ? 0 : toastStore.config.duration)
    
    const newToast: ToastState = {
      ...toast,
      id,
      open: true,
      createdAt: Date.now(),
      variant: toast.variant ?? "default",
      dismissible: toast.dismissible ?? true,
      position: toast.position ?? toastStore.config.position
    }
    
    // Remove oldest toast if we exceed maxToasts
    if (toastStore.toasts.length >= toastStore.config.maxToasts) {
      const oldestToast = toastStore.toasts[0]
      toastStore.removeToast(oldestToast.id)
    }
    
    toastStore.toasts.push(newToast)
    toastStore.notify()
    
    // Auto dismiss after duration if not persistent
    if (duration > 0) {
      setTimeout(() => {
        toastStore.removeToast(id)
      }, duration)
    }
    
    return id
  },
  
  removeToast: (id: string) => {
    const index = toastStore.toasts.findIndex(toast => toast.id === id)
    if (index > -1) {
      const toast = toastStore.toasts[index]
      toast.open = false
      toast.onDismiss?.()
      toastStore.notify()
      
      // Remove from array after animation
      setTimeout(() => {
        const currentIndex = toastStore.toasts.findIndex(t => t.id === id)
        if (currentIndex > -1) {
          toastStore.toasts.splice(currentIndex, 1)
          toastStore.notify()
        }
      }, 300)
    }
  },
  
  removeAllToasts: () => {
    toastStore.toasts.forEach(toast => {
      toast.open = false
      toast.onDismiss?.()
    })
    toastStore.notify()
    
    setTimeout(() => {
      toastStore.toasts.length = 0
      toastStore.notify()
    }, 300)
  },
  
  updateConfig: (newConfig: Partial<ToastConfig>) => {
    toastStore.config = { ...toastStore.config, ...newConfig }
  },
  
  notify: () => {
    toastStore.listeners.forEach(listener => listener())
  },
  
  subscribe: (listener: () => void): (() => void) => {
    toastStore.listeners.add(listener)
    return () => {
      toastStore.listeners.delete(listener)
    }
  }
}

// Convenience methods for different toast variants
const createVariantToast = (variant: ToastVariant) => (props: Omit<ToastProps, 'variant'>) => {
  return toastStore.addToast({ ...props, variant })
}

export function useToast() {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0)
  
  React.useEffect(() => {
    const unsubscribe = toastStore.subscribe(() => forceUpdate())
    return unsubscribe
  }, [])
  
  return {
    toast: toastStore.addToast,
    success: createVariantToast("success"),
    error: createVariantToast("error"),
    warning: createVariantToast("warning"),
    info: createVariantToast("info"),
    neon: createVariantToast("neon"),
    toasts: toastStore.toasts,
    dismiss: toastStore.removeToast,
    dismissAll: toastStore.removeAllToasts,
    config: toastStore.updateConfig
  }
}

// Export the toast store for external access if needed
export { toastStore }
