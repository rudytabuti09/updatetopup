'use client'

import Link from "next/link"
import { Star, TrendingUp, Sparkles, Gamepad2, Zap } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"

const popularGames = [
  {
    id: "mobile-legends",
    name: "Mobile Legends",
    category: "MOBA",
    image: "🏆",
    price: "Mulai dari Rp 15.000",
    rating: 4.9,
    isPopular: true,
    gradient: "from-blue-600 to-purple-600"
  },
  {
    id: "free-fire",
    name: "Free Fire",
    category: "Battle Royale", 
    image: "🔥",
    price: "Mulai dari Rp 10.000",
    rating: 4.8,
    isPopular: true,
    gradient: "from-orange-500 to-red-600"
  },
  {
    id: "pubg-mobile",
    name: "PUBG Mobile",
    category: "Battle Royale",
    image: "🎯",
    price: "Mulai dari Rp 16.000",
    rating: 4.7,
    isPopular: false,
    gradient: "from-yellow-500 to-orange-600"
  },
  {
    id: "genshin-impact",
    name: "Genshin Impact",
    category: "RPG",
    image: "⚡",
    price: "Mulai dari Rp 16.000",
    rating: 4.8,
    isPopular: true,
    gradient: "from-purple-500 to-pink-600"
  },
  {
    id: "valorant",
    name: "Valorant",
    category: "FPS",
    image: "🎮",
    price: "Mulai dari Rp 20.000",
    rating: 4.6,
    isPopular: false,
    gradient: "from-red-500 to-pink-600"
  },
  {
    id: "cod-mobile",
    name: "Call of Duty Mobile",
    category: "FPS",
    image: "💀",
    price: "Mulai dari Rp 27.000",
    rating: 4.5,
    isPopular: false,
    gradient: "from-gray-700 to-gray-900"
  },
  {
    id: "honkai-star-rail",
    name: "Honkai Star Rail",
    category: "RPG",
    image: "🌟",
    price: "Mulai dari Rp 16.000",
    rating: 4.7,
    isPopular: true,
    gradient: "from-indigo-500 to-purple-600"
  },
  {
    id: "arena-of-valor",
    name: "Arena of Valor",
    category: "MOBA",
    image: "⚔️",
    price: "Mulai dari Rp 14.000",
    rating: 4.4,
    isPopular: false,
    gradient: "from-teal-500 to-blue-600"
  }
]

export function PopularGames() {
  return (
    <section className="py-20 relative bg-gradient-to-b from-transparent via-retro-lavender/5 to-transparent">
      {/* Retro Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-retro bg-[length:40px_40px]" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          {/* Section Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-neon-magenta/10 to-neon-cyan/10 border border-neon-magenta/20">
            <Sparkles className="w-4 h-4 text-neon-magenta" />
            <span className="text-sm font-retro font-semibold uppercase tracking-wider text-wmx-dark">Featured Games</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-heading font-black mb-4">
            <span className="text-wmx-dark">HOT </span>
            <span className="text-glow-magenta">GAMES</span>
          </h2>
          <p className="text-wmx-gray-600 max-w-2xl mx-auto font-sans">
            Level up your gaming experience with instant top-ups and exclusive deals
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularGames.map((game, index) => (
              <Link key={game.id} href={`/catalog/${game.id}`}>
                <div 
                  className="group relative animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <GlassCard hover className="p-0 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-neon">
                    {/* Popular Badge */}
                    {game.isPopular && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-retro-gold to-retro-orange text-wmx-dark text-xs font-retro font-bold px-3 py-1 rounded-full flex items-center z-10 animate-pulse">
                        <Zap className="h-3 w-3 mr-1" />
                        HOT
                      </div>
                    )}

                    {/* Game Icon with Retro Gradient */}
                    <div className={`relative bg-gradient-to-br ${game.gradient} p-8 text-center overflow-hidden`}>
                      <div className="absolute inset-0 bg-grid-retro bg-[length:20px_20px] opacity-20" />
                      <div className="relative text-5xl md:text-6xl filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-300">
                        {game.image}
                      </div>
                      
                      {/* Neon Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Scan Line Effect */}
                      <div className="absolute inset-x-0 h-px bg-white/50 top-0 group-hover:top-full transition-all duration-1000" />
                    </div>

                    {/* Game Info */}
                    <div className="p-4 space-y-3">
                      <h3 className="font-heading font-bold text-wmx-dark text-base md:text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-neon-magenta group-hover:to-neon-cyan group-hover:bg-clip-text transition-all duration-300">
                        {game.name}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-retro uppercase tracking-wider text-wmx-gray-500">{game.category}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-retro-gold fill-current" />
                          <span className="text-xs font-bold text-wmx-gray-700">{game.rating}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-wmx-gray-200">
                        <p className="text-sm font-semibold bg-gradient-to-r from-neon-magenta to-neon-cyan bg-clip-text text-transparent">
                          {game.price}
                        </p>
                      </div>
                      
                      {/* Quick Action */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="w-full py-2 px-4 bg-gradient-to-r from-neon-magenta to-neon-cyan text-white font-heading text-xs uppercase tracking-wider rounded-lg hover:shadow-neon transition-all">
                          Top Up Now
                        </button>
                      </div>
                    </div>
                  </GlassCard>
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
              <span className="text-wmx-dark">MORE </span>
              <span className="text-retro-gold">SERVICES</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Mobile Credit", icon: "📱", href: "/catalog?category=pulsa", gradient: "from-neon-green to-retro-sky" },
              { name: "E-Wallet", icon: "💳", href: "/catalog?category=emoney", gradient: "from-neon-blue to-neon-cyan" },
              { name: "Social Boost", icon: "🚀", href: "/catalog?category=sosmed", gradient: "from-neon-pink to-neon-magenta" },
              { name: "Utilities", icon: "⚡", href: "/catalog?category=ppob", gradient: "from-retro-gold to-retro-orange" },
            ].map((service, index) => (
              <Link key={service.name} href={service.href}>
                <div 
                  className="group animate-slide-up"
                  style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                >
                  <GlassCard hover className="p-6 text-center relative overflow-hidden transition-all duration-300 hover:scale-105">
                    <div className="relative z-10">
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                        {service.icon}
                      </div>
                      <h4 className="font-heading font-bold text-sm text-wmx-dark group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-neon-magenta group-hover:to-neon-cyan group-hover:bg-clip-text transition-all uppercase tracking-wide">
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
