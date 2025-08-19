import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'
import Icon from '../components/AppIcon'

const ForgotPassword = () => {
  const { resetPassword } = useAuth()
  const { showSuccess, showError } = useNotification()
  
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleChange = (e) => {
    setEmail(e.target.value)
    if (errors.email) {
      setErrors({})
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!email) {
      newErrors.email = 'Email wajib diisi'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format email tidak valid'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const { error } = await resetPassword(email)
      
      if (error) {
        let errorMessage = 'Terjadi kesalahan saat mengirim email reset'
        if (error.message.includes('User not found')) {
          errorMessage = 'Email tidak terdaftar di sistem WMX TOPUP'
          setErrors({ email: 'Email tidak terdaftar' })
        } else {
          errorMessage = error.message
          setErrors({ general: error.message })
        }
        
        showError(errorMessage, 'Reset Password Gagal!')
        return
      }

      // Success - show notification
      showSuccess(
        `Link reset password telah dikirim ke ${email}. Silakan cek inbox atau folder spam Anda.`,
        'Email Terkirim! 📧'
      )
      
      // Small delay to show notification before showing success page
      setTimeout(() => {
        setEmailSent(true)
      }, 1500)
    } catch (error) {
      console.error('Reset password error:', error)
      setErrors({ general: 'Terjadi kesalahan. Silakan coba lagi.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (emailSent) {
    return (
      <>
        <Helmet>
          <title>Email Reset Terkirim - WMX TOPUP</title>
        </Helmet>
        
        <div className="min-h-screen bg-gradient-to-br from-background via-surface/20 to-background flex items-center justify-center p-4">
          <div className="w-full max-w-md text-center">
            <div className="gaming-card p-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Mail" size={40} className="text-primary" />
              </div>
              
              <h1 className="text-2xl font-gaming font-bold text-foreground mb-4">
                Email Reset Terkirim!
              </h1>
              
              <p className="text-text-secondary mb-6">
                Kami telah mengirim link reset password ke email <strong>{email}</strong>. 
                Silakan cek inbox atau folder spam Anda.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setEmailSent(false)
                    setEmail('')
                  }}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-black py-3 px-4 rounded-lg font-gaming font-semibold hover:shadow-neon-glow transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Icon name="RotateCcw" size={18} />
                  Kirim Ulang
                </button>
                
                <Link
                  to="/login"
                  className="w-full bg-surface/50 hover:bg-surface/70 text-foreground py-3 px-4 rounded-lg font-medium transition-colors border border-border/50 hover:border-primary/30 flex items-center justify-center gap-2"
                >
                  <Icon name="ArrowLeft" size={18} />
                  Kembali ke Login
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
        <title>Lupa Password - WMX TOPUP | Reset Password Akun</title>
        <meta name="description" content="Reset password akun WMX TOPUP Anda dengan mudah dan aman." />
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
              Lupa Password?
            </h1>
            <p className="text-text-secondary">
              Masukkan email Anda untuk mendapatkan link reset password
            </p>
          </div>

          {/* Reset Form */}
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
                    value={email}
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary to-secondary text-black py-3 px-4 rounded-lg font-gaming font-semibold hover:shadow-neon-glow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={18} />
                    Kirim Link Reset
                  </>
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="text-center mt-8 pt-6 border-t border-border/50">
              <Link 
                to="/login" 
                className="text-primary hover:text-primary/80 font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="ArrowLeft" size={16} />
                Kembali ke Login
              </Link>
            </div>
          </div>

          {/* Help */}
          <div className="mt-8 text-center">
            <p className="text-text-secondary text-sm mb-4">
              Butuh bantuan lain?
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <a 
                href="mailto:support@wmxtopup.com" 
                className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
              >
                <Icon name="Mail" size={14} />
                <span>Email Support</span>
              </a>
              <a 
                href="https://wa.me/6281234567890" 
                className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
              >
                <Icon name="MessageCircle" size={14} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword