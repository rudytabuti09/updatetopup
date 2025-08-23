'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { RootLayout } from '@/components/layout/root-layout'
import { Search as SearchIcon, Sparkles, Zap, Gamepad2, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

// Catalog items (can be replaced with API data later)
const catalogItems = [
  { id: 'ml', title: 'Mobile Legends', category: 'mobile', icon: '⚔️', color: 'from-blue-500 to-purple-600', startingPrice: 'Rp 12.000', rating: 4.9, popular: true, description: 'Bang Bang Diamond' },
  { id: 'ff', title: 'Free Fire', category: 'mobile', icon: '🔥', color: 'from-orange-500 to-red-600', startingPrice: 'Rp 10.000', rating: 4.8, popular: true, description: 'Diamond Top Up' },
  { id: 'pubg', title: 'PUBG Mobile', category: 'mobile', icon: '🎯', color: 'from-yellow-500 to-orange-600', startingPrice: 'Rp 15.000', rating: 4.7, popular: true, description: 'UC Purchase' },
  { id: 'valorant', title: 'Valorant', category: 'pc', icon: '🎮', color: 'from-red-500 to-pink-600', startingPrice: 'Rp 50.000', rating: 4.9, popular: true, description: 'Valorant Points' },
  { id: 'genshin', title: 'Genshin Impact', category: 'mobile', icon: '⭐', color: 'from-purple-500 to-indigo-600', startingPrice: 'Rp 65.000', rating: 4.8, popular: false, description: 'Genesis Crystals' },
  { id: 'cod', title: 'Call of Duty Mobile', category: 'mobile', icon: '🔫', color: 'from-green-500 to-teal-600', startingPrice: 'Rp 20.000', rating: 4.6, popular: false, description: 'CP Top Up' },
  { id: 'steam', title: 'Steam Wallet', category: 'voucher', icon: '💳', color: 'from-gray-600 to-gray-800', startingPrice: 'Rp 60.000', rating: 5.0, popular: false, description: 'IDR Wallet Code' },
  { id: 'google', title: 'Google Play', category: 'voucher', icon: '🎁', color: 'from-green-500 to-blue-600', startingPrice: 'Rp 50.000', rating: 4.9, popular: false, description: 'Gift Card' },
  { id: 'lol', title: 'League of Legends', category: 'pc', icon: '🏆', color: 'from-cyan-500 to-blue-600', startingPrice: 'Rp 35.000', rating: 4.7, popular: false, description: 'Riot Points' },
  { id: 'hsr', title: 'Honkai Star Rail', category: 'mobile', icon: '🌟', color: 'from-pink-500 to-purple-600', startingPrice: 'Rp 65.000', rating: 4.8, popular: false, description: 'Oneiric Shards' },
  { id: 'tof', title: 'Tower of Fantasy', category: 'mobile', icon: '🗼', color: 'from-indigo-500 to-purple-600', startingPrice: 'Rp 45.000', rating: 4.5, popular: false, description: 'Tanium' },
  { id: 'apex', title: 'Apex Legends', category: 'pc', icon: '🎪', color: 'from-red-600 to-orange-600', startingPrice: 'Rp 75.000', rating: 4.6, popular: false, description: 'Apex Coins' },
] as const

const filterCategories = [
  { id: 'all', label: 'All', icon: Gamepad2 },
  { id: 'mobile', label: 'Mobile', icon: Sparkles },
  { id: 'pc', label: 'PC', icon: Zap },
  { id: 'voucher', label: 'Voucher', icon: Star },
] as const

export default function CatalogPage() {
  const [search, setSearch] = useState('')
  const [active, setActive] = useState<typeof filterCategories[number]['id']>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  const products = useMemo(() => {
    let items = [...catalogItems]
    if (active !== 'all') items = items.filter(i => i.category === active)
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(i => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
    }
    return items
  }, [active, search])

  return (
    <RootLayout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background soft gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
        {/* Faint retro grid */}
        <div className="fixed inset-0 opacity-[0.035]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, #FF00FF 1px, transparent 1px), linear-gradient(to bottom, #00FFFF 1px, transparent 1px)`,
              backgroundSize: '100px 100px',
            }}
          />
        </div>

        {/* Hero sub-header */}
        <section className="relative z-10 pt-12 pb-6 px-4 text-center">
          <div className="container mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-neon-magenta/10 to-neon-cyan/10 border border-neon-magenta/20 mb-4">
              <Sparkles className="w-4 h-4 text-neon-magenta animate-pulse" />
              <span className="text-sm font-retro font-semibold text-gray-700 uppercase tracking-wider">Game Catalog</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-black">
              <span className="text-gray-800">Pilih </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-magenta to-neon-cyan">Game Favoritmu</span>
              <span className="text-gray-800"> untuk Top Up</span>
            </h1>
          </div>
        </section>

        {/* Search + Filters */}
        <section className="relative z-10 px-4 pb-4">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative group">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-neon-magenta transition-colors" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari game atau voucher..."
                  className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:border-neon-magenta focus:outline-none focus:ring-4 focus:ring-neon-magenta/10 transition-all"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-magenta to-neon-cyan opacity-0 group-focus-within:opacity-20 blur-xl transition-opacity pointer-events-none" />
              </div>
            </div>

            <div className="flex justify-center">
              <div className="inline-flex bg-white/90 backdrop-blur-sm rounded-xl p-1 border border-gray-200">
                {filterCategories.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActive(id)}
                    className={cn(
                      'relative px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2',
                      active === id ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                    )}
                  >
                    {active === id && <div className="absolute inset-0 bg-gradient-to-r from-neon-magenta to-neon-cyan rounded-lg" />}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {label}
                    </span>
                    {active === id && <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-white rounded-full" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Product grid */}
        <section className="relative z-10 px-4 pb-20">
          <div className="container mx-auto">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white/60 rounded-xl h-64 animate-pulse" />
                ))}
              </div>
            ) : products.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((p, idx) => (
                  <div key={p.id} className="group relative animate-slide-up" style={{ animationDelay: `${idx * 0.05}s`, animationFillMode: 'backwards' }}>
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                      {p.popular && (
                        <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-gradient-to-r from-retro-gold to-retro-orange rounded-full">
                          <span className="text-xs font-bold text-white">HOT</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-r from-neon-magenta/0 to-neon-cyan/0 group-hover:from-neon-magenta/10 group-hover:to-neon-cyan/10 transition-all pointer-events-none" />

                      <div className="p-6">
                        <div className="relative mb-4">
                          <div className={cn('w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r p-0.5', p.color)}>
                            <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                              <span className="text-4xl">{p.icon}</span>
                            </div>
                          </div>
                          <div className={cn('absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity bg-gradient-to-r', p.color)} />
                        </div>

                        <h3 className="font-heading font-bold text-lg text-gray-800 mb-1">{p.title}</h3>
                        <p className="text-sm text-gray-500 mb-3">{p.description}</p>

                        <div className="flex items-center gap-1 mb-3">
                          <Star className="w-4 h-4 text-retro-gold fill-retro-gold" />
                          <span className="text-sm font-semibold text-gray-700">{p.rating}</span>
                        </div>

                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-1">Mulai dari</p>
                          <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-magenta to-neon-cyan">{p.startingPrice}</p>
                        </div>

                        <Link href={`/catalog/${p.id}`}>
                          <button className="w-full relative overflow-hidden group/btn">
                            <div className="relative px-4 py-3 bg-gradient-to-r from-neon-magenta to-neon-cyan text-white font-bold rounded-lg transition-all group-hover/btn:shadow-lg group-hover/btn:shadow-neon-magenta/30">
                              <span className="relative z-10 flex items-center justify-center gap-2">
                                <Zap className="w-4 h-4" />
                                Top Up
                                <span className="sr-only">Top Up {p.title}</span>
                              </span>
                              <div className="absolute inset-0 bg-gradient-to-r from-neon-magenta to-neon-cyan opacity-0 group-hover/btn:opacity-100 blur-md transition-opacity" />
                            </div>
                          </button>
                        </Link>
                      </div>

                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-magenta/20 to-neon-cyan/20 blur-xl" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-neon-magenta/10 to-neon-cyan/10 mb-4">
                  <SearchIcon className="w-10 h-10 text-neon-magenta" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Tidak ada hasil</h3>
                <p className="text-gray-600">Coba cari dengan kata kunci lain</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </RootLayout>
  )
}
