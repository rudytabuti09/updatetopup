'use client'

import * as React from 'react'
import { 
  Database, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Package,
  Edit,
  History,
  Search,
  Filter
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

interface Product {
  id: string
  name: string
  sku: string
  stock: number | null
  stockType: 'LIMITED' | 'UNLIMITED' | 'OUT_OF_STOCK'
  minStock: number | null
  maxStock: number | null
  lastStockSync: string | null
  service: {
    name: string
    category: {
      name: string
    }
  }
}

interface StockHistory {
  id: string
  type: 'MANUAL_ADJUSTMENT' | 'ORDER_REDUCTION' | 'SYNC_UPDATE' | 'RESTORE'
  quantity: number
  previousStock: number | null
  newStock: number
  reason: string
  createdAt: string
  user?: {
    name: string
  }
}

export default function AdminStockPage() {
  const { toast } = useToast()
  const [products, setProducts] = React.useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([])
  const [stockHistory, setStockHistory] = React.useState<StockHistory[]>([])
  const [loading, setLoading] = React.useState(true)
  const [syncing, setSyncing] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [stockFilter, setStockFilter] = React.useState<string>('all')
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null)
  const [showStockModal, setShowStockModal] = React.useState(false)
  const [showHistoryModal, setShowHistoryModal] = React.useState(false)

  // Load data
  React.useEffect(() => {
    loadProducts()
    loadStockHistory()
  }, [])

  // Filter products
  React.useEffect(() => {
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
      const response = await fetch('/api/admin/stock')
      const result = await response.json()
      
      if (result.success) {
        setProducts(result.data)
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
        description: 'Failed to load stock data',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const loadStockHistory = async () => {
    try {
      const response = await fetch('/api/admin/stock/history?limit=50')
      const result = await response.json()
      
      if (result.success) {
        setStockHistory(result.data)
      }
    } catch (error) {
      console.error('Failed to load stock history:', error)
    }
  }

  const syncStock = async () => {
    try {
      setSyncing(true)
      const response = await fetch('/api/admin/vip-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'sync-stock' })
      })

      const result = await response.json()
      
      if (result.success) {
        toast({
          title: 'Sync Berhasil',
          description: `Stock updated for ${result.data?.stockUpdated || 0} products`,
        })
        loadProducts()
        loadStockHistory()
      } else {
        toast({
          title: 'Sync Gagal',
          description: result.message,
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sync stock',
        variant: 'destructive'
      })
    } finally {
      setSyncing(false)
    }
  }

  const updateStock = async (productId: string, stock: number, reason: string) => {
    try {
      const response = await fetch('/api/admin/stock', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
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
          title: 'Berhasil',
          description: 'Stock berhasil diupdate'
        })
        loadProducts()
        loadStockHistory()
        setShowStockModal(false)
        setSelectedProduct(null)
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

  const getStockBadge = (product: Product) => {
    if (product.stockType === 'OUT_OF_STOCK') {
      return <Badge variant="destructive">Out of Stock</Badge>
    }
    if (product.stockType === 'UNLIMITED') {
      return <Badge variant="secondary">Unlimited</Badge>
    }
    if (product.minStock && product.stock !== null && product.stock <= product.minStock) {
      return <Badge variant="destructive">Low Stock</Badge>
    }
    return <Badge variant="default">In Stock</Badge>
  }

  const getStockText = (product: Product) => {
    if (product.stockType === 'UNLIMITED') return '∞'
    if (product.stockType === 'OUT_OF_STOCK') return '0'
    return product.stock?.toString() || '0'
  }

  const stats = {
    totalProducts: products.length,
    lowStock: products.filter(p => 
      p.stockType === 'LIMITED' && 
      p.minStock && 
      p.stock !== null && 
      p.stock <= p.minStock
    ).length,
    outOfStock: products.filter(p => p.stockType === 'OUT_OF_STOCK').length,
    unlimited: products.filter(p => p.stockType === 'UNLIMITED').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-magenta to-neon-cyan bg-clip-text text-transparent">
            Stock Management
          </h1>
          <p className="text-white/70 mt-1">
            Monitor dan kelola stock produk VIP-Reseller
          </p>
        </div>
        <Button
          onClick={syncStock}
          disabled={syncing}
          className="bg-gradient-to-r from-neon-magenta to-neon-cyan hover:opacity-90"
        >
          {syncing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Stock
            </>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
            </div>
            <Package className="h-8 w-8 text-neon-cyan" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Low Stock</p>
              <p className="text-2xl font-bold text-red-400">{stats.lowStock}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-400">{stats.outOfStock}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-gray-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Unlimited</p>
              <p className="text-2xl font-bold text-green-400">{stats.unlimited}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
        </GlassCard>
      </div>

      {/* Filters */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder-white/40"
            />
          </div>
          
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            <option value="all" className="bg-gray-800">All Products</option>
            <option value="limited" className="bg-gray-800">Limited Stock</option>
            <option value="unlimited" className="bg-gray-800">Unlimited</option>
            <option value="out_of_stock" className="bg-gray-800">Out of Stock</option>
            <option value="low_stock" className="bg-gray-800">Low Stock Alert</option>
          </select>
        </div>
      </GlassCard>

      {/* Products Table */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">
            Products ({filteredProducts.length})
          </h3>
          <Button
            variant="outline"
            onClick={() => setShowHistoryModal(true)}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <History className="h-4 w-4 mr-2" />
            View History
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-white/70">Loading stock data...</div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="border border-white/10 rounded-lg p-4 bg-white/5">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-white font-medium">{product.name}</h4>
                      {getStockBadge(product)}
                    </div>
                    <div className="text-white/60 text-sm">
                      <p>{product.service.category.name} • {product.service.name}</p>
                      <p>SKU: {product.sku}</p>
                    </div>
                    {product.lastStockSync && (
                      <p className="text-white/40 text-xs">
                        Last sync: {new Date(product.lastStockSync).toLocaleString('id-ID')}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-right space-y-2">
                    <div className="text-2xl font-bold text-white">
                      {getStockText(product)}
                    </div>
                    {product.stockType === 'LIMITED' && product.minStock && (
                      <div className="text-white/60 text-sm">
                        Min: {product.minStock}
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(product)
                        setShowStockModal(true)
                      }}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-white/50">
                No products found matching your criteria.
              </div>
            )}
          </div>
        )}
      </GlassCard>

      {/* Stock Edit Modal */}
      {showStockModal && selectedProduct && (
        <StockEditModal
          product={selectedProduct}
          onClose={() => {
            setShowStockModal(false)
            setSelectedProduct(null)
          }}
          onUpdate={updateStock}
        />
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <StockHistoryModal
          history={stockHistory}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </div>
  )
}

// Stock Edit Modal
interface StockEditModalProps {
  product: Product
  onClose: () => void
  onUpdate: (productId: string, stock: number, reason: string) => void
}

function StockEditModal({ product, onClose, onUpdate }: StockEditModalProps) {
  const [stock, setStock] = React.useState(product.stock?.toString() || '0')
  const [reason, setReason] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const stockNumber = parseInt(stock)
    if (!isNaN(stockNumber) && reason.trim()) {
      onUpdate(product.id, stockNumber, reason.trim())
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Edit Stock</h3>
        <p className="text-white/70 mb-6">{product.name}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white/80 block mb-2">
              Current Stock: {product.stock || 0}
            </label>
            <Input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min="0"
              required
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-white/80 block mb-2">
              Reason for Change
            </label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Manual restock, Correction, etc."
              required
              className="bg-white/5 border-white/10 text-white placeholder-white/40"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-neon-magenta to-neon-cyan hover:opacity-90"
            >
              Update Stock
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}

// Stock History Modal
interface StockHistoryModalProps {
  history: StockHistory[]
  onClose: () => void
}

function StockHistoryModal({ history, onClose }: StockHistoryModalProps) {
  const getHistoryTypeIcon = (type: string) => {
    switch (type) {
      case 'MANUAL_ADJUSTMENT':
        return <Edit className="h-4 w-4" />
      case 'ORDER_REDUCTION':
        return <TrendingDown className="h-4 w-4" />
      case 'SYNC_UPDATE':
        return <RefreshCw className="h-4 w-4" />
      case 'RESTORE':
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Database className="h-4 w-4" />
    }
  }

  const getHistoryTypeColor = (type: string) => {
    switch (type) {
      case 'MANUAL_ADJUSTMENT':
        return 'text-blue-400'
      case 'ORDER_REDUCTION':
        return 'text-red-400'
      case 'SYNC_UPDATE':
        return 'text-neon-cyan'
      case 'RESTORE':
        return 'text-green-400'
      default:
        return 'text-white/60'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Stock History</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Close
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {history.map((entry) => (
              <div key={entry.id} className="border border-white/10 rounded-lg p-4 bg-white/5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg bg-white/10 ${getHistoryTypeColor(entry.type)}`}>
                      {getHistoryTypeIcon(entry.type)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">
                          {entry.type.replace('_', ' ').toLowerCase()}
                        </span>
                        <Badge variant="outline" className="border-white/20 text-white/70">
                          {entry.quantity > 0 ? '+' : ''}{entry.quantity}
                        </Badge>
                      </div>
                      <p className="text-white/70 text-sm">{entry.reason}</p>
                      <div className="text-white/50 text-xs">
                        Stock: {entry.previousStock || 0} → {entry.newStock}
                      </div>
                      {entry.user && (
                        <div className="text-white/40 text-xs">
                          by {entry.user.name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-white/40 text-xs">
                    {new Date(entry.createdAt).toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
            ))}
            
            {history.length === 0 && (
              <div className="text-center py-8 text-white/50">
                No stock history available.
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
