'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, Gamepad2, Zap, Shield, Star, ArrowRight, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard } from '@/components/ui/glass-card'
import { GradientButton } from '@/components/ui/gradient-button'
import { cn } from '@/lib/utils'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        const session = await getSession()
        if (session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN') {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true)
    try {
      await signIn(provider, { callbackUrl: '/dashboard' })
    } catch (error) {
      setError('OAuth sign in failed')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-wmx-light via-retro-lavender/10 to-wmx-light">
      {/* Retro Grid Background */}
      <div className="absolute inset-0 bg-grid-retro bg-[length:50px_50px] opacity-20" />
      
      {/* Animated Neon Orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-neon-magenta/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-retro-gold/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Retro Scan Line Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent animate-scan-line" />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12">
          <div className="max-w-md text-center space-y-8">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="relative">
                <Gamepad2 className="h-12 w-12 text-neon-magenta animate-glow" />
                <div className="absolute inset-0 bg-neon-magenta/20 blur-lg animate-pulse" />
              </div>
              <div>
                <h1 className="font-heading font-black text-4xl">
                  <span className="text-wmx-dark">WMX</span>
                  <span className="text-glow-magenta ml-2">TOPUP</span>
                </h1>
                <p className="text-retro-gold font-retro text-sm uppercase tracking-wider">ARCADE PLATFORM</p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Zap className="h-8 w-8 text-neon-cyan" />
                  <div className="absolute inset-0 bg-neon-cyan/20 blur-lg" />
                </div>
                <div className="text-left">
                  <h3 className="font-heading font-bold text-wmx-dark">Lightning Fast</h3>
                  <p className="text-wmx-gray-600 text-sm">Instant top-up processing</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Shield className="h-8 w-8 text-retro-gold" />
                  <div className="absolute inset-0 bg-retro-gold/20 blur-lg" />
                </div>
                <div className="text-left">
                  <h3 className="font-heading font-bold text-wmx-dark">Ultra Secure</h3>
                  <p className="text-wmx-gray-600 text-sm">Bank-level security</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Star className="h-8 w-8 text-neon-magenta" />
                  <div className="absolute inset-0 bg-neon-magenta/20 blur-lg" />
                </div>
                <div className="text-left">
                  <h3 className="font-heading font-bold text-wmx-dark">Best Price</h3>
                  <p className="text-wmx-gray-600 text-sm">Guaranteed lowest rates</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-heading font-bold text-glow-magenta mb-1">1M+</div>
                <div className="text-wmx-gray-600 text-xs uppercase tracking-wide">Players</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-heading font-bold text-glow-cyan mb-1">500+</div>
                <div className="text-wmx-gray-600 text-xs uppercase tracking-wide">Games</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <GlassCard className="w-full max-w-md space-y-8">
            <div className="text-center space-y-4">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
                <div className="relative">
                  <Gamepad2 className="h-8 w-8 text-neon-magenta" />
                  <div className="absolute inset-0 bg-neon-magenta/20 blur-lg" />
                </div>
                <span className="font-heading font-bold text-xl bg-gradient-to-r from-neon-magenta to-neon-cyan bg-clip-text text-transparent">
                  WMX TOPUP
                </span>
              </div>

              <h2 className="font-heading font-bold text-2xl text-wmx-dark">
                Welcome Back
              </h2>
              <p className="text-wmx-gray-600">
                Sign in to your gaming account
              </p>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-neon-magenta/30 transition-all duration-300"
                onClick={() => handleOAuthSignIn('google')}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-neon-cyan/30 transition-all duration-300"
                onClick={() => handleOAuthSignIn('github')}
                disabled={isLoading}
              >
                <Github className="w-5 h-5 mr-2" />
                Continue with GitHub
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-wmx-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-wmx-gray-500 font-medium">Or continue with email</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-wmx-dark font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-wmx-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-2 border-wmx-gray-200 focus:border-neon-magenta focus:ring-1 focus:ring-neon-magenta/20 transition-all duration-300"
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
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-12 h-12 border-2 border-wmx-gray-200 focus:border-neon-magenta focus:ring-1 focus:ring-neon-magenta/20 transition-all duration-300"
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
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <GradientButton
                type="submit"
                variant="primary"
                className="w-full h-12 font-heading uppercase tracking-wider"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    SIGNING IN...
                  </>
                ) : (
                  <>
                    SIGN IN
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </GradientButton>
            </form>

            {/* Demo Credentials */}
            <div className="bg-wmx-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-wmx-dark mb-2 text-sm">Demo Accounts:</h3>
              <div className="space-y-1 text-xs text-wmx-gray-600">
                <div>Admin: admin@wmx.com / admin123</div>
                <div>User: user@wmx.com / user123</div>
              </div>
            </div>

            {/* Footer Links */}
            <div className="text-center space-y-4">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-neon-magenta hover:text-neon-cyan transition-colors font-medium"
              >
                Forgot your password?
              </Link>
              
              <div className="text-sm text-wmx-gray-600">
                Don&apos;t have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="text-neon-magenta hover:text-neon-cyan font-medium transition-colors"
                >
                  Sign up here
                </Link>
              </div>
              
              <div className="pt-4">
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
