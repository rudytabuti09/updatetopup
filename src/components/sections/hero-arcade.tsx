'use client'

import React from 'react'
import Link from 'next/link'
import { Gamepad2, Sparkles, Coins, Star, Zap, ChevronRight, Trophy, Flame, Target, Joystick } from 'lucide-react'
import { GradientButton } from '@/components/ui/gradient-button'
import { LogoImage } from '@/components/ui/logo-image'
import { cn } from '@/lib/utils'

// Popular game logos data
const gameLogos = [
  { 
    id: 'mlbb', 
    name: 'Mobile Legends', 
    color: 'from-blue-500 to-purple-600', 
    logoSrc: '/logos/games/mobile-legends.png',
    fallbackIcon: Trophy,
    fallbackColor: 'text-blue-500'
  },
  { 
    id: 'ff', 
    name: 'Free Fire', 
    color: 'from-orange-500 to-red-600', 
    logoSrc: '/logos/games/free-fire.png',
    fallbackIcon: Flame,
    fallbackColor: 'text-orange-500'
  },
  { 
    id: 'pubg', 
    name: 'PUBG Mobile', 
    color: 'from-yellow-500 to-orange-600', 
    logoSrc: '/logos/games/pubg-mobile.png',
    fallbackIcon: Target,
    fallbackColor: 'text-yellow-500'
  },
  { 
    id: 'valorant', 
    name: 'Valorant', 
    color: 'from-red-500 to-pink-600', 
    logoSrc: '/logos/games/valorant.png',
    fallbackIcon: Joystick,
    fallbackColor: 'text-red-500'
  },
]

