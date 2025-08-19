import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'
import Icon from './AppIcon'

const AuthButton = () => {
  const { user, profile, signOut, isAuthenticated } = useAuth()
  const { showSuccess, showError } = useNotification()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    try {
      const userName = profile?.full_name || profile?.username || 'User'
      await signOut()
      setIsDropdownOpen(false)
      
      // Show logout success notification
      showSuccess(
        `Sampai jumpa lagi ${userName}! Anda telah berhasil keluar dari akun WMX TOPUP.`,
        'Logout Berhasil! 👋'
      )
      
      // Small delay before redirect to show notification
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (error) {
      console.error('Sign out error:', error)
      showError('Terjadi kesalahan saat logout. Silakan coba lagi.', 'Logout Gagal!')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="text-foreground hover:text-primary transition-colors font-medium"
        >
          Masuk
        </Link>
        <Link
          to="/signup"
          className="bg-gradient-to-r from-primary to-secondary text-black px-4 py-2 rounded-lg font-gaming font-semibold hover:shadow-neon-glow transition-all duration-200"
        >
          Daftar
        </Link>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface/50 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
          {profile?.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt={profile.username || user.email}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <Icon name="User" size={16} className="text-black" />
          )}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-foreground">
            {profile?.username || profile?.full_name || 'User'}
          </div>
          <div className="text-xs text-text-secondary">
            {profile?.total_transactions || 0} transaksi
          </div>
        </div>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`text-text-secondary transition-transform ${
            isDropdownOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-card border border-border/50 rounded-lg shadow-lg z-50">
          {/* User Info */}
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.username || user.email}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Icon name="User" size={20} className="text-black" />
                )}
              </div>
              <div>
                <div className="font-medium text-foreground">
                  {profile?.full_name || profile?.username || 'User'}
                </div>
                <div className="text-sm text-text-secondary">
                  {user.email}
                </div>
                {profile?.role && profile.role !== 'customer' && (
                  <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full mt-1 inline-block">
                    {profile.role}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              to="/dashboard"
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-surface/50 transition-colors"
            >
              <Icon name="LayoutDashboard" size={16} />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/profile"
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-surface/50 transition-colors"
            >
              <Icon name="User" size={16} />
              <span>Profil Saya</span>
            </Link>
            
            <Link
              to="/transactions"
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-surface/50 transition-colors"
            >
              <Icon name="History" size={16} />
              <span>Riwayat Transaksi</span>
              {profile?.total_transactions > 0 && (
                <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {profile.total_transactions}
                </span>
              )}
            </Link>
            
            <Link
              to="/favorites"
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-surface/50 transition-colors"
            >
              <Icon name="Heart" size={16} />
              <span>Game Favorit</span>
            </Link>

            <div className="border-t border-border/50 my-2"></div>
            
            <Link
              to="/settings"
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-surface/50 transition-colors"
            >
              <Icon name="Settings" size={16} />
              <span>Pengaturan</span>
            </Link>
            
            <Link
              to="/help"
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-surface/50 transition-colors"
            >
              <Icon name="HelpCircle" size={16} />
              <span>Bantuan</span>
            </Link>

            <div className="border-t border-border/50 my-2"></div>
            
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <Icon name="LogOut" size={16} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AuthButton