'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  RefreshCw, 
  Database, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Package,
  ShoppingCart,
  TrendingUp,
  Clock,
  Download,
  Upload,
  Search,
  Edit,
  Eye,
  BarChart3
} from 'lucide-react'
import { AdminLayout } from '@/components/layout/admin-layout'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { ProductModal } from '@/components/admin/product-modal'

interface Product {
  id: string
  name: string
  sku: string
  price: number
  buyPrice: number
  profit: number
  stock: number | null
  stockType: 'LIMITED' | 'UNLIMITED' | 'OUT_OF_STOCK'
  minStock: number | null
  maxStock: number | null
  isActive: boolean
  lastStockSync: string | null
  description?: string
  category: string
  sortOrder: number
  service: {
    id: string
    name: string
    category: {
      id: string
      name: string
    }
  }
}

interface Category {
  id: string
  name: string
  services?: Service[]
}

interface Service {
  id: string
  name: string
  categoryId: string
}

interface SyncResult {
  success: boolean
  message: string
  data?: {
    servicesAdded: number
    servicesUpdated: number
    productsAdded: number
    productsUpdated: number
    stockUpdated: number
  }
  error?: string
}

export default function AdminCatalogPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  
  // State for data
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('')
  const [stockFilter, setStockFilter] = useState('all')
  
  // State for modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  // State for loading and sync
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  
  const [syncResults, setSyncResults] = React.useState<{
    services?: SyncResult
    products?: SyncResult  
    stock?: SyncResult
    full?: SyncResult
  }>({})
  
  const [stats, setStats] = React.useState({
    totalServices: 0,
    totalProducts: 0,
    totalStock: 0,
    lastSyncTime: null as string | null,
    pendingSync: 0
  })

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/catalog/stats')
      const result = await response.json()
      
      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Failed to load catalog stats:', error)
    }
  }

  // Load initial stats
  React.useEffect(() => {
    loadStats()
  }, [])

  // Load data on component mount
  useEffect(() => {
    loadProducts()
    loadLowStockProducts()
    loadCategories()
  }, [])

  // Filter products based on search and filters
  useEffect(() => {
    let filtered = products

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.service.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Stock filter
    switch (stockFilter) {
      case 'limited':
        filtered = filtered.filter(p => p.stockType === 'LIMITED')
        break
      case 'unlimited':
        filtered = filtered.filter(p => p.stockType === 'UNLIMITED')
        break
      case 'out_of_stock':
        filtered = filtered.filter(p => p.stockType === 'OUT_OF_STOCK')
        break
      case 'low_stock':
        filtered = filtered.filter(p => 
          p.stockType === 'LIMITED' && 
          p.minStock && 
          p.stock !== null && 
          p.stock <= p.minStock
        )
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, stockFilter])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/products?limit=100')
      const result = await response.json()
      
      if (result.success) {
        setProducts(result.data.products)
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories?includeServices=true')
      const result = await response.json()
      
      if (result.success) {
        setCategories(result.data)
      }
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const loadLowStockProducts = async () => {
    try {
      const response = await fetch('/api/admin/stock?action=low-stock')
      const result = await response.json()
      
      if (result.success) {
        setLowStockProducts(result.data)
      }
    } catch (error) {
      console.error('Failed to load low stock products:', error)
    }
  }

  const handleSync = async (action: string) => {
    try {
      setSyncing(true)
      const response = await fetch('/api/admin/vip-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      })
      
      const result: SyncResult = await response.json()
      
      if (result.success) {
        toast({
          title: 'Sync Successful',
          description: result.message
        })
        
        // Reload products if sync affected them
        if (action === 'sync-products' || action === 'sync-stock' || action === 'full-sync') {
          await loadProducts()
          await loadLowStockProducts()
        }
      } else {
        toast({
          title: 'Sync Failed',
          description: result.message,
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sync with VIP-Reseller',
        variant: 'destructive'
      })
    } finally {
      setSyncing(false)
    }
  }

  const updateProductStock = async (productId: string, stock: number, reason: string) => {
    try {
      const response = await fetch('/api/admin/stock', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          stock,
          reason
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Stock updated successfully'
        })
        await loadProducts()
        await loadLowStockProducts()
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update stock',
        variant: 'destructive'
      })
    }
  }

  const getStockBadgeVariant = (stockType: string, stock: number | null, minStock: number | null) => {
    if (stockType === 'OUT_OF_STOCK') return 'destructive'
    if (stockType === 'UNLIMITED') return 'secondary'
    if (minStock && stock !== null && stock <= minStock) return 'destructive'
    return 'default'
  }

  const getStockText = (product: Product) => {
    if (product.stockType === 'UNLIMITED') return 'Unlimited'
    if (product.stockType === 'OUT_OF_STOCK') return 'Out of Stock'
    return product.stock?.toString() || '0'
  }

  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <GlassCard className="p-8">
            <p className="text-white/70">Access denied. Admin privileges required.</p>
          </GlassCard>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {/* Header with retro styling */}
      <div className="mb-8 relative">
        <div className="flex items-center space-x-4 mb-4">
          <h1 className="text-4xl font-heading font-bold text-transparent bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-purple bg-clip-text animate-pulse">
            CATALOG MANAGEMENT
          </h1>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-ping" />
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-ping" style={{animationDelay: '0.2s'}} />
            <div className="w-2 h-2 bg-neon-magenta rounded-full animate-ping" style={{animationDelay: '0.4s'}} />
          </div>
        </div>
        <p className="text-white/70 font-mono text-sm tracking-wide mb-4">
          {">"} Kelola produk, stock, dan sinkronisasi dengan VIP-Reseller
        </p>
        <div className="neon-divider mb-6" />
        
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-neon-green hover:bg-neon-green/80 text-black font-semibold"
          >
            <Package className="w-4 h-4 mr-2" />
            Tambah Produk
          </Button>
          
          <Button
            onClick={() => handleSync('sync-stock')}
            disabled={syncing}
            variant="outline"
            className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            Sync Stock
          </Button>
          
          <Button
            onClick={() => handleSync('full-sync')}
            disabled={syncing}
            className="bg-neon-magenta hover:bg-neon-magenta/80 text-black font-semibold"
          >
            <Download className="w-4 h-4 mr-2" />
            Full Sync
          </Button>
        </div>
      </div>

      {/* Stats Grid with enhanced retro styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total Products */}
        <GlassCard variant="cyber" hover glow>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-mono text-neon-cyan uppercase tracking-wider">PRODUCT_COUNT.DB</p>
              <p className="text-3xl font-bold text-white font-mono">{products.length.toLocaleString()}</p>
              <p className="text-xs text-neon-green flex items-center">
                <span className="mr-1">▲</span> {products.filter(p => p.isActive).length} ACTIVE
              </p>
            </div>
            <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-blue flex items-center justify-center shadow-glow-cyan">
              <Package className="h-7 w-7 text-black" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2">
            <div className="text-xs text-white/40 font-mono">[01]</div>
          </div>
        </GlassCard>

        {/* Low Stock Alert */}
        <GlassCard variant="cyber" hover className="border-orange-500/30">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-mono text-orange-400 uppercase tracking-wider animate-pulse">LOW_STOCK.WAR</p>
              <p className="text-3xl font-bold text-orange-300 font-mono animate-pulse">{lowStockProducts.length}</p>
              <p className="text-xs text-orange-400 uppercase font-mono">NEEDS_RESTOCK</p>
            </div>
            <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.5)] animate-pulse">
              <AlertTriangle className="h-7 w-7 text-black" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2">
            <div className="text-xs text-orange-400/60 font-mono animate-pulse">[!]</div>
          </div>
        </GlassCard>

        {/* Total Services */}
        <GlassCard variant="cyber" hover>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-mono text-neon-magenta uppercase tracking-wider">SERVICES.SRV</p>
              <p className="text-3xl font-bold text-white font-mono">{categories.length}</p>
              <p className="text-xs text-neon-green flex items-center">
                <span className="mr-1">▲</span> CATEGORIES
              </p>
            </div>
            <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-neon-green to-neon-cyan flex items-center justify-center shadow-glow-cyan animate-pulse">
              <Database className="h-7 w-7 text-black" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2">
            <div className="text-xs text-white/40 font-mono">[02]</div>
          </div>
        </GlassCard>

        {/* Sync Status */}
        <GlassCard variant="neon" hover>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-mono text-retro-gold uppercase tracking-wider">SYNC_STATUS.LOG</p>
              <p className="text-3xl font-bold text-white font-mono">
                {syncing ? (
                  <RefreshCw className="h-8 w-8 animate-spin text-neon-cyan" />
                ) : (
                  <CheckCircle className="h-8 w-8 text-neon-green" />
                )}
              </p>
              <p className="text-xs text-retro-gold flex items-center">
                {syncing ? 'SYNCING...' : 'READY'}
              </p>
            </div>
            <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-retro-gold to-retro-orange flex items-center justify-center shadow-glow-gold">
              <RefreshCw className={`h-7 w-7 text-black ${syncing ? 'animate-spin' : ''}`} />
            </div>
          </div>
          <div className="absolute bottom-2 right-2">
            <div className="text-xs text-white/40 font-mono">[03]</div>
          </div>
        </GlassCard>

      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="sync">VIP-Reseller Sync</TabsTrigger>
          <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="all">All Products</option>
              <option value="limited">Limited Stock</option>
              <option value="unlimited">Unlimited</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="low_stock">Low Stock</option>
            </select>
          </div>

          {/* Products List */}
          <GlassCard variant="cyber">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neon-cyan uppercase font-mono tracking-wider">PRODUCT_DB.SYS ({filteredProducts.length})</h2>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="loading-spinner mb-4" />
                <p className="text-white/70 font-mono">Loading product database...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="border border-white/10 rounded-lg p-4 space-y-2 bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-white">{product.name}</h3>
                        <p className="text-sm text-white/60 font-mono">
                          {product.service.category.name} • {product.service.name}
                        </p>
                        <p className="text-xs text-white/40 font-mono">SKU: {product.sku}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded font-mono uppercase ${
                          product.isActive 
                            ? 'bg-neon-green/20 text-neon-green border border-neon-green/30' 
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {product.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                        
                        <span className={`text-xs px-2 py-1 rounded font-mono uppercase ${
                          product.stockType === 'OUT_OF_STOCK' 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : product.stockType === 'UNLIMITED' 
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : product.minStock && product.stock !== null && product.stock <= product.minStock
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            : 'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {getStockText(product)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                      <div className="flex gap-4 text-sm font-mono text-white/70">
                        <span>PRICE: Rp {product.price.toLocaleString()}</span>
                        <span>BUY: Rp {product.buyPrice.toLocaleString()}</span>
                        <span className="text-neon-green">PROFIT: Rp {product.profit.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProduct(product)
                            setShowEditModal(true)
                          }}
                          className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 font-mono"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          EDIT
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProduct(product)}
                          className="border-neon-green text-neon-green hover:bg-neon-green/10 font-mono"
                        >
                          <Package className="w-4 h-4 mr-1" />
                          STOCK
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredProducts.length === 0 && (
                  <div className="text-center py-8 text-white/60 font-mono">
                    NO PRODUCTS FOUND IN DATABASE
                  </div>
                )}
              </div>
            )}
          </GlassCard>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <GlassCard variant="cyber">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neon-magenta uppercase font-mono tracking-wider">VIP_RESELLER.SYNC</h2>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-neon-magenta rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-neon-pink rounded-full animate-pulse" style={{animationDelay: '0.3s'}} />
              </div>
            </div>
            <p className="text-white/60 font-mono text-sm mb-6">
              {">"} Sinkronisasi data dengan VIP-Reseller API
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => handleSync('sync-services')}
                disabled={syncing}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 font-mono"
              >
                <Download className="w-6 h-6 mb-2" />
                SYNC SERVICES
                <span className="text-xs text-white/60">Update service list</span>
              </Button>
              
              <Button
                onClick={() => handleSync('sync-products')}
                disabled={syncing}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center border-neon-green text-neon-green hover:bg-neon-green/10 font-mono"
              >
                <Package className="w-6 h-6 mb-2" />
                SYNC PRODUCTS
                <span className="text-xs text-white/60">Update price list</span>
              </Button>
              
              <Button
                onClick={() => handleSync('sync-stock')}
                disabled={syncing}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center border-neon-magenta text-neon-magenta hover:bg-neon-magenta/10 font-mono"
              >
                <RefreshCw className="w-6 h-6 mb-2" />
                SYNC STOCK
                <span className="text-xs text-white/60">Update stock levels</span>
              </Button>
              
              <Button
                onClick={() => handleSync('full-sync')}
                disabled={syncing}
                className="h-20 flex flex-col items-center justify-center bg-retro-gold hover:bg-retro-gold/80 text-black font-mono font-bold"
              >
                <Upload className="w-6 h-6 mb-2" />
                FULL SYNC
                <span className="text-xs text-black/80">Sync everything</span>
              </Button>
            </div>
            
            {syncing && (
              <div className="bg-white/5 p-4 rounded-lg border border-neon-cyan/30 mt-4">
                <div className="flex items-center text-neon-cyan font-mono">
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  <span>SYNCHRONIZING WITH VIP-RESELLER...</span>
                </div>
              </div>
            )}
          </GlassCard>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <GlassCard variant="cyber" className="border-orange-500/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-orange-400 uppercase font-mono tracking-wider flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 animate-pulse" />
                STOCK_ALERTS.WAR ({lowStockProducts.length})
              </h2>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}} />
              </div>
            </div>
            
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-8 text-neon-green font-mono">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                ALL PRODUCTS WELL STOCKED - NO ALERTS
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex justify-between items-center p-3 border border-orange-500/30 rounded-lg bg-orange-500/5">
                    <div>
                      <h4 className="font-medium text-white font-mono">{product.name}</h4>
                      <p className="text-sm text-white/60 font-mono">
                        CURRENT: {product.stock} • MIN: {product.minStock}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded font-mono uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30 animate-pulse">
                      LOW STOCK
                    </span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </TabsContent>
      </Tabs>

      {/* Add Product Modal */}
      {showAddModal && (
        <ProductModal
          categories={categories}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            loadProducts()
          }}
        />
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          categories={categories}
          onClose={() => {
            setShowEditModal(false)
            setSelectedProduct(null)
          }}
          onSuccess={() => {
            setShowEditModal(false)
            setSelectedProduct(null)
            loadProducts()
          }}
        />
      )}

      {/* Edit Stock Modal */}
      {selectedProduct && !showEditModal && (
        <StockEditModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onUpdate={updateProductStock}
        />
      )}
    </AdminLayout>
  )
}

// Stock Edit Modal Component
interface StockEditModalProps {
  product: Product
  onClose: () => void
  onUpdate: (productId: string, stock: number, reason: string) => void
}

function StockEditModal({ product, onClose, onUpdate }: StockEditModalProps) {
  const [stock, setStock] = useState(product.stock?.toString() || '0')
  const [reason, setReason] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const stockNumber = parseInt(stock)
    if (!isNaN(stockNumber) && reason.trim()) {
      onUpdate(product.id, stockNumber, reason.trim())
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Edit Stock: {product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Current Stock: {product.stock || 0}</label>
              <Input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Reason for Change</label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Manual restock, Correction, etc."
                required
                className="mt-1"
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">Update Stock</Button>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
