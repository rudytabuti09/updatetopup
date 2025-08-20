import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Icon from './AppIcon'

const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false, redirectTo = '/login' }) => {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If route requires auth but user is not logged in
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // If route is for guests only but user is logged in (like login/signup pages)
  if (!requireAuth && user) {
    return <Navigate to="/" replace />
  }

  // If route requires admin access but user is not admin
  if (requireAdmin && user) {
    if (!profile || (profile.role !== 'admin' && profile.role !== 'moderator')) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Shield" size={32} className="text-red-500" />
            </div>
            <h2 className="text-xl font-gaming font-bold text-foreground mb-2">
              Access Denied
            </h2>
            <p className="text-text-secondary mb-6">
              You don't have permission to access this area.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-primary hover:bg-primary/90 text-black px-6 py-2 rounded-lg font-gaming font-bold transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      )
    }
  }

  return children
}

export default ProtectedRoute