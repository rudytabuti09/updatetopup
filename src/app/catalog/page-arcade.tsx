'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, Sparkles, Zap, ChevronRight, Star, TrendingUp, Gamepad2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Sample game catalog data
const gameProducts = [
  {
    id: 'ml',
    title: 'Mobile Legends',
    category: 'mobile',
    icon: '⚔️',
    color: 'from-blue-500 to-purple-600',
    startingPrice: 'Rp 12.000',
    rating: 4.9,
    popular: true,
    description: 'Bang Bang Diamond'
  },
  {
    id: 'ff',
    title: 'Free Fire',
    category: 'mobile',
    icon: '🔥',
    color: 'from-orange-500 to-red-600',
    startingPrice: 'Rp 10.000',
    rating: 4.8,
    popular: true,
    description: 'Diamond Top Up'
  },
  {
    id: 'pubg',
    title: 'PUBG Mobile',
    category: 'mobile',
    icon: '🎯',
    color: 'from-yellow-500 to-orange-600',
    startingPrice: 'Rp 15.000',
    rating: 4.7,
    popular: true,
    description: 'UC Purchase'
  },
  {
    id: 'valorant',
    title: 'Valorant',
    category: 'pc',
    icon: '🎮',
    color: 'from-red-500 to-pink-600',
    startingPrice: 'Rp 50.000',
    rating: 4.9,
    popular: true,
    description: 'Valorant Points'
  },
  {
    id: 'genshin',
    title: 'Genshin Impact',
    category: 'mobile',
    icon: '⭐',
    color: 'from-purple-500 to-indigo-600',
    startingPrice: 'Rp 65.000',
    rating: 4.8,
    description: 'Genesis Crystals'
  },
  {
    id: 'cod',
    title: 'Call of Duty Mobile',
    category: 'mobile',
    icon: '🔫',
    color: 'from-green-500 to-teal-600',
    startingPrice: 'Rp 20.000',
    rating: 4.6,
    description: 'CP Top Up'
  },
  {
    id: 'steam',
    title: 'Steam Wallet',
    category: 'voucher',
    icon: '💳',
    color: 'from-gray-600 to-gray-800',
    startingPrice: 'Rp 60.000',
    rating: 5.0,
    description: 'IDR Wallet Code'
  },
  {
    id: 'google',
    title: 'Google Play',
    category: 'voucher',
    icon: '🎁',
    color: 'from-green-500 to-blue-600',
    startingPrice: 'Rp 50.000',
    rating: 4.9,
    description: 'Gift Card'
  },
  {
    id: 'lol',
    title: 'League of Legends',
    category: 'pc',
    icon: '🏆',
    color: 'from-cyan-500 to-blue-600',
    startingPrice: 'Rp 35.000',
    rating: 4.7,
    description: 'Riot Points'
  },
  {
    id: 'hsr',
    title: 'Honkai Star Rail',
    category: 'mobile',
    icon: '🌟',
    color: 'from-pink-500 to-purple-600',
    startingPrice: 'Rp 65.000',
    rating: 4.8,
    description: 'Oneiric Shards'
  },
  {
    id: 'tof',
    title: 'Tower of Fantasy',
    category: 'mobile',
    icon: '🗼',
    color: 'from-indigo-500 to-purple-600',
    startingPrice: 'Rp 45.000',
    rating: 4.5,
    description: 'Tanium'
  },
  {
    id: 'apex',
    title: 'Apex Legends',
    category: 'pc',
    icon: '🎪',
    color: 'from-red-600 to-orange-600',
    startingPrice: 'Rp 75.000',
    rating: 4.6,
    description: 'Apex Coins'
  }
]

const filterCategories = [
  { id: 'all', label: 'All Games', icon: Gamepad2 },
  { id: 'mobile', label: 'Mobile', icon: Sparkles },
  { id: 'pc', label: 'PC Games', icon: Zap },
  { id: 'voucher', label: 'Voucher', icon: Star }
]

