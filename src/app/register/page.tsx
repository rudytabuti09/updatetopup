'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, Gamepad2, Zap, Shield, Star, ArrowRight, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard } from '@/components/ui/glass-card'
import { GradientButton } from '@/components/ui/gradient-button'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      if (response.ok) {
        router.push('/login?message=Account created successfully')
      } else {
        const data = await response.json()
        setError(data.error || 'Registration failed')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-wmx-light via-retro-lavender/10 to-wmx-light">
      {/* Retro Grid Background */}
      <div className="absolute inset-0 bg-grid-retro bg-[length:50px_50px] opacity-20" />
      
      {/* Animated Neon Orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-neon-cyan/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-magenta/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-retro-gold/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Retro Scan Line Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-neon-magenta/50 to-transparent animate-scan-line" />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12">
          <div className="max-w-md text-center space-y-8">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="relative">
                <Gamepad2 className="h-12 w-12 text-neon-cyan animate-glow" />
                <div className="absolute inset-0 bg-neon-cyan/20 blur-lg animate-pulse" />
              </div>
              <div>
                <h1 className="font-heading font-black text-4xl">
                  <span className="text-wmx-dark">WMX</span>
                  <span className="text-glow-cyan ml-2">TOPUP</span>
                </h1>
                <p className="text-retro-gold font-retro text-sm uppercase tracking-wider">ARCADE PLATFORM</p>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="space-y-4">
              <h2 className="font-heading font-bold text-2xl text-wmx-dark">
                Join the Gaming Revolution
              </h2>
              <p className="text-wmx-gray-600 leading-relaxed">
                Create your account and get instant access to the fastest, 
                most secure gaming top-up platform in the universe.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-left">
                <div className="relative">
                  <Zap className="h-6 w-6 text-neon-cyan" />
                  <div className="absolute inset-0 bg-neon-cyan/20 blur-lg" />
                </div>
                <span className="text-wmx-gray-700 font-medium">Instant top-up processing</span>
              </div>

              <div className="flex items-center gap-3 text-left">
                <div className="relative">
                  <Shield className="h-6 w-6 text-retro-gold" />
                  <div className="absolute inset-0 bg-retro-gold/20 blur-lg" />
                </div>
                <span className="text-wmx-gray-700 font-medium">Bank-level security protection</span>
              </div>

              <div className="flex items-center gap-3 text-left">
                <div className="relative">
                  <Star className="h-6 w-6 text-neon-magenta" />
                  <div className="absolute inset-0 bg-neon-magenta/20 blur-lg" />
                </div>
                <span className="text-wmx-gray-700 font-medium">Best prices guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <GlassCard className="w-full max-w-md space-y-6">
            <div className="text-center space-y-4">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
                <div className="relative">
                  <Gamepad2 className="h-8 w-8 text-neon-cyan" />
                  <div className="absolute inset-0 bg-neon-cyan/20 blur-lg" />
                </div>
                <span className="font-heading font-bold text-xl bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent">
                  WMX TOPUP
                </span>
              </div>

              <h2 className="font-heading font-bold text-2xl text-wmx-dark">
                Create Account
              </h2>
              <p className="text-wmx-gray-600">
                Start your gaming journey with us
              </p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-wmx-dark font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-wmx-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 h-12 border-2 border-wmx-gray-200 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-wmx-dark font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-wmx-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 h-12 border-2 border-wmx-gray-200 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-wmx-dark font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-wmx-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-12 h-12 border-2 border-wmx-gray-200 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all duration-300"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-wmx-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-wmx-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-wmx-dark font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-wmx-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 pr-12 h-12 border-2 border-wmx-gray-200 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all duration-300"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-wmx-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-wmx-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Terms Agreement */}
              <div className="text-xs text-wmx-gray-500 bg-wmx-gray-50 p-3 rounded-lg">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-neon-cyan hover:text-neon-magenta font-medium transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-neon-cyan hover:text-neon-magenta font-medium transition-colors">
                  Privacy Policy
                </Link>
              </div>

              {/* Submit Button */}
              <GradientButton
                type="submit"
                variant="primary"
                className="w-full h-12 font-heading uppercase tracking-wider bg-gradient-to-r from-neon-cyan to-neon-magenta"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    CREATING ACCOUNT...
                  </>
                ) : (
                  <>
                    CREATE ACCOUNT
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </GradientButton>
            </form>

            {/* Footer Links */}
            <div className="text-center space-y-4">
              <div className="text-sm text-wmx-gray-600">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-neon-cyan hover:text-neon-magenta font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </div>
              
              <div className="pt-2">
                <Link
                  href="/"
                  className="text-sm text-wmx-gray-500 hover:text-wmx-gray-700 transition-colors flex items-center justify-center gap-1"
                >
                  ← Back to home
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
