import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'
import Icon from '../components/AppIcon'

const Signup = () => {
  const navigate = useNavigate()
  const { signUp, loading } = useAuth()
  const { showSuccess, showError } = useNotification()
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    agreeToTerms: false
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    if (!formData.username) {
      newErrors.username = 'Username wajib diisi'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username minimal 3 karakter'
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username hanya boleh huruf, angka, dan underscore'
    }

    if (!formData.fullName) {
      newErrors.fullName = 'Nama lengkap wajib diisi'
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Nama lengkap minimal 2 karakter'
    }

    if (!formData.email) {
      newErrors.email = 'Email wajib diisi'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password harus mengandung huruf besar, kecil, dan angka'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Anda harus menyetujui syarat dan ketentuan'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const { data, error } = await signUp(formData.email, formData.password, {
        username: formData.username,
        full_name: formData.fullName
      })
      
      if (error) {
        let errorMessage = 'Terjadi kesalahan saat mendaftar'
        if (error.message.includes('User already registered')) {
          errorMessage = 'Email sudah terdaftar, silakan gunakan email lain'
          setErrors({ email: 'Email sudah terdaftar' })
        } else if (error.message.includes('Username already exists')) {
          errorMessage = 'Username sudah digunakan, silakan pilih username lain'
          setErrors({ username: 'Username sudah digunakan' })
        } else {
          errorMessage = error.message
          setErrors({ general: error.message })
        }
        
        showError(errorMessage, 'Pendaftaran Gagal!')
        return
      }

      // Success - show notification
      showSuccess(
        `Selamat ${formData.fullName}! Akun WMX TOPUP Anda berhasil dibuat. Selamat bergabung dengan komunitas gaming terbaik!`,
        'Pendaftaran Berhasil! 🎉'
      )
      
      // Small delay to show notification before showing success page
      setTimeout(() => {
        setSignupSuccess(true)
      }, 1500)
    } catch (error) {
      console.error('Signup error:', error)
      setErrors({ general: 'Terjadi kesalahan. Silakan coba lagi.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (signupSuccess) {
    return (
      <>
        <Helmet>
          <title>Pendaftaran Berhasil - WMX TOPUP</title>
        </Helmet>
        
        <div className="min-h-screen bg-gradient-to-br from-background via-surface/20 to-background flex items-center justify-center p-4">
          <div className="w-full max-w-md text-center">
            <div className="gaming-card p-8">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="CheckCircle" size={40} className="text-green-500" />
              </div>
              
              <h1 className="text-2xl font-gaming font-bold text-foreground mb-4">
                Pendaftaran Berhasil!
              </h1>
              
              <p className="text-text-secondary mb-6">
                Akun Anda telah berhasil dibuat. Silakan cek email untuk konfirmasi akun (jika diperlukan).
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-black py-3 px-4 rounded-lg font-gaming font-semibold hover:shadow-neon-glow transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Icon name="LogIn" size={18} />
                  Masuk Sekarang
                </button>
                
                <Link
                  to="/"
                  className="w-full bg-surface/50 hover:bg-surface/70 text-foreground py-3 px-4 rounded-lg font-medium transition-colors border border-border/50 hover:border-primary/30 flex items-center justify-center gap-2"
                >
                  <Icon name="Home" size={18} />
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Daftar - WMX TOPUP | Buat Akun Gaming Baru</title>
        <meta name="description" content="Daftar akun WMX TOPUP gratis untuk mendapatkan akses ke platform top up gaming terbaik di Indonesia." />
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
              Bergabung dengan WMX
            </h1>
            <p className="text-text-secondary">
              Buat akun gratis dan mulai gaming experience terbaik
            </p>
          </div>

          {/* Signup Form */}
          <div className="gaming-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
                  <Icon name="AlertCircle" size={20} className="text-red-500 flex-shrink-0" />
                  <span className="text-red-500 text-sm">{errors.general}</span>
                </div>
              )}

              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-foreground">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="User" size={18} className="text-text-secondary" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-foreground placeholder:text-text-secondary/70 ${
                      errors.username ? 'border-red-500' : 'border-border/50'
                    }`}
                    placeholder="username_kamu"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.username && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <Icon name="AlertCircle" size={14} />
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Full Name Field */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="UserCheck" size={18} className="text-text-secondary" />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-foreground placeholder:text-text-secondary/70 ${
                      errors.fullName ? 'border-red-500' : 'border-border/50'
                    }`}
                    placeholder="Nama Lengkap Anda"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <Icon name="AlertCircle" size={14} />
                    {errors.fullName}
                  </p>
                )}
              </div>

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
                    placeholder="Buat password yang kuat"
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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="Lock" size={18} className="text-text-secondary" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-foreground placeholder:text-text-secondary/70 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-border/50'
                    }`}
                    placeholder="Ulangi password"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={isSubmitting}
                  >
                    <Icon 
                      name={showConfirmPassword ? "EyeOff" : "Eye"} 
                      size={18} 
                      className="text-text-secondary hover:text-foreground transition-colors" 
                    />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <Icon name="AlertCircle" size={14} />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-primary bg-surface/50 border-border/50 rounded focus:ring-primary/50 focus:ring-2"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-text-secondary">
                    Saya menyetujui{' '}
                    <Link to="/terms" className="text-primary hover:text-primary/80 transition-colors">
                      Syarat & Ketentuan
                    </Link>
                    {' '}dan{' '}
                    <Link to="/privacy" className="text-primary hover:text-primary/80 transition-colors">
                      Kebijakan Privasi
                    </Link>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <Icon name="AlertCircle" size={14} />
                    {errors.agreeToTerms}
                  </p>
                )}
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
                    Mendaftar...
                  </>
                ) : (
                  <>
                    <Icon name="UserPlus" size={18} />
                    Daftar Sekarang
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-8 pt-6 border-t border-border/50">
              <p className="text-text-secondary">
                Sudah punya akun?{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Masuk di sini
                </Link>
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-8 text-center">
            <p className="text-text-secondary text-sm mb-4">
              Keuntungan bergabung dengan WMX TOPUP:
            </p>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center justify-center gap-2 text-text-secondary">
                <Icon name="Zap" size={14} className="text-primary" />
                <span>Top up instan untuk 150+ game</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-text-secondary">
                <Icon name="Shield" size={14} className="text-green-500" />
                <span>Keamanan transaksi terjamin 100%</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-text-secondary">
                <Icon name="Gift" size={14} className="text-secondary" />
                <span>Promo dan diskon eksklusif member</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup