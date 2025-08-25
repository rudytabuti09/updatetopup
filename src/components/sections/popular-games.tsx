'use client'

import Link from "next/link"
import { Star, TrendingUp, Sparkles, Gamepad2, Zap, Trophy, Flame, Target, Joystick, Skull, Sparkle, Swords, Smartphone, CreditCard, Rocket, BoltIcon } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { LogoImage } from "@/components/ui/logo-image"

const popularGames = [
  {
    id: "mobile-legends",
    name: "Mobile Legends",
    category: "MOBA",
    logoSrc: "/logos/games/mobile-legends.png",
    fallbackIcon: Trophy,
    fallbackColor: "text-blue-500",
    price: "Mulai dari Rp 15.000",
    rating: 4.9,
    isPopular: true,
    gradient: "from-blue-600 to-purple-600"
  },
  {
    id: "free-fire",
    name: "Free Fire",
    category: "Battle Royale", 
    logoSrc: "/logos/games/free-fire.png",
    fallbackIcon: Flame,
    fallbackColor: "text-orange-500",
    price: "Mulai dari Rp 10.000",
    rating: 4.8,
    isPopular: true,
    gradient: "from-orange-500 to-red-600"
  },
  {
    id: "pubg-mobile",
    name: "PUBG Mobile",
    category: "Battle Royale",
    logoSrc: "/logos/games/pubg-mobile.png",
    fallbackIcon: Target,
    fallbackColor: "text-yellow-500",
    price: "Mulai dari Rp 16.000",
    rating: 4.7,
    isPopular: false,
    gradient: "from-yellow-500 to-orange-600"
  },
  {
    id: "genshin-impact",
    name: "Genshin Impact",
    category: "RPG",
    logoSrc: "/logos/games/genshin-impact.png",
    fallbackIcon: Zap,
    fallbackColor: "text-purple-500",
    price: "Mulai dari Rp 16.000",
    rating: 4.8,
    isPopular: true,
    gradient: "from-purple-500 to-pink-600"
  },
  {
    id: "valorant",
    name: "Valorant",
    category: "FPS",
    logoSrc: "/logos/games/valorant.png",
    fallbackIcon: Joystick,
    fallbackColor: "text-red-500",
    price: "Mulai dari Rp 20.000",
    rating: 4.6,
    isPopular: false,
    gradient: "from-red-500 to-pink-600"
  },
  {
    id: "cod-mobile",
    name: "Call of Duty Mobile",
    category: "FPS",
    logoSrc: "/logos/games/cod-mobile.png",
    fallbackIcon: Skull,
    fallbackColor: "text-gray-600",
    price: "Mulai dari Rp 27.000",
    rating: 4.5,
    isPopular: false,
    gradient: "from-gray-700 to-gray-900"
  },
  {
    id: "honkai-star-rail",
    name: "Honkai Star Rail",
    category: "RPG",
    logoSrc: "/logos/games/honkai-star-rail.png",
    fallbackIcon: Sparkle,
    fallbackColor: "text-indigo-500",
    price: "Mulai dari Rp 16.000",
    rating: 4.7,
    isPopular: true,
    gradient: "from-indigo-500 to-purple-600"
  },
  {
    id: "arena-of-valor",
    name: "Arena of Valor",
    category: "MOBA",
    logoSrc: "/logos/games/arena-of-valor.png",
    fallbackIcon: Swords,
    fallbackColor: "text-teal-500",
    price: "Mulai dari Rp 14.000",
    rating: 4.4,
    isPopular: false,
    gradient: "from-teal-500 to-blue-600"
  }
]

