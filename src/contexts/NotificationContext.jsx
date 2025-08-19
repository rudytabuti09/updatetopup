import React, { createContext, useContext, useState } from 'react'
import Toast from '../components/Toast'

const NotificationContext = createContext({})

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  const addNotification = ({ 
    message, 
    type = 'success', 
    title, 
    duration = 4000 
  }) => {
    const id = Date.now() + Math.random()
    const notification = {
      id,
      message,
      type,
      title,
      duration,
      isVisible: true
    }

    setNotifications(prev => [...prev, notification])

    // Auto remove after duration
    setTimeout(() => {
      removeNotification(id)
    }, duration + 500) // Add extra time for animation
  }

  const removeNotification = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id 
          ? { ...notif, isVisible: false }
          : notif
      )
    )

    // Remove from array after animation
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id))
    }, 300)
  }

  // Convenience methods
  const showSuccess = (message, title = 'Berhasil!') => {
    addNotification({ message, type: 'success', title })
  }

  const showError = (message, title = 'Error!') => {
    addNotification({ message, type: 'error', title })
  }

  const showWarning = (message, title = 'Peringatan!') => {
    addNotification({ message, type: 'warning', title })
  }

  const showInfo = (message, title = 'Info') => {
    addNotification({ message, type: 'info', title })
  }

  const value = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Render notifications */}
      <div className="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
        {notifications.map((notification, index) => (
          <div 
            key={notification.id}
            style={{ 
              transform: `translateY(${index * 10}px)`,
              zIndex: 9999 - index
            }}
          >
            <Toast
              message={notification.message}
              type={notification.type}
              title={notification.title}
              isVisible={notification.isVisible}
              duration={notification.duration}
              onClose={() => removeNotification(notification.id)}
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}