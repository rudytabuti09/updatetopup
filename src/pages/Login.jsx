import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'
import Icon from '../components/AppIcon'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, loading } = useAuth()
  const { showSuccess, showError } = useNotification()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect to intended page after login
  const from = location.state?.from?.pathname || '/'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email wajib diisi'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const { data, error } = await signIn(formData.email, formData.password)
      
      if (error) {
        let errorMessage = 'Terjadi kesalahan saat login'
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email atau password yang Anda masukkan salah'
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Silakan konfirmasi email Anda terlebih dahulu'
        } else {
          errorMessage = error.message
        }
        
        showError(errorMessage, 'Login Gagal!')
        setErrors({ general: errorMessage })
        return
      }

      // Success - show notification and redirect
      showSuccess(
        `Selamat datang kembali! Anda berhasil masuk ke akun WMX TOPUP.`,
        'Login Berhasil! 🎮'
      )
      
      // Small delay to show notification before redirect
      setTimeout(() => {
        navigate(from, { replace: true })
      }, 1000)
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ general: 'Terjadi kesalahan. Silakan coba lagi.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDemoLogin = async () => {
    setFormData({
      email: 'demo@wmxtopup.com',
      password: 'demo123'
    })
  }

  return (
    <>
      <Helmet>
        <title>Login - WMX TOPUP | Masuk ke Akun Gaming Anda</title>
        <meta name="description" content="Masuk ke akun WMX TOPUP untuk melakukan top up game favorit dengan mudah dan aman." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-surface/20 to-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Icon name="Zap" size={24} className="text-black" />
              </div>
              <span className="text-2xl logo-text">
                WMX TOPUP
              </span>
            </Link>
            
            <h1 className="text-3xl hero-title text-foreground mb-2">
              Selamat Datang Kembali
            </h1>
            <p className="text-text-secondary">
              Masuk ke akun Anda untuk melanjutkan gaming
            </p>
          </div>

          {/* Login Form */}
          <div className="gaming-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
                  <Icon name="AlertCircle" size={20} className="text-red-500 flex-shrink-0" />
                  <span className="text-red-500 text-sm">{errors.general}</span>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="Mail" size={18} className="text-text-secondary" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-foreground placeholder:text-text-secondary/70 ${
                      errors.email ? 'border-red-500' : 'border-border/50'
                    }`}
                    placeholder="nama@email.com"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <Icon name="AlertCircle" size={14} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="Lock" size={18} className="text-text-secondary" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-foreground placeholder:text-text-secondary/70 ${
                      errors.password ? 'border-red-500' : 'border-border/50'
                    }`}
                    placeholder="Masukkan password"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={isSubmitting}
                  >
                    <Icon 
                      name={showPassword ? "EyeOff" : "Eye"} 
                      size={18} 
                      className="text-text-secondary hover:text-foreground transition-colors" 
                    />
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <Icon name="AlertCircle" size={14} />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Lupa password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full bg-gradient-to-r from-primary to-secondary text-black py-3 px-4 rounded-lg font-gaming font-semibold hover:shadow-neon-glow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    Masuk...
                  </>
                ) : (
                  <>
                    <Icon name="LogIn" size={18} />
                    Masuk
                  </>
                )}
              </button>

              {/* Demo Login */}
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full bg-surface/50 hover:bg-surface/70 text-foreground py-3 px-4 rounded-lg font-medium transition-colors border border-border/50 hover:border-primary/30 flex items-center justify-center gap-2"
              >
                <Icon name="Play" size={18} />
                Coba Demo Login
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-text-secondary">atau</span>
              </div>
            </div>

            {/* Social Login (Future) */}
            <div className="space-y-3">
              <button
                type="button"
                disabled
                className="w-full bg-surface/30 text-text-secondary py-3 px-4 rounded-lg font-medium transition-colors border border-border/30 flex items-center justify-center gap-2 cursor-not-allowed opacity-50"
              >
                <Icon name="Chrome" size={18} />
                Masuk dengan Google (Coming Soon)
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-8 pt-6 border-t border-border/50">
              <p className="text-text-secondary">
                Belum punya akun?{' '}
                <Link 
                  to="/signup" 
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 text-center">
            <p className="text-text-secondary text-sm mb-4">
              Dengan masuk, Anda mendapatkan akses ke:
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-text-secondary">
                <Icon name="Zap" size={14} className="text-primary" />
                <span>Top up instan</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Icon name="Heart" size={14} className="text-red-500" />
                <span>Game favorit</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Icon name="History" size={14} className="text-secondary" />
                <span>Riwayat transaksi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login