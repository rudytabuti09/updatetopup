'use client'

import Link from "next/link"
import { Zap, Shield, Star, Gamepad2, Sparkles, Trophy } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { GradientButton } from "@/components/ui/gradient-button"
import { GlassCard } from "@/components/ui/glass-card"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-wmx-light via-retro-lavender/10 to-wmx-light">
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

      <div className="relative container mx-auto px-4 text-center z-10">
        <div className="max-w-5xl mx-auto">
          
          {/* Retro Badge */}
          <div className="mb-6 animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-neon-magenta/20 to-neon-cyan/20 border border-neon-magenta/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-neon-magenta" />
              <span className="text-sm font-retro font-semibold bg-gradient-to-r from-neon-magenta to-neon-cyan bg-clip-text text-transparent uppercase tracking-wider">
                Next-Gen Gaming Platform
              </span>
            </span>
          </div>

          {/* Hero Title & Tagline */}
          <div className="mb-12 animate-slide-up">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-black mb-6 leading-tight">
              <span className="block text-wmx-dark">WMX</span>
              <span className="block text-glow-magenta text-4xl md:text-6xl lg:text-7xl">TOPUP</span>
              <span className="block mt-2">
                <span className="text-retro-gold text-3xl md:text-4xl lg:text-5xl font-retro">
                  ARCADE
                </span>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-wmx-gray-700 mb-8 max-w-3xl mx-auto font-sans">
              Platform top up gaming terpercaya dengan sentuhan retro-futuristik.
              <br className="hidden md:block" />
              <span className="text-neon-magenta font-semibold">Instant • Secure • 24/7</span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <Link href="/catalog">
              <GradientButton variant="primary" size="xl" className="group">
                <Gamepad2 className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
                START GAME
              </GradientButton>
            </Link>
            <Link href="/tracking">
              <GradientButton variant="outline" size="xl">
                <Trophy className="mr-2 h-5 w-5" />
                Track Order
              </GradientButton>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-slide-up" style={{animationDelay: '0.4s'}}>
            <GlassCard hover className="text-center group">
              <div className="relative">
                <Zap className="h-12 w-12 text-neon-magenta mx-auto mb-4 group-hover:text-glow-magenta transition-all" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-neon-magenta/20 rounded-full blur-xl group-hover:bg-neon-magenta/30 transition-all" />
                </div>
              </div>
              <h3 className="font-heading font-bold text-lg mb-2 text-wmx-dark">Lightning Fast</h3>
              <p className="text-wmx-gray-600 text-sm">Instant processing</p>
            </GlassCard>
            
            <GlassCard hover className="text-center group">
              <div className="relative">
                <Star className="h-12 w-12 text-retro-gold mx-auto mb-4 group-hover:animate-spin transition-all" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-retro-gold/20 rounded-full blur-xl group-hover:bg-retro-gold/30 transition-all" />
                </div>
              </div>
              <h3 className="font-heading font-bold text-lg mb-2 text-wmx-dark">Best Price</h3>
              <p className="text-wmx-gray-600 text-sm">Guaranteed lowest rates</p>
            </GlassCard>
            
            <GlassCard hover className="text-center group">
              <div className="relative">
                <Shield className="h-12 w-12 text-neon-cyan mx-auto mb-4 group-hover:text-glow-cyan transition-all" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-neon-cyan/20 rounded-full blur-xl group-hover:bg-neon-cyan/30 transition-all" />
                </div>
              </div>
              <h3 className="font-heading font-bold text-lg mb-2 text-wmx-dark">Ultra Secure</h3>
              <p className="text-wmx-gray-600 text-sm">100% safe & trusted</p>
            </GlassCard>
          </div>

          {/* Statistics */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center animate-slide-up" style={{animationDelay: '0.6s'}}>
            <div className="group">
              <div className="text-3xl md:text-4xl font-heading font-bold text-glow-magenta mb-2 group-hover:scale-110 transition-transform">1M+</div>
              <div className="text-wmx-gray-600 text-sm font-sans uppercase tracking-wide">Players Served</div>
            </div>
            <div className="group">
              <div className="text-3xl md:text-4xl font-heading font-bold text-glow-cyan mb-2 group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-wmx-gray-600 text-sm font-sans uppercase tracking-wide">Always Online</div>
            </div>
            <div className="group">
              <div className="text-3xl md:text-4xl font-heading font-bold text-retro-gold mb-2 group-hover:scale-110 transition-transform">500+</div>
              <div className="text-wmx-gray-600 text-sm font-sans uppercase tracking-wide">Game Titles</div>
            </div>
            <div className="group">
              <div className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-neon-magenta to-neon-cyan bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">99%</div>
              <div className="text-wmx-gray-600 text-sm font-sans uppercase tracking-wide">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Retro Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-neon-magenta/50 rounded-full flex justify-center relative">
          <div className="w-1 h-3 bg-gradient-to-b from-neon-magenta to-neon-cyan rounded-full mt-2 animate-pulse" />
          <div className="absolute inset-0 rounded-full bg-neon-magenta/20 blur-md" />
        </div>
      </div>
    </section>
  )
}