export function PopularGames() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Light Retro Background Layers */}
      <div className="absolute inset-0">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 retro-grid opacity-5" />
        
        {/* Floating Particles */}
        <div className="absolute top-20 left-10 w-3 h-3 bg-neon-magenta rounded-full animate-float opacity-20 blur-sm" />
        <div className="absolute top-32 right-20 w-4 h-4 bg-neon-cyan rounded-full animate-float opacity-15 blur-sm" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-retro-gold rounded-full animate-float opacity-25 blur-sm" style={{animationDelay: '2s'}} />
        <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-neon-pink rounded-full animate-float opacity-20 blur-sm" style={{animationDelay: '3s'}} />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          {/* Retro Gaming Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-neon-magenta/20 to-neon-cyan/20 border border-neon-magenta/30 backdrop-blur-sm mb-6">
            <Gamepad2 className="w-5 h-5 text-neon-magenta animate-pulse" />
            <span className="text-sm font-retro font-semibold text-neon-magenta uppercase tracking-wider">
              Popular Games
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-heading font-black mb-4">
            <span className="text-glow-magenta">GAME</span>{" "}
            <span className="text-neon-cyan">FAVORIT</span>
          </h2>
          <p className="text-wmx-gray-700 text-lg max-w-2xl mx-auto font-sans">
            Pilih dari berbagai game populer dengan harga terbaik dan proses instan
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {popularGames.map((game, index) => (
              <Link key={game.id} href={`/catalog/${game.id}`}>
                <div 
                  className="group relative animate-slide-up"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Outer Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-magenta/20 to-neon-cyan/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110" />
                  
                  {/* Game Card */}
                  <div className="relative bg-white/95 backdrop-blur-xl border border-neon-magenta/20 rounded-xl overflow-hidden transition-all duration-500 hover:border-neon-magenta hover:shadow-glow-magenta group-hover:scale-105">
                    {/* Subtle neon glow line */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-magenta/50 to-transparent"></div>
                    {/* Hot Badge */}
                    {game.isPopular && (
                      <div className="absolute top-3 right-3 z-30">
                        <div className="bg-gradient-to-r from-neon-magenta to-neon-cyan text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          <span>Popular</span>
                        </div>
                      </div>
                    )}

                    {/* Game Icon Section */}
                    <div className="relative h-32 overflow-hidden">
                      {/* Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-90`} />
                      
                      {/* Game Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="group-hover:scale-110 transition-transform duration-300">
                          <LogoImage
                            src={game.logoSrc}
                            alt={`${game.name} Logo`}
                            fallbackIcon={game.fallbackIcon}
                            fallbackColor={game.fallbackColor}
                            width={64}
                            height={64}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Game Info Section */}
                    <div className="p-4 space-y-3">
                      {/* Game Name */}
                      <h3 className="font-retro font-bold text-wmx-gray-800 text-base leading-tight uppercase tracking-wide">
                        {game.name}
                      </h3>
                      
                      {/* Category & Rating */}
                      <div className="flex items-center justify-between">
                        <div className="px-2 py-1 bg-wmx-gray-100 border border-wmx-gray-200 rounded text-xs font-medium text-wmx-gray-600 uppercase">
                          {game.category}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-medium text-wmx-gray-600">{game.rating}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="pt-2 border-t border-wmx-gray-200">
                        <p className="text-sm font-medium text-neon-magenta">
                          {game.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-16">
            <Link href="/catalog">
              <GradientButton variant="primary" size="xl" className="group">
                <Gamepad2 className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                EXPLORE ALL GAMES
              </GradientButton>
            </Link>
          </div>
        </div>

        {/* Other Services Quick Links */}
        <div className="mt-24">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-heading font-bold mb-2">
              <span className="text-wmx-gray-800">MORE </span>
              <span className="text-retro-gold">SERVICES</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { 
                name: "Mobile Credit", 
                logoSrc: "/logos/payments/pulsa.png",
                fallbackIcon: Smartphone,
                fallbackColor: "text-white",
                href: "/catalog?category=pulsa", 
                gradient: "from-neon-green to-retro-sky" 
              },
              { 
                name: "E-Wallet", 
                logoSrc: "/logos/payments/ewallet.png",
                fallbackIcon: CreditCard,
                fallbackColor: "text-white",
                href: "/catalog?category=emoney", 
                gradient: "from-neon-blue to-neon-cyan" 
              },
              { 
                name: "Social Boost", 
                logoSrc: "/logos/payments/social.png",
                fallbackIcon: Rocket,
                fallbackColor: "text-white",
                href: "/catalog?category=sosmed", 
                gradient: "from-neon-pink to-neon-magenta" 
              },
              { 
                name: "Utilities", 
                logoSrc: "/logos/payments/utilities.png",
                fallbackIcon: BoltIcon,
                fallbackColor: "text-white",
                href: "/catalog?category=ppob", 
                gradient: "from-retro-gold to-retro-orange" 
              },
            ].map((service, index) => (
              <Link key={service.name} href={service.href}>
                <div 
                  className="group animate-slide-up"
                  style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                >
                  <GlassCard hover className="p-6 text-center relative overflow-hidden transition-all duration-300 hover:scale-105">
                    <div className="relative z-10">
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                        <LogoImage
                          src={service.logoSrc}
                          alt={`${service.name} Icon`}
                          fallbackIcon={service.fallbackIcon}
                          fallbackColor={service.fallbackColor}
                          width={40}
                          height={40}
                        />
                      </div>
                      <h4 className="font-heading font-bold text-sm text-wmx-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-neon-magenta group-hover:to-neon-cyan group-hover:bg-clip-text transition-all uppercase tracking-wide">
                        {service.name}
                      </h4>
                    </div>
                    
                    {/* Background Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  </GlassCard>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
