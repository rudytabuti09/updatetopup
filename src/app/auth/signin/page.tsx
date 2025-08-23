'use client'

import * as React from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react'
import { RootLayout } from '@/components/layout/root-layout'
import { GlassCard } from '@/components/ui/glass-card'
import { GradientButton } from '@/components/ui/gradient-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/ui/logo'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')

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
        setError('Email atau password salah')
      } else {
        const session = await getSession()
        if (session?.user.role === 'ADMIN' || session?.user.role === 'SUPER_ADMIN') {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      setError('Terjadi kesalahan saat login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <RootLayout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          
          {/* Logo */}
          <div className="text-center mb-8">
            <Logo size="lg" />
            <h1 className="text-2xl font-heading font-bold text-white mt-4 mb-2">
              Masuk ke Akun Anda
            </h1>
            <p className="text-white/70">
              Kelola pesanan dan akses fitur eksklusif
            </p>
          </div>

          <GlassCard>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/60"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-white/60"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <GradientButton
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="loading-spinner mr-2" />
                    Memproses...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Masuk
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </GradientButton>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/70">
                Belum punya akun?{' '}
                <button 
                  onClick={() => router.push('/auth/signup')}
                  className="text-neon-blue hover:text-neon-purple transition-colors font-medium"
                >
                  Daftar di sini
                </button>
              </p>
            </div>
          </GlassCard>

          {/* Demo Credentials */}
          <GlassCard className="mt-6">
            <div className="text-center">
              <h3 className="font-medium text-white mb-3">Demo Akun</h3>
              <div className="space-y-2 text-sm text-white/70">
                <div>Admin: admin@wmx.com / admin123</div>
                <div>User: user@wmx.com / user123</div>
              </div>
            </div>
          </GlassCard>

        </div>
      </div>
    </RootLayout>
  )
}
