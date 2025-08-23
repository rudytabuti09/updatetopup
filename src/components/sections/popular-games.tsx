'use client'

import Link from "next/link"
import { Star, TrendingUp } from "lucide-react"
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
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Game <span className="gradient-text">Populer</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Top up untuk game favorit kamu dengan harga terbaik dan proses yang super cepat
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {popularGames.map((game) => (
              <Link key={game.id} href={`/catalog/${game.id}`}>
                <GlassCard hover className="p-4 group relative overflow-hidden">
                  {/* Popular Badge */}
                  {game.isPopular && (
                    <div className="absolute top-2 right-2 bg-gradient-primary text-white text-xs font-bold px-2 py-1 rounded-full flex items-center z-10">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Popular
                    </div>
                  )}

                  {/* Game Icon with Gradient Background */}
                  <div className={`relative mb-4 rounded-xl bg-gradient-to-br ${game.gradient} p-4 text-center`}>
                    <div className="text-4xl md:text-5xl filter drop-shadow-lg">
                      {game.image}
                    </div>
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Game Info */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-white text-sm md:text-base group-hover:text-neon-blue transition-colors">
                      {game.name}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/60">{game.category}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-white/70">{game.rating}</span>
                      </div>
                    </div>

                    <p className="text-neon-blue text-xs font-semibold">
                      {game.price}
                    </p>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl`} />
                </GlassCard>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link href="/catalog">
              <GradientButton variant="secondary" size="lg">
                Lihat Semua Game
              </GradientButton>
            </Link>
          </div>
        </div>

        {/* Other Services Quick Links */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-heading font-bold text-white mb-2">
              Layanan <span className="gradient-text">Lainnya</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { name: "Pulsa & Data", icon: "📱", href: "/catalog?category=pulsa", color: "from-green-500 to-teal-600" },
              { name: "E-Money", icon: "💳", href: "/catalog?category=emoney", color: "from-blue-500 to-cyan-600" },
              { name: "Social Media", icon: "📸", href: "/catalog?category=sosmed", color: "from-pink-500 to-rose-600" },
              { name: "PPOB", icon: "⚡", href: "/catalog?category=ppob", color: "from-yellow-500 to-orange-600" },
            ].map((service) => (
              <Link key={service.name} href={service.href}>
                <GlassCard hover className="p-4 text-center group">
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-2xl mb-3`}>
                    {service.icon}
                  </div>
                  <h4 className="text-white font-semibold text-sm group-hover:text-neon-blue transition-colors">
                    {service.name}
                  </h4>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