export function HeroArcade() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Pastel Gradient Sky Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100 via-purple-100 to-pink-100" />
      
      {/* Retro Neon Grid Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 perspective-1000">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
        <div 
          className="absolute inset-0 retro-grid animate-grid-scroll"
          style={{
            backgroundImage: `
              linear-gradient(to right, #FF00FF33 1px, transparent 1px),
              linear-gradient(to bottom, #00FFFF33 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: 'rotateX(60deg) translateZ(-100px)',
            transformOrigin: 'center bottom'
          }}
        />
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Gamepad */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="relative">
            <Gamepad2 className="w-16 h-16 text-neon-magenta drop-shadow-glow-magenta" />
            <div className="absolute inset-0 blur-xl bg-neon-magenta/30" />
          </div>
        </div>
        
        {/* Arcade Tokens */}
        <div className="absolute top-40 right-20 animate-float" style={{animationDelay: '1s'}}>
          <div className="relative">
            <Coins className="w-12 h-12 text-retro-gold drop-shadow-glow-gold" />
            <div className="absolute inset-0 blur-xl bg-retro-gold/30" />
          </div>
        </div>
        
        {/* Pixel Sparkles */}
        <div className="absolute top-1/3 left-1/4 animate-pulse">
          <Sparkles className="w-8 h-8 text-neon-cyan drop-shadow-glow-cyan" />
        </div>
        <div className="absolute top-1/2 right-1/3 animate-pulse" style={{animationDelay: '0.5s'}}>
          <Star className="w-6 h-6 text-retro-gold drop-shadow-glow-gold" />
        </div>
        <div className="absolute bottom-1/3 left-1/3 animate-pulse" style={{animationDelay: '1s'}}>
          <Sparkles className="w-10 h-10 text-neon-magenta drop-shadow-glow-magenta" />
        </div>
      </div>

      {/* Neon Light Beams */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-neon-magenta/50 via-transparent to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-neon-cyan/50 via-transparent to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto">
          
          {/* Arcade Badge */}
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 backdrop-blur-md border-2 border-neon-magenta/30 shadow-glow-magenta">
              <Zap className="w-5 h-5 text-neon-magenta animate-pulse" />
              <span className="text-sm font-bold font-retro text-gray-800 uppercase tracking-wider">
                Arcade Edition • Est. 2024
              </span>
              <Zap className="w-5 h-5 text-neon-cyan animate-pulse" />
            </div>
          </div>

          {/* Main Headline */}
          <div className="mb-6 animate-slide-up">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-black leading-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
                Top Up Mudah & Cepat
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-magenta via-neon-purple to-neon-cyan mt-2">
                di WMX TOPUP
              </span>
            </h1>
          </div>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-3xl mx-auto font-sans animate-slide-up" style={{animationDelay: '0.1s'}}>
            Nikmati pengalaman top up tercepat & terpercaya untuk semua game favoritmu.
            <br />
            <span className="text-neon-magenta font-semibold">Instant • Secure • 24/7</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{animationDelay: '0.2s'}}>
            {/* Primary CTA */}
            <Link href="/catalog">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-neon-magenta to-neon-cyan text-white font-bold font-heading text-lg uppercase tracking-wider rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-neon-magenta/50">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-magenta to-neon-cyan opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                
                {/* Button Content */}
                <span className="relative flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5" />
                  Top Up Sekarang
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                
                {/* Pulse Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-magenta to-neon-cyan animate-pulse opacity-30" />
              </button>
            </Link>

            {/* Secondary CTA */}
            <Link href="/catalog">
              <button className="group px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-neon-cyan text-gray-800 font-bold font-heading text-lg uppercase tracking-wider rounded-lg transition-all hover:scale-105 hover:bg-neon-cyan/10 hover:border-neon-cyan hover:text-neon-cyan hover:shadow-glow-cyan">
                <span className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Lihat Katalog
                </span>
              </button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="text-center">
              <div className="text-3xl font-black font-heading text-neon-magenta">1M+</div>
              <div className="text-sm text-gray-600 font-sans">Players</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black font-heading text-neon-cyan">24/7</div>
              <div className="text-sm text-gray-600 font-sans">Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black font-heading text-retro-gold">500+</div>
              <div className="text-sm text-gray-600 font-sans">Games</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black font-heading text-neon-purple">99%</div>
              <div className="text-sm text-gray-600 font-sans">Success</div>
            </div>
          </div>

          {/* Game Showcase Row */}
          <div className="relative animate-slide-up" style={{animationDelay: '0.4s'}}>
            <div className="text-center mb-6">
              <span className="text-sm font-retro font-bold text-gray-600 uppercase tracking-wider">
                Popular Games
              </span>
            </div>
            
            <div className="flex justify-center gap-6 flex-wrap">
              {gameLogos.map((game, index) => (
                <div
                  key={game.id}
                  className="group relative animate-fade-in"
                  style={{animationDelay: `${0.5 + index * 0.1}s`}}
                >
                  {/* Neon Frame */}
                  <div className={cn(
                    "relative w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden",
                    "bg-white/80 backdrop-blur-sm",
                    "border-2 border-transparent",
                    "transition-all duration-300",
                    "hover:scale-110 hover:rotate-3"
                  )}>
                    {/* Gradient Border */}
                    <div className={cn(
                      "absolute inset-0 rounded-xl p-[2px]",
                      "bg-gradient-to-r",
                      game.color
                    )}>
                      <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                        {/* Game Icon/Logo */}
                        <LogoImage
                          src={game.logoSrc}
                          alt={`${game.name} Logo`}
                          fallbackIcon={game.fallbackIcon}
                          fallbackColor={game.fallbackColor}
                          width={56}
                          height={56}
                          className="md:w-14 md:h-14"
                        />
                      </div>
                    </div>
                    
                    {/* Glow Effect on Hover */}
                    <div className={cn(
                      "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity",
                      "bg-gradient-to-r blur-xl",
                      game.color
                    )} />
                  </div>
                  
                  {/* Game Name */}
                  <div className="mt-2 text-xs font-bold text-gray-600 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {game.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animated Scan Line */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent animate-scan-line" />
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}
