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
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-transparent via-wmx-dark/5 to-transparent">
      {/* Animated Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 animate-pulse" />
        {/* Floating Particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-neon-magenta rounded-full animate-float opacity-60" />
        <div className="absolute top-32 right-20 w-3 h-3 bg-neon-cyan rounded-full animate-float opacity-40" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-40 left-1/4 w-1 h-1 bg-retro-gold rounded-full animate-float opacity-80" style={{animationDelay: '2s'}} />
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-neon-pink rounded-full animate-float opacity-50" style={{animationDelay: '3s'}} />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          {/* Retro Gaming Badge */}
          <div className="inline-block mb-8 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-magenta to-neon-cyan rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-opacity animate-pulse" />
            <div className="relative bg-wmx-dark/90 backdrop-blur-sm border-2 border-neon-magenta rounded-full px-6 py-3 flex items-center gap-3">
              <Gamepad2 className="w-5 h-5 text-neon-magenta animate-pulse" />
              <span className="text-sm font-mono font-bold uppercase tracking-widest text-white">POPULAR GAMES</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-neon-cyan rounded-full animate-ping" />
                <div className="w-2 h-2 bg-neon-magenta rounded-full animate-ping" style={{animationDelay: '0.5s'}} />
                <div className="w-2 h-2 bg-retro-gold rounded-full animate-ping" style={{animationDelay: '1s'}} />
              </div>
            </div>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-mono font-black mb-6 relative">
            <span className="bg-gradient-to-r from-neon-magenta via-neon-cyan to-neon-pink bg-clip-text text-transparent animate-pulse">
              &gt; HOT GAMES_
            </span>
            <div className="absolute -right-2 top-0 w-1 h-full bg-neon-cyan animate-pulse" />
          </h2>
          <p className="text-wmx-gray-400 max-w-3xl mx-auto font-mono text-lg leading-relaxed">
            [ SYSTEM ONLINE ] Boost your gaming performance with instant digital top-ups
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
                  
                  {/* Main Card */}
                  <div className="relative bg-wmx-dark/40 backdrop-blur-sm border-2 border-neon-magenta/30 rounded-2xl overflow-hidden transition-all duration-500 hover:border-neon-cyan/60 hover:shadow-[0_0_30px_rgba(255,0,255,0.3)] group-hover:scale-105">
                    {/* Popular Badge */}
                    {game.isPopular && (
                      <div className="absolute top-3 right-3 z-20">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-retro-gold to-retro-orange rounded-lg blur-sm animate-pulse" />
                          <div className="relative bg-gradient-to-r from-retro-gold to-retro-orange text-wmx-dark text-xs font-mono font-bold px-3 py-1 rounded-lg flex items-center border border-retro-gold/50">
                            <Zap className="h-3 w-3 mr-1 animate-bounce" />
                            <span className="tracking-wider">HOT</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Game Icon Section */}
                    <div className="relative h-32 overflow-hidden">
                      {/* Animated Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-80`} />
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.1)_49%,rgba(255,255,255,0.1)_51%,transparent_52%)] bg-[length:20px_20px] animate-pulse" />
                      
                      {/* Scan Lines */}
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_98%,rgba(0,255,255,0.3)_100%)] bg-[length:50px_100%] animate-[slide_2s_linear_infinite]" />
                      
                      {/* Game Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl filter drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                          {game.image}
                        </div>
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-neon-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Game Info Section */}
                    <div className="p-5 space-y-4 bg-gradient-to-b from-wmx-dark/60 to-wmx-dark/80">
                      {/* Game Name */}
                      <h3 className="font-mono font-bold text-white text-lg leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-neon-magenta group-hover:to-neon-cyan group-hover:bg-clip-text transition-all duration-300">
                        {game.name}
                      </h3>
                      
                      {/* Category & Rating */}
                      <div className="flex items-center justify-between">
                        <div className="px-2 py-1 bg-gradient-to-r from-neon-magenta/20 to-neon-cyan/20 border border-neon-magenta/30 rounded-md">
                          <span className="text-xs font-mono uppercase tracking-wider text-neon-cyan font-bold">
                            {game.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 bg-gradient-to-r from-retro-gold/20 to-retro-orange/20 px-2 py-1 rounded-md">
                          <Star className="h-3 w-3 text-retro-gold fill-current animate-pulse" />
                          <span className="text-xs font-mono font-bold text-retro-gold">{game.rating}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="pt-3 border-t border-neon-magenta/30">
                        <p className="text-sm font-mono font-bold bg-gradient-to-r from-neon-magenta to-neon-cyan bg-clip-text text-transparent">
                          &gt; {game.price}
                        </p>
                      </div>
                      
                      {/* Action Button */}
                      <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <button className="w-full py-2 px-4 bg-gradient-to-r from-neon-magenta via-neon-cyan to-neon-pink text-white font-mono text-xs uppercase tracking-wider rounded-lg border border-neon-magenta/50 hover:shadow-[0_0_20px_rgba(255,0,255,0.5)] hover:border-neon-cyan transition-all duration-300 relative overflow-hidden group/btn">
                          <span className="relative z-10">[ TOP UP NOW ]</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-300" />
                        </button>
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
