'use client'

import * as React from "react"
import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, Filter, Star, TrendingUp } from "lucide-react"
import { RootLayout } from "@/components/layout/root-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Product {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  isPopular: boolean
  provider: string
  image: string
  gradient: string
}

interface Service {
  id: string
  name: string
  category: string
  products: Product[]
  image: string
  gradient: string
}

// Mock data for demonstration (replace with API data)
const mockServices: Service[] = [
  {
    id: "mobile-legends",
    name: "Mobile Legends",
    category: "game",
    image: "🏆",
    gradient: "from-blue-600 to-purple-600",
    products: [
      { id: "ml-86", name: "86 Diamond", category: "game", price: 15000, rating: 4.9, isPopular: true, provider: "ML", image: "💎", gradient: "from-blue-600 to-purple-600" },
      { id: "ml-172", name: "172 Diamond", category: "game", price: 28000, rating: 4.9, isPopular: true, provider: "ML", image: "💎", gradient: "from-blue-600 to-purple-600" },
      { id: "ml-257", name: "257 Diamond", category: "game", price: 42000, rating: 4.8, isPopular: false, provider: "ML", image: "💎", gradient: "from-blue-600 to-purple-600" },
    ]
  },
  {
    id: "free-fire",
    name: "Free Fire",
    category: "game", 
    image: "🔥",
    gradient: "from-orange-500 to-red-600",
    products: [
      { id: "ff-70", name: "70 Diamond", category: "game", price: 10000, rating: 4.8, isPopular: true, provider: "FF", image: "💎", gradient: "from-orange-500 to-red-600" },
      { id: "ff-140", name: "140 Diamond", category: "game", price: 19000, rating: 4.8, isPopular: true, provider: "FF", image: "💎", gradient: "from-orange-500 to-red-600" },
      { id: "ff-355", name: "355 Diamond", category: "game", price: 48000, rating: 4.7, isPopular: false, provider: "FF", image: "💎", gradient: "from-orange-500 to-red-600" },
    ]
  },
  // Add more mock data for other categories
  {
    id: "telkomsel",
    name: "Telkomsel",
    category: "pulsa",
    image: "📱",
    gradient: "from-red-500 to-pink-600",
    products: [
      { id: "tsel-10k", name: "Pulsa 10.000", category: "pulsa", price: 11000, rating: 4.7, isPopular: true, provider: "TSEL", image: "📱", gradient: "from-red-500 to-pink-600" },
      { id: "tsel-25k", name: "Pulsa 25.000", category: "pulsa", price: 26000, rating: 4.7, isPopular: true, provider: "TSEL", image: "📱", gradient: "from-red-500 to-pink-600" },
    ]
  }
]

const categories = [
  { id: "all", name: "Semua", icon: "🏠" },
  { id: "game", name: "Game", icon: "🎮" },
  { id: "pulsa", name: "Pulsa & Data", icon: "📱" },
  { id: "emoney", name: "E-Money", icon: "💳" },
  { id: "sosmed", name: "Social Media", icon: "📸" },
  { id: "ppob", name: "PPOB", icon: "⚡" },
]

function CatalogContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [services, setServices] = React.useState<Service[]>(mockServices)
  const [filteredServices, setFilteredServices] = React.useState<Service[]>(mockServices)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState(searchParams.get('category') || 'all')
  const [sortBy, setSortBy] = React.useState('popular')
  const [loading, setLoading] = React.useState(false)

  // Filter and search logic
  React.useEffect(() => {
    let filtered = services

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(query) ||
        service.products.some(product => 
          product.name.toLowerCase().includes(query)
        )
      )
    }

    // Sort services
    if (sortBy === 'popular') {
      filtered = filtered.sort((a, b) => {
        const aPopular = a.products.filter(p => p.isPopular).length
        const bPopular = b.products.filter(p => p.isPopular).length
        return bPopular - aPopular
      })
    } else if (sortBy === 'name') {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'price') {
      filtered = filtered.sort((a, b) => {
        const aMinPrice = Math.min(...a.products.map(p => p.price))
        const bMinPrice = Math.min(...b.products.map(p => p.price))
        return aMinPrice - bMinPrice
      })
    }

    setFilteredServices(filtered)
  }, [services, selectedCategory, searchQuery, sortBy])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    // Update URL without page reload
    const params = new URLSearchParams(searchParams.toString())
    if (category === 'all') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    router.replace(`/catalog?${params.toString()}`)
  }

  const handleProductClick = (serviceId: string, productId: string) => {
    router.push(`/catalog/${serviceId}?product=${productId}`)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        
        {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-black mb-4">
              <span className="gradient-text">Katalog</span> Produk
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Pilih dari ratusan produk digital terbaik dengan harga termurah dan proses tercepat
            </p>
          </div>

          {/* Search and Filter Bar */}
          <GlassCard className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                <Input
                  placeholder="Cari game atau produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/60 h-12"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 bg-white/5 border-white/20 text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Populer</SelectItem>
                    <SelectItem value="name">Nama A-Z</SelectItem>
                    <SelectItem value="price">Harga Termurah</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </GlassCard>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={handleCategoryChange} className="mb-8">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto bg-white/5 p-1">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id}
                  value={category.id}
                  className="flex flex-col items-center p-3 data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
                >
                  <span className="text-xl mb-1">{category.icon}</span>
                  <span className="text-xs">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-8">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="loading-spinner" />
                  <span className="ml-3 text-white/70">Memuat produk...</span>
                </div>
              ) : filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredServices.map((service) => (
                    <GlassCard key={service.id} hover className="p-0 overflow-hidden group">
                      {/* Service Header */}
                      <div className={`relative p-4 bg-gradient-to-r ${service.gradient} text-center`}>
                        <div className="text-4xl mb-2">{service.image}</div>
                        <h3 className="font-bold text-white text-lg">{service.name}</h3>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      {/* Products List */}
                      <div className="p-4 space-y-3">
                        {service.products.slice(0, 3).map((product) => (
                          <div
                            key={product.id}
                            onClick={() => handleProductClick(service.id, product.id)}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group/product"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-white text-sm">{product.name}</span>
                                {product.isPopular && (
                                  <div className="bg-gradient-primary text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    Popular
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <div className="flex items-center text-yellow-400">
                                  <Star className="h-3 w-3 fill-current mr-1" />
                                  {product.rating}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-neon-blue">
                                Rp {product.price.toLocaleString('id-ID')}
                              </div>
                              {product.originalPrice && (
                                <div className="text-xs text-white/60 line-through">
                                  Rp {product.originalPrice.toLocaleString('id-ID')}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {service.products.length > 3 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-neon-blue hover:text-neon-purple"
                            onClick={() => router.push(`/catalog/${service.id}`)}
                          >
                            Lihat {service.products.length - 3} produk lainnya
                          </Button>
                        )}
                      </div>
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-white mb-2">Produk tidak ditemukan</h3>
                  <p className="text-white/70 mb-6">
                    Coba ubah kata kunci pencarian atau pilih kategori yang berbeda
                  </p>
                  <GradientButton 
                    variant="secondary"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                    }}
                  >
                    Reset Filter
                  </GradientButton>
                </div>
              )}
            </TabsContent>
          </Tabs>
      </div>
    </div>
  )
}

export default function CatalogPage() {
  return (
    <RootLayout>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="loading-spinner mb-4" />
            <p className="text-white/70">Memuat katalog...</p>
          </div>
        </div>
      }>
        <CatalogContent />
      </Suspense>
    </RootLayout>
  )
}