export default function CatalogPageArcade() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [filteredProducts, setFilteredProducts] = useState(gameProducts)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 500)
  }, [])

  useEffect(() => {
    let filtered = gameProducts

    // Apply category filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(product => product.category === activeFilter)
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }, [searchQuery, activeFilter])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with Soft Gradient and Retro Grid */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
      
      {/* Faint Retro Grid Lines */}
      <div className="fixed inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #FF00FF 1px, transparent 1px),
              linear-gradient(to bottom, #00FFFF 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      {/* Floating Orbs for Depth */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-neon-magenta/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Minimal Header with Neon Underline */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 group">
                <Gamepad2 className="w-8 h-8 text-neon-magenta group-hover:text-neon-cyan transition-colors" />
                <span className="font-heading font-bold text-xl bg-gradient-to-r from-neon-magenta to-neon-cyan bg-clip-text text-transparent">
                  WMX TOPUP
                </span>
              </Link>
              
              <nav className="hidden md:flex items-center gap-8">
                <Link href="/" className="text-gray-600 hover:text-neon-magenta transition-colors">Home</Link>
                <Link href="/catalog" className="relative text-neon-magenta font-semibold">
                  Catalog
                  <span className="absolute -bottom-5 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-magenta to-neon-cyan" />
                </Link>
                <Link href="/tracking" className="text-gray-600 hover:text-neon-cyan transition-colors">Track Order</Link>
                <Link href="/help" className="text-gray-600 hover:text-retro-gold transition-colors">Help</Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Sub-header */}
        <section className="py-12 px-4">
          <div className="container mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-neon-magenta/10 to-neon-cyan/10 border border-neon-magenta/20 mb-6">
              <Sparkles className="w-4 h-4 text-neon-magenta animate-pulse" />
              <span className="text-sm font-retro font-semibold text-gray-700 uppercase tracking-wider">
                Game Catalog
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-black mb-4">
              <span className="text-gray-800">Pilih </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-magenta to-neon-cyan">
                Game Favoritmu
              </span>
              <span className="text-gray-800"> untuk Top Up</span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dapatkan diamond, UC, dan item game lainnya dengan harga terbaik dan proses instant
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="px-4 pb-8">
          <div className="container mx-auto">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-neon-magenta transition-colors" />
                <input
                  type="text"
                  placeholder="Cari game atau voucher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:border-neon-magenta focus:outline-none focus:ring-4 focus:ring-neon-magenta/10 transition-all"
                />
                {/* Neon Border Glow Effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-magenta to-neon-cyan opacity-0 group-focus-within:opacity-20 blur-xl transition-opacity pointer-events-none" />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex justify-center">
              <div className="inline-flex bg-white/90 backdrop-blur-sm rounded-xl p-1 border border-gray-200">
                {filterCategories.map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveFilter(category.id)}
                      className={cn(
                        "relative px-6 py-3 rounded-lg font-medium transition-all",
                        "flex items-center gap-2",
                        activeFilter === category.id
                          ? "text-white"
                          : "text-gray-600 hover:text-gray-800"
                      )}
                    >
                      {/* Active Background */}
                      {activeFilter === category.id && (
                        <div className="absolute inset-0 bg-gradient-to-r from-neon-magenta to-neon-cyan rounded-lg" />
                      )}
                      
                      {/* Content */}
                      <span className="relative flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {category.label}
                      </span>
                      
                      {/* Sliding Underline Animation */}
                      {activeFilter === category.id && (
                        <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-white rounded-full" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="px-4 pb-20">
          <div className="container mx-auto">
            {isLoading ? (
              // Loading State
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white/60 rounded-xl h-64 animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              // Product Grid
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="group relative animate-fade-in"
                    style={{
                      animationDelay: `${index * 0.05}s`,
                      animationFillMode: 'backwards'
                    }}
                  >
                    {/* Product Card */}
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                      {/* Popular Badge */}
                      {product.popular && (
                        <div className="absolute top-2 right-2 z-10">
                          <div className="px-2 py-1 bg-gradient-to-r from-retro-gold to-retro-orange rounded-full">
                            <span className="text-xs font-bold text-white">HOT</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-neon-magenta/0 to-neon-cyan/0 group-hover:from-neon-magenta/10 group-hover:to-neon-cyan/10 transition-all pointer-events-none" />
                      
                      {/* Card Content */}
                      <div className="p-6">
                        {/* Game Icon */}
                        <div className="relative mb-4">
                          <div className={cn(
                            "w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r p-0.5",
                            product.color
                          )}>
                            <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                              <span className="text-4xl">{product.icon}</span>
                            </div>
                          </div>
                          
                          {/* Icon Glow on Hover */}
                          <div className={cn(
                            "absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity",
                            "bg-gradient-to-r",
                            product.color
                          )} />
                        </div>
                        
                        {/* Title */}
                        <h3 className="font-heading font-bold text-lg text-gray-800 mb-1">
                          {product.title}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-sm text-gray-500 mb-3">
                          {product.description}
                        </p>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3">
                          <Star className="w-4 h-4 text-retro-gold fill-retro-gold" />
                          <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                          <span className="text-xs text-gray-500">(1.2k)</span>
                        </div>
                        
                        {/* Price */}
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-1">Mulai dari</p>
                          <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-magenta to-neon-cyan">
                            {product.startingPrice}
                          </p>
                        </div>
                        
                        {/* CTA Button */}
                        <Link href={`/catalog/${product.id}`}>
                          <button className="w-full relative overflow-hidden group/btn">
                            <div className="relative px-4 py-3 bg-gradient-to-r from-neon-magenta to-neon-cyan text-white font-bold rounded-lg transition-all group-hover/btn:shadow-lg group-hover/btn:shadow-neon-magenta/30">
                              <span className="relative z-10 flex items-center justify-center gap-2">
                                <Zap className="w-4 h-4" />
                                Top Up
                                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                              </span>
                              
                              {/* Button Glow Pulse */}
                              <div className="absolute inset-0 bg-gradient-to-r from-neon-magenta to-neon-cyan opacity-0 group-hover/btn:opacity-100 blur-md transition-opacity" />
                            </div>
                          </button>
                        </Link>
                      </div>
                      
                      {/* Card Neon Aura on Hover */}
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-magenta/20 to-neon-cyan/20 blur-xl" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // No Results State
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-neon-magenta/10 to-neon-cyan/10 mb-4">
                  <Search className="w-10 h-10 text-neon-magenta" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Tidak ada hasil</h3>
                <p className="text-gray-600">Coba cari dengan kata kunci lain</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-neon-magenta to-neon-cyan text-white rounded-full shadow-2xl shadow-neon-magenta/30 hover:scale-110 transition-transform z-50 flex items-center justify-center group">
        <Filter className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
      </button>
    </div>
  )
}
