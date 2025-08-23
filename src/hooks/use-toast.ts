import * as React from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

type ToastState = ToastProps & {
  id: string
  open: boolean
}

const toastStore = {
  toasts: [] as ToastState[],
  listeners: new Set<() => void>(),
  
  addToast: (toast: ToastProps) => {
    const id = Math.random().toString(36).slice(2, 9)
    const newToast: ToastState = { ...toast, id, open: true }
    toastStore.toasts.push(newToast)
    toastStore.notify()
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      toastStore.removeToast(id)
    }, 5000)
    
    return id
  },
  
  removeToast: (id: string) => {
    const index = toastStore.toasts.findIndex(toast => toast.id === id)
    if (index > -1) {
      toastStore.toasts[index].open = false
      toastStore.notify()
      
      // Remove from array after animation
      setTimeout(() => {
        toastStore.toasts.splice(index, 1)
        toastStore.notify()
      }, 300)
    }
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

export function useToast() {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0)
  
  React.useEffect(() => {
    const unsubscribe = toastStore.subscribe(() => forceUpdate())
    return unsubscribe
  }, [])
  
  return {
    toast: toastStore.addToast,
    toasts: toastStore.toasts,
    dismiss: toastStore.removeToast
  }
}
