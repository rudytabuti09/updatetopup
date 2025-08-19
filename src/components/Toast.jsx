import React, { useState, useEffect } from 'react'
import Icon from './AppIcon'

const Toast = ({ 
  message, 
  type = 'success', 
  isVisible, 
  onClose, 
  duration = 4000,
  title 
}) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      onClose()
    }, 300) // Wait for animation to complete
  }

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500/10 border-green-500/20',
          icon: 'CheckCircle',
          iconColor: 'text-green-500',
          titleColor: 'text-green-400'
        }
      case 'error':
        return {
          bg: 'bg-red-500/10 border-red-500/20',
          icon: 'AlertCircle',
          iconColor: 'text-red-500',
          titleColor: 'text-red-400'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-500/10 border-yellow-500/20',
          icon: 'AlertTriangle',
          iconColor: 'text-yellow-500',
          titleColor: 'text-yellow-400'
        }
      case 'info':
        return {
          bg: 'bg-blue-500/10 border-blue-500/20',
          icon: 'Info',
          iconColor: 'text-blue-500',
          titleColor: 'text-blue-400'
        }
      default:
        return {
          bg: 'bg-surface/50 border-border/50',
          icon: 'Bell',
          iconColor: 'text-text-secondary',
          titleColor: 'text-foreground'
        }
    }
  }

  const styles = getToastStyles()

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
      <div 
        className={`
          pointer-events-auto max-w-sm w-full ${styles.bg} border rounded-lg shadow-gaming-lg backdrop-blur-md
          transform transition-all duration-300 ease-out
          ${isAnimating ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
        `}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 ${styles.iconColor}`}>
              <Icon name={styles.icon} size={20} />
            </div>
            
            <div className="flex-1 min-w-0">
              {title && (
                <h4 className={`text-sm font-gaming font-semibold ${styles.titleColor} mb-1`}>
                  {title}
                </h4>
              )}
              <p className="text-sm text-text-secondary leading-relaxed">
                {message}
              </p>
            </div>

            <button
              onClick={handleClose}
              className="flex-shrink-0 text-text-secondary hover:text-foreground transition-colors p-1 rounded-md hover:bg-surface/30"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-surface/30 rounded-b-lg overflow-hidden">
          <div 
            className={`h-full ${
              type === 'success' ? 'bg-green-500' :
              type === 'error' ? 'bg-red-500' :
              type === 'warning' ? 'bg-yellow-500' :
              type === 'info' ? 'bg-blue-500' : 'bg-primary'
            } transition-all duration-${duration} ease-linear`}
            style={{
              width: isAnimating ? '0%' : '100%',
              transition: `width ${duration}ms linear`
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Toast